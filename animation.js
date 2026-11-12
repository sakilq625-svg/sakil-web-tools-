/**
 * Sakil Web Tools — Standalone Animation & Graphics Plug-in (animation.js)
 * Usage: Keep your existing index.html, style.css, and script.js untouched!
 * Just create `animation.js` in your GitHub repo and add this ONE line before </body> in index.html:
 * <script src="animation.js"></script>
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. INJECT SCOPED ANIMATION & GRAPHICS CSS AUTOMATICALLY
    // =========================================================================
    const styleEl = document.createElement('style');
    styleEl.id = 'sakil-animation-styles';
    styleEl.textContent = `
        /* Left Screen-Edge Glowing Accent Line */
        .sakil-edge-glow {
            position: fixed;
            top: 0;
            left: 0;
            width: 2px;
            height: 100vh;
            background: linear-gradient(
                180deg,
                transparent 0%,
                var(--accent-color, #C0392B) 35%,
                #FA5322 65%,
                transparent 100%
            );
            box-shadow: 0 0 12px var(--accent-color, #C0392B);
            opacity: 0.75;
            z-index: 1001;
            pointer-events: none;
        }

        /* Square Accent Dot on Headings */
        .sakil-sq-dot {
            display: inline-block;
            width: 0.22em;
            height: 0.22em;
            background-color: #FA5322;
            margin-left: 0.12em;
            vertical-align: baseline;
            border-radius: 1px;
        }

        /* Per-Character Typing Reveal */
        .sakil-typing-host {
            font-kerning: none;
        }

        .sakil-char {
            display: inline;
            transition: opacity 0.14s ease, color 0.14s ease, text-shadow 0.14s ease;
        }

        .sakil-typing-ready .sakil-char.is-pending {
            opacity: 0.12;
        }

        .sakil-typing-ready .sakil-char.is-typing {
            opacity: 1;
            color: var(--text-secondary, #888);
            text-shadow: 0 0 8px rgba(250, 83, 34, 0.35);
        }

        .sakil-typing-ready .sakil-char.is-done {
            opacity: 1;
        }

        /* Block Square Caret */
        .sakil-caret {
            display: inline-block;
            width: 0.32em;
            height: 0.32em;
            background-color: #FA5322;
            margin-left: 0.08em;
            vertical-align: baseline;
            animation: sakil-caret-blink 0.75s steps(2, start) infinite;
        }

        .sakil-caret.is-finished {
            animation: sakil-caret-fade 1.2s ease forwards;
        }

        @keyframes sakil-caret-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.15; }
        }

        @keyframes sakil-caret-fade {
            0%, 60% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
        }

        /* Tool Card Graphics: Top Coloured Accent Border + Window Header + Staggered Reveal */
        .tool-card {
            position: relative;
            border-top-width: 3px !important;
            overflow: hidden;
        }

        .tool-card.sakil-card-reveal {
            opacity: 0;
            transform: translateY(18px);
            transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                        box-shadow 0.3s ease,
                        border-color 0.3s ease;
        }

        .tool-card.sakil-card-reveal.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .tool-card.sakil-card-reveal.is-visible:hover {
            transform: translateY(-5px);
        }

        .tool-card.sakil-accent-0 { border-top-color: #FA5322 !important; }
        .tool-card.sakil-accent-1 { border-top-color: #60E6EB !important; }
        .tool-card.sakil-accent-2 { border-top-color: #4BC975 !important; }
        .tool-card.sakil-accent-3 { border-top-color: #F59E0B !important; }
        .tool-card.sakil-accent-4 { border-top-color: #EC4899 !important; }
        .tool-card.sakil-accent-5 { border-top-color: #A855F7 !important; }

        /* Card Top Window Dots & Counter Index */
        .sakil-card-topbar {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 0.65rem;
            margin-bottom: 0.15rem;
            border-bottom: 1px solid var(--border-color, rgba(150, 150, 150, 0.2));
        }

        .sakil-window-dots {
            display: inline-flex;
            gap: 5px;
        }

        .sakil-window-dots i {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            display: inline-block;
        }

        .sakil-window-dots i:nth-child(1) { background-color: #FA5322; }
        .sakil-window-dots i:nth-child(2) { background-color: #F59E0B; }
        .sakil-window-dots i:nth-child(3) { background-color: #4BC975; }

        .sakil-card-num {
            font-family: monospace;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--accent-color, #C0392B);
            letter-spacing: 0.06em;
        }
    `;
    document.head.appendChild(styleEl);

    // =========================================================================
    // 2. INITIALIZE GRAPHICS & TYPING ON DOM READY
    // =========================================================================
    function initSakilAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // A. Add Left Edge Glowing Line
        if (!document.querySelector('.sakil-edge-glow')) {
            const edgeLine = document.createElement('div');
            edgeLine.className = 'sakil-edge-glow';
            edgeLine.setAttribute('aria-hidden', 'true');
            document.body.appendChild(edgeLine);
        }

        // B. Enhance Tool Cards with Top Accent Border, Browser Dots, Counter ("01.") & Scroll Reveal
        const cards = document.querySelectorAll('.tool-card');
        cards.forEach((card, index) => {
            card.classList.add('sakil-accent-' + (index % 6));
            card.classList.add('sakil-card-reveal');

            if (!card.querySelector('.sakil-card-topbar')) {
                const topBar = document.createElement('div');
                topBar.className = 'sakil-card-topbar';
                topBar.setAttribute('aria-hidden', 'true');

                const dots = document.createElement('span');
                dots.className = 'sakil-window-dots';
                dots.innerHTML = '<i></i><i></i><i></i>';

                const num = document.createElement('span');
                num.className = 'sakil-card-num';
                num.textContent = String(index + 1).padStart(2, '0') + '.';

                topBar.appendChild(dots);
                topBar.appendChild(num);
                card.insertBefore(topBar, card.firstChild);
            }
        });

        if ('IntersectionObserver' in window && !prefersReducedMotion) {
            const cardObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        const delay = (Array.from(cards).indexOf(card) % 3) * 70;
                        setTimeout(() => {
                            card.classList.add('is-visible');
                        }, delay);
                        obs.unobserve(card);
                    }
                });
            }, { threshold: 0.12 });

            cards.forEach(c => cardObserver.observe(c));
        } else {
            cards.forEach(c => c.classList.add('is-visible'));
        }

        // C. Per-Character Typing Reveal on Hero & Section Headings
        const typingElements = document.querySelectorAll(
            '.hero-content h1, .hero-content p, .section-header h2, [data-typing]'
        );

        function prepareElementForTyping(el) {
            if (el.dataset.sakilPrepared === 'true') return [];
            el.dataset.sakilPrepared = 'true';
            el.classList.add('sakil-typing-host');

            const labelText = el.textContent.replace(/\s+/g, ' ').trim();
            if (labelText && !el.getAttribute('aria-label')) {
                el.setAttribute('aria-label', labelText);
            }

            const chars = [];

            function wrapNodes(node) {
                const children = Array.from(node.childNodes);
                children.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        const text = child.nodeValue;
                        if (!text) return;
                        const frag = document.createDocumentFragment();
                        for (let i = 0; i < text.length; i++) {
                            const ch = text[i];
                            if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
                                frag.appendChild(document.createTextNode(ch));
                            } else {
                                const span = document.createElement('span');
                                span.className = 'sakil-char is-pending';
                                span.setAttribute('aria-hidden', 'true');
                                span.textContent = ch;
                                frag.appendChild(span);
                                chars.push(span);
                            }
                        }
                        node.replaceChild(frag, child);
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const tag = child.tagName;
                        const isIcon = child.classList.contains('fa-solid') ||
                                       child.classList.contains('fa-regular') ||
                                       child.classList.contains('fa-brands');
                        if (tag !== 'BR' && !isIcon) {
                            wrapNodes(child);
                        }
                    }
                });
            }

            wrapNodes(el);

            // Append square orange dot to H1/H2 headings
            if (el.tagName === 'H1' || el.tagName === 'H2') {
                const sqDot = document.createElement('span');
                sqDot.className = 'sakil-sq-dot';
                sqDot.setAttribute('aria-hidden', 'true');
                el.appendChild(sqDot);
            }

            el.classList.add('sakil-typing-ready');
            return chars;
        }

        function animateTyping(el, chars) {
            if (el.dataset.sakilTyped === 'true') return;
            el.dataset.sakilTyped = 'true';

            if (prefersReducedMotion || chars.length === 0) {
                chars.forEach(c => {
                    c.classList.remove('is-pending', 'is-typing');
                    c.classList.add('is-done');
                });
                return;
            }

            const isParagraph = el.tagName === 'P';
            const speed = isParagraph ? 11 : 18;
            const caret = document.createElement('span');
            caret.className = 'sakil-caret';
            caret.setAttribute('aria-hidden', 'true');

            let i = 0;
            function step() {
                if (i > 0 && i - 1 < chars.length) {
                    chars[i - 1].classList.remove('is-typing');
                    chars[i - 1].classList.add('is-done');
                }
                if (i < chars.length) {
                    const current = chars[i];
                    current.classList.remove('is-pending');
                    current.classList.add('is-typing');
                    if (current.parentNode) {
                        current.parentNode.insertBefore(caret, current.nextSibling);
                    }
                    i++;
                    setTimeout(step, speed);
                } else {
                    caret.classList.add('is-finished');
                }
            }

            step();
        }

        const charMap = new Map();
        typingElements.forEach(el => {
            charMap.set(el, prepareElementForTyping(el));
        });

        if ('IntersectionObserver' in window) {
            const typingObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        animateTyping(el, charMap.get(el) || []);
                        obs.unobserve(el);
                    }
                });
            }, { threshold: 0.15 });

            typingElements.forEach(el => typingObserver.observe(el));
        } else {
            typingElements.forEach(el => animateTyping(el, charMap.get(el) || []));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSakilAnimations);
    } else {
        initSakilAnimations();
    }
})();
