const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

// Configure marked with syntax highlighting (simplified for static build)
marked.setOptions({
  breaks: true,
  gfm: true
});

// File system helper functions (copied from server.js)
async function getAllMarkdownFiles(dir, baseDir = null) {
  if (!baseDir) baseDir = dir;
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Only scan specific directories we want
      const allowedDirs = [
        'architecture-design',
        'code-review-optimization', 
        'coding-fundamentals',
        'debugging-troubleshooting',
        'setup-guides',
        'templates',
        'testing',
        'automation-tools',
        'claude-code',
        'cloud-deployment',
        'development-environment',
        'ide-configuration',
        'project-templates'
      ];
      
      if (entry.isDirectory() && (allowedDirs.includes(entry.name) || dir === baseDir)) {
        const subFiles = await getAllMarkdownFiles(fullPath, baseDir);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
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
    console.error(`Error extracting title from ${filePath}:`, error);
    return path.basename(filePath, '.md');
  }
}

async function buildNavigationTree() {
  const rootDir = path.join(__dirname, '..');
  console.log(`Scanning directory: ${rootDir}`);
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
    const pathParts = file.path.split('/');
    
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
  
  return { tree, files };
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

async function buildStatic() {
  console.log('Building static site for GitHub Pages...');
  
  // Create dist directory
  const distDir = path.join(__dirname, 'dist');
  await fs.mkdir(distDir, { recursive: true });
  
  // Build navigation and get all files
  const { tree, files } = await buildNavigationTree();
  
  // Generate navigation data
  await fs.writeFile(
    path.join(distDir, 'navigation.json'),
    JSON.stringify(tree, null, 2)
  );
  
  console.log(`Generated navigation data with ${files.length} files`);
  
  // Generate content for each markdown file
  const contentDir = path.join(distDir, 'content');
  await fs.mkdir(contentDir, { recursive: true });
  
  for (const file of files) {
    try {
      const content = await renderMarkdown(file.fullPath);
      const rawContent = await fs.readFile(file.fullPath, 'utf-8');
      
      const contentData = {
        content,
        title: file.title,
        path: file.path,
        raw: rawContent
      };
      
      // Create directory structure if needed
      const filePath = path.join(contentDir, file.path + '.json');
      const fileDir = path.dirname(filePath);
      await fs.mkdir(fileDir, { recursive: true });
      
      await fs.writeFile(filePath, JSON.stringify(contentData, null, 2));
      console.log(`Generated content for: ${file.path}`);
    } catch (error) {
      console.error(`Error generating content for ${file.path}:`, error);
    }
  }
  
  // Copy static files
  await copyDirectory(path.join(__dirname, 'public'), distDir);
  
  console.log('Static build complete!');
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Run the build
buildStatic().catch(console.error);