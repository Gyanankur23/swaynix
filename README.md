<div align="center">

# 🔥 Swaynix

### **Human-Centric Community Hub** — Anti-FOMO Cohort Discovery Engine

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://swaynix-web-xl3i.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

**Connect with genuine human interests across India. No bot-logic, no follower counts. Just pure engagement.**

[🚀 Live Demo](https://swaynix-web-xl3i.vercel.app/) · [📖 Documentation](#documentation) · [🔧 Quick Start](#-quick-start) · [📊 API Reference](#-api-reference)

</div>

<!-- MAIN HERO HEADER -->
<p align="center">
  <img src="public/logo/Screenshot 2026-05-04 140433.jpg" width="49%" />
</p>

---

### Project Screenshots
<p align="center">
  <img src="public/logo/Screenshot 2026-05-04 140209.png" alt="Main Header" width="100%"/>
  <img src="public/logo/Screenshot 2026-05-04 140442.png" width="49%" />
</p>

<p align="center">
  <img src="public/logo/Screenshot 2026-05-04 140508.png" width="49%" />
  <img src="public/logo/Screenshot 2026-05-04 140519.png" width="49%" />
</p>

<p align="center">
  <img src="public/logo/Screenshot 2026-05-04 140529.png" width="100%" />
</p>


---

## 🌟 Vision

Swaynix reimagines social connectivity through an **Anti-FOMO lens** — prioritizing meaningful interactions over vanity metrics. Built for the Indian community landscape, our platform uses sophisticated cohort-matching algorithms to connect people based on shared interests, not popularity contests.

> *"No follower counts. No algorithmic manipulation. Just authentic human connection."*

---

## ✨ Core Features

### 🎯 Anti-FOMO Architecture
- **No Follower Counts** — Engagement quality trumps quantity
- **Weighted Scoring Algorithm** — `(Post_Depth × 5) + (Meaningful_Interactions × 2)`
- **10-Level Progression System** — From Rookie (Level 1) to Legend (Level 10 at 10,000+ points)

### ⚡ Performance-First Design
| Feature | Technology | Performance |
|---------|-----------|-------------|
| **Cohort Discovery** | PostgreSQL JSONB + GIN Indexes | **< 1ms** query time |
| **Static Caching** | Next.js ISR | **0ms** database latency for repeat visitors |
| **Revenue Processing** | Worker Queue + `SKIP LOCKED` | Safe concurrent transaction handling |
| **Content Delivery** | Edge Network | Sub-second global load times |

### 🗄️ Advanced Database Architecture
- **JSONB-Driven Schema** — Flexible, schema-less user profiles and cohort metadata
- **12+ Specialized Indexes** — GIN indexes for containment queries, B-tree for lookups
- **PostgreSQL Triggers** — Automated engagement scoring, member counting, post metadata updates
- **Raw SQL Matching** — `@>` containment operators for sub-millisecond interest matching

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SWAYNIX PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐   │
│  │   Next.js    │◄────►│   Express    │◄────►│  PostgreSQL  │   │
│  │  15 (Web)    │      │  API Server  │      │   (JSONB)    │   │
│  └──────────────┘      └──────────────┘      └──────────────┘   │
│         │                     │                   │             │
│    ┌────┴────┐           ┌────┴────┐          ┌────┴────┐       │
│    │  ISR    │           │ Helmet  │          │  GIN    │       │
│    │ Cache   │           │   CSP   │          │ Indexes │       │
│    └─────────┘           └─────────┘          └─────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Revenue Worker Queue                       │    │
│  │         (SKIP LOCKED Pattern for Safety)                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
swaynix/
├── 📂 apps/
│   ├── 📂 web/                    # Next.js 15 Frontend
│   │   ├── 📂 app/               # App Router (RSC)
│   │   │   ├── 📂 (feed)/        # Feed layout group
│   │   │   ├── 📂 admin/         # Admin dashboard
│   │   │   ├── 📂 cohort/        # Cohort pages
│   │   │   ├── 📂 explore/       # Discovery interface
│   │   │   ├── 📂 feed/          # Main feed
│   │   │   ├── 📂 profile/       # User profiles
│   │   │   ├── 📂 settings/      # User settings
│   │   │   └── 📄 page.tsx       # Landing page
│   │   ├── 📂 components/        # React components
│   │   ├── 📂 hooks/             # Custom hooks
│   │   └── 📂 lib/               # Utilities
│   │
│   └── 📂 server/                 # Express.js API
│       ├── 📂 src/
│       │   ├── 📄 index.js      # Main server entry
│       │   ├── 📂 services/       # Business logic
│       │   │   └── 📄 matcher.js  # Cohort matching engine
│       │   ├── 📂 logic/          # Scoring algorithms
│       │   │   └── 📄 scoring.js  # Engagement scoring
│       │   └── 📂 workers/        # Background workers
│       │       └── 📄 revenue_worker.js
│       └── 📄 package.json
│
├── 📂 database/
│   ├── 📄 schema.sql             # PostgreSQL schema (517 lines)
│   ├── 📄 seed.js               # 1000-user mock data generator
│   └── 📄 package.json
│
├── 📄 package.json              # Workspace root (npm workspaces)
├── 📄 vercel.json              # Vercel deployment config
└── 📄 .env.example             # Environment template
```

---

## 🛠️ Technology Stack

### Frontend Layer
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.1.0 | App Router, ISR, Server Components |
| **React** | 19.0.0 | UI Components, Hooks |
| **TypeScript** | 5.x | Type Safety |
| **TailwindCSS** | 3.4.0 | Utility-first styling |
| **shadcn/ui** | Latest | Radix UI component primitives |
| **Framer Motion** | 12.x | Animations & transitions |
| **GSAP** | 3.14.2 | Advanced animations |
| **Leaflet** | 1.9.4 | Interactive maps |

### Backend Layer
| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 4.21.0 | REST API framework |
| **Helmet** | 8.0.0 | Security headers & CSP |
| **CORS** | 2.8.5 | Cross-origin handling |
| **express-validator** | 7.2.0 | Request validation |
| **node-pg** | 8.13.0 | PostgreSQL driver |

### Database Layer
| Feature | Implementation |
|---------|----------------|
| **Engine** | PostgreSQL 14+ |
| **Extensions** | `uuid-ossp` for UUID generation |
| **Schema** | 12 tables, 15+ indexes |
| **Triggers** | 8 automated functions |
| **JSONB Columns** | Users, Cohorts, Posts, Comments, Companies, Ads |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ with npm 9+
- PostgreSQL 14+
- Git

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/Gyanankur23/swaynix.git
cd swaynix

# Install dependencies (workspaces)
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
DATABASE_URL="postgresql://user:pass@localhost:5432/swaynix"
NEXT_PUBLIC_API_URL="http://localhost:3001"
CLIENT_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
# Create schema and indexes
npm run db:schema

# Seed with 1000 realistic mock users
npm run db:seed
```

### 4. Start Development

```bash
# Start all workspaces (concurrently)
npm run dev

# Or start individually:
npm run dev --workspace=@swaynix/web      # Next.js on :3000
npm run dev --workspace=@swaynix/server   # Express on :3001
```

### 5. Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| Web App | http://localhost:3000 | Next.js frontend |
| API Server | http://localhost:3001 | Express REST API |
| API Docs | http://localhost:3001/api/health | Health check endpoint |

---

## 📊 Database Schema

### Core Tables

#### `users` — Platform Members
```sql
id UUID PRIMARY KEY
created_at TIMESTAMP
created_at TIMESTAMP
created_at TIMESTAMP
profile_data JSONB        -- Flexible attributes
engagement_score INTEGER  -- Weighted algorithm score
level INTEGER             -- 1-10 progression
```

#### `cohorts` — Interest-Based Communities
```sql
id UUID PRIMARY KEY
name VARCHAR(100)
slug VARCHAR(100) UNIQUE
description TEXT
metadata JSONB            -- Topics, rules, tags
member_count INTEGER      -- Cached count
last_activity_at TIMESTAMP
```

#### `posts` — User Content
```sql
id UUID PRIMARY KEY
user_id UUID → users
cohort_id UUID → cohorts
content TEXT
depth_score INTEGER       -- Character count/complexity
metadata JSONB            -- Engagement cache
```

### Critical Indexes

```sql
-- GIN indexes for sub-millisecond JSONB queries
CREATE INDEX idx_users_profile_data_gin ON users USING GIN (profile_data);
CREATE INDEX idx_cohorts_metadata_gin ON cohorts USING GIN (metadata);
CREATE INDEX idx_posts_metadata_gin ON posts USING GIN (metadata);
CREATE INDEX idx_ads_target_interests_gin ON ads USING GIN (target_interests);

-- B-tree indexes for lookups
CREATE INDEX idx_users_engagement_score ON users(engagement_score DESC);
CREATE INDEX idx_cohorts_slug ON cohorts(slug);
```

### Automated Triggers

| Trigger | Action | Purpose |
|---------|--------|---------|
| `trigger_update_engagement_score` | ON INSERT/UPDATE user_cohorts | Recalculates user score |
| `trigger_increment_engagement_on_comment` | ON INSERT comments | +5 points per comment |
| `trigger_award_points_on_like` | ON INSERT post_likes | +2 points to author |
| `trigger_update_cohort_member_count` | ON INSERT/DELETE user_cohorts | Updates member count |
| `trigger_update_post_likes/shares/saves` | ON INSERT/DELETE | Caches engagement counts |

---

## 🔗 API Reference

### User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/health` | Health check | Public |
| `GET` | `/api/users/:userId/recommendations` | Cohort recommendations | User |
| `GET` | `/api/users/:userId/score` | Engagement score & level | User |
| `GET` | `/api/users/:userId/posts` | User's posts | Public |

### Cohort Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/cohorts/discover?interests=tech,startups` | Discover by interests | Public |
| `GET` | `/api/cohorts/trending` | Trending cohorts | Public |
| `GET` | `/api/cohorts/:slug` | Cohort details (ISR-cached) | Public |
| `POST` | `/api/cohorts/search` | Search by metadata criteria | Public |

### Post Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/posts` | Create post | User |
| `GET` | `/api/posts/feed` | Personalized feed | Public/User |
| `POST` | `/api/posts/:postId/like` | Toggle like | User |
| `POST` | `/api/posts/:postId/comments` | Add comment | User |

### Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/queue-stats` | Revenue queue status | Admin |

---

## 🎯 Anti-FOMO Scoring System

### Formula
```javascript
// Explicitly excludes follower counts
const score = (postDepthScore * 5) + (meaningfulInteractions * 2);
```

### Level Thresholds

| Level | Points | Title | Badge |
|-------|--------|-------|-------|
| 1 | 0+ | Rookie | 🌱 |
| 2 | 10+ | Explorer | 🔍 |
| 3 | 50+ | Contributor | ✍️ |
| 4 | 100+ | Regular | 🔄 |
| 5 | 250+ | Engaged | 🎯 |
| 6 | 500+ | Active | ⚡ |
| 7 | 1,000+ | Veteran | 🎖️ |
| 8 | 2,500+ | Expert | 🏆 |
| 9 | 5,000+ | Master | 👑 |
| 10 | 10,000+ | Legend | 🔥 |

### Scoring Actions

| Action | Points | Description |
|--------|--------|-------------|
| Write a comment | +5 | Meaningful interaction |
| Get a like | +2 | Engagement on your content |
| Deep post (1,000+ chars) | +25 | Quality content bonus |
| Join cohort discussion | +1 | Participation reward |

---

## 🔒 Security Features

### Content Security Policy (Helmet)
```javascript
contentSecurityPolicy: {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"], // Next.js requirement
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"]
}
```

### Additional Protections
- **HSTS** — Strict transport security (1 year max-age)
- **Referrer Policy** — `strict-origin-when-cross-origin`
- **CORS** — Configured for specific origins
- **Input Validation** — express-validator on all POST endpoints

---

## 🚢 Deployment

### Vercel (Frontend)
```bash
# Deploy web app
vercel --cwd apps/web
```

### Railway/Render (Backend + DB)
```bash
# Deploy server
# Set environment variables in dashboard
# Connect PostgreSQL addon
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
| `CLIENT_URL` | Yes | Frontend origin for CORS |
| `PORT` | No | Server port (default: 3001) |

---

## 🧪 Testing & Quality

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

---

## 📈 Roadmap

### Q1 2024 — Foundation
- ✅ Core platform architecture
- ✅ PostgreSQL JSONB implementation
- ✅ Anti-FOMO scoring system
- ✅ ISR caching

### Q2 2024 — Growth
- 🔄 Mobile app (React Native)
- 🔄 Real-time messaging
- 🔄 Advanced analytics dashboard

### Q3 2024 — Scale
- 🔄 AI-powered cohort recommendations
- 🔄 Multi-language support (Hindi, Tamil, Telugu)
- 🔄 Regional server deployment

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

### Development Workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/swaynix.git

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Commit changes
git commit -m "feat: add amazing feature"

# 4. Push to branch
git push origin feature/amazing-feature

# 5. Open Pull Request
```

---

## 📜 License

[MIT License](LICENSE) © 2026 Swaynix Team

---

## 🙏 Acknowledgments

- **shadcn/ui** — Beautiful component primitives
- **Radix UI** — Accessible UI components
- **Vercel** — Edge deployment platform
- **PostgreSQL** — World's most advanced open-source database

---

<div align="center">

**[⬆ Back to Top](#-swaynix)**

Built with ❤️ for authentic human connection

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Swaynix-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/gyanankur-baruah-797205338/)

</div>
