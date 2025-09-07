set -euo pipefail

ZSHRC="$HOME/.zshrc"
ZSH_DIR="${ZSH:-$HOME/.oh-my-zsh}"
ANTIDOTE_DIR="$HOME/.antidote"
PLUG_TXT="$HOME/.zsh_plugins.txt"
PLUG_BUNDLE="$HOME/.zsh_plugins.sh"

append_if_missing() { grep -Fqx "$1" "$2" 2>/dev/null || echo "$1" >> "$2"; }

# 1) Install Antidote
[ -d "$ANTIDOTE_DIR" ] || git clone --depth=1 https://github.com/mattmc3/antidote "$ANTIDOTE_DIR"

# 2) Write plugin list (ensure syntax highlighting last)
cat > "$PLUG_TXT" <<'EOF'
zsh-users/zsh-autosuggestions
ohmyzsh/ohmyzsh path:plugins/git
MichaelAquilina/zsh-you-should-use
zdharma-continuum/fast-syntax-highlighting
EOF

# 3) Ensure OMZ base is sourced (safe if present)
if [ -d "$ZSH_DIR" ]; then
  grep -q '^export ZSH=' "$ZSHRC" 2>/dev/null || echo "export ZSH=\"$ZSH_DIR\"" >> "$ZSHRC"
  grep -q 'source \$ZSH/oh-my-zsh\.sh' "$ZSHRC" 2>/dev/null || echo 'source $ZSH/oh-my-zsh.sh' >> "$ZSHRC"
  # Disable OMZ theme (Starship owns the prompt)
  if grep -q '^ZSH_THEME=' "$ZSHRC" 2>/dev/null; then
    sed -i 's/^ZSH_THEME=.*/ZSH_THEME=""/' "$ZSHRC"
  else
    echo 'ZSH_THEME=""' >> "$ZSHRC"
  fi
  # Disable OMZ plugin loader to avoid double-loading
  if grep -q '^\s*plugins=' "$ZSHRC" 2>/dev/null; then
    sed -i 's/^\s*plugins=.*/plugins=()/' "$ZSHRC"
  else
    echo 'plugins=()' >> "$ZSHRC"
  fi
fi

# 4) Add Antidote init + bundle to .zshrc (persistent)
append_if_missing 'source ~/.antidote/antidote.zsh' "$ZSHRC"
if ! grep -q 'antidote bundle < ~/.zsh_plugins.txt' "$ZSHRC" 2>/dev/null; then
  cat >> "$ZSHRC" <<'EOS'
# Antidote bundle (rebuild if list changed)
if [ ! -f ~/.zsh_plugins.sh ] || [ ~/.zsh_plugins.txt -nt ~/.zsh_plugins.sh ]; then
  antidote bundle < ~/.zsh_plugins.txt > ~/.zsh_plugins.sh
fi
source ~/.zsh_plugins.sh
EOS
fi

# 5) Starship init (feature installs it)
grep -q 'starship init zsh' "$ZSHRC" 2>/dev/null || echo 'eval "$(starship init zsh)"' >> "$ZSHRC"

# 6) Make autosuggest ghost text readable
append_if_missing "export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=8'" "$ZSHRC"

echo "✅ Antidote + OMZ base configured. Plugins bundled. Starship initialized."
echo "   Open a new terminal or run: exec zsh"
