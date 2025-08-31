set -euo pipefail

echo "🚀 Running postCreateCommand..."

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Pull Git LFS files
git lfs pull

# Install Dependencies
if [ -f package-lock.json ]; then
  echo "📦 Installing dependencies from lock file"
  pnpm install --frozen-lockfile
else
  echo "📦 No `lock file`. Installing dependencies without one..."
  pnpm install
fi

echo "✅ postCreateCommand finished"
