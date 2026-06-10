class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleNavToggle();
        this.handleSmoothScroll();
        this.handleBackToTop();
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('backToTop');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            // Navbar background
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Back to top button
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            // Active nav link
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            sections.forEach(section => {
                const top = section.offsetTop - 150;
                if (window.scrollY >= top) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    handleNavToggle() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }

    handleSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    handleBackToTop() {
        document.getElementById('backToTop').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});