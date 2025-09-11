// Navigation module - handles top bar and work menu
import { $, $$, debounce } from '../utils/dom.js';
import { smoothScrollTo, smoothScrollToWithCallback } from '../utils/scroll.js';
import { config, mediaSections } from '../config.js';

let workMenuOpen = false;
let menu, workBtn;

/**
 * Initialize navigation
 */
export function initNavigation() {
    menu = $('#work-menu');
    workBtn = $('#work-btn');
    
    if (!menu || !workBtn) return;
    
    // Set up event listeners
    workBtn.addEventListener('click', handleWorkButtonClick);
    window.addEventListener('resize', debounce(updateMenuPosition, config.debounceDelay));
    window.addEventListener('scroll', debounce(updateMenuPosition, config.debounceDelay));
    
    // Initialize warans button (scroll to top)
    initWaransButton();
    
    // Initialize work menu items
    initWorkMenuItems();
    
    // Set initial state
    closeWorkMenu();
    setWorkMenuStyle();
    updateWorkButtonText();
}

/**
 * Handle work button click
 */
function handleWorkButtonClick(e) {
    e.stopPropagation();
    toggleWorkMenu();
}

/**
 * Toggle work menu open/close
 */
export function toggleWorkMenu() {
    if (!workMenuOpen) {
        openWorkMenu();
    } else {
        closeWorkMenu();
    }
}

/**
 * Open work menu
 */
function openWorkMenu() {
    const isMobile = window.innerWidth <= config.mobileBreakpoint;
    
    setWorkMenuStyle();
    menu.style.display = 'flex';
    
    // Add menu-open class on mobile
    if (isMobile) {
        menu.classList.add('menu-open');
    }
    
    workBtn.classList.add('negatif');
    workMenuOpen = true;
    hideDynamicSectionButtons();
}

/**
 * Close work menu
 */
export function closeWorkMenu() {
    menu.style.display = 'none';
    menu.classList.remove('menu-open');
    workBtn.classList.remove('negatif');
    workMenuOpen = false;
    showDynamicSectionButtons();
}

/**
 * Set work menu position based on viewport
 */
function setWorkMenuStyle() {
    const isMobile = window.innerWidth <= config.mobileBreakpoint;
    
    if (isMobile) {
        Object.assign(menu.style, {
            position: 'fixed',
            top: '79px',
            left: '0',
            width: '100vw'
        });
    } else {
        const workRect = workBtn.getBoundingClientRect();
        Object.assign(menu.style, {
            position: 'fixed',
            top: workRect.top + 'px',
            left: workRect.right + 'px',
            width: 'auto'
        });
    }
}

/**
 * Update menu position on scroll/resize
 */
function updateMenuPosition() {
    if (workMenuOpen) {
        setWorkMenuStyle();
    }
    updateWorkButtonText();
}

/**
 * Get current section based on scroll position
 */
function getCurrentSection() {
    const gallery = $('.gallery');
    if (!gallery) return 'HOME';

    // Check each section to see which one is currently active
    const sections = Object.keys(mediaSections);
    
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const mediaFiles = mediaSections[section];
        
        if (!mediaFiles || mediaFiles.length === 0) continue;
        
        // Get first element of section
        const firstElement = gallery.querySelector(`[data-section="${section}"][data-index="0"]`);
        if (!firstElement) continue;
        
        const firstRect = firstElement.getBoundingClientRect();
        
        // If this section's first element is at or near the top
        if (firstRect.top <= 100) {
            // Check if next section has started
            let nextSectionStarted = false;
            if (i < sections.length - 1) {
                const nextSection = sections[i + 1];
                const nextFirst = gallery.querySelector(`[data-section="${nextSection}"][data-index="0"]`);
                if (nextFirst) {
                    const nextRect = nextFirst.getBoundingClientRect();
                    nextSectionStarted = nextRect.top <= 100;
                }
            }
            
            // If next section hasn't started, this is the current section
            if (!nextSectionStarted) {
                return section;
            }
        }
    }
    
    return 'HOME';
}

/**
 * Update work button text based on current section and viewport
 */
function updateWorkButtonText() {
    if (!workBtn) return;
    
    const isMobile = window.innerWidth <= config.mobileBreakpoint;
    
    if (isMobile) {
        const currentSection = getCurrentSection();
        workBtn.textContent = currentSection === 'HOME' ? 'work' : currentSection;
    } else {
        workBtn.textContent = 'work';
    }
}

/**
 * Initialize warans button for scroll to top
 */
function initWaransButton() {
    $$('.top-btn').forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === 'warans') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Use callback-based scroll for consistent behavior
                smoothScrollToWithCallback(0);
            });
        }
    });
}

/**
 * Initialize work menu items
 */
function initWorkMenuItems() {
    $$('#work-menu .top-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.textContent.trim();
            scrollToSection(section);
            closeWorkMenu();
        });
    });
}

/**
 * Scroll to specific section
 */
export function scrollToSection(section) {
    const element = $(`[data-section="${section}"][data-index="0"]`);
    if (element) {
        smoothScrollTo(element);
    }
}

/**
 * Hide dynamic section buttons
 */
function hideDynamicSectionButtons() {
    $$('[id^="sectionBtn-"]').forEach(btn => {
        btn.style.display = 'none';
    });
}

/**
 * Show dynamic section buttons
 */
function showDynamicSectionButtons() {
    const infoModal = $('#info-modal');
    if (infoModal && infoModal.style.display === 'block') return;
    
    $$('[id^="sectionBtn-"]').forEach(btn => {
        btn.style.display = '';
    });
}