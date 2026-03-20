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

        const heroCa = document.getElementById('heroCa');
        if (heroCa && CONFIG.ca) {
            heroCa.textContent = CONFIG.ca;
            heroCa.addEventListener('click', () => {
                navigator.clipboard.writeText(CONFIG.ca).catch(() => {});
                showToast();
            });
        }
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
        // Show hero title immediately with sienna flash
        document.body.classList.add('flash-sienna');
        heroTitle.style.opacity = '1';

        // Remove sienna flash after 150ms
        setTimeout(() => {
            document.body.classList.remove('flash-sienna');
        }, 150);
    }

    // Hide unused lines
    if (line1) line1.style.display = 'none';
    if (line2) line2.style.display = 'none';

    coldOpen();

    /* ---- ACT II — CONCEPT REVEAL ---- */
    const conceptSection = document.getElementById('actII');

    const conceptObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = conceptSection.querySelector('.concept__title');
                if (title) title.classList.add('visible');

                const paragraphs = conceptSection.querySelectorAll('.concept__body p');
                paragraphs.forEach((p, i) => {
                    setTimeout(() => p.classList.add('visible'), (i + 1) * 300);
                });
            }
        });
    }, { threshold: 0.3 });

    if (conceptSection) conceptObs.observe(conceptSection);

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

    /* ---- LOAD CONFIG ---- */
    loadConfig();

})();
