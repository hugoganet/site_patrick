// Scroll utility functions

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(element, options = {}) {
    const defaultOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    };
    
    if (element instanceof Element) {
        element.scrollIntoView({ ...defaultOptions, ...options });
    } else if (typeof element === 'number') {
        window.scrollTo({
            top: element,
            behavior: options.behavior || 'smooth'
        });
    }
}

/**
 * Get current scroll position
 */
export function getScrollPosition() {
    return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
    };
}

/**
 * Check if element is in viewport
 */
export function isElementInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= -offset &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    );
}

/**
 * Check if element is at top of viewport
 */
export function isElementAtTop(element, threshold = 1) {
    const rect = element.getBoundingClientRect();
    return rect.top <= threshold;
}

/**
 * Get element's offset from document top
 */
export function getOffsetTop(element) {
    let offsetTop = 0;
    while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }
    return offsetTop;
}