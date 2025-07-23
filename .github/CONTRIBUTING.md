# Contributing
## Stack
## Authentication
## Style Guide
## Architecture
### Data Storage
#### Authentication:
- Read-Heavy (Accounts, Users, etc...)
    - Cloudflare D1
    - SQLite
    - Fully managed by Better Auth; unlikely to ever need to be directly managed outside of analytics
- Write-Heavy (Sessions)
    - Cloudflare KV
    - Cached in cookies for the same amount of time as KV's eventual consistency estimate
    - Rate-limited
#### Videos
- Cloudflare Stream
#### Other Assets
- Cloudflare R2
#### Global Read-Heavy Content (Courses, Lectures, Instructors)
- Neon
    - PostgreSQL
    - Keeps content isolated away from irrelevant auth data, allowing better auth to fully manage auth
    - Branching
    - Instant rollback
    - Read replicas
    - Fast
    - Scale to 0
    - Generous free tier
    - Cheaper to separate storage across multiple DBs
    - Integrates with drizzle
    - Integrates with caching layers (ex: polyscale)
#### User-Specific Write-Heavy Content (Progress, Quizzes, Notes)
- Cloudflare Durable Objects w/ SQLite backend
- Allows for multi-tenant databases
- Scales with each user much more manageably
- Fast progress updates due to a lightweight store guaranteed to be in the same region that is guaranteed to not have conflicts
- No write contention due to all requests being from the same user
    - Slowest part of shared DBs
- GDPR Compliant due to isolated data/easily deletable
- Downside is aggregating all user info must be done either on a schedule or in an event-driven manner rather than query-driven

#### Social Features (Comments, Likes, Reviews)
- Cloudflare Durable Objects
- Allows for managing concurrency due to DO's actor model
- Immediately consistent
- Isolates write-heavy meta-data from ready-heavy DB
- Can be cached differently/optimistic updates

## Realtime Features? (Chat)
- Cloudflare Durable Objects w/ Websockets
