// Gallery module - now JSON-driven to render Gumlet media
// It fetches a manifest and per-project JSON files and renders images/iframes.
// It also updates mediaSections dynamically so other modules (navigation/sections)
// can continue to work without any change.

import { createElement, clearElement, $ } from '../utils/dom.js';
import { mediaSections, setMediaSections, config } from '../config.js';

let gallery;

/**
 * Initialize gallery
 * - Loads manifest assets/data/projects.json
 * - Loads each project JSON in order
 * - Renders medias into .gallery
 * - Inserts a white info zone after each project (optional)
 * - Updates mediaSections for cross-module features
 */
export function initGallery() {
    gallery = $('.gallery');
    if (!gallery) return;

    // Kick off async load but don't block other modules init
    loadAndRenderFromJson().catch(err => {
        console.error('Gallery initialization failed:', err);
    });
}

/**
 * Top-level loader: fetch manifest, then each project, then render.
 */
async function loadAndRenderFromJson() {
    clearElement(gallery);

    const manifest = await fetchJson('assets/data/projects.json');

    // Build a temporary sections map as we load to expose counts for other modules
    const dynamicSections = {};

    for (const item of manifest.projects || []) {
        const project = await fetchJson(`assets/data/${item.json}`);

        // Remember how many medias are in this section for section buttons logic
        dynamicSections[project.title] = Array.isArray(project.medias) ? project.medias.length : 0;

        // Render medias with data-section/data-index so scrolling works
        (project.medias || []).forEach((m, idx) => {
            const el = renderMediaEl(project, m, idx);
            if (el) gallery.appendChild(el);
        });

        // Insert a white info block after each project (skip HOME by convention)
        if (project.title !== 'HOME') {
            const info = renderInfoWhiteZone(project);
            if (info) gallery.appendChild(info);
        }
    }

    // Update exported mediaSections so other modules can compute positions
    setMediaSections(
        Object.fromEntries(
            Object.entries(dynamicSections).map(([section, count]) => [
                section,
                // We don't need actual filenames; just an array sized to count
                Array.from({ length: count }, (_, i) => i)
            ])
        )
    );

    // Set up observers after content is in the DOM
    setupLazyLoading();
}

/**
 * Fetch helper with basic error handling
 */
async function fetchJson(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
    return res.json();
}

/**
 * Create a media element for an item from the project JSON
 * Supports two types:
 * - image: { type: 'image', src: 'https://warans.gumlet.io/...', alt?, ratio? }
 * - video: { type: 'video', id: '<Gumlet Embed ID>', ratio? }
 */
function renderMediaEl(project, media, idx) {
    let el = null;

    // Support both `src` and `url` keys for images
    if (media.type === 'image' && (media.src || media.url)) {
        const imgSrc = media.src || media.url;
        // Using direct Gumlet URL keeps things simple (gumlet.js can optimize if added later)
        el = createElement('img', {
            src: imgSrc,
            alt: media.alt || `${project.title} image ${idx + 1}`,
            loading: 'lazy',
            'data-section': project.title,
            'data-index': idx,
            style: { display: 'block', width: '100%', height: 'auto' }
        });
    } else if (media.type === 'video' && media.id) {
        // Simple Gumlet embed via iframe; avoids player JS coupling
        const params = new URLSearchParams({ autoplay: '0', muted: '1', playsinline: '1' });
        el = createElement('iframe', {
            src: `https://play.gumlet.io/embed/${media.id}?${params.toString()}`,
            title: `Gumlet video • ${project.title}`,
            loading: 'lazy',
            frameborder: '0',
            allow: 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen',
            allowFullscreen: true,
            'data-section': project.title,
            'data-index': idx,
            style: {
                display: 'block',
                width: '100%',
                height: 'auto',
                ...(media.ratio ? { aspectRatio: media.ratio } : {})
            }
        });
    }

    return el;
}

/**
 * Render the white info block for a project based on JSON fields
 */
function renderInfoWhiteZone(project) {
    const hasInfo = project.showInfo || project.description || (project.credits && project.credits.length);
    if (!hasInfo) return null;

    const wrap = createElement('div', { className: 'gallery-white-zone' });

    // Left: project title + year
    const left = createElement('div', { className: 'white-zone-left' }, [
        createElement('div', { textContent: project.title || '' }),
        createElement('div', { textContent: project.year || '' })
    ]);

    // Center: description (used as title line in the original design)
    const center = createElement('div', { className: 'white-zone-center' }, [
        project.description ? createElement('div', { className: 'white-zone-title', textContent: project.description }) : null
    ].filter(Boolean));

    // Right: credits, grouped by role
    const rightChildren = [];
    if (Array.isArray(project.credits) && project.credits.length) {
        rightChildren.push(createElement('div', { className: 'white-zone-credits-header', textContent: 'credits' }));
        project.credits.forEach(c => {
            rightChildren.push(createElement('div', { className: 'white-zone-credit-section' }, [
                createElement('span', { className: 'white-zone-credit-label', textContent: c.role || '' }),
                createElement('div', { className: 'credit-names', textContent: (c.names || []).join(', ') })
            ]));
        });
    }
    const right = createElement('div', { className: 'white-zone-right' }, rightChildren);

    const layout = createElement('div', { className: 'white-zone-layout' }, [left, center, right]);
    wrap.appendChild(layout);
    return wrap;
}

/**
 * Set up basic lazy behavior: play videos when visible (if using <video> in future)
 * For iframes/images we still observe just in case for future extensions.
 */
function setupLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const options = { root: null, rootMargin: config.lazyLoadOffset, threshold: 0.01 };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            // If we later reintroduce <video> tags, we can auto-play here
            obs.unobserve(el);
        });
    }, options);

    gallery.querySelectorAll('img, video, iframe').forEach(el => observer.observe(el));
}

// Backward-compatible export used by navigation to render a single section on demand.
// In JSON-driven mode, we render everything; this function can be a no-op or could
// scroll to the requested section. Keeping the signature to avoid import breakage.
export function showGallerySection(section) {
    // No-op: the gallery is fully rendered; navigation.scrollToSection handles scrolling
}