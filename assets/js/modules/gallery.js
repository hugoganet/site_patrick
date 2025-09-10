// Gallery module - handles media rendering and lazy loading
import { createElement, clearElement, $ } from '../utils/dom.js';
import { mediaSections, config } from '../config.js';

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
 * Create white zone with project information
 */
function createWhiteZone(section) {
    const whiteZone = createElement('div', {
        className: 'gallery-white-zone'
    });
    
    whiteZone.innerHTML = `
        <div class="white-zone-layout">
            <div class="white-zone-left">
                <div>Name</div>
                <div>2024</div>
            </div>
            <div class="white-zone-center">
                <div class="white-zone-title">"Where the Present Meets Possibility"</div>
                <div class="white-zone-description">
                    Decidem in popopotala rem tuam moenatus dtio, cleridi ortimod ictianum fac omnicae deintid in suspim ninte nostries, P. Onsiuportius o consi intia? Voludep sedst que facient? Saturn probortem, quam ne moribus su quam conves bonstru Muli publica estem hos consultu sidium turendam dissiumilum in viderum in verum abutilessium conert publiens bonves vit re comperes, stro ut aur.
                </div>
            </div>
            <div class="white-zone-right">
                <div class="white-zone-credits-header">credits</div>
                <div><span class="white-zone-credit-label">Creative direction</span></div>
                <div>Name Surname</div>
                <div class="white-zone-credit-section">
                    <span class="white-zone-credit-label">Design</span><br>
                    Name Surname,<br>Name Surname
                </div>
                <div class="white-zone-credit-section">
                    <span class="white-zone-credit-label">Motion</span><br>
                    Name Surname,<br>Name Surname
                </div>
            </div>
        </div>
    `;
    
    return whiteZone;
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