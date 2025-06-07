# Claude Code Installation & Setup

## 🚀 Installation

### Prerequisites
- Node.js 18+ or Python 3.8+
- Git (for repository integration)
- Terminal access (bash, zsh, PowerShell)

### Installation Methods

#### Option 1: NPM (Recommended)
```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

#### Option 2: Python pip
```bash
# Install via pip
pip install claude-code

# Verify installation
claude --version
```

#### Option 3: Direct Download
```bash
# Download latest release
curl -L https://github.com/anthropics/claude-code/releases/latest/download/claude-code-linux -o claude
chmod +x claude
sudo mv claude /usr/local/bin/

# For Windows (PowerShell)
Invoke-WebRequest -Uri "https://github.com/anthropics/claude-code/releases/latest/download/claude-code-windows.exe" -OutFile "claude.exe"
```

## 🔐 Authentication Setup

### API Key Configuration
```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY="your-api-key-here"

# Make it permanent (add to your shell profile)
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.zshrc

# For Windows (PowerShell)
$env:ANTHROPIC_API_KEY = "your-api-key-here"
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "your-api-key-here", "User")
```

### Alternative Authentication Methods
```bash
# Using configuration file
claude config set api-key "your-api-key-here"

# Using interactive setup
claude auth login
```

### Verify Authentication
```bash
# Test API connection
claude auth status

# Run a simple test
claude chat "Hello, can you help me with coding?"
```

## ⚙️ Configuration

### Global Configuration File
Create `~/.claude/config.json`:
```json
{
  "api_key": "your-api-key-here",
  "model": "claude-3-sonnet-20240229",
  "max_tokens": 4096,
  "temperature": 0.1,
  "editor": "code",
  "auto_save": true,
  "git_integration": true,
  "default_language": "auto-detect"
}
```

### Project-Specific Configuration
Create `.claude.json` in your project root:
```json
{
  "project_name": "my-awesome-project",
  "language": "typescript",
  "framework": "react",
  "testing_framework": "jest",
  "style_guide": "eslint:recommended",
  "custom_prompts": "./prompts/",
  "exclude_files": [
    "node_modules/**",
    "dist/**",
    "*.log"
  ]
}
```

## 🛠️ IDE Integration

### VS Code Integration
```bash
# Install VS Code extension
code --install-extension anthropic.claude-code

# Configure workspace settings
mkdir .vscode
cat > .vscode/settings.json << EOF
{
  "claude.apiKey": "\${env:ANTHROPIC_API_KEY}",
  "claude.autoSuggest": true,
  "claude.enableCodeReview": true,
  "claude.defaultModel": "claude-3-sonnet-20240229"
}
EOF
```

### Terminal Aliases and Functions
Add to your shell profile (`~/.bashrc`, `~/.zshrc`):
```bash
# Useful Claude Code aliases
alias cr="claude review"
alias cg="claude generate"
alias ce="claude explain"
alias cf="claude fix"
alias cd="claude docs"

# Enhanced functions
function claude-commit() {
  claude review --format=commit | git commit -F -
}

function claude-pr() {
  claude review --format=pr-description > pr-template.md
  echo "PR description generated in pr-template.md"
}

function claude-test() {
  claude generate --type=test --file="$1"
}
```

## 📁 Project Structure Setup

### Initialize Claude in Project
```bash
# Navigate to your project
cd your-project

# Initialize Claude configuration
claude init

# This creates:
# - .claude.json (project config)
# - .claude/ (local settings and cache)
# - prompts/ (custom prompt templates)
```

### Custom Prompt Directory
```bash
mkdir -p prompts/{review,generate,explain,fix}

# Create template prompts
cat > prompts/review/security.md << EOF
# Security Review Prompt
Review this code for security vulnerabilities:
- SQL injection potential
- XSS vulnerabilities  
- Authentication issues
- Data exposure risks
EOF
```

## 🔧 Advanced Configuration

### Model Selection
```bash
# List available models
claude models list

# Set default model
claude config set model "claude-3-opus-20240229"

# Use specific model for a command
claude chat --model="claude-3-haiku-20240307" "Quick question about syntax"
```

### Performance Optimization
```json
{
  "cache_enabled": true,
  "cache_duration": 3600,
  "parallel_requests": 3,
  "request_timeout": 30,
  "retry_attempts": 2,
  "stream_responses": true
}
```

### Git Integration Settings
```json
{
  "git": {
    "auto_commit_reviews": false,
    "include_diff_context": true,
    "respect_gitignore": true,
    "branch_naming": "claude/{task-description}",
    "commit_template": "feat: {description}\n\n🤖 Generated with Claude Code"
  }
}
```

## ✅ Verification & Testing

### Basic Functionality Test
```bash
# Test core commands
claude chat "Test connection"
claude review README.md
claude explain package.json
claude generate --type=function --description="fibonacci sequence"
```

### Integration Tests
```bash
# Test Git integration
git status
claude review --staged

# Test IDE integration (if using VS Code)
code . 
# Try Claude commands in command palette (Ctrl+Shift+P)

# Test project configuration
claude config show
claude project status
```

### Troubleshooting Common Issues
```bash
# Check authentication
claude auth status

# Verify API key
echo $ANTHROPIC_API_KEY

# Clear cache if needed
claude cache clear

# Update to latest version
npm update -g @anthropic-ai/claude-code

# Check logs for errors
claude logs --tail=50
```

## 🚀 Next Steps

After successful installation:
1. **Configure your IDE** with Claude Code integration
2. **Set up custom prompts** for your specific use cases  
3. **Establish workflow patterns** for daily development
4. **Share configurations** with your team
5. **Explore advanced features** like automated code reviews and generation

See the workflow guides for detailed usage patterns and best practices.