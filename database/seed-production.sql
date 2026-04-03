-- =============================================
-- EngageHub Production Seed Data
-- 10 High-Quality Posts with Technical Value
-- Password: GB@23
-- =============================================

-- First, ensure we have cohorts for posts
INSERT INTO cohorts (name, slug, description, metadata) VALUES
('Data Architects', 'data-architects', 'Advanced database design and architecture discussions', '{"interests": ["sql", "architecture", "scaling"], "topics": ["database-design", "normalization", "partitioning"]}'),
('Python Automated', 'python-automated', 'Automation scripts and workflow optimization', '{"interests": ["python", "automation", "scripting"], "topics": ["scraping", "ci-cd", "etl"]}'),
('React Masters', 'react-masters', 'Advanced React patterns and performance', '{"interests": ["react", "javascript", "frontend"], "topics": ["hooks", "suspense", "concurrent-mode"]}'),
('AI Innovators', 'ai-innovators', 'Machine learning and AI implementation', '{"interests": ["ai", "ml", "python"], "topics": ["transformers", "neural-networks", "llm"]}')
ON CONFLICT (slug) DO NOTHING;

-- Insert companies for B2C ad system
INSERT INTO companies (name, slug, description, targeting_criteria) VALUES
('TechCorp AI', 'techcorp-ai', 'Enterprise AI solutions', '{"interests": ["ai", "ml", "python"], "company_size": "enterprise"}'),
('Reactify Pro', 'reactify-pro', 'React development tools', '{"interests": ["react", "javascript", "frontend"], "company_size": "startup"}'),
('DataScale', 'datascale', 'Database scaling solutions', '{"interests": ["sql", "architecture", "scaling"], "company_size": "scaleup"}')
ON CONFLICT (slug) DO NOTHING;

-- Insert ads targeting specific interests
INSERT INTO ads (company_id, title, body, image_url, cta_text, cta_url, target_interests, budget_cents, cost_per_click_cents, max_impressions) 
SELECT 
    c.id,
    'Scale Your AI Models 10x',
    'Deploy large language models with enterprise-grade infrastructure. Auto-scaling included.',
    'https://picsum.photos/seed/ad-ai-1/400/200',
    'Start Free Trial',
    'https://techcorp.ai/engage',
    '["ai", "ml", "python"]',
    500000,  -- $5,000 budget
    100,      -- $1.00 CPC
    100000
FROM companies c WHERE c.slug = 'techcorp-ai'
ON CONFLICT DO NOTHING;

INSERT INTO ads (company_id, title, body, image_url, cta_text, cta_url, target_interests, budget_cents, cost_per_click_cents, max_impressions)
SELECT 
    c.id,
    'Debug React Like a Pro',
    'Advanced debugging tools for React developers. Catch bugs before they reach production.',
    'https://picsum.photos/seed/ad-react-1/400/200',
    'Install Extension',
    'https://reactify.pro/debug',
    '["react", "javascript", "frontend"]',
    250000,  -- $2,500 budget
    50,       -- $0.50 CPC
    50000
FROM companies c WHERE c.slug = 'reactify-pro'
ON CONFLICT DO NOTHING;

INSERT INTO ads (company_id, title, body, image_url, cta_text, cta_url, target_interests, budget_cents, cost_per_click_cents, max_impressions)
SELECT 
    c.id,
    'Partition Tables at Scale',
    'Automated table partitioning for PostgreSQL. Handle billions of rows effortlessly.',
    'https://picsum.photos/seed/ad-db-1/400/200',
    'Read Docs',
    'https://datascale.io/partition',
    '["sql", "architecture", "scaling"]',
    300000,  -- $3,000 budget
    75,       -- $0.75 CPC
    75000
FROM companies c WHERE c.slug = 'datascale'
ON CONFLICT DO NOTHING;

-- =============================================
-- POST 1: Database Partitioning Strategy
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'data-architects' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'cyan_founder' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'After partitioning our 500M row events table by date ranges, query time dropped from 4.2s to 180ms. Here is the exact strategy we used:\n\n1. Range partition by created_at (monthly)\n2. Attach/detach old partitions for archiving\n3. BRIN indexes for time-series queries\n\nKey insight: Your partition key MUST match your most common WHERE clause.\n\nAnyone dealing with large time-series data should consider this approach. Happy to share the migration script.',
    '{"tags": ["postgresql", "partitioning", "performance"], "technical_depth": "high", "engagement": {"views": 1240, "bookmarks": 89}}',
    85
FROM cohort_data c, user_data u;

-- Comment on Post 1
WITH post_data AS (
    SELECT id FROM posts ORDER BY created_at DESC LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'data_wizard' LIMIT 1
)
INSERT INTO comments (post_id, user_id, content, metadata)
SELECT 
    p.id,
    u.id,
    'Great breakdown! We implemented something similar but used LIST partitioning by tenant_id for our multi-tenant SaaS. One gotcha: pg_dump does not handle declarative partitions gracefully in older versions.',
    '{"technical_value": "high", "contains_code": false}'
FROM post_data p, user_data u;

-- =============================================
-- POST 2: Python Asyncio Pattern
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'python-automated' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'dev_ninja' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'The async/await pattern that saved our scraping infrastructure:\n\n```python\nasync def bounded_gather(tasks, limit=10):\n    semaphore = asyncio.Semaphore(limit)\n    \n    async def sem_task(task):\n        async with semaphore:\n            return await task\n    \n    return await asyncio.gather(*[sem_task(t) for t in tasks])\n```\n\nBefore: 50 concurrent requests, constant 429 errors\nAfter: Controlled 10 concurrent, 0 rate limits, 3x faster overall\n\nRate limiting is not just politeness—it is performance.',
    '{"tags": ["python", "asyncio", "scraping"], "technical_depth": "high", "engagement": {"views": 892, "bookmarks": 156}}',
    90
FROM cohort_data c, user_data u;

-- =============================================
-- POST 3: React Server Components
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'react-masters' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'react_ace' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'Real-world RSC bundle size reduction:\n\nBefore RSC: 247KB ( hydrated everything )\nAfter RSC: 89KB ( only client components )\n\nThe mental model shift: Data fetching happens ONCE on the server. No useEffect waterfall. No double data.\n\nExample pattern:\n- Server Component: Fetch user + posts\n- Pass as props to Client Component\n- Client Component: Handle interactions only\n\nThe 158KB savings was worth the architectural complexity.',
    '{"tags": ["react", "rsc", "nextjs"], "technical_depth": "high", "engagement": {"views": 2103, "bookmarks": 234}}',
    88
FROM cohort_data c, user_data u;

-- =============================================
-- POST 4: Transformer Architecture Deep Dive
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'ai-innovators' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'ai_researcher' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'Why attention is all you need (explained in code):\n\nThe key insight: Query-Key-Value is just a learned database lookup.\n\nSelf-attention allows the model to build dynamic connections between any positions in the sequence. This replaces recurrence (RNNs) with parallel computation.\n\nWe fine-tuned a 7B parameter model on domain-specific data with QLoRA. VRAM usage: 14GB -> 6GB. Same accuracy, consumer GPU accessible.\n\nThe democratization of LLMs is here.',
    '{"tags": ["llm", "transformers", "fine-tuning"], "technical_depth": "high", "engagement": {"views": 1547, "bookmarks": 312}}',
    92
FROM cohort_data c, user_data u;

-- Comment on Post 4
WITH post_data AS (
    SELECT id FROM posts WHERE content LIKE '%attention is all you need%' ORDER BY created_at DESC LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'ml_engineer' LIMIT 1
)
INSERT INTO comments (post_id, user_id, content, metadata)
SELECT 
    p.id,
    u.id,
    'QLoRA is a game changer! We ran it on RTX 4090 with batch size 4. One optimization: use gradient checkpointing for longer sequences. VRAM tradeoff for compute, but lets you handle 4k context windows.',
    '{"technical_value": "high", "contains_code": false, "additional_insight": true}'
FROM post_data p, user_data u;

-- =============================================
-- POST 5: Database Index Strategy
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'data-architects' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'data_wizard' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'Index strategy for read-heavy workloads:\n\n1. B-Tree: Equality and range queries\n2. BRIN: Large, naturally ordered data\n3. GIN: Array/JSONB containment (our main use case)\n4. HASH: Only when equality is 100% of access pattern\n\nOur GIN index on user interests reduced cohort discovery from 800ms to 12ms.\n\nThe @> operator is magical for JSONB containment. Profile matching happens in milliseconds now.',
    '{"tags": ["postgresql", "indexing", "performance"], "technical_depth": "high", "engagement": {"views": 2156, "bookmarks": 445}}',
    87
FROM cohort_data c, user_data u;

-- =============================================
-- POST 6: CI/CD Pipeline Optimization
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'python-automated' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'user_8' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'Cut our CI time from 14 minutes to 3 minutes:\n\n1. Parallel test execution (pytest-xdist)\n2. Docker layer caching (registry-based)\n3. Selective test runs based on changed files\n4. Pre-built base images with dependencies\n\nThe test selection algorithm:\n- Map file dependencies to test modules\n- Only run tests affected by PR changes\n- Full suite runs on main branch only\n\nDeveloper feedback loop matters.',
    '{"tags": ["ci-cd", "python", "testing"], "technical_depth": "medium", "engagement": {"views": 987, "bookmarks": 178}}',
    78
FROM cohort_data c, user_data u;

-- =============================================
-- POST 7: TypeScript Generic Patterns
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'react-masters' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'user_6' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'The generic pattern every React dev needs:\n\n```typescript\nfunction useAsyncResource<T, E = Error>(\n  fetcher: () => Promise<T>,\n  deps: DependencyList\n) {\n  const [data, setData] = useState<T | null>(null);\n  const [error, setError] = useState<E | null>(null);\n  // ... implementation\n}\n```\n\nKey insight: Constrain your generics at the function definition, not at usage. The E = Error default means consumers do not need to specify error types unless they want custom handling.\n\nType inference is your friend.',
    '{"tags": ["typescript", "react", "generics"], "technical_depth": "medium", "engagement": {"views": 1432, "bookmarks": 267}}',
    82
FROM cohort_data c, user_data u;

-- =============================================
-- POST 8: Vector Database Comparison
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'ai-innovators' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'cyan_founder' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'Evaluated 4 vector DBs for our RAG pipeline:\n\n1. pgvector (PostgreSQL): Good for <1M vectors, ACID compliance\n2. Pinecone: Managed, fast, expensive at scale\n3. Weaviate: Great hybrid search, GraphQL interface\n4. Milvus: Highest throughput, self-hosted complexity\n\nWe chose pgvector + HNSW indexing for operational simplicity. Query latency: 45ms P95.\n\nFor <5M vectors with strict consistency requirements, pgvector is underrated.',
    '{"tags": ["vector-db", "rag", "postgresql"], "technical_depth": "high", "engagement": {"views": 1876, "bookmarks": 398}}',
    91
FROM cohort_data c, user_data u;

-- Comment on Post 8
WITH post_data AS (
    SELECT id FROM posts WHERE content LIKE '%Evaluated 4 vector DBs%' ORDER BY created_at DESC LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'data_wizard' LIMIT 1
)
INSERT INTO comments (post_id, user_id, content, metadata)
SELECT 
    p.id,
    u.id,
    'Have you tried the ivfflat vs HNSW comparison on pgvector? We found HNSW uses more RAM (as expected) but build time is way faster. For dynamic embeddings that update frequently, HNSW incremental updates are a lifesaver.',
    '{"technical_value": "high", "contains_code": false}'
FROM post_data p, user_data u;

-- =============================================
-- POST 9: API Rate Limiting Design
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'python-automated' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'data_wizard' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'Sliding window rate limiting with Redis:\n\n```python\nasync def is_allowed(key: str, limit: int, window: int):\n    pipe = redis.pipeline()\n    now = time.time()\n    pipe.zremrangebyscore(key, 0, now - window)\n    pipe.zcard(key)\n    pipe.zadd(key, {str(now): now})\n    pipe.expire(key, window)\n    _, current, _, _ = await pipe.execute()\n    return current < limit\n```\n\nSliding window prevents the burst-at-boundary problem of fixed windows.\n\nCost: ~2ms per check. Scales horizontally with Redis Cluster.',
    '{"tags": ["redis", "rate-limiting", "api-design"], "technical_depth": "high", "engagement": {"views": 1245, "bookmarks": 289}}',
    89
FROM cohort_data c, user_data u;

-- =============================================
-- POST 10: Microservices Communication
-- =============================================
WITH cohort_data AS (
    SELECT id FROM cohorts WHERE slug = 'data-architects' LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'user_10' LIMIT 1
)
INSERT INTO posts (user_id, cohort_id, content, metadata, depth_score)
SELECT 
    u.id,
    c.id,
    E'Event-driven architecture lessons from 3 years in production:\n\n1. **Schema registry is non-negotiable**\n   Backward/forward compatibility prevents midnight pages\n\n2. **Idempotency keys everywhere**\n   Network flakes happen. Process exactly-once semantics.\n\n3. **Dead letter queues with reprocessing UI**\n   Ops team needs visibility, not just logs\n\n4. **Circuit breakers on consumers**\n   Protect downstream from cascading failures\n\n5. **Event sourcing for audit trails**\n   Debug any state by replaying events\n\nComplexity is the tax on distributed systems. Pay it deliberately.',
    '{"tags": ["microservices", "event-driven", "architecture"], "technical_depth": "high", "engagement": {"views": 2341, "bookmarks": 567}}',
    95
FROM cohort_data c, user_data u;

-- Comment on Post 10
WITH post_data AS (
    SELECT id FROM posts WHERE content LIKE '%Event-driven architecture lessons%' ORDER BY created_at DESC LIMIT 1
),
user_data AS (
    SELECT id FROM users WHERE username = 'user_4' LIMIT 1
)
INSERT INTO comments (post_id, user_id, content, metadata)
SELECT 
    p.id,
    u.id,
    'Solid list! We learned #3 the hard way. Engineers were SSHing into containers to replay events manually. Built a simple UI that shows DLQ contents and allows one-click replay with idempotency check. Reduced MTTR from hours to minutes.',
    '{"technical_value": "high", "contains_code": false, "war_story": true}'
FROM post_data p, user_data u;

-- =============================================
-- Verify Seed Data
-- =============================================
SELECT 'Posts seeded: ' || COUNT(*)::TEXT as status FROM posts;
SELECT 'Comments seeded: ' || COUNT(*)::TEXT as status FROM comments;
SELECT 'Companies seeded: ' || COUNT(*)::TEXT as status FROM companies;
SELECT 'Ads seeded: ' || COUNT(*)::TEXT as status FROM ads;
