/**
 * Revenue Worker
 * Uses SELECT ... FOR UPDATE SKIP LOCKED for safe ad-payout queue processing
 * Prevents race conditions in multi-worker deployments
 */

const { Pool } = require('pg');
const { DB_CONFIG } = require('../config/database');

class RevenueWorker {
  constructor() {
    this.pool = new Pool(DB_CONFIG);
    this.workerId = `worker-${process.pid}-${Date.now()}`;
    this.isRunning = false;
    this.processingInterval = null;
    
    // Configuration
    this.config = {
      batchSize: 10,           // Process 10 payouts at a time
      pollIntervalMs: 5000,    // Check queue every 5 seconds
      maxRetries: 3,           // Retry failed payouts 3 times
      processingTimeout: 30000 // 30 second timeout per batch
    };
  }

  /**
   * Initialize the worker
   */
  async start() {
    console.log(`[${this.workerId}] Revenue Worker starting...`);
    this.isRunning = true;
    
    // Start processing loop
    this.processingInterval = setInterval(() => {
      this.processPayoutQueue().catch(err => {
        console.error(`[${this.workerId}] Processing error:`, err.message);
      });
    }, this.config.pollIntervalMs);
    
    // Immediate first run
    await this.processPayoutQueue();
    
    console.log(`[${this.workerId}] Revenue Worker started (poll interval: ${this.config.pollIntervalMs}ms)`);
  }

  /**
   * Graceful shutdown
   */
  async stop() {
    console.log(`[${this.workerId}] Stopping Revenue Worker...`);
    this.isRunning = false;
    
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    
    await this.pool.end();
    console.log(`[${this.workerId}] Revenue Worker stopped`);
  }

  /**
   * Process the payout queue using SKIP LOCKED
   * This pattern prevents multiple workers from processing the same payout
   */
  async processPayoutQueue() {
    if (!this.isRunning) return;
    
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // CRITICAL: SELECT ... FOR UPDATE SKIP LOCKED
      // This atomically selects and locks pending payouts
      // Other workers will skip rows already locked by this worker
      const selectQuery = `
        SELECT 
          id, 
          user_id, 
          amount_cents,
          created_at
        FROM ad_payout_queue
        WHERE status = 'pending'
        ORDER BY created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT $1
      `;
      
      const { rows: pendingPayouts } = await client.query(selectQuery, [this.config.batchSize]);
      
      if (pendingPayouts.length === 0) {
        await client.query('COMMIT');
        return; // No work to do
      }
      
      console.log(`[${this.workerId}] Processing ${pendingPayouts.length} payouts`);
      
      // Mark payouts as processing and assign to this worker
      const payoutIds = pendingPayouts.map(p => p.id);
      
      await client.query(
        `UPDATE ad_payout_queue 
         SET status = 'processing', 
             locked_by_worker = $1
         WHERE id = ANY($2::uuid[])`,
        [this.workerId, payoutIds]
      );
      
      await client.query('COMMIT');
      
      // Process each payout (outside transaction for longer operations)
      for (const payout of pendingPayouts) {
        await this.processPayout(payout);
      }
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`[${this.workerId}] Queue processing error:`, error.message);
    } finally {
      client.release();
    }
  }

  /**
   * Process a single payout
   * Simulates payment processing with retry logic
   */
  async processPayout(payout) {
    let attempts = 0;
    let success = false;
    
    while (attempts < this.config.maxRetries && !success) {
      attempts++;
      
      try {
        // Simulate payment gateway call
        await this.simulatePaymentProcessing(payout);
        
        // Mark as completed
        await this.pool.query(
          `UPDATE ad_payout_queue 
           SET status = 'completed',
               processed_at = CURRENT_TIMESTAMP,
               locked_by_worker = NULL
           WHERE id = $1`,
          [payout.id]
        );
        
        console.log(`[${this.workerId}] ✅ Payout ${payout.id} completed ($${(payout.amount_cents / 100).toFixed(2)})`);
        success = true;
        
      } catch (error) {
        console.error(`[${this.workerId}] Attempt ${attempts} failed for payout ${payout.id}:`, error.message);
        
        if (attempts >= this.config.maxRetries) {
          // Mark as failed after max retries
          await this.pool.query(
            `UPDATE ad_payout_queue 
             SET status = 'failed',
                 locked_by_worker = NULL
             WHERE id = $1`,
            [payout.id]
          );
          console.error(`[${this.workerId}] ❌ Payout ${payout.id} failed after ${this.config.maxRetries} attempts`);
        } else {
          // Wait before retry
          await this.sleep(1000 * attempts);
        }
      }
    }
  }

  /**
   * Simulate payment processing
   * In production, this would call Stripe, PayPal, etc.
   */
  async simulatePaymentProcessing(payout) {
    // Simulate network latency
    await this.sleep(Math.random() * 500 + 100);
    
    // Simulate occasional failures (5% failure rate for testing)
    if (Math.random() < 0.05) {
      throw new Error('Simulated payment gateway timeout');
    }
    
    // Log the simulated transaction
    console.log(`[${this.workerId}] 💰 Processing $${(payout.amount_cents / 100).toFixed(2)} for user ${payout.user_id}`);
    
    return { success: true, transactionId: `txn_${Date.now()}_${payout.id}` };
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const { rows } = await this.pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(amount_cents) as total_cents
      FROM ad_payout_queue
      GROUP BY status
      ORDER BY status
    `);
    
    return rows;
  }

  /**
   * Requeue stuck payouts (processing for too long)
   */
  async requeueStuckPayouts(timeoutMinutes = 10) {
    const { rowCount } = await this.pool.query(`
      UPDATE ad_payout_queue
      SET status = 'pending',
          locked_by_worker = NULL
      WHERE status = 'processing'
        AND created_at < CURRENT_TIMESTAMP - INTERVAL '${timeoutMinutes} minutes'
    `);
    
    if (rowCount > 0) {
      console.log(`[${this.workerId}] Requeued ${rowCount} stuck payouts`);
    }
    
    return rowCount;
  }

  /**
   * Utility: Sleep for ms
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// If run directly, start the worker
if (require.main === module) {
  const worker = new RevenueWorker();
  
  // Graceful shutdown handlers
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    await worker.stop();
    process.exit(0);
  });
  
  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down...');
    await worker.stop();
    process.exit(0);
  });
  
  // Start the worker
  worker.start().catch(err => {
    console.error('Failed to start worker:', err);
    process.exit(1);
  });
  
  // Requeue stuck payouts periodically
  setInterval(() => {
    worker.requeueStuckPayouts();
  }, 60000); // Check every minute
}

module.exports = { RevenueWorker };
