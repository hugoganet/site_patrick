# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Warans Studio website is a modern portfolio website built with vanilla HTML5, CSS3, and ES6+ JavaScript. The project uses a modular architecture with ES6 modules and no build process - all code runs directly in the browser. The site now uses **Gumlet CDN** for optimized media delivery and has transitioned to a **JSON-driven gallery system**.

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
│   │   ├── tokens.css      # CSS custom properties (design tokens)
│   │   ├── responsive.css  # Mobile/tablet adaptations
│   │   └── components/     # Component-specific styles
│   ├── data/              # JSON-based project configuration (NEW)
│   │   ├── projects.json   # Project manifest and ordering
│   │   └── *.json         # Individual project data files
│   └── js/
│       ├── main.js         # Application bootstrap
│       ├── config.js       # Media sections & app configuration
│       ├── modules/        # Feature modules (gallery, navigation, modal)
│       └── utils/          # Reusable utilities (DOM, scroll)
└── Medias/                 # Local project media (legacy structure)
```

### Design Token System (NEW)
The project now uses CSS custom properties for consistent theming:
- **tokens.css**: Centralized design tokens for colors, typography, spacing, and motion
- **Semantic tokens**: Color system with `--color-bg`, `--color-text`, etc.
- **Layout tokens**: Consistent margins with `--desktop-margin`, `--mobile-margin`
- **Component tokens**: Standardized button, white-zone, and z-index values

### Media System Architecture

#### JSON-Driven Configuration (NEW)
Projects are now configured through JSON files in `assets/data/`:
- **projects.json**: Master list of projects with display order
- **[slug].json**: Individual project data including:
  - Title, year, description
  - Credits (role and names)
  - Media array with Gumlet CDN references
  - Display preferences (showInfo flag)

#### Gumlet CDN Integration
All media now served through Gumlet CDN (warans.gumlet.io):
- **Images**: WebP format with automatic optimization
- **Videos**: Embedded via Gumlet player with adaptive streaming
- **Schema**: `{ "type": "image|video", "url|id": "...", "ratio": "16/9" }`

### JavaScript Module System
- **Entry Point**: `assets/js/main.js` orchestrates module initialization
- **Configuration**: `assets/js/config.js` contains legacy media mappings (being migrated to JSON)
- **Modules**: Feature-specific modules in `assets/js/modules/`
- **Utilities**: Shared utilities in `assets/js/utils/`

### CSS Architecture
- **Component-based**: Separate stylesheets for each UI component
- **Import System**: All components imported into `main.css`
- **Token-driven**: Design decisions centralized in `tokens.css`
- **Responsive**: Mobile-first approach with `responsive.css`
- **Typography**: Uses Adobe TypeKit "Indivisible" font family

## Key Implementation Details

### Gallery System
The gallery module (`assets/js/modules/gallery.js`) handles:
- Dynamic loading from JSON data files
- Gumlet video embed integration
- Lazy loading with Intersection Observer
- White zone creation between project sections
- Responsive video aspect ratios

### Performance Optimizations
- Gumlet CDN for optimized media delivery
- Intersection Observer API for lazy loading
- Throttled scroll events (real-time updates)
- WebP images with automatic format selection
- Adaptive video streaming

### Navigation System
- Responsive work menu with dynamic positioning
- Smooth scrolling to project sections
- Mobile-optimized full-width menu
- Auto-hiding section buttons when menu is open

## File Modification Guidelines

### Adding New Projects
1. Create JSON file: `assets/data/[project-slug].json`
2. Add project entry to `assets/data/projects.json`
3. Upload media to Gumlet CDN
4. Update navigation menu in `index.html` if needed

### JSON Project Schema
```json
{
  "title": "Project Name",
  "slug": "url-friendly-slug",
  "year": "2024",
  "description": "Short tagline",
  "credits": [
    { "role": "Role", "names": ["Name"] }
  ],
  "medias": [
    { "type": "image", "url": "https://warans.gumlet.io/..." },
    { "type": "video", "id": "gumlet_embed_id", "ratio": "16/9" }
  ],
  "showInfo": true
}
```

### Modifying Styles
- Use design tokens from `tokens.css` for consistency
- Edit component-specific CSS files in `assets/css/components/`
- Test across mobile/desktop breakpoints (especially white zones)
- Maintain CSS variable usage for theming

### JavaScript Changes
- Follow ES6 module patterns
- Use utilities from `assets/js/utils/`
- Check JSON data structure when modifying gallery
- Test Gumlet embed integration

## Recent Updates (Updated: 2025-09-29)

### Major Changes
- **Rebrand**: Complete rebrand from PPS Studio to Warans Studio
- **Design Tokens**: Introduced CSS custom properties system for consistent theming
- **Media Migration**: Transitioned from local files to Gumlet CDN
- **JSON Configuration**: Projects now configured via JSON files instead of hardcoded JS
- **Performance**: Implemented scroll throttling for real-time updates

### Removed Features
- Deleted legacy `Medias_old/` directory with unoptimized media
- Removed `KIRBY_MIGRATION_PLAN.md` and `codebase_analysis.md`
- Removed `compress-videos.sh` script (now handled by Gumlet)

### Recent Bug Fixes (Latest)
- **Back-to-Top Button**: Fixed visibility logic preventing button from showing
  - Removed `height: 100%` CSS constraint that limited document height calculation
  - Added scroll threshold (100px) to prevent premature visibility at page top
  - Button now correctly appears only when user scrolls down AND approaches bottom
- Fixed white zone responsive layout issues
- Corrected mobile/desktop margin calculations
- Fixed section button visibility with open work menu
- Improved navigation button spacing and positioning

### Current Development Status
- ✅ Core gallery system migrated to JSON/Gumlet architecture
- ✅ Responsive design optimized for mobile/desktop
- ✅ Back-to-top navigation functionality restored
- 🔄 Additional UI/UX enhancements in progress

## Browser Compatibility
- Requires ES6 module support
- Intersection Observer API support
- Modern CSS Grid and Flexbox support
- CSS Custom Properties support
- HTML5 video/audio support