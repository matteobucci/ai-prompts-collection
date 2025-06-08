// Detect environment and set base URL
function detectEnvironment() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Check if we're on GitHub Pages
  if (hostname.includes('github.io') && pathname.includes('/ai-prompts-collection/')) {
    // Set base tag for GitHub Pages
    const baseTag = document.createElement('base');
    baseTag.href = '/ai-prompts-collection/';
    document.head.insertBefore(baseTag, document.head.firstChild);
    return true;
  }
  
  return false;
}

// Initialize environment detection
const isGitHubPages = detectEnvironment();

// App State
const state = {
  currentPath: null,
  navigation: null,
  searchResults: [],
  theme: localStorage.getItem('theme') || 'light',
  isLoading: false,
  isStatic: false // Will be detected automatically
};

// DOM Elements
const elements = {
  logo: document.getElementById('logo'),
  searchToggle: document.getElementById('searchToggle'),
  searchContainer: document.getElementById('searchContainer'),
  searchInput: document.getElementById('searchInput'),
  searchClose: document.getElementById('searchClose'),
  searchResults: document.getElementById('searchResults'),
  themeToggle: document.getElementById('themeToggle'),
  sidebarToggle: document.getElementById('sidebarToggle'),
  sidebar: document.getElementById('sidebar'),
  navigation: document.getElementById('navigation'),
  content: document.getElementById('content'),
  contentArea: document.getElementById('contentArea'),
  contentBody: document.getElementById('contentBody'),
  breadcrumb: document.getElementById('breadcrumb'),
  copyBtn: document.getElementById('copyBtn'),
  printBtn: document.getElementById('printBtn'),
  loadingOverlay: document.getElementById('loadingOverlay'),
  toastContainer: document.getElementById('toastContainer')
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  initializeTheme();
  bindEvents();
  await loadNavigation();
  bindFeatureCards();
  
  // Load content from URL hash
  const hash = window.location.hash.substring(1);
  if (hash) {
    const decodedPath = decodeURIComponent(hash);
    await loadContent(decodedPath);
  }
});

// Theme Management
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('theme', state.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = elements.themeToggle.querySelector('i');
  icon.className = state.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Event Bindings
function bindEvents() {
  // Logo click to return home
  elements.logo.addEventListener('click', () => {
    showWelcomeScreen();
    showToast('Welcome back to the homepage!', 'success');
  });
  
  // Search functionality
  elements.searchToggle.addEventListener('click', toggleSearch);
  elements.searchClose.addEventListener('click', toggleSearch);
  elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
  elements.searchInput.addEventListener('keydown', handleSearchKeydown);
  
  // Theme toggle
  elements.themeToggle.addEventListener('click', toggleTheme);
  
  // Sidebar toggle for mobile
  elements.sidebarToggle.addEventListener('click', toggleSidebar);
  
  // Content actions
  elements.copyBtn.addEventListener('click', copyContent);
  elements.printBtn.addEventListener('click', () => window.print());
  
  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (!elements.searchContainer.contains(e.target) && !elements.searchToggle.contains(e.target)) {
      closeSearch();
    }
  });
  
  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const decodedPath = decodeURIComponent(hash);
      if (decodedPath !== state.currentPath) {
        loadContent(decodedPath);
      }
    } else {
      showWelcomeScreen();
    }
  });
  
  // Handle mobile sidebar overlay
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !elements.sidebar.contains(e.target) && 
        !elements.sidebarToggle.contains(e.target) &&
        elements.sidebar.classList.contains('mobile-open')) {
      toggleSidebar();
    }
  });
}

// Search Functionality
function toggleSearch() {
  const isActive = elements.searchContainer.classList.toggle('active');
  if (isActive) {
    elements.searchInput.focus();
  } else {
    elements.searchInput.value = '';
    elements.searchResults.classList.remove('visible');
  }
}

function closeSearch() {
  elements.searchContainer.classList.remove('active');
  elements.searchInput.value = '';
  elements.searchResults.classList.remove('visible');
}

async function handleSearch() {
  const query = elements.searchInput.value.trim();
  
  if (!query) {
    elements.searchResults.classList.remove('visible');
    return;
  }
  
  if (query.length < 2) return;
  
  try {
    showLoading(true);
    let results;
    
    if (state.isStatic) {
      // Static mode - simple client-side search
      results = performClientSearch(query);
      displaySearchResults(results, query);
    } else {
      // Server mode - use API search
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      results = await response.json();
      displaySearchResults(results, query);
    }
  } catch (error) {
    console.error('Search error:', error);
    showToast('Search failed. Please try again.', 'error');
  } finally {
    showLoading(false);
  }
}

function performClientSearch(query) {
  const results = [];
  const searchTerm = query.toLowerCase();
  
  if (!state.navigation) return results;
  
  // Search through all navigation items
  Object.entries(state.navigation).forEach(([sectionName, section]) => {
    if (Array.isArray(section)) {
      section.forEach(file => {
        if (file.title.toLowerCase().includes(searchTerm) || 
            file.path.toLowerCase().includes(searchTerm)) {
          results.push({
            file: file,
            matches: [{ content: file.title, line: 1 }]
          });
        }
      });
    } else {
      Object.entries(section).forEach(([categoryName, files]) => {
        if (Array.isArray(files)) {
          files.forEach(file => {
            if (file.title.toLowerCase().includes(searchTerm) || 
                file.path.toLowerCase().includes(searchTerm)) {
              results.push({
                file: file,
                matches: [{ content: file.title, line: 1 }]
              });
            }
          });
        }
      });
    }
  });
  
  return results.slice(0, 10); // Limit results
}

function displaySearchResults(results, query) {
  if (!results || results.length === 0) {
    elements.searchResults.innerHTML = '<div class="search-result"><div class="search-result-title">No results found</div></div>';
    elements.searchResults.classList.add('visible');
    return;
  }
  
  const html = results.map(result => {
    const file = result.file;
    const matches = result.matches;
    
    let snippets = '';
    if (matches && matches.length > 0) {
      snippets = matches.map(match => {
        const highlighted = highlightText(match.content, query);
        return `<div class="search-result-snippet">${highlighted}</div>`;
      }).join('');
    }
    
    return `
      <div class="search-result" onclick="selectSearchResult('${escapeQuotes(file.path)}')">
        <div class="search-result-title">${file.title}</div>
        <div class="search-result-path">${file.path}</div>
        ${snippets}
      </div>
    `;
  }).join('');
  
  elements.searchResults.innerHTML = html;
  elements.searchResults.classList.add('visible');
}

function highlightText(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeQuotes(string) {
  return string.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function selectSearchResult(path) {
  closeSearch();
  loadContent(path);
}

function handleSearchKeydown(e) {
  if (e.key === 'Escape') {
    closeSearch();
  } else if (e.key === 'Enter') {
    const firstResult = elements.searchResults.querySelector('.search-result');
    if (firstResult) {
      firstResult.click();
    }
  }
}

// Detect environment and load navigation
async function loadNavigation() {
  try {
    // Try API first (server mode)
    let response = await fetch('/api/navigation');
    if (response.ok) {
      state.isStatic = false;
      state.navigation = await response.json();
      renderNavigation();
      return;
    }
  } catch (error) {
    console.log('API not available, trying static mode...');
  }
  
  try {
    // Fallback to static mode
    const response = await fetch('./navigation.json');
    if (response.ok) {
      state.isStatic = true;
      state.navigation = await response.json();
      renderNavigation();
      return;
    }
  } catch (error) {
    console.error('Failed to load navigation in static mode:', error);
  }
  
  elements.navigation.innerHTML = '<div class="loading">Failed to load navigation</div>';
}

function renderNavigation() {
  if (!state.navigation) return;
  
  let html = '';
  
  Object.entries(state.navigation).forEach(([sectionName, section]) => {
    html += `<div class="nav-section">`;
    html += `<div class="nav-section-title">${sectionName}</div>`;
    
    if (Array.isArray(section)) {
      // Direct files
      section.forEach(file => {
        html += `<a href="#${encodeURIComponent(file.path)}" class="nav-item" onclick="event.preventDefault(); loadContent('${escapeQuotes(file.path)}')">${file.title}</a>`;
      });
    } else {
      // Categories
      Object.entries(section).forEach(([categoryName, files]) => {
        if (Array.isArray(files) && files.length > 0) {
          html += `<div class="nav-category">`;
          html += `<div class="nav-category-title" onclick="toggleCategory(this)">
                     ${categoryName}
                     <i class="fas fa-chevron-down"></i>
                   </div>`;
          html += `<div class="nav-items">`;
          
          files.forEach(file => {
            html += `<a href="#${encodeURIComponent(file.path)}" class="nav-item" onclick="event.preventDefault(); loadContent('${escapeQuotes(file.path)}')">${file.title}</a>`;
          });
          
          html += `</div></div>`;
        }
      });
    }
    
    html += `</div>`;
  });
  
  elements.navigation.innerHTML = html;
}

function toggleCategory(element) {
  const category = element.parentElement;
  category.classList.toggle('collapsed');
}

function toggleSidebar() {
  elements.sidebar.classList.toggle('mobile-open');
}

// Content Loading
async function loadContent(path) {
  if (!path || state.isLoading || path === state.currentPath) return;
  
  try {
    state.isLoading = true;
    showLoading(true);
    
    let response;
    let data;
    
    if (state.isStatic) {
      // Static mode - load from JSON files
      response = await fetch(`./content/${path}.json`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      data = await response.json();
    } else {
      // Server mode - use API
      response = await fetch(`/api/content?path=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      data = await response.json();
    }
    
    state.currentPath = path;
    window.location.hash = encodeURIComponent(path);
    
    renderContent(data);
    updateActiveNavItem(path);
    updateBreadcrumb(data.title, path);
    
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 768) {
      elements.sidebar.classList.remove('mobile-open');
    }
    
  } catch (error) {
    console.error('Failed to load content:', error);
    showToast('Failed to load content. Please try again.', 'error');
  } finally {
    state.isLoading = false;
    showLoading(false);
  }
}

function renderContent(data) {
  elements.contentBody.innerHTML = data.content;
  
  // Show content area and hide welcome screen
  document.querySelector('.welcome-screen').style.display = 'none';
  elements.contentArea.style.display = 'block';
  
  // Scroll to top
  elements.content.scrollTop = 0;
  
  // Add copy buttons to code blocks
  addCopyButtonsToCodeBlocks();
}

function updateActiveNavItem(path) {
  // Remove previous active class
  document.querySelectorAll('.nav-item.active').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to current item
  const activeItem = document.querySelector(`a[href="#${encodeURIComponent(path)}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
    
    // Expand parent category if collapsed
    const category = activeItem.closest('.nav-category');
    if (category) {
      category.classList.remove('collapsed');
    }
  }
}

function updateBreadcrumb(title, path) {
  const pathParts = path.split('/');
  const breadcrumbParts = pathParts.map((part, index) => {
    if (index === pathParts.length - 1) {
      return `<span>${title}</span>`;
    } else {
      return `<a href="#" onclick="loadCategoryOverview('${pathParts.slice(0, index + 1).join('/')}')">${part.replace(/-/g, ' ')}</a>`;
    }
  });
  
  elements.breadcrumb.innerHTML = breadcrumbParts.join(' / ');
}

function showWelcomeScreen() {
  document.querySelector('.welcome-screen').style.display = 'block';
  elements.contentArea.style.display = 'none';
  
  // Clear active nav items
  document.querySelectorAll('.nav-item.active').forEach(item => {
    item.classList.remove('active');
  });
  
  elements.breadcrumb.innerHTML = '';
  window.location.hash = '';
  state.currentPath = null;
}

// Feature Cards Functionality
function bindFeatureCards() {
  const featureCards = document.querySelectorAll('.feature-card.clickable');
  
  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      const title = card.dataset.title;
      
      // Find the first file in this category
      const categoryPath = findCategoryPath(category);
      if (categoryPath) {
        loadContent(categoryPath);
      } else {
        // If no specific file found, expand the category in navigation
        expandNavigationCategory(title);
        showToast(`Browse ${title} in the navigation panel`, 'info');
      }
    });
    
    // Add hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}

function findCategoryPath(category) {
  if (!state.navigation) return null;
  
  // First try to find a README file for the category
  const readmePath = `${category}/README.md`;
  
  // Check if this file exists in navigation
  for (const [sectionName, section] of Object.entries(state.navigation)) {
    if (Array.isArray(section)) {
      const file = section.find(f => f.path === readmePath);
      if (file) return file.path;
    } else {
      for (const [categoryName, files] of Object.entries(section)) {
        if (Array.isArray(files)) {
          const file = files.find(f => f.path === readmePath);
          if (file) return file.path;
        }
      }
    }
  }
  
  // If no README found, return the first file in the category
  for (const [sectionName, section] of Object.entries(state.navigation)) {
    if (Array.isArray(section)) {
      const file = section.find(f => f.path.startsWith(category + '/'));
      if (file) return file.path;
    } else {
      for (const [categoryName, files] of Object.entries(section)) {
        if (Array.isArray(files)) {
          const file = files.find(f => f.path.startsWith(category + '/'));
          if (file) return file.path;
        }
      }
    }
  }
  
  return null;
}

function expandNavigationCategory(title) {
  // Find and expand the navigation category
  const categoryElements = document.querySelectorAll('.nav-category-title');
  categoryElements.forEach(element => {
    if (element.textContent.trim().includes(title)) {
      const category = element.parentElement;
      category.classList.remove('collapsed');
    }
  });
}

// Utility Functions
function addCopyButtonsToCodeBlocks() {
  const codeBlocks = elements.contentBody.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    const pre = block.parentElement;
    if (pre.querySelector('.copy-code-btn')) return; // Already has button
    
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.innerHTML = '<i class="fas fa-copy"></i>';
    button.title = 'Copy code';
    
    button.addEventListener('click', () => {
      copyToClipboard(block.textContent);
      showToast('Code copied to clipboard!', 'success');
    });
    
    pre.style.position = 'relative';
    pre.appendChild(button);
  });
}

async function copyContent() {
  if (!state.currentPath) return;
  
  try {
    let markdownContent;
    
    if (state.isStatic) {
      // Static mode - get from JSON
      const response = await fetch(`./content/${state.currentPath}.json`);
      const data = await response.json();
      markdownContent = data.raw || data.content;
    } else {
      // Server mode - use API
      const response = await fetch(`/api/raw?path=${encodeURIComponent(state.currentPath)}`);
      markdownContent = await response.text();
    }
    
    await copyToClipboard(markdownContent);
    showToast('Content copied to clipboard!', 'success');
  } catch (error) {
    console.error('Copy failed:', error);
    showToast('Failed to copy content', 'error');
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

function showLoading(visible) {
  elements.loadingOverlay.classList.toggle('visible', visible);
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  }[type] || 'fa-info-circle';
  
  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add CSS for copy button
const style = document.createElement('style');
style.textContent = `
  .copy-code-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 6px 8px;
    font-size: 12px;
    color: var(--text-secondary);
    cursor: pointer;
    opacity: 0;
    transition: var(--transition);
  }
  
  pre:hover .copy-code-btn {
    opacity: 1;
  }
  
  .copy-code-btn:hover {
    background: var(--accent-primary);
    color: white;
  }
  
  @keyframes slideOut {
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);