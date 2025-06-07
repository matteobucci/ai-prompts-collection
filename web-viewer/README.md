# Prompts Web Viewer

A beautiful, responsive web interface for browsing your AI coding prompts collection with search functionality, dark mode, and mobile support.

## Features

- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🌙 **Dark/Light Theme**: Toggle between themes with preference persistence
- 🔍 **Full-Text Search**: Search across all prompts and guides instantly
- 📖 **Syntax Highlighting**: Beautiful code highlighting with copy buttons
- 🧭 **Smart Navigation**: Organized categories with collapsible sections
- ⚡ **Fast Performance**: Cached content and optimized loading
- 📋 **Copy Support**: Easy copying of code blocks and entire documents
- 🔗 **Direct Links**: Shareable URLs for specific guides

## Quick Start

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn

### Installation

1. Navigate to the web-viewer directory:
```bash
cd web-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3001
```

### Production Mode

For production deployment:

```bash
npm start
```

## Usage

### Navigation
- Browse categories in the left sidebar
- Click on any guide to view its content
- Use the search bar to find specific topics
- Toggle dark/light theme with the theme button

### Search
- Press the search icon or use Ctrl+K to open search
- Type any keyword to search across all content
- Results show matches with highlighted text
- Click any result to navigate to that guide

### Mobile
- Tap the hamburger menu to open navigation
- All functionality is preserved on mobile devices
- Touch-friendly interface with proper spacing

## Project Structure

```
web-viewer/
├── src/
│   └── server.js          # Express server with API endpoints
├── public/
│   ├── index.html         # Main HTML template
│   ├── css/
│   │   └── style.css      # Comprehensive styles
│   └── js/
│       └── app.js         # Frontend JavaScript application
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## API Endpoints

### GET /api/navigation
Returns the complete navigation tree structure.

### GET /api/content?path={filePath}
Returns rendered HTML content for a specific markdown file.

**Parameters:**
- `path`: Relative path to the markdown file

**Response:**
```json
{
  "content": "<rendered-html>",
  "title": "Document Title",
  "path": "relative/path/to/file.md"
}
```

### GET /api/search?q={query}
Searches across all markdown files for the given query.

**Parameters:**
- `q`: Search query string

**Response:**
```json
[
  {
    "file": {
      "path": "relative/path/to/file.md",
      "title": "Document Title"
    },
    "matches": [
      {
        "line": 42,
        "content": "Matching line content",
        "context": "Surrounding context"
      }
    ]
  }
]
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### Customization

#### Themes
Modify CSS custom properties in `/public/css/style.css`:

```css
:root {
  --accent-primary: #your-color;
  --bg-primary: #your-background;
  /* ... other variables */
}
```

#### Navigation Structure
The navigation is automatically generated from your markdown files. The structure follows:

```
├── Prompt Categories/
│   ├── Coding Fundamentals/
│   ├── Debugging & Troubleshooting/
│   └── ...
└── Setup Guides/
    ├── IDE Configuration/
    ├── Claude Code/
    └── ...
```

## Development

### File Watching
The server automatically watches for changes to markdown files and clears the cache, so you can see updates immediately during development.

### Adding Features

1. **New API Endpoints**: Add routes in `src/server.js`
2. **Frontend Features**: Extend `public/js/app.js`
3. **Styling**: Modify `public/css/style.css`

### Performance Optimization

- Content is cached in memory for faster access
- Syntax highlighting is applied client-side
- Search results are limited to prevent performance issues
- Mobile-optimized with touch interactions

## Deployment

### Local Network Access
To access from other devices on your network:

```bash
# Start server binding to all interfaces
PORT=3001 node src/server.js
```

Then access via your local IP: `http://192.168.x.x:3001`

### Production Deployment

1. **Docker**: Create a Dockerfile for containerization
2. **Reverse Proxy**: Use nginx for SSL and caching
3. **Process Manager**: Use PM2 for production process management

Example PM2 configuration:
```json
{
  "name": "prompts-viewer",
  "script": "src/server.js",
  "cwd": "/path/to/web-viewer",
  "env": {
    "NODE_ENV": "production",
    "PORT": 3001
  }
}
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change the port
PORT=3002 npm start
```

**Navigation not loading:**
- Check that markdown files exist in the parent directory
- Verify file permissions
- Check server logs for errors

**Search not working:**
- Ensure all markdown files are readable
- Check for very large files that might cause memory issues
- Verify the search query is at least 2 characters

**Styling issues:**
- Clear browser cache
- Check for CSS loading errors in developer tools
- Verify all CSS files are accessible

### Performance Tips

- Keep markdown files reasonably sized (< 1MB each)
- Use appropriate image sizes and formats
- Consider implementing pagination for very large collections
- Monitor memory usage with many concurrent users

## Contributing

1. Follow the existing code style
2. Test on multiple devices and browsers
3. Ensure responsive design principles
4. Add appropriate error handling
5. Update documentation for new features

## License

This project is part of the AI Coding Prompts Collection and follows the same license terms.