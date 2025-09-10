// Navigation module - handles top bar and work menu
import { $, $$, debounce } from '../utils/dom.js';
import { smoothScrollTo, smoothScrollToWithCallback } from '../utils/scroll.js';
import { config } from '../config.js';

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