set -euo pipefail

echo "🚀 Running postCreateCommand..."

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Pull Git LFS files
git lfs pull

# Install Dependencies
if [ -f package-lock.json ]; then
  echo "📦 Installing dependencies with npm ci..."
  npm ci
else
  echo "📦 No `package-lock.json`. Installing dependencies with npm install..."
  npm install
fi

echo "✅ postCreateCommand finished"
