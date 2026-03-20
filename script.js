/* ============================================
   ME — CINEMATIC SITE SCRIPT
   ============================================ */

(function () {
    'use strict';

    /* ---- CONFIG LOADER ---- */
    const CONFIG = { ca: '', twitter: '#', community: '#', buy: '#' };

    async function loadConfig() {
        try {
            const r = await fetch('/api/config');
            if (!r.ok) return;
            const data = await r.json();
            if (data.ca) CONFIG.ca = data.ca;
            if (data.twitter) CONFIG.twitter = data.twitter;
            if (data.community) CONFIG.community = data.community;
            if (data.buy) CONFIG.buy = data.buy;
            applyConfig();
        } catch (_) { /* silent */ }
    }

    function applyConfig() {
        const caBtn = document.getElementById('caBtn');
        if (caBtn && CONFIG.ca) caBtn.dataset.ca = CONFIG.ca;

        const tw = document.getElementById('twitterLink');
        if (tw && CONFIG.twitter) tw.href = CONFIG.twitter;

        const comm = document.getElementById('communityLink');
        if (comm && CONFIG.community) comm.href = CONFIG.community;

        const buy = document.getElementById('buyLink');
        if (buy && CONFIG.buy) buy.href = CONFIG.buy;
    }

    /* ---- CA COPY + TOAST ---- */
    const caBtn = document.getElementById('caBtn');
    const toast = document.getElementById('toast');

    if (caBtn) {
        caBtn.addEventListener('click', async () => {
            const ca = caBtn.dataset.ca;
            if (!ca) return;
            try {
                await navigator.clipboard.writeText(ca);
            } catch (_) {
                const ta = document.createElement('textarea');
                ta.value = ca;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            showToast();
        });
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
    }

    /* ---- ACT I — COLD OPEN SEQUENCE ---- */
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const flash = document.getElementById('flash');
    const heroTitle = document.getElementById('heroTitle');

    function coldOpen() {
        // Line 1 fade in
        setTimeout(() => {
            line1.style.transition = 'opacity 2s ease';
            line1.style.opacity = '1';
        }, 1500);

        // Line 1 fade out
        setTimeout(() => {
            line1.style.transition = 'opacity 0.8s ease';
            line1.style.opacity = '0';
        }, 4500);

        // Line 2 fade in
        setTimeout(() => {
            line2.style.transition = 'opacity 2s ease';
            line2.style.opacity = '1';
        }, 6000);

        // Line 2 fade out
        setTimeout(() => {
            line2.style.transition = 'opacity 0.8s ease';
            line2.style.opacity = '0';
        }, 9000);

        // Flash + Hero
        setTimeout(() => {
            flash.style.transition = 'opacity 0.04s ease';
            flash.style.opacity = '1';
            setTimeout(() => {
                flash.style.transition = 'opacity 0.04s ease';
                flash.style.opacity = '0';
            }, 80);

            setTimeout(() => {
                heroTitle.style.transition = 'opacity 0.8s ease';
                heroTitle.style.opacity = '1';
            }, 120);
        }, 11000);
    }

    coldOpen();

    /* ---- ACT II — POSTER REVEAL ---- */
    const posterSection = document.getElementById('actII');

    function handlePoster(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = posterSection.querySelector('.poster__image img');
                if (img) img.classList.add('zoomed');

                const from = posterSection.querySelector('.poster__from');
                const title = posterSection.querySelector('.poster__title');
                const sub = posterSection.querySelector('.poster__subtitle');
                const credits = posterSection.querySelector('.poster__credits');

                if (from) from.classList.add('visible');
                if (title) title.classList.add('visible');
                if (sub) sub.classList.add('visible');
                if (credits) credits.classList.add('visible');
            }
        });
    }

    const posterObs = new IntersectionObserver(handlePoster, { threshold: 0.3 });
    if (posterSection) posterObs.observe(posterSection);

    /* ---- ACT III — TRILOGY CLIP-PATH REVEAL ---- */
    const trilogyPanels = document.querySelectorAll('.trilogy__panel[data-reveal]');

    const trilogyObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.2 });

    trilogyPanels.forEach(p => trilogyObs.observe(p));

    /* ---- ACT V — STAGGERED REVIEWS ---- */
    const reviews = document.querySelectorAll('.acclaim-review[data-fade]');

    const reviewObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const idx = Array.from(reviews).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 200);
            }
        });
    }, { threshold: 0.15 });

    reviews.forEach(r => reviewObs.observe(r));

    /* ---- LOAD CONFIG ---- */
    loadConfig();

})();
