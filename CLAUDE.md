# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PPS Studio website is a modern portfolio website built with vanilla HTML5, CSS3, and ES6+ JavaScript. The project uses a modular architecture with ES6 modules and no build process - all code runs directly in the browser.

## Development Commands

### Serving the Application
Since this uses ES6 modules, you need to serve files over HTTP (not file://).
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (if http-server is installed)
npx http-server

# Using PHP
php -S localhost:8000
```

### No Build Process
- Direct browser refresh for testing changes
- No compilation, bundling, or preprocessing required
- All JavaScript modules are loaded natively by the browser

## Architecture Overview

### Core Structure
```
├── index.html              # Main entry point
├── assets/
│   ├── css/
│   │   ├── main.css        # Central stylesheet with imports
│   │   ├── responsive.css  # Mobile/tablet adaptations
│   │   └── components/     # Component-specific styles
│   └── js/
│       ├── main.js         # Application bootstrap
│       ├── config.js       # Media sections & app configuration
│       ├── modules/        # Feature modules (gallery, navigation, modal)
│       └── utils/          # Reusable utilities (DOM, scroll)
└── Medias/                 # Project media organized by folders
    ├── 00-HOME/
    ├── 01-Present><Futur/
    ├── 02-Frac Auvergne/
    └── ...
```

### JavaScript Module System
- **Entry Point**: `assets/js/main.js` orchestrates module initialization
- **Configuration**: `assets/js/config.js` contains media mappings and app settings
- **Modules**: Feature-specific modules in `assets/js/modules/`
- **Utilities**: Shared utilities in `assets/js/utils/`

### Media Configuration
Media sections are defined in `assets/js/config.js:2-72` with project names mapping to media file arrays. When adding new projects:
1. Add media files to `Medias/XX-ProjectName/` folder
2. Update `mediaSections` object in `config.js`
3. Ensure navigation menu in `index.html:25-30` includes the project

### CSS Architecture
- **Component-based**: Separate stylesheets for each UI component
- **Import System**: All components imported into `main.css`
- **Responsive**: Mobile-first approach with `responsive.css`
- **Typography**: Uses Adobe TypeKit "Indivisible" font family

## Key Implementation Details

### Gallery System
The gallery module (`assets/js/modules/gallery.js`) handles:
- Lazy loading with Intersection Observer
- Video autoplay management
- White zone creation between project sections
- Dynamic media rendering from configuration

### Performance Optimizations
- Intersection Observer API for lazy loading
- Debounced scroll/resize events
- Video optimization (autoplay, muted, loop)
- Lazy image loading

### Navigation System
- Responsive work menu with dynamic positioning
- Smooth scrolling to project sections
- Mobile-optimized full-width menu

## File Modification Guidelines

### Adding New Projects
1. Create media folder: `Medias/XX-ProjectName/`
2. Update `assets/js/config.js` mediaSections object
3. Add menu item to `index.html` work menu
4. Test responsive behavior

### Modifying Styles
- Edit component-specific CSS files in `assets/css/components/`
- Maintain consistent naming conventions
- Test across mobile/desktop breakpoints
- Consider lazy loading impact on styling

### JavaScript Changes
- Follow ES6 module patterns
- Use utilities from `assets/js/utils/`
- Maintain error handling consistency
- Test media loading and performance

## Browser Compatibility
- Requires ES6 module support
- Intersection Observer API support
- Modern CSS Grid and Flexbox support
- HTML5 video/audio support