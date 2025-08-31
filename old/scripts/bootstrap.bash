set -euo pipefail

echo "Bootstrapping environment..."

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

## Apply authentication database migrations
npx wrangler d1 migrations apply auth_database

## Apply school database migrations
npm run db:push

## Seed
npm run db:seed

echo "Bootstrap finished"
