# Contributing
## Stack
## Authentication
## Style Guide
## Architecture.
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
- Another D1 or DO for multi tenancy
    - Keeps content isolated away from irrelevant auth data, allowing better auth to fully manage auth
    - Multi tenancy would require taking a snapshot of all data on a schedule which can then be queried
#### User-Specific Write-Heavy Content (Progress, Quizzes, Notes)
- Cloudflare Durable Objects w/ SQLite or KV backend
- Allows for multi-tenant databases
- Scales with each user much more manageably
- Fast progress updates due to a lightweight store guaranteed to be in the same region that is guaranteed to not have conflicts
- No write contention due to all requests being from the same user
    - Slowest part of shared DBs
- GDPR Compliant due to isolated data/easily deletable
- Downside is aggregating all user info must be done either on a schedule or in an event-driven manner rather than query-driven
