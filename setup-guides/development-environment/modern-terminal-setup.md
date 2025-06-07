# Modern Terminal Setup

## 🎯 Overview

Transform your terminal into a powerful, efficient development environment with modern tools, enhanced shell configurations, and productivity features.

## 🚀 Terminal Emulator Setup

### Recommended Terminal Emulators

#### macOS
```bash
# Install iTerm2 (Recommended)
brew install --cask iterm2

# Alternative: Alacritty (Fast, GPU-accelerated)
brew install --cask alacritty

# Alternative: Kitty (Feature-rich)
brew install --cask kitty

# Alternative: Wezterm (Modern, cross-platform)
brew install --cask wezterm
```

#### Linux
```bash
# Alacritty (Recommended for performance)
sudo apt install alacritty

# Kitty (Feature-rich)
sudo apt install kitty

# Terminator (Multiple panes)
sudo apt install terminator

# GNOME Terminal (Default, good integration)
# Usually pre-installed

# WezTerm (Modern)
curl -LO https://github.com/wez/wezterm/releases/latest/download/wezterm-*.AppImage
chmod +x wezterm-*.AppImage
```

#### Windows
```bash
# Windows Terminal (Recommended)
winget install Microsoft.WindowsTerminal

# Alternative: Alacritty
winget install Alacritty.Alacritty

# Alternative: WezTerm
winget install wez.wezterm
```

### Terminal Configuration

#### iTerm2 Configuration
```bash
# Install iTerm2 Shell Integration
curl -L https://iterm2.com/shell_integration/install_shell_integration_and_utilities.sh | bash

# iTerm2 Profile Settings (Preferences > Profiles)
# - Font: Fira Code, 14pt, with ligatures enabled
# - Color Scheme: Dracula or Solarized Dark
# - Window transparency: 10-15%
# - Blur: Enabled
# - Cursor: Vertical bar, blinking
```

#### Alacritty Configuration
```yaml
# ~/.config/alacritty/alacritty.yml
window:
  padding:
    x: 6
    y: 6
  dynamic_padding: false
  decorations: buttonless
  startup_mode: Windowed

scrolling:
  history: 10000
  multiplier: 3

font:
  normal:
    family: "Fira Code"
    style: Regular
  bold:
    family: "Fira Code"
    style: Bold
  italic:
    family: "Fira Code"
    style: Italic
  size: 14.0

colors:
  primary:
    background: '#1e1e1e'
    foreground: '#d4d4d4'
  
  normal:
    black:   '#000000'
    red:     '#cd3131'
    green:   '#0dbc79'
    yellow:  '#e5e510'
    blue:    '#2472c8'
    magenta: '#bc3fbc'
    cyan:    '#11a8cd'
    white:   '#e5e5e5'
  
  bright:
    black:   '#666666'
    red:     '#f14c4c'
    green:   '#23d18b'
    yellow:  '#f5f543'
    blue:    '#3b8eea'
    magenta: '#d670d6'
    cyan:    '#29b8db'
    white:   '#e5e5e5'

cursor:
  style: Block
  unfocused_hollow: true

mouse:
  hide_when_typing: true

key_bindings:
  - { key: V,        mods: Command,       action: Paste            }
  - { key: C,        mods: Command,       action: Copy             }
  - { key: Q,        mods: Command,       action: Quit             }
  - { key: N,        mods: Command,       action: SpawnNewInstance }
```

## 🐚 Shell Enhancement

### Zsh Setup (Recommended)
```bash
# Install Zsh (if not already installed)
# macOS: Pre-installed
# Linux:
sudo apt install zsh

# Windows (WSL):
sudo apt install zsh

# Set Zsh as default shell
chsh -s $(which zsh)

# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### Oh My Zsh Configuration
```bash
# ~/.zshrc configuration
export ZSH="$HOME/.oh-my-zsh"

# Theme selection
ZSH_THEME="powerlevel10k/powerlevel10k"

# Plugins
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  z
  docker
  kubectl
  npm
  node
  python
  rust
  vscode
  web-search
  copypath
  copyfile
  extract
)

source $ZSH/oh-my-zsh.sh

# User configuration
export PATH=$HOME/bin:/usr/local/bin:$PATH
export EDITOR='code'

# Aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias gb='git branch'
alias gco='git checkout'

# Development aliases
alias serve='python -m http.server'
alias myip='curl http://ipecho.net/plain; echo'
alias tree='tree -aC -I ".git|node_modules|.next"'

# Load additional configuration
source ~/.zsh_profile
```

### Essential Zsh Plugins Installation
```bash
# Install Powerlevel10k theme
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# Install zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# Install zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# Configure Powerlevel10k
p10k configure
```

## 🔧 Modern Command Line Tools

### Essential Replacements
```bash
# Better ls alternative
brew install exa
# or
cargo install exa

# Better cat alternative
brew install bat
# or
cargo install bat

# Better grep alternative
brew install ripgrep
# or
cargo install ripgrep

# Better find alternative
brew install fd
# or
cargo install fd-find

# Better du alternative
brew install dust
# or
cargo install du-dust

# Better top alternative
brew install htop btop
# or
sudo apt install htop

# Better ps alternative
brew install procs
# or
cargo install procs

# JSON processor
brew install jq

# HTTP client
brew install httpie

# File manager
brew install ranger
# or
cargo install broot
```

### Git Enhancement
```bash
# Install delta for better git diff
brew install git-delta
# or
cargo install git-delta

# Install lazygit for TUI git interface
brew install lazygit

# Configure git with delta
git config --global core.pager delta
git config --global interactive.diffFilter 'delta --color-only'
git config --global delta.navigate true
git config --global merge.conflictstyle diff3
git config --global diff.colorMoved default
```

### Node.js Version Management
```bash
# Install fnm (fast node manager)
curl -fsSL https://fnm.vercel.app/install | bash

# Install latest LTS Node.js
fnm install --lts
fnm use lts-latest
fnm default lts-latest

# Alternative: Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
nvm alias default lts/*
```

## 📁 Enhanced File Navigation

### Fuzzy Finding with fzf
```bash
# Install fzf
brew install fzf
# or
sudo apt install fzf

# Install shell integration
$(brew --prefix)/opt/fzf/install
# or for Linux
/usr/share/doc/fzf/examples/install

# Add to ~/.zshrc
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND='fd --type d --hidden --follow --exclude .git'

# Custom fzf functions
fh() {
  eval $( ([ -n "$ZSH_NAME" ] && fc -l 1 || history) | fzf +s --tac | sed 's/ *[0-9]* *//')
}

# Git commit browser
fshow() {
  git log --graph --color=always \
      --format="%C(auto)%h%d %s %C(black)%C(bold)%cr" "$@" |
  fzf --ansi --no-sort --reverse --tiebreak=index --bind=ctrl-s:toggle-sort \
      --bind "ctrl-m:execute:
                (grep -o '[a-f0-9]\{7\}' | head -1 |
                xargs -I % sh -c 'git show --color=always % | less -R') << 'FZF-EOF'
                {}
FZF-EOF"
}
```

### Directory Navigation with z
```bash
# z is included in Oh My Zsh plugins
# Usage examples:
# z Documents    # Jump to ~/Documents
# z proj         # Jump to most frecent directory matching "proj"
# z -l           # List all directories in database
```

## 🎨 Terminal Customization

### Custom Aliases and Functions
```bash
# ~/.zsh_profile
# Development shortcuts
alias weather='curl wttr.in'
alias cheat='curl cheat.sh/'
alias speedtest='curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python -'

# Project navigation
alias projects='cd ~/Projects'
alias dotfiles='cd ~/.dotfiles'

# Docker shortcuts
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
alias dlog='docker logs -f'
alias dexec='docker exec -it'

# Kubernetes shortcuts
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kdp='kubectl describe pod'

# Network utilities
alias ports='netstat -tulanp'
alias listening='lsof -i -P | grep LISTEN'

# System information
alias cpu='top -o cpu'
alias mem='top -o mem'
alias disk='df -h'

# Quick editing
alias zshconfig='code ~/.zshrc'
alias aliases='code ~/.zsh_profile'

# Functions
mkcd() {
    mkdir -p "$1" && cd "$1"
}

extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.bz2)   tar xjf "$1"     ;;
            *.tar.gz)    tar xzf "$1"     ;;
            *.bz2)       bunzip2 "$1"     ;;
            *.rar)       unrar x "$1"     ;;
            *.gz)        gunzip "$1"      ;;
            *.tar)       tar xf "$1"      ;;
            *.tbz2)      tar xjf "$1"     ;;
            *.tgz)       tar xzf "$1"     ;;
            *.zip)       unzip "$1"       ;;
            *.Z)         uncompress "$1"  ;;
            *.7z)        7z x "$1"        ;;
            *)           echo "'$1' cannot be extracted via extract()" ;;
        esac
    else
        echo "'$1' is not a valid file"
    fi
}

# Git functions
gitignore() {
    curl -sL "https://www.gitignore.io/api/$1"
}

weather() {
    curl -s "wttr.in/$1?format=3"
}
```

### Starship Prompt (Alternative to Powerlevel10k)
```bash
# Install Starship
curl -sS https://starship.rs/install.sh | sh

# Add to ~/.zshrc
eval "$(starship init zsh)"

# Create ~/.config/starship.toml
[character]
success_symbol = "[➜](bold green)"
error_symbol = "[➜](bold red)"

[git_branch]
symbol = "🌱 "

[git_status]
ahead = "⇡${count}"
diverged = "⇕⇡${ahead_count}⇣${behind_count}"
behind = "⇣${count}"

[nodejs]
symbol = "⬢ "

[python]
symbol = "🐍 "

[rust]
symbol = "🦀 "

[docker_context]
symbol = "🐳 "

[kubernetes]
symbol = "☸ "
disabled = false

[package]
disabled = true
```

## 📱 Multiplexer Setup

### tmux Configuration
```bash
# Install tmux
brew install tmux
# or
sudo apt install tmux

# Create ~/.tmux.conf
# Set prefix to Ctrl-a
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Split panes
bind | split-window -h
bind - split-window -v
unbind '"'
unbind %

# Switch panes
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Enable mouse mode
set -g mouse on

# Status bar
set -g status-bg black
set -g status-fg white
set -g status-interval 60
set -g status-left-length 30
set -g status-left '#[fg=green](#S) #(whoami)'
set -g status-right '#[fg=yellow]#(cut -d " " -f 1-3 /proc/loadavg)#[default] #[fg=white]%H:%M#[default]'

# Install tmux plugin manager
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# Plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'

# Initialize TMUX plugin manager
run '~/.tmux/plugins/tpm/tpm'
```

## 🔄 Environment Synchronization

### Dotfiles Management
```bash
# Create dotfiles repository
mkdir ~/.dotfiles
cd ~/.dotfiles
git init

# Add configuration files
ln -sf ~/.dotfiles/.zshrc ~/.zshrc
ln -sf ~/.dotfiles/.gitconfig ~/.gitconfig
ln -sf ~/.dotfiles/.tmux.conf ~/.tmux.conf

# Installation script
#!/bin/bash
# ~/.dotfiles/install.sh

# Install Homebrew (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install essential tools
brew install git zsh tmux fzf ripgrep bat exa fd

# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Symlink dotfiles
ln -sf ~/.dotfiles/.zshrc ~/.zshrc
ln -sf ~/.dotfiles/.gitconfig ~/.gitconfig
ln -sf ~/.dotfiles/.tmux.conf ~/.tmux.conf

echo "Dotfiles installed! Please restart your terminal."
```

### Backup and Sync Script
```bash
#!/bin/bash
# ~/.dotfiles/backup.sh

# Backup current configs
cp ~/.zshrc ~/.dotfiles/.zshrc
cp ~/.gitconfig ~/.dotfiles/.gitconfig
cp ~/.tmux.conf ~/.dotfiles/.tmux.conf

# Commit changes
cd ~/.dotfiles
git add .
git commit -m "Update dotfiles $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "Dotfiles backed up and synced!"
```

## ✅ Quick Setup Script

### One-liner Installation
```bash
# Run this command to set up everything
curl -s https://raw.githubusercontent.com/your-username/dotfiles/main/install.sh | bash
```

### Complete Setup Script
```bash
#!/bin/bash
# Complete terminal setup script

set -e

echo "🚀 Setting up modern terminal environment..."

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    PACKAGE_MANAGER="apt"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    PACKAGE_MANAGER="brew"
else
    echo "Unsupported OS"
    exit 1
fi

# Install package manager if needed
if [[ "$OS" == "macos" ]] && ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install essential tools
echo "Installing essential tools..."
if [[ "$OS" == "macos" ]]; then
    brew install zsh git tmux fzf ripgrep bat exa fd-find jq httpie delta lazygit
else
    sudo apt update
    sudo apt install -y zsh git tmux fzf ripgrep bat fd-find jq curl
fi

# Install Oh My Zsh
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    echo "Installing Oh My Zsh..."
    sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# Install Powerlevel10k
if [ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k" ]; then
    echo "Installing Powerlevel10k..."
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
fi

# Install plugins
echo "Installing Zsh plugins..."
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# Set Zsh as default shell
if [ "$SHELL" != "$(which zsh)" ]; then
    echo "Setting Zsh as default shell..."
    chsh -s $(which zsh)
fi

echo "✅ Setup complete! Please restart your terminal and run 'p10k configure' to configure your prompt."
```