// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll-triggered animations
    initScrollAnimations();
    
    // Initialize parallax effects
    initParallax();
    
    // Initialize typewriter effect for subtitle
    initTypewriter();

    // Initialize about editor
    initAboutEditor();
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

// About Editor with LocalStorage persistence
function loadAboutData() {
    const saved = localStorage.getItem('zeaple_about');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('aboutAvatarText').textContent = data.avatar || 'Z';
        document.getElementById('aboutName').textContent = data.name || 'byr';
        document.getElementById('aboutBio').textContent = data.bio || '一个 OIer';
        document.getElementById('aboutStat1').textContent = data.stat1 || '∞';
        document.getElementById('aboutStat2').textContent = data.stat2 || '∞';
        document.getElementById('aboutStat3').textContent = data.stat3 || '∞';
        // Load honors
        if (data.honors && data.honors.length > 0) {
            renderHonors(data.honors);
        }
    }
}

function renderHonors(honors) {
    const container = document.querySelector('.timeline');
    container.innerHTML = honors.map(h => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span class="timeline-date">${h.date}</span>
                <h4>${h.title}</h4>
            </div>
        </div>
    `).join('');
}

function initAboutEditor() {
    // Load saved data on startup
    loadAboutData();

    const editBtn = document.getElementById('editAboutBtn');
    const modal = document.getElementById('aboutModal');
    if (!editBtn || !modal) return;

    // Open editor
    editBtn.addEventListener('click', () => {
        document.getElementById('editAvatarText').value = document.getElementById('aboutAvatarText').textContent;
        document.getElementById('editName').value = document.getElementById('aboutName').textContent;
        document.getElementById('editBio').value = document.getElementById('aboutBio').textContent;
        document.getElementById('editStat1').value = document.getElementById('aboutStat1').textContent;
        document.getElementById('editStat2').value = document.getElementById('aboutStat2').textContent;
        document.getElementById('editStat3').value = document.getElementById('aboutStat3').textContent;
        // Load current honors into editor
        const honorItems = document.querySelectorAll('.timeline-item');
        document.getElementById('editHonors').value = Array.from(honorItems).map(item => {
            const date = item.querySelector('.timeline-date').textContent;
            const title = item.querySelector('h4').textContent;
            return `${date}|${title}`;
        }).join('\n');
        modal.classList.add('active');
    });

    // Save
    document.getElementById('saveAboutEdit').addEventListener('click', () => {
        const avatar = document.getElementById('editAvatarText').value || 'Z';
        const name = document.getElementById('editName').value || 'byr';
        const bio = document.getElementById('editBio').value || '一个 OIer';
        const stat1 = document.getElementById('editStat1').value || '∞';
        const stat2 = document.getElementById('editStat2').value || '∞';
        const stat3 = document.getElementById('editStat3').value || '∞';
        const honorsRaw = document.getElementById('editHonors').value.trim();

        // Update display
        document.getElementById('aboutAvatarText').textContent = avatar;
        document.getElementById('aboutName').textContent = name;
        document.getElementById('aboutBio').textContent = bio;
        document.getElementById('aboutStat1').textContent = stat1;
        document.getElementById('aboutStat2').textContent = stat2;
        document.getElementById('aboutStat3').textContent = stat3;

        // Parse honors
        const honors = honorsRaw ? honorsRaw.split('\n').filter(l => l.trim()).map(l => {
            const parts = l.split('|');
            return { date: parts[0]?.trim() || '', title: parts[1]?.trim() || '' };
        }) : [];

        if (honors.length > 0) {
            renderHonors(honors);
        }

        // Save to localStorage
        localStorage.setItem('zeaple_about', JSON.stringify({
            avatar, name, bio, stat1, stat2, stat3, honors
        }));

        modal.classList.remove('active');
    });

    // Cancel
    document.getElementById('cancelAboutEdit').addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close via overlay/close button
    modal.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('active'));
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.classList.remove('active'));
}
