// Sections module - handles dynamic section buttons
import { $, $$, createElement, debounce } from '../utils/dom.js';
import { isElementAtTop } from '../utils/scroll.js';
import { mediaSections, config } from '../config.js';
import { scrollToSection } from './navigation.js';
import { isModalVisible } from './modal.js';

const activeSectionButtons = new Map();

/**
 * Initialize section buttons
 */
export function initSectionButtons() {
    // Set up scroll and resize listeners
    window.addEventListener('scroll', debounce(updateSectionButtons, config.debounceDelay));
    window.addEventListener('resize', debounce(updateSectionButtons, config.debounceDelay));
    
    // Initial update
    setTimeout(updateSectionButtons, 200);
}

/**
 * Update section buttons based on scroll position
 */
function updateSectionButtons() {
    const gallery = $('.gallery');
    const infoModal = $('#info-modal');
    
    // Hide all buttons if info modal is open
    if (isModalVisible() || (infoModal && infoModal.style.display === 'block')) {
        hideAllSectionButtons();
        return;
    }
    
    // Check each section
    Object.keys(mediaSections).forEach(section => {
        if (section === 'HOME') return; // Never show HOME button
        
        const shouldShow = isSectionInView(section);
        
        if (shouldShow) {
            addSectionButton(section);
        } else {
            removeSectionButton(section);
        }
    });
}

/**
 * Check if section is in view
 */
function isSectionInView(section) {
    const gallery = $('.gallery');
    const mediaFiles = mediaSections[section];
    
    if (!mediaFiles || mediaFiles.length === 0) return false;
    
    // Get first and last media elements of section
    const firstElement = gallery.querySelector(`[data-section="${section}"][data-index="0"]`);
    const lastElement = gallery.querySelector(`[data-section="${section}"][data-index="${mediaFiles.length - 1}"]`);
    
    if (!firstElement || !lastElement) return false;
    
    const firstRect = firstElement.getBoundingClientRect();
    const lastRect = lastElement.getBoundingClientRect();
    
    // Check if next section has started
    let nextSectionStarted = false;
    const sectionNames = Object.keys(mediaSections);
    const currentIndex = sectionNames.indexOf(section);
    
    if (currentIndex < sectionNames.length - 1) {
        const nextSection = sectionNames[currentIndex + 1];
        const nextFirst = gallery.querySelector(`[data-section="${nextSection}"][data-index="0"]`);
        
        if (nextFirst) {
            const nextRect = nextFirst.getBoundingClientRect();
            nextSectionStarted = nextRect.top <= 1;
        }
    }
    
    // Show button if first element is at top and either:
    // - Next section hasn't started, OR
    // - Last element is still visible
    const lastVisible = lastRect.bottom > 0 && lastRect.top < window.innerHeight;
    
    return firstRect.top <= 1 && (!nextSectionStarted || lastVisible);
}

/**
 * Add section button
 */
function addSectionButton(section) {
    const btnId = `sectionBtn-${section.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    if (activeSectionButtons.has(btnId)) return;
    
    const btn = createElement('button', {
        className: 'top-btn main-btn',
        id: btnId,
        textContent: section,
        style: {
            zIndex: '10001'
        }
    });
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollToSection(section);
    });
    
    positionSectionButton(btn);
    document.body.appendChild(btn);
    activeSectionButtons.set(btnId, btn);
    
    // Add resize listener for this button
    window.addEventListener('resize', () => positionSectionButton(btn));
}

/**
 * Position section button relative to work button
 */
function positionSectionButton(btn) {
    const workBtn = $('#work-btn');
    if (!workBtn) return;
    
    const workRect = workBtn.getBoundingClientRect();
    const isMobile = window.innerWidth <= config.mobileBreakpoint;
    
    if (isMobile) {
        Object.assign(btn.style, {
            position: 'fixed',
            left: (workRect.left + workRect.width / 2) + 'px',
            top: (workRect.bottom + 2) + 'px',
            transform: 'translateX(-50%)',
            marginLeft: '2px',
            marginRight: '2px'
        });
    } else {
        Object.assign(btn.style, {
            position: 'fixed',
            left: workRect.right + 'px',
            top: workRect.top + 'px',
            transform: '',
            marginLeft: '0',
            marginRight: '0'
        });
    }
}

/**
 * Remove section button
 */
function removeSectionButton(section) {
    const btnId = `sectionBtn-${section.replace(/[^a-zA-Z0-9]/g, '')}`;
    const btn = activeSectionButtons.get(btnId);
    
    if (btn) {
        btn.remove();
        activeSectionButtons.delete(btnId);
    }
}

/**
 * Hide all section buttons
 */
function hideAllSectionButtons() {
    activeSectionButtons.forEach(btn => {
        btn.style.display = 'none';
    });
}

/**
 * Show all section buttons
 */
export function showAllSectionButtons() {
    activeSectionButtons.forEach(btn => {
        btn.style.display = '';
    });
}