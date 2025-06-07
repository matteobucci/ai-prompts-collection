const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { marked } = require('marked');
const hljs = require('highlight.js');
const chokidar = require('chokidar');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {}
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));

// Content cache for better performance
let contentCache = new Map();
let navigationTree = null;

// File system helper functions
async function getAllMarkdownFiles(dir, baseDir = null) {
  if (!baseDir) baseDir = dir;
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'web-viewer') {
        const subFiles = await getAllMarkdownFiles(fullPath, baseDir);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const relativePath = path.relative(baseDir, fullPath);
        files.push({
          path: relativePath,
          fullPath: fullPath,
          name: entry.name,
          title: await extractTitle(fullPath)
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

async function extractTitle(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Look for the first heading
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return trimmed.substring(2).trim();
      }
    }
    
    // Fallback to filename
    return path.basename(filePath, '.md').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  } catch (error) {
    return path.basename(filePath, '.md');
  }
}

async function buildNavigationTree() {
  const rootDir = path.join(__dirname, '../..');
  const files = await getAllMarkdownFiles(rootDir);
  
  const tree = {
    'Prompt Categories': {
      'Coding Fundamentals': [],
      'Debugging & Troubleshooting': [],
      'Code Review & Optimization': [],
      'Architecture & Design': [],
      'Testing': [],
      'Templates': []
    },
    'Setup Guides': {
      'IDE Configuration': [],
      'Claude Code': [],
      'Automation Tools': [],
      'Project Templates': [],
      'Cloud Deployment': [],
      'Development Environment': []
    }
  };
  
  // Add root README
  const rootReadme = files.find(f => f.path === 'README.md');
  if (rootReadme) {
    tree['Getting Started'] = [rootReadme];
  }
  
  // Organize files into categories
  files.forEach(file => {
    const pathParts = file.path.split(path.sep);
    
    if (pathParts[0] === 'coding-fundamentals') {
      tree['Prompt Categories']['Coding Fundamentals'].push(file);
    } else if (pathParts[0] === 'debugging-troubleshooting') {
      tree['Prompt Categories']['Debugging & Troubleshooting'].push(file);
    } else if (pathParts[0] === 'code-review-optimization') {
      tree['Prompt Categories']['Code Review & Optimization'].push(file);
    } else if (pathParts[0] === 'architecture-design') {
      tree['Prompt Categories']['Architecture & Design'].push(file);
    } else if (pathParts[0] === 'testing') {
      tree['Prompt Categories']['Testing'].push(file);
    } else if (pathParts[0] === 'templates') {
      tree['Prompt Categories']['Templates'].push(file);
    } else if (pathParts[0] === 'setup-guides') {
      if (pathParts[1] === 'ide-configuration') {
        tree['Setup Guides']['IDE Configuration'].push(file);
      } else if (pathParts[1] === 'claude-code') {
        tree['Setup Guides']['Claude Code'].push(file);
      } else if (pathParts[1] === 'automation-tools') {
        tree['Setup Guides']['Automation Tools'].push(file);
      } else if (pathParts[1] === 'project-templates') {
        tree['Setup Guides']['Project Templates'].push(file);
      } else if (pathParts[1] === 'cloud-deployment') {
        tree['Setup Guides']['Cloud Deployment'].push(file);
      } else if (pathParts[1] === 'development-environment') {
        tree['Setup Guides']['Development Environment'].push(file);
      } else if (pathParts[1] === 'README.md') {
        tree['Setup Guides']['Overview'] = [file];
      }
    }
  });
  
  return tree;
}

async function renderMarkdown(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return marked(content);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '<p>Error loading content</p>';
  }
}

// Initialize navigation tree
async function initialize() {
  console.log('Building navigation tree...');
  navigationTree = await buildNavigationTree();
  console.log('Navigation tree built successfully');
  
  // Watch for file changes in development
  if (process.env.NODE_ENV !== 'production') {
    const watcher = chokidar.watch(path.join(__dirname, '../..'), {
      ignored: /(^|[\/\\])\..|node_modules|web-viewer/,
      persistent: true
    });
    
    watcher.on('change', async (path) => {
      if (path.endsWith('.md')) {
        console.log(`File ${path} changed, clearing cache`);
        contentCache.clear();
        navigationTree = await buildNavigationTree();
      }
    });
  }
}

// Routes
app.get('/', async (req, res) => {
  try {
    const html = await fs.readFile(path.join(__dirname, '../public/index.html'), 'utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading page');
  }
});

app.get('/api/navigation', (req, res) => {
  res.json(navigationTree);
});

app.get('/api/content', async (req, res) => {
  const filePath = req.query.path;
  
  if (!filePath) {
    return res.status(400).json({ error: 'Path parameter required' });
  }
  
  // Check cache first
  if (contentCache.has(filePath)) {
    return res.json(contentCache.get(filePath));
  }
  
  try {
    const fullPath = path.join(__dirname, '../..', filePath);
    const content = await renderMarkdown(fullPath);
    const title = await extractTitle(fullPath);
    
    const result = {
      content,
      title,
      path: filePath
    };
    
    // Cache the result
    contentCache.set(filePath, result);
    
    res.json(result);
  } catch (error) {
    console.error('Error loading content:', error);
    res.status(404).json({ error: 'Content not found' });
  }
});

app.get('/api/search', async (req, res) => {
  const query = req.query.q?.toLowerCase();
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter required' });
  }
  
  try {
    const rootDir = path.join(__dirname, '../..');
    const files = await getAllMarkdownFiles(rootDir);
    const results = [];
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file.fullPath, 'utf-8');
        const lines = content.split('\n');
        
        // Search in title and content
        if (file.title.toLowerCase().includes(query) || content.toLowerCase().includes(query)) {
          const matches = [];
          
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(query)) {
              matches.push({
                line: index + 1,
                content: line.trim(),
                context: lines.slice(Math.max(0, index - 1), index + 2).join('\n')
              });
            }
          });
          
          results.push({
            file: file,
            matches: matches.slice(0, 3) // Limit to 3 matches per file
          });
        }
      } catch (error) {
        console.error(`Error searching file ${file.fullPath}:`, error);
      }
    }
    
    res.json(results.slice(0, 20)); // Limit to 20 results
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Prompts Web Viewer running at http://localhost:${PORT}`);
    console.log(`📚 Browse your AI coding prompts collection in style!`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});