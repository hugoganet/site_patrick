// Main application entry point
import { initNavigation } from './modules/navigation.js';
import { initGallery } from './modules/gallery.js';
import { initModal } from './modules/modal.js';
import { initSectionButtons } from './modules/sections.js';

/**
 * Initialize application
 */
function initApp() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

/**
 * Initialize all modules
 */
function init() {
    try {
        // Initialize core modules
        initNavigation();
        initGallery();
        initModal();
        initSectionButtons();
        
        console.log('PPS Website initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Start the application
initApp();

// Export for debugging
window.PPSApp = {
    reinit: init,
    version: '1.0.0'
};