set -euo pipefail

echo "🚀 Running onCreateCommand..."

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

## Install Git LFS
git lfs install

# Setup Zsh
bash "$SCRIPT_DIR/setup-zsh.bash"

echo "✅ onCreateCommand finished"
