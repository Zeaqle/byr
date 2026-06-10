// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll-triggered animations
    initScrollAnimations();
    
    // Initialize parallax effects
    initParallax();
    
    // Initialize typewriter effect for subtitle
    initTypewriter();
});

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card, .blog-card, .about-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
        }
    });
}

// Typewriter effect for hero subtitle
function initTypewriter() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.display = 'block';
    
    let index = 0;
    const speed = 30;

    function type() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    setTimeout(type, 500);
}

// Console branding
console.log('%c byr', 'font-size: 40px; font-weight: bold; color: #a29bfe;');
console.log('%c Welcome to my personal website!', 'font-size: 16px; color: #fd79a8;');