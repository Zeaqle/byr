class AlbumManager {
    constructor() {
        this.photos = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.loadPhotos();
        this.renderPhotos();
        this.bindEvents();
    }

    loadPhotos() {
        const saved = localStorage.getItem('zeaple_album_photos');
        if (saved) {
            this.photos = JSON.parse(saved);
        }
        if (this.photos.length === 0) {
            // Add default photo
            this.photos = [{
                id: Date.now(),
                name: 'gallery.png',
                data: 'images/gallery.png',
                date: '2026-06-10'
            }];
            this.savePhotos();
        }
    }

    savePhotos() {
        localStorage.setItem('zeaple_album_photos', JSON.stringify(this.photos));
    }

    renderPhotos() {
        const grid = document.getElementById('albumGrid');

        if (this.photos.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:80px 0;color:var(--text-muted)">
                    <i class="fas fa-images" style="font-size:48px;margin-bottom:16px;opacity:0.3"></i>
                    <p>还没有照片，点击上方按钮上传吧！</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.photos.map((photo, index) => `
            <div class="album-item" onclick="albumManager.openLightbox(${index})">
                <img src="${photo.data}" alt="${photo.name}">
                <div class="album-overlay">
                    <span>${photo.name}</span>
                    <span>${photo.date}</span>
                </div>
            </div>
        `).join('');
    }

    addPhotos(files) {
        const loadPromises = Array.from(files).map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const now = new Date();
                    resolve({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        data: e.target.result,
                        date: now.toLocaleDateString('zh-CN')
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(loadPromises).then(photos => {
            this.photos.unshift(...photos);
            this.savePhotos();
            this.renderPhotos();
        });
    }

    openLightbox(index) {
        this.currentIndex = index;
        const lightbox = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        const photo = this.photos[index];

        img.src = photo.data;
        document.getElementById('lightboxDate').textContent = photo.date;
        document.getElementById('lightboxIndex').textContent = `${index + 1} / ${this.photos.length}`;
        lightbox.classList.add('active');
    }

    closeLightbox() {
        document.getElementById('lightbox').classList.remove('active');
    }

    prevPhoto() {
        if (this.photos.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
        this.updateLightbox();
    }

    nextPhoto() {
        if (this.photos.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        this.updateLightbox();
    }

    updateLightbox() {
        const photo = this.photos[this.currentIndex];
        document.getElementById('lightboxImg').src = photo.data;
        document.getElementById('lightboxDate').textContent = photo.date;
        document.getElementById('lightboxIndex').textContent = `${this.currentIndex + 1} / ${this.photos.length}`;
    }

    bindEvents() {
        document.getElementById('photoUpload').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.addPhotos(e.target.files);
                e.target.value = '';
            }
        });

        document.getElementById('lightbox').querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        document.querySelector('.lightbox-overlay').addEventListener('click', () => this.closeLightbox());
        document.querySelector('.lightbox-prev').addEventListener('click', () => this.prevPhoto());
        document.querySelector('.lightbox-next').addEventListener('click', () => this.nextPhoto());

        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('lightbox').classList.contains('active')) return;
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.prevPhoto();
            if (e.key === 'ArrowRight') this.nextPhoto();
        });
    }
}

const albumManager = new AlbumManager();