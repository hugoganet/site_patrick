// DOM utility functions

/**
 * Create DOM element with attributes and children
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
}

/**
 * Query selector with error handling
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Query selector all with array return
 */
export function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

/**
 * Debounce function for performance
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add multiple event listeners
 */
export function addEventListeners(element, events, handler) {
    events.forEach(event => element.addEventListener(event, handler));
}

/**
 * Remove all children from element
 */
export function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}