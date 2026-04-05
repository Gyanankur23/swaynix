# Swaynix

**Anti-FOMO Community Platform** - Discover meaningful cohorts based on interests, not popularity. 

## 🚀 Key Features

- **Sub-millisecond Cohort Discovery** - PostgreSQL JSONB with GIN indexes
- **ISR (Incremental Static Regeneration)** - 0ms database latency for frequent visitors
- **Anti-FOMO Design** - No follower counts, only quality engagement metrics
- **Safe Revenue Processing** - Worker queue with `SKIP LOCKED` pattern

## 📁 Project Structure

```
swaynix/
├── apps/
│   ├── web/           # Next.js 15 frontend
│   └── server/        # Express.js API
├── database/
│   ├── schema.sql     # PostgreSQL schema with GIN indexes
│   └── seed.js        # 1000 mock users generator
└── .env.example       # Environment configuration
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS, shadcn/ui
- **Backend:** Express.js, Helmet (CSP), CORS
- **Database:** PostgreSQL with JSONB columns
- **Matching:** Raw SQL with `@>` containment operators
- **Scoring:** (Post_Depth × 5) + (Meaningful_Interactions × 2)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL

# Initialize database
npm run db:schema

# Seed with 1000 users
npm run db:seed

# Start development
npm run dev
```

## 📊 Database Schema

### Users Table
- `id` (UUID) - Primary key
- `profile_data` (JSONB) - Flexible user attributes
- `engagement_score` (INTEGER) - Weighted algorithm score
- `level` (INTEGER) - User level 1-10

### Cohorts Table
- `id` (UUID) - Primary key
- `metadata` (JSONB) - Cohort attributes & rules
- `member_count` (INTEGER) - Cached member count

### Critical Indexes
```sql
CREATE INDEX idx_users_profile_data_gin ON users USING GIN (profile_data);
CREATE INDEX idx_cohorts_metadata_gin ON cohorts USING GIN (metadata);
```

## 🔗 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/users/:id/recommendations` | JSONB-based cohort matching |
| `GET /api/cohorts/discover` | Discover by interests |
| `GET /api/cohorts/:slug` | ISR-cached cohort details |
| `GET /api/cohorts/trending` | Trending cohorts |
| `GET /api/users/:id/score` | Engagement score |

## 🎯 Anti-FOMO Scoring

```javascript
// No follower counts allowed
score = (postDepth * 5) + (meaningfulInteractions * 2)
```

Levels are calculated from thresholds:
- Level 1: 0+ points
- Level 5: 250+ points
- Level 10: 10,000+ points

## 📜 License

MIT
