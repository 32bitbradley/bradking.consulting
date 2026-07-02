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
function initReveal() {}
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
