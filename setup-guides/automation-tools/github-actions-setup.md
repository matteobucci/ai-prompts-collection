# GitHub Actions CI/CD Setup

## 🎯 Overview

Create comprehensive GitHub Actions workflows for automated testing, building, and deployment with AI-assisted development integration.

## 🚀 Basic Workflow Setup

### Project Structure
```
.github/
├── workflows/
│   ├── ci.yml                 # Continuous Integration
│   ├── cd.yml                 # Continuous Deployment
│   ├── code-quality.yml       # Code quality checks
│   └── security.yml           # Security scanning
├── ISSUE_TEMPLATE/            # Issue templates
└── PULL_REQUEST_TEMPLATE.md   # PR template
```

### Essential CI Workflow
```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  PYTHON_VERSION: '3.11'

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for better analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Run integration tests
        run: npm run test:integration

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
          retention-days: 30
```

## 🔍 Code Quality Workflow

### Comprehensive Quality Checks
```yaml
# .github/workflows/code-quality.yml
name: Code Quality

on:
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # Claude Code Integration
      - name: Setup Claude Code
        run: |
          npm install -g @anthropic-ai/claude-code
          claude --version

      - name: AI Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Review changed files
          git diff --name-only origin/main...HEAD | while read file; do
            if [[ $file == *.js || $file == *.ts || $file == *.jsx || $file == *.tsx ]]; then
              echo "Reviewing $file"
              claude review "$file" --format=github >> claude-review.md
            fi
          done

      - name: SonarCloud Analysis
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      - name: Run ESLint
        run: npm run lint -- --format=@microsoft/eslint-formatter-sarif --output-file=eslint-results.sarif
        continue-on-error: true

      - name: Upload SARIF file
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: eslint-results.sarif

      - name: Dependency vulnerability scan
        run: npm audit --audit-level=moderate

      - name: Check for security issues
        uses: securecodewarrior/github-action-add-sarif@v1
        with:
          sarif-file: eslint-results.sarif

      - name: Comment Claude Review
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            if (fs.existsSync('claude-review.md')) {
              const review = fs.readFileSync('claude-review.md', 'utf8');
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: `## 🤖 Claude Code Review\n\n${review}`
              });
            }
```

## 🚀 Deployment Workflow

### Automated Deployment Pipeline
```yaml
# .github/workflows/cd.yml
name: Continuous Deployment

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.event.inputs.environment == 'staging'
    environment: staging

    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add your deployment commands here
          # Example: kubectl, terraform, ansible, etc.

  deploy-production:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v') || github.event.inputs.environment == 'production'
    environment: production

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add your production deployment commands here
```

## 🔐 Security Scanning Workflow

### Comprehensive Security Pipeline
```yaml
# .github/workflows/security.yml
name: Security Scanning

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v2

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Check for known security issues
        run: |
          npm audit --audit-level=high
          npx audit-ci --high

      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'project-name'
          path: '.'
          format: 'SARIF'

      - name: Upload OWASP results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'reports/dependency-check-report.sarif'
```

## 🛠️ Advanced Automation Features

### Matrix Testing Strategy
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node-version: [16, 18, 20]
    include:
      - os: ubuntu-latest
        node-version: 18
        coverage: true
    exclude:
      - os: windows-latest
        node-version: 16
```

### Conditional Job Execution
```yaml
jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      frontend: ${{ steps.changes.outputs.frontend }}
      backend: ${{ steps.changes.outputs.backend }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            frontend:
              - 'frontend/**'
            backend:
              - 'backend/**'

  test-frontend:
    needs: changes
    if: ${{ needs.changes.outputs.frontend == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - name: Test frontend
        run: npm run test:frontend

  test-backend:
    needs: changes
    if: ${{ needs.changes.outputs.backend == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - name: Test backend
        run: npm run test:backend
```

### Workflow Reusability
```yaml
# .github/workflows/reusable-test.yml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
      environment:
        required: false
        type: string
        default: 'test'
    secrets:
      API_KEY:
        required: true

jobs:
  test:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm test
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

## 📊 Monitoring & Notifications

### Workflow Status Notifications
```yaml
  notify:
    runs-on: ubuntu-latest
    needs: [test, build, deploy]
    if: always()
    
    steps:
      - name: Notify on success
        if: ${{ needs.test.result == 'success' && needs.build.result == 'success' }}
        uses: 8398a7/action-slack@v3
        with:
          status: success
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

      - name: Notify on failure
        if: ${{ failure() }}
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## ✅ Best Practices

### Security
- Use secrets for sensitive data
- Limit token permissions with GITHUB_TOKEN
- Pin action versions to specific commits
- Regularly update dependencies

### Performance
- Use caching for dependencies and build artifacts
- Optimize job parallelization
- Use conditional execution to skip unnecessary jobs
- Implement incremental builds where possible

### Maintainability
- Use reusable workflows for common patterns
- Document complex workflow logic
- Regular cleanup of unused workflows and artifacts
- Monitor workflow execution times and costs