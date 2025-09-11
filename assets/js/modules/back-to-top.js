// Back to Top module - handles back to top button visibility and functionality
import { $, debounce } from '../utils/dom.js';
import { smoothScrollToWithCallback } from '../utils/scroll.js';
import { config } from '../config.js';

let backToTopBtn;
let isVisible = false;

/**
 * Initialize back to top functionality
 */
export function initBackToTop() {
    backToTopBtn = $('#back-to-top');
    
    if (!backToTopBtn) {
        console.warn('Back to top button not found');
        return;
    }
    
    // Set up event listeners
    backToTopBtn.addEventListener('click', handleBackToTopClick);
    window.addEventListener('scroll', debounce(handleScroll, config.debounceDelay));
    
    // Initial state check
    handleScroll();
}

/**
 * Handle back to top button click
 */
function handleBackToTopClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Use the same smooth scroll function as the warans button
    smoothScrollToWithCallback(0, () => {
        // Hide button after scrolling to top
        setTimeout(() => {
            handleScroll();
        }, 100);
    });
}

/**
 * Handle scroll event to show/hide button
 */
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Show button when user is near bottom (within 200px of bottom)
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
    const shouldBeVisible = distanceFromBottom <= 200;
    
    if (shouldBeVisible && !isVisible) {
        showButton();
    } else if (!shouldBeVisible && isVisible) {
        hideButton();
    }
}

/**
 * Show the back to top button
 */
function showButton() {
    if (!backToTopBtn) return;
    
    backToTopBtn.classList.add('visible');
    isVisible = true;
}

/**
 * Hide the back to top button
 */
function hideButton() {
    if (!backToTopBtn) return;
    
    backToTopBtn.classList.remove('visible');
    isVisible = false;
}