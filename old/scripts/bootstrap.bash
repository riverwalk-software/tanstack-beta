set -euo pipefail

echo "Bootstrapping environment..."

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

## Apply authentication database migrations
pnpm wrangler d1 migrations apply auth_database

## Apply school database migrations
pnpm run db:push

## Seed
pnpm run db:seed

echo "Bootstrap finished"
