// Modal module - handles info modal functionality
import { $, $$ } from '../utils/dom.js';
import { smoothScrollTo, smoothScrollToWithCallback } from '../utils/scroll.js';

let infoModal;
let isModalOpen = false;

/**
 * Initialize modal
 */
export function initModal() {
    infoModal = $('#info-modal');
    if (!infoModal) return;
    
    // Set up info button click handlers
    $$('.top-btn').forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === 'info') {
            btn.addEventListener('click', showInfoModal);
        }
    });
    
    // Set up modal close handlers
    setupModalCloseHandlers();
    
    // Set up contact button in modal
    setupModalContactButton();
    
    // Monitor modal state changes
    observeModalState();
}

/**
 * Show info modal
 */
export function showInfoModal() {
    if (!infoModal) return;
    
    infoModal.style.display = 'block';
    isModalOpen = true;
    hideSectionButtons();
}

/**
 * Hide info modal
 */
export function hideInfoModal() {
    if (!infoModal) return;
    
    infoModal.style.display = 'none';
    isModalOpen = false;
    showSectionButtons();
}

/**
 * Hide info modal and scroll to top gracefully
 */
export function hideInfoModalAndScrollToTop() {
    if (!infoModal) return;
    
    infoModal.style.display = 'none';
    isModalOpen = false;
    
    // Don't show section buttons immediately - wait for scroll to complete
    smoothScrollToWithCallback(0).then(() => {
        // Only show section buttons after scroll animation completes
        showSectionButtons();
    });
}

/**
 * Setup modal close handlers
 */
function setupModalCloseHandlers() {
    // Close on clicking warans button in modal - with graceful scroll to top
    $$('#info-modal .top-btn').forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === 'warans') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                hideInfoModalAndScrollToTop();
            });
        }
        // Close on clicking info button in modal
        if (btn.textContent.trim().toLowerCase() === 'info') {
            btn.addEventListener('click', hideInfoModal);
        }
    });
    
    // Close on clicking outside modal content (optional)
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            hideInfoModal();
        }
    });
}

/**
 * Setup contact button in modal
 */
function setupModalContactButton() {
    $$('#info-modal .top-btn').forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === 'contact') {
            btn.addEventListener('click', () => {
                const contactSection = $('#contact-section-info');
                if (contactSection) {
                    smoothScrollTo(contactSection);
                }
            });
        }
    });
}

/**
 * Hide section buttons when modal is open
 */
function hideSectionButtons() {
    $$('[id^="sectionBtn-"]').forEach(btn => {
        btn.style.display = 'none';
    });
}

/**
 * Show section buttons when modal is closed
 */
function showSectionButtons() {
    // Check if work menu is also open
    const workMenu = $('#work-menu');
    const workMenuOpen = workMenu && workMenu.style.display === 'flex';
    
    if (!workMenuOpen) {
        $$('[id^="sectionBtn-"]').forEach(btn => {
            btn.style.display = '';
        });
    }
}

/**
 * Observe modal state changes
 */
function observeModalState() {
    if (!infoModal) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (infoModal.style.display === 'block') {
                    hideSectionButtons();
                } else if (infoModal.style.display === 'none') {
                    showSectionButtons();
                }
            }
        });
    });
    
    observer.observe(infoModal, {
        attributes: true,
        attributeFilter: ['style']
    });
}

/**
 * Check if modal is open
 */
export function isModalVisible() {
    return isModalOpen;
}