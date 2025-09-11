// Gallery module - handles media rendering and lazy loading
import { createElement, clearElement, $ } from '../utils/dom.js';
import { mediaSections, config, getProjectData, validateProjectData } from '../config.js';

let gallery;

/**
 * Initialize gallery
 */
export function initGallery() {
    gallery = $('.gallery');
    if (!gallery) return;
    
    renderAllSections();
    setupLazyLoading();
}

/**
 * Render all media sections
 */
export function renderAllSections() {
    clearElement(gallery);
    
    Object.entries(mediaSections).forEach(([section, mediaFiles]) => {
        renderSection(section, mediaFiles);
    });
}

/**
 * Render single section
 */
function renderSection(section, mediaFiles) {
    mediaFiles.forEach((file, index) => {
        const mediaElement = createMediaElement(file, section, index);
        if (mediaElement) {
            gallery.appendChild(mediaElement);
            
            // Add white zone after last item (except HOME)
            if (section !== 'HOME' && index === mediaFiles.length - 1) {
                gallery.appendChild(createWhiteZone(section));
            }
        }
    });
}

/**
 * Create media element (image or video)
 */
function createMediaElement(file, section, index) {
    const src = config.mediaPath + file;
    const isVideo = /\.(mp4|webm|ogg)$/i.test(file);
    const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(file);
    
    if (isVideo) {
        return createElement('video', {
            src,
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
            loading: 'lazy',
            preload: 'auto',
            'data-section': section,
            'data-index': index,
            style: {
                display: 'block',
                width: '100%',
                height: 'auto'
            }
        });
    } else if (isImage) {
        return createElement('img', {
            src,
            alt: file,
            loading: 'lazy',
            'data-section': section,
            'data-index': index,
            style: {
                display: 'block',
                width: '100%',
                height: 'auto'
            }
        });
    }
    
    return null;
}

/**
 * Create white zone with project information from data
 */
function createWhiteZone(section) {
    const rawProjectData = getProjectData(section);
    const project = validateProjectData(rawProjectData);
    
    const whiteZone = createElement('div', {
        className: 'gallery-white-zone'
    });
    
    const layout = createElement('div', {
        className: 'white-zone-layout'
    });
    
    // Generate sections
    layout.appendChild(renderProjectMeta(project, section));
    layout.appendChild(renderProjectDescription(project));
    layout.appendChild(renderProjectCredits(project.credits));
    
    whiteZone.appendChild(layout);
    return whiteZone;
}

/**
 * Render project metadata (left section)
 */
function renderProjectMeta(project, section) {
    const leftSection = createElement('div', {
        className: 'white-zone-left'
    });
    
    const nameDiv = createElement('div', {
        textContent: project.name
    });
    
    const yearDiv = createElement('div', {
        textContent: project.year
    });
    
    leftSection.appendChild(nameDiv);
    leftSection.appendChild(yearDiv);
    
    return leftSection;
}

/**
 * Render project description (center section)
 */
function renderProjectDescription(project) {
    const centerSection = createElement('div', {
        className: 'white-zone-center'
    });
    
    const titleDiv = createElement('div', {
        className: 'white-zone-title',
        textContent: `"${project.title}"`
    });
    
    const descriptionDiv = createElement('div', {
        className: 'white-zone-description',
        textContent: project.description
    });
    
    centerSection.appendChild(titleDiv);
    centerSection.appendChild(descriptionDiv);
    
    return centerSection;
}

/**
 * Render project credits (right section)
 */
function renderProjectCredits(credits) {
    const rightSection = createElement('div', {
        className: 'white-zone-right'
    });
    
    const creditsHeader = createElement('div', {
        className: 'white-zone-credits-header',
        textContent: 'credits'
    });
    
    rightSection.appendChild(creditsHeader);
    
    // Add each credit section
    Object.entries(credits).forEach(([role, people]) => {
        rightSection.appendChild(formatCreditSection(role, people));
    });
    
    return rightSection;
}

/**
 * Format individual credit section
 */
function formatCreditSection(role, people) {
    const creditSection = createElement('div', {
        className: 'white-zone-credit-section'
    });
    
    const roleLabel = createElement('span', {
        className: 'white-zone-credit-label',
        textContent: role
    });
    
    const namesDiv = createElement('div', {
        className: 'credit-names',
        textContent: people.join(', ')
    });
    
    creditSection.appendChild(roleLabel);
    creditSection.appendChild(namesDiv);
    
    return creditSection;
}

/**
 * Setup lazy loading with Intersection Observer
 */
function setupLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    
    const options = {
        root: null,
        rootMargin: config.lazyLoadOffset,
        threshold: 0.01
    };
    
    const observer = new IntersectionObserver(handleMediaIntersection, options);
    
    gallery.querySelectorAll('img, video').forEach(media => {
        observer.observe(media);
    });
}

/**
 * Handle media intersection for lazy loading
 */
function handleMediaIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const media = entry.target;
            
            if (media.tagName === 'VIDEO' && media.paused) {
                media.play().catch(() => {
                    // Autoplay might be blocked
                });
            }
            
            observer.unobserve(media);
        }
    });
}

/**
 * Show specific gallery section
 */
export function showGallerySection(section) {
    if (!mediaSections[section]) return;
    
    clearElement(gallery);
    renderSection(section, mediaSections[section]);
    setupLazyLoading();
}