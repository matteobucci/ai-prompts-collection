# Neovim Modern AI-Ready Setup

## Overview

Transform Neovim into a modern IDE with AI integration, LSP support, and optimal performance.

## 🚀 Installation

### Neovim Installation
```bash
# macOS (Homebrew)
brew install neovim

# Ubuntu/Debian
sudo apt update && sudo apt install neovim

# Windows (via winget)
winget install Neovim.Neovim

# Build from source (latest features)
git clone https://github.com/neovim/neovim.git
cd neovim && make CMAKE_BUILD_TYPE=RelWithDebInfo
sudo make install
```

### Prerequisites
```bash
# Node.js (for LSP servers)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python support
pip3 install pynvim

# Clipboard support
sudo apt install xclip  # Linux
# macOS has built-in clipboard support
```

## 🛠️ Modern Configuration Structure

### Directory Setup
```bash
# Create Neovim config directory
mkdir -p ~/.config/nvim/{lua,plugin}
cd ~/.config/nvim
```

### init.lua - Main Configuration
```lua
-- ~/.config/nvim/init.lua
-- Modern Neovim configuration with AI integration

-- Set leader key early
vim.g.mapleader = ' '
vim.g.maplocalleader = ' '

-- Basic settings
require('settings')
require('keymaps')
require('plugins')
require('lsp-config')
require('ai-integration')
```

### lua/settings.lua - Core Settings
```lua
-- ~/.config/nvim/lua/settings.lua
local opt = vim.opt

-- UI Configuration
opt.number = true
opt.relativenumber = true
opt.signcolumn = 'yes'
opt.wrap = false
opt.scrolloff = 8
opt.sidescrolloff = 8

-- Indentation
opt.tabstop = 4
opt.shiftwidth = 4
opt.expandtab = true
opt.autoindent = true
opt.smartindent = true

-- Search
opt.ignorecase = true
opt.smartcase = true
opt.hlsearch = true
opt.incsearch = true

-- Performance
opt.updatetime = 300
opt.timeoutlen = 500
opt.lazyredraw = true

-- File handling
opt.backup = false
opt.writebackup = false
opt.swapfile = false
opt.undofile = true
opt.undodir = vim.fn.expand('~/.nvim/undodir')

-- Completion
opt.completeopt = {'menu', 'menuone', 'noselect'}

-- Colors and appearance
opt.termguicolors = true
opt.background = 'dark'
```

## 📦 Plugin Management with Lazy.nvim

### lua/plugins.lua - Plugin Configuration
```lua
-- ~/.config/nvim/lua/plugins.lua
-- Install lazy.nvim if not present
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  -- Color scheme
  {
    "catppuccin/nvim",
    name = "catppuccin",
    priority = 1000,
    config = function()
      vim.cmd.colorscheme "catppuccin-mocha"
    end,
  },

  -- File explorer
  {
    "nvim-tree/nvim-tree.lua",
    dependencies = "nvim-tree/nvim-web-devicons",
    config = function()
      require("nvim-tree").setup()
    end,
  },

  -- Fuzzy finder
  {
    "nvim-telescope/telescope.nvim",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "nvim-telescope/telescope-fzf-native.nvim",
    },
    config = function()
      require("telescope").setup()
    end,
  },

  -- LSP Configuration
  {
    "neovim/nvim-lspconfig",
    dependencies = {
      "williamboman/mason.nvim",
      "williamboman/mason-lspconfig.nvim",
      "j-hui/fidget.nvim",
    },
  },

  -- Autocompletion
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",
      "hrsh7th/cmp-buffer",
      "hrsh7th/cmp-path",
      "L3MON4D3/LuaSnip",
      "saadparwaiz1/cmp_luasnip",
    },
  },

  -- Treesitter for syntax highlighting
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      require("nvim-treesitter.configs").setup({
        ensure_installed = {
          "lua", "python", "javascript", "typescript", 
          "rust", "go", "html", "css", "json", "yaml"
        },
        highlight = { enable = true },
        indent = { enable = true },
      })
    end,
  },

  -- AI Integration
  {
    "github/copilot.vim",
    config = function()
      vim.g.copilot_no_tab_map = true
      vim.keymap.set('i', '<C-J>', 'copilot#Accept("\\<CR>")', 
        { expr = true, replace_keycodes = false })
    end,
  },

  -- Git integration
  {
    "lewis6991/gitsigns.nvim",
    config = function()
      require("gitsigns").setup()
    end,
  },

  -- Status line
  {
    "nvim-lualine/lualine.nvim",
    dependencies = "nvim-tree/nvim-web-devicons",
    config = function()
      require("lualine").setup({
        theme = "catppuccin"
      })
    end,
  },

  -- Terminal integration
  {
    "akinsho/toggleterm.nvim",
    config = function()
      require("toggleterm").setup({
        direction = "horizontal",
        size = 15,
      })
    end,
  },
})
```

## 🔧 LSP Configuration

### lua/lsp-config.lua
```lua
-- ~/.config/nvim/lua/lsp-config.lua
-- Mason setup for LSP server management
require("mason").setup()
require("mason-lspconfig").setup({
  ensure_installed = {
    "lua_ls", "pyright", "tsserver", "rust_analyzer",
    "gopls", "html", "cssls", "jsonls"
  }
})

-- LSP server configurations
local lspconfig = require("lspconfig")
local capabilities = require("cmp_nvim_lsp").default_capabilities()

-- Lua
lspconfig.lua_ls.setup({
  capabilities = capabilities,
  settings = {
    Lua = {
      diagnostics = { globals = {"vim"} },
      workspace = {
        library = vim.api.nvim_get_runtime_file("", true),
        checkThirdParty = false,
      },
    },
  },
})

-- Python
lspconfig.pyright.setup({
  capabilities = capabilities,
})

-- TypeScript/JavaScript
lspconfig.tsserver.setup({
  capabilities = capabilities,
})

-- Rust
lspconfig.rust_analyzer.setup({
  capabilities = capabilities,
  settings = {
    ["rust-analyzer"] = {
      checkOnSave = {
        command = "clippy"
      },
    },
  },
})

-- Key mappings for LSP
vim.api.nvim_create_autocmd("LspAttach", {
  callback = function(event)
    local map = function(keys, func, desc)
      vim.keymap.set('n', keys, func, 
        { buffer = event.buf, desc = 'LSP: ' .. desc })
    end

    map('gd', vim.lsp.buf.definition, 'Go to Definition')
    map('gr', vim.lsp.buf.references, 'Go to References')
    map('K', vim.lsp.buf.hover, 'Hover Documentation')
    map('<leader>rn', vim.lsp.buf.rename, 'Rename')
    map('<leader>ca', vim.lsp.buf.code_action, 'Code Action')
  end,
})
```

## 🤖 AI Integration Setup

### lua/ai-integration.lua
```lua
-- ~/.config/nvim/lua/ai-integration.lua
-- Configure AI tools for enhanced coding

-- GitHub Copilot settings
vim.g.copilot_filetypes = {
  ["*"] = true,
  gitcommit = false,
  NeogitCommitMessage = false,
}

-- Custom commands for Claude Code integration
vim.api.nvim_create_user_command('ClaudeReview', function()
  local file = vim.fn.expand('%:p')
  vim.cmd('split | terminal claude review ' .. file)
end, {})

vim.api.nvim_create_user_command('ClaudeExplain', function()
  local file = vim.fn.expand('%:p')
  vim.cmd('split | terminal claude explain ' .. file)
end, {})

-- Key mappings for AI features
vim.keymap.set('n', '<leader>ai', '<cmd>ClaudeReview<cr>', 
  { desc = 'Claude Code Review' })
vim.keymap.set('n', '<leader>ae', '<cmd>ClaudeExplain<cr>', 
  { desc = 'Claude Explain Code' })
```

## ⌨️ Key Mappings

### lua/keymaps.lua
```lua
-- ~/.config/nvim/lua/keymaps.lua
local map = vim.keymap.set

-- General mappings
map('n', '<leader>w', '<cmd>w<cr>', { desc = 'Save file' })
map('n', '<leader>q', '<cmd>q<cr>', { desc = 'Quit' })
map('n', '<Esc>', '<cmd>nohlsearch<cr>', { desc = 'Clear highlights' })

-- File explorer
map('n', '<leader>e', '<cmd>NvimTreeToggle<cr>', { desc = 'Toggle file explorer' })

-- Telescope
map('n', '<leader>ff', '<cmd>Telescope find_files<cr>', { desc = 'Find files' })
map('n', '<leader>fg', '<cmd>Telescope live_grep<cr>', { desc = 'Live grep' })
map('n', '<leader>fb', '<cmd>Telescope buffers<cr>', { desc = 'Find buffers' })

-- Terminal
map('n', '<C-`>', '<cmd>ToggleTerm<cr>', { desc = 'Toggle terminal' })
map('t', '<C-`>', '<cmd>ToggleTerm<cr>', { desc = 'Toggle terminal' })

-- Window navigation
map('n', '<C-h>', '<C-w>h', { desc = 'Move to left window' })
map('n', '<C-j>', '<C-w>j', { desc = 'Move to bottom window' })
map('n', '<C-k>', '<C-w>k', { desc = 'Move to top window' })
map('n', '<C-l>', '<C-w>l', { desc = 'Move to right window' })

-- AI assistance
map('i', '<C-J>', 'copilot#Accept("\\<CR>")', 
  { expr = true, replace_keycodes = false, desc = 'Accept Copilot suggestion' })
```

## ✅ Validation & Testing

### Health Check
```bash
# Run Neovim health check
nvim +checkhealth
```

### Feature Testing
- [ ] LSP servers start and provide diagnostics
- [ ] Autocompletion works with nvim-cmp
- [ ] GitHub Copilot provides suggestions
- [ ] Telescope fuzzy finding works
- [ ] File tree navigation functions
- [ ] Terminal integration toggles properly
- [ ] Git signs display file changes
- [ ] Syntax highlighting via Treesitter works