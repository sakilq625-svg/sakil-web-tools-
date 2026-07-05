/**
 * Sakil Web Tools - Core Main Script
 * Version: 1.0.0 (2026)
 * Features: Light/Dark Mode, Live Search, Mobile Navigation, Performance Loader
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. PAGE LOADER INITIALIZATION
    // ==========================================
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // Matches CSS transition speed
        });
        
        // Safety fallback if load event already fired
        if (document.readyState === 'complete') {
            loader.classList.add('fade-out');
            loader.style.display = 'none';
        }
    }

    // ==========================================
    // 2. MODERN LIGHT / DARK THEME MANAGER
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('sakil-tools-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    htmlElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('sakil-tools-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
            themeIcon.style.color = '#fbbf24'; // Premium Sun Yellow
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeIcon.style.color = '';
        }
    }

    // ==========================================
    // 3. RESPONSIVE MOBILE MENU HAMBURGER
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link or outside
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 4. LIVE DYNAMIC SEARCH FILTER ENGINE
    // ==========================================
    const searchInput = document.getElementById('tool-search');
    const toolCards = document.querySelectorAll('.tool-card');
    const toolSections = document.querySelectorAll('.tool-section');
    const noResultsMessage = document.getElementById('no-results');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let totalVisibleCards = 0;

            toolSections.forEach(section => {
                const cardsInSection = section.querySelectorAll('.tool-card');
                let visibleCardsInSection = 0;

                cardsInSection.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('p').textContent.toLowerCase();
                    const keywords = card.getAttribute('data-keywords') ? card.getAttribute('data-keywords').toLowerCase() : '';

                    if (title.includes(query) || description.includes(query) || keywords.includes(query)) {
                        card.style.display = 'flex';
                        visibleCardsInSection++;
                        totalVisibleCards++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Hide the entire category section if no cards match inside it
                if (visibleCardsInSection === 0 && query !== '') {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });

            // Toggle No Results View
            if (totalVisibleCards === 0 && query !== '') {
                noResultsMessage.classList.remove('hidden');
            } else {
                noResultsMessage.classList.add('hidden');
            }
        });
    }
});