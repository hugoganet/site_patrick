// Scroll utility functions

let activeScrollPromise = null;
let isCurrentlyScrolling = false;

/**
 * Smooth scroll to element with completion detection
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
 * Smooth scroll with completion Promise
 */
export function smoothScrollToWithCallback(element, options = {}) {
    if (activeScrollPromise) {
        return activeScrollPromise;
    }
    
    const targetPosition = typeof element === 'number' ? element : getOffsetTop(element);
    isCurrentlyScrolling = true;
    
    activeScrollPromise = new Promise((resolve) => {
        const startPosition = getScrollPosition().y;
        const distance = Math.abs(targetPosition - startPosition);
        
        // If already at target, resolve immediately
        if (distance < 5) {
            isCurrentlyScrolling = false;
            activeScrollPromise = null;
            resolve();
            return;
        }
        
        // Start the scroll
        smoothScrollTo(element, options);
        
        // Monitor scroll completion
        let rafId;
        let lastPosition = startPosition;
        let stableCount = 0;
        
        const checkComplete = () => {
            const currentPosition = getScrollPosition().y;
            const distanceToTarget = Math.abs(currentPosition - targetPosition);
            
            // Check if position is stable (not changing)
            if (Math.abs(currentPosition - lastPosition) < 1) {
                stableCount++;
            } else {
                stableCount = 0;
            }
            
            lastPosition = currentPosition;
            
            // Complete when close to target and stable for a few frames
            if (distanceToTarget < 5 || stableCount > 3) {
                isCurrentlyScrolling = false;
                activeScrollPromise = null;
                resolve();
            } else {
                rafId = requestAnimationFrame(checkComplete);
            }
        };
        
        rafId = requestAnimationFrame(checkComplete);
        
        // Timeout fallback
        setTimeout(() => {
            if (activeScrollPromise) {
                cancelAnimationFrame(rafId);
                isCurrentlyScrolling = false;
                activeScrollPromise = null;
                resolve();
            }
        }, 2000);
    });
    
    return activeScrollPromise;
}

/**
 * Check if currently scrolling
 */
export function isScrolling() {
    return isCurrentlyScrolling;
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