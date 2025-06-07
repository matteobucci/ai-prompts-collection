# VS Code AI-Optimized Setup

## Quick Setup Overview

Transform VS Code into an AI-powered development environment with optimal configuration for Claude Code integration.

## 🚀 Installation & Initial Setup

### 1. VS Code Installation
```bash
# Windows (via winget)
winget install Microsoft.VisualStudioCode

# macOS (via Homebrew)
brew install --cask visual-studio-code

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install code
```

### 2. Essential AI Extensions
```bash
# Install via command palette (Ctrl+Shift+P) or terminal
code --install-extension GitHub.copilot
code --install-extension ms-vscode.vscode-json
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-python.python
code --install-extension rust-lang.rust-analyzer
```

## 🛠️ Core Configuration

### settings.json Configuration
```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.5,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  
  // AI and Code Completion
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": false,
    "markdown": true
  },
  "editor.inlineSuggest.enabled": true,
  "editor.suggestSelection": "first",
  "editor.tabCompletion": "on",
  
  // Code Formatting
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit"
  },
  
  // File Management
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true,
    "**/.DS_Store": true
  },
  
  // Terminal Integration
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.cursorBlinking": true,
  
  // Git Integration
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.autofetch": true,
  "scm.diffDecorations": "gutter"
}
```

### keybindings.json - AI-Optimized Shortcuts
```json
[
  {
    "key": "ctrl+shift+a",
    "command": "github.copilot.generate",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+c",
    "command": "github.copilot.acceptCursorPanelSolution",
    "when": "github.copilot.panelVisible"
  },
  {
    "key": "ctrl+;",
    "command": "editor.action.commentLine",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+shift+f",
    "command": "workbench.action.findInFiles"
  },
  {
    "key": "ctrl+`",
    "command": "workbench.action.terminal.toggleTerminal"
  }
]
```

## 🔧 Language-Specific Setup

### Python Development
```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.testing.pytestEnabled": true
}
```

### JavaScript/TypeScript
```json
{
  "typescript.preferences.quoteStyle": "single",
  "javascript.preferences.quoteStyle": "single",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always"
}
```

### Rust Development
```json
{
  "rust-analyzer.checkOnSave.command": "clippy",
  "rust-analyzer.cargo.buildScripts.enable": true,
  "rust-analyzer.procMacro.enable": true
}
```

## 🎨 Recommended Extensions by Category

### AI & Code Intelligence
- **GitHub Copilot**: AI pair programmer
- **TabNine**: Advanced code completion
- **IntelliCode**: Microsoft's AI assistance
- **CodeGPT**: ChatGPT integration

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **SonarLint**: Code quality analysis
- **Error Lens**: Inline error highlighting

### Git & Collaboration
- **GitLens**: Enhanced Git capabilities
- **Live Share**: Real-time collaboration
- **Git Graph**: Visual git history
- **GitHub Pull Requests**: PR management

### Productivity
- **Auto Rename Tag**: HTML/XML tag synchronization
- **Bracket Pair Colorizer**: Color-coded brackets
- **Path Intellisense**: File path completion
- **TODO Highlight**: Task highlighting

## 🔄 Claude Code Integration

### Terminal Setup for Claude Code
```bash
# Ensure Claude Code is accessible from VS Code terminal
# Add to your shell profile (.bashrc, .zshrc, etc.)
alias claude="claude-code"
export ANTHROPIC_API_KEY="your-api-key"
```

### Workspace Integration
```json
{
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Claude Code Review",
        "type": "shell",
        "command": "claude",
        "args": ["review", "${file}"],
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "shared"
        }
      }
    ]
  }
}
```

## 📊 Performance Optimization

### Memory & Performance Settings
```json
{
  "extensions.autoUpdate": false,
  "telemetry.telemetryLevel": "off",
  "workbench.enableExperiments": false,
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/*.code-search": true
  }
}
```

## ✅ Validation Checklist

- [ ] VS Code opens with proper font and theme
- [ ] GitHub Copilot provides suggestions
- [ ] Code formatting works on save
- [ ] Terminal integration functions properly
- [ ] Language servers activate correctly
- [ ] Git integration shows file changes
- [ ] Claude Code commands work from terminal
- [ ] Extensions load without errors