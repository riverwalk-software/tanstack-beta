set -euo pipefail

echo "🚀 Running postStartCommand..."

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Start dev server (if not already running)
if ! pgrep -f "node .*dev" >/dev/null 2>&1 && ! lsof -i:3000 >/dev/null 2>&1; then
  echo "▶️ npm run dev &"
  nohup npm run dev >/workspace/.devserver.log 2>&1 &
else
  echo "[INFO] dev server already running (pid/port check)"
fi

echo "✅ postStartCommand finished"
