'use strict';

function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) { return; }

    toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}
function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) { return; }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
        targets.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { observer.observe(el); });
}
function initLightbox() {
    if (typeof GLightbox === 'undefined') { return; }
    if (!document.querySelector('.glightbox')) { return; }
    GLightbox({ selector: '.glightbox' });
}

document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initLightbox();
});
