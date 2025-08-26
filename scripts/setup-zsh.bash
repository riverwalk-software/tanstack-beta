set -euo pipefail

# Paths
USER_HOME="$HOME"
ZSHRC="$USER_HOME/.zshrc"
ZSH_DIR="$USER_HOME/.oh-my-zsh"
ZSH_CUSTOM="${ZSH_CUSTOM:-$ZSH_DIR/custom}"

# --- Install Oh My Zsh (if missing) ---
if [ ! -d "$ZSH_DIR" ]; then
  sudo apt-get update && sudo apt-get install -y curl git ca-certificates
  RUNZSH=no CHSH=no \
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
else
  echo "Oh My Zsh already installed; skipping."
fi

# --- Install Plugins ---
[ -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ] || \
  git clone https://github.com/zsh-users/zsh-autosuggestions "$ZSH_CUSTOM/plugins/zsh-autosuggestions"

[ -d "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" ] || \
  git clone https://github.com/zsh-users/zsh-syntax-highlighting "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting"

# Ensure plugins line (syntax-highlighting MUST be last)
if grep -qE '^\s*plugins=' "$ZSHRC"; then
  sed -i 's/^\s*plugins=.*/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' "$ZSHRC"
else
  echo 'plugins=(git zsh-autosuggestions zsh-syntax-highlighting)' >> "$ZSHRC"
fi

# --- Starship ---
if ! command -v starship >/dev/null 2>&1; then
  curl -sS https://starship.rs/install.sh | sh -s -- -y
fi

# Only add init line if missing
grep -q 'starship init zsh' "$ZSHRC" || echo 'eval "$(starship init zsh)"' >> "$ZSHRC"

# --- Make ghost text visible ---
grep -q ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE "$ZSHRC" || \
  echo "export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=8'" >> "$ZSHRC"

echo "✅ Oh My Zsh + plugins + Starship configured. Open a new terminal or run: exec zsh"
