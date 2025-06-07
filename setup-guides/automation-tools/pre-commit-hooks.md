# Pre-commit Hooks Setup

## 🎯 Overview

Implement automated code quality checks and AI-assisted reviews at commit time to catch issues early and maintain consistent code standards.

## 🚀 Installation & Basic Setup

### Install Pre-commit
```bash
# Using pip
pip install pre-commit

# Using Homebrew (macOS)
brew install pre-commit

# Using conda
conda install -c conda-forge pre-commit

# Verify installation
pre-commit --version
```

### Initialize in Project
```bash
# Navigate to your project root
cd your-project

# Create .pre-commit-config.yaml
touch .pre-commit-config.yaml

# Install git hook scripts
pre-commit install

# Install hooks for all hook types
pre-commit install --hook-type pre-commit
pre-commit install --hook-type pre-push
pre-commit install --hook-type commit-msg
```

## 🛠️ Configuration Examples

### Basic Configuration
```yaml
# .pre-commit-config.yaml
repos:
  # Basic code formatting and linting
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-toml
      - id: check-merge-conflict
      - id: check-added-large-files
        args: ['--maxkb=500']
      - id: detect-private-key

  # Python specific
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black
        language_version: python3

  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        args: ["--profile", "black"]

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8

  # JavaScript/TypeScript
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
        files: \.(js|ts|jsx|tsx)$
        additional_dependencies:
          - eslint@8.56.0
          - '@typescript-eslint/parser@6.15.0'
          - '@typescript-eslint/eslint-plugin@6.15.0'

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v4.0.0-alpha.8
    hooks:
      - id: prettier
        files: \.(js|ts|jsx|tsx|json|css|md|yml|yaml)$
```

### Advanced Configuration with AI Integration
```yaml
# .pre-commit-config.yaml
repos:
  # Standard hooks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-merge-conflict
      - id: check-added-large-files
        args: ['--maxkb=1000']
      - id: detect-private-key
      - id: check-ast
      - id: debug-statements

  # Security scanning
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

  # Python tools
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black

  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        args: ["--profile", "black"]

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
        additional_dependencies: [flake8-docstrings, flake8-bugbear]

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [types-requests]

  # JavaScript/TypeScript tools
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
        files: \.(js|ts|jsx|tsx)$
        additional_dependencies:
          - eslint@8.56.0
          - '@typescript-eslint/parser@6.15.0'
          - '@typescript-eslint/eslint-plugin@6.15.0'
          - eslint-plugin-react@7.33.2
          - eslint-plugin-react-hooks@4.6.0

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v4.0.0-alpha.8
    hooks:
      - id: prettier

  # Custom Claude Code integration
  - repo: local
    hooks:
      - id: claude-security-review
        name: Claude Security Review
        entry: scripts/claude-security-hook.sh
        language: script
        files: \.(py|js|ts|jsx|tsx)$
        pass_filenames: true
        
      - id: claude-code-quality
        name: Claude Code Quality Check
        entry: scripts/claude-quality-hook.sh
        language: script
        files: \.(py|js|ts|jsx|tsx)$
        pass_filenames: true
        stages: [pre-push]

  # Documentation
  - repo: https://github.com/myint/docformatter
    rev: v1.7.5
    hooks:
      - id: docformatter
        args: [--in-place, --wrap-summaries=80, --wrap-descriptions=80]

  # Commit message validation
  - repo: https://github.com/commitizen-tools/commitizen
    rev: v3.13.0
    hooks:
      - id: commitizen
        stages: [commit-msg]
```

## 🤖 Claude Code Integration Scripts

### Security Review Hook
```bash
#!/bin/bash
# scripts/claude-security-hook.sh

# Check if Claude Code is available
if ! command -v claude &> /dev/null; then
    echo "⚠️  Claude Code not found. Skipping security review."
    exit 0
fi

# Check if API key is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  ANTHROPIC_API_KEY not set. Skipping security review."
    exit 0
fi

echo "🔍 Running Claude security review..."

# Review each file for security issues
for file in "$@"; do
    if [[ $file == *.py || $file == *.js || $file == *.ts || $file == *.jsx || $file == *.tsx ]]; then
        echo "Reviewing $file for security issues..."
        
        # Run Claude security review
        review_output=$(claude review "$file" --focus=security --format=simple 2>/dev/null)
        
        # Check for critical security issues
        if echo "$review_output" | grep -q "🔴\|CRITICAL\|SECURITY"; then
            echo "❌ Critical security issues found in $file:"
            echo "$review_output"
            echo ""
            echo "Please address these security concerns before committing."
            exit 1
        fi
        
        # Check for warnings
        if echo "$review_output" | grep -q "⚠️\|WARNING"; then
            echo "⚠️  Security warnings found in $file:"
            echo "$review_output"
            echo ""
        fi
    fi
done

echo "✅ Security review passed"
exit 0
```

### Code Quality Hook
```bash
#!/bin/bash
# scripts/claude-quality-hook.sh

# Check if Claude Code is available
if ! command -v claude &> /dev/null; then
    echo "⚠️  Claude Code not found. Skipping quality review."
    exit 0
fi

echo "📝 Running Claude code quality review..."

# Track if any files have quality issues
has_issues=false

for file in "$@"; do
    if [[ $file == *.py || $file == *.js || $file == *.ts || $file == *.jsx || $file == *.tsx ]]; then
        echo "Reviewing $file for code quality..."
        
        # Run Claude quality review
        review_output=$(claude review "$file" --focus=quality --format=simple 2>/dev/null)
        
        # Check for critical quality issues
        if echo "$review_output" | grep -q "🔴\|CRITICAL"; then
            echo "❌ Critical quality issues found in $file:"
            echo "$review_output"
            echo ""
            has_issues=true
        fi
        
        # Show suggestions for improvement
        if echo "$review_output" | grep -q "💡\|SUGGESTION"; then
            echo "💡 Quality suggestions for $file:"
            echo "$review_output" | grep -A 3 "💡\|SUGGESTION"
            echo ""
        fi
    fi
done

if [ "$has_issues" = true ]; then
    echo "Please address the critical quality issues before pushing."
    exit 1
fi

echo "✅ Code quality review passed"
exit 0
```

### Make Scripts Executable
```bash
chmod +x scripts/claude-security-hook.sh
chmod +x scripts/claude-quality-hook.sh
```

## 🎛️ Language-Specific Configurations

### Python Project
```yaml
# .pre-commit-config.yaml for Python
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: debug-statements
      - id: check-ast

  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black

  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        args: ["--profile", "black", "--check-only", "--diff"]

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
        additional_dependencies:
          - flake8-docstrings
          - flake8-bugbear
          - flake8-comprehensions

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [types-requests, types-PyYAML]

  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.5
    hooks:
      - id: bandit
        args: ["-c", "pyproject.toml"]

  - repo: https://github.com/python-poetry/poetry
    rev: 1.7.1
    hooks:
      - id: poetry-check
      - id: poetry-lock
        args: ["--no-update"]
```

### Node.js/React Project
```yaml
# .pre-commit-config.yaml for Node.js/React
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-json
      - id: check-yaml
      - id: check-merge-conflict
      - id: check-added-large-files

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
        files: \.(js|jsx|ts|tsx)$
        additional_dependencies:
          - eslint@8.56.0
          - '@typescript-eslint/parser@6.15.0'
          - '@typescript-eslint/eslint-plugin@6.15.0'
          - eslint-plugin-react@7.33.2
          - eslint-plugin-react-hooks@4.6.0
          - eslint-plugin-jsx-a11y@6.8.0

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v4.0.0-alpha.8
    hooks:
      - id: prettier
        files: \.(js|jsx|ts|tsx|json|css|scss|md)$

  - repo: local
    hooks:
      - id: tsc
        name: TypeScript Compiler
        entry: npx tsc --noEmit
        language: system
        files: \.(ts|tsx)$
        pass_filenames: false

      - id: jest
        name: Jest Tests
        entry: npm test -- --passWithNoTests
        language: system
        pass_filenames: false
        stages: [pre-push]
```

## 🔧 Advanced Hook Configuration

### Custom Hook Development
```python
#!/usr/bin/env python3
# hooks/check-import-order.py

import ast
import sys
from typing import List, Set

def check_import_order(filename: str) -> List[str]:
    """Check if imports are properly ordered."""
    with open(filename, 'r') as f:
        try:
            tree = ast.parse(f.read())
        except SyntaxError:
            return []

    errors = []
    imports = []
    
    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            imports.append((node.lineno, node))
    
    # Check import order logic here
    # Return list of error messages
    
    return errors

if __name__ == '__main__':
    errors = []
    for filename in sys.argv[1:]:
        if filename.endswith('.py'):
            file_errors = check_import_order(filename)
            errors.extend(file_errors)
    
    if errors:
        for error in errors:
            print(error)
        sys.exit(1)
    
    sys.exit(0)
```

### Multi-stage Hook Configuration
```yaml
repos:
  - repo: local
    hooks:
      # Fast checks for every commit
      - id: fast-lint
        name: Fast Linting
        entry: npm run lint:fast
        language: system
        stages: [pre-commit]
        
      # Comprehensive checks before push
      - id: full-test-suite
        name: Full Test Suite
        entry: npm run test:all
        language: system
        stages: [pre-push]
        
      # Security audit before push
      - id: security-audit
        name: Security Audit
        entry: npm audit --audit-level=moderate
        language: system
        stages: [pre-push]
```

## 📊 Performance Optimization

### Selective File Processing
```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black
        files: ^(src/|tests/).*\.py$  # Only process specific directories

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
        files: ^src/.*\.(js|ts|jsx|tsx)$
        exclude: ^src/vendor/  # Exclude vendor files
```

### Parallel Execution
```bash
# Enable parallel execution
pre-commit run --all-files --hook-stage=pre-commit --jobs=4
```

## ✅ Best Practices

### Setup Guidelines
- Start with basic hooks and gradually add more
- Test hooks thoroughly before team adoption
- Document custom hooks and their purpose
- Regular updates of hook versions

### Performance Tips
- Use `files` and `exclude` patterns to limit scope
- Implement fast-fail for critical checks
- Cache dependencies when possible
- Use parallel execution for independent checks

### Team Adoption
- Provide clear documentation and examples
- Set up shared configuration files
- Create onboarding scripts for new developers
- Regular maintenance and updates

### Troubleshooting
```bash
# Skip hooks for emergency commits
git commit --no-verify -m "Emergency fix"

# Run specific hook
pre-commit run black --all-files

# Update hooks to latest versions
pre-commit autoupdate

# Clean and reinstall hooks
pre-commit clean
pre-commit install
```