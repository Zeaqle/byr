class BlogManager {
    constructor() {
        this.posts = [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.init();
    }

    init() {
        this.loadPosts();
        this.renderPosts();
        this.bindEvents();
    }

    loadPosts() {
        localStorage.removeItem('zeaple_blog_posts');
        this.posts = [];
        this.savePosts();
    }

    savePosts() {
        localStorage.setItem('zeaple_blog_posts', JSON.stringify(this.posts));
    }

    renderPosts(filter) {
        const grid = document.getElementById('blogGrid');
        const f = filter || this.currentFilter;

        let filtered = this.posts;
        if (f !== 'all') {
            filtered = this.posts.filter(p => p.category === f);
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="blog-empty">
                    <i class="fas fa-feather-alt"></i>
                    <p>还没有文章，开始写第一篇吧！</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(post => {
            const categoryLabels = {
                algorithm: '算法',
                life: '生活',
                contest: '竞赛'
            };
            const plainText = post.content.replace(/[#*`\->\[\]()!]/g, '').substring(0, 120);
            return `
                <div class="blog-card" data-id="${post.id}" onclick="blogManager.viewPost(${post.id})">
                    <span class="blog-card-category ${post.category}">${categoryLabels[post.category]}</span>
                    <h3>${post.title}</h3>
                    <p>${plainText}...</p>
                    <span class="blog-date">${post.date}</span>
                </div>
            `;
        }).join('');
    }

    filterPosts(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderPosts(filter);
    }

    openEditor(postId) {
        this.editingId = postId || null;
        const modal = document.getElementById('blogModal');
        const titleInput = document.getElementById('postTitle');
        const contentInput = document.getElementById('postContent');
        const categorySelect = document.getElementById('postCategory');
        const modalTitle = document.getElementById('modalTitle');

        if (postId) {
            const post = this.posts.find(p => p.id === postId);
            if (post) {
                modalTitle.textContent = '编辑文章';
                titleInput.value = post.title;
                contentInput.value = post.content;
                categorySelect.value = post.category;
                this.updatePreview();
            }
        } else {
            modalTitle.textContent = '写文章';
            titleInput.value = '';
            contentInput.value = '';
            categorySelect.value = 'algorithm';
            document.getElementById('editorPreview').innerHTML = '';
        }

        modal.classList.add('active');
    }

    closeEditor() {
        document.getElementById('blogModal').classList.remove('active');
        this.editingId = null;
    }

    savePost() {
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const category = document.getElementById('postCategory').value;

        if (!title) { alert('请输入文章标题！'); return; }
        if (!content) { alert('请输入文章内容！'); return; }

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];

        if (this.editingId) {
            const post = this.posts.find(p => p.id === this.editingId);
            if (post) {
                post.title = title;
                post.content = content;
                post.category = category;
            }
        } else {
            this.posts.unshift({
                id: Date.now(),
                title,
                content,
                category,
                date: dateStr
            });
        }

        this.savePosts();
        this.renderPosts();
        this.closeEditor();
    }

    viewPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        const modal = document.getElementById('viewPostModal');
        document.getElementById('viewPostTitle').textContent = post.title;
        document.getElementById('viewPostDate').textContent = post.date;

        const categoryBadge = document.getElementById('viewPostCategory');
        const categoryLabels = { algorithm: '算法', life: '生活', contest: '竞赛' };
        categoryBadge.textContent = categoryLabels[post.category];
        categoryBadge.className = 'post-category-badge ' + post.category;

        const contentDiv = document.getElementById('viewPostContent');
        if (window.marked) {
            contentDiv.innerHTML = window.marked.parse(post.content);
        } else {
            contentDiv.innerHTML = post.content.replace(/\n/g, '<br>');
        }

        modal.classList.add('active');
    }

    closeViewPost() {
        document.getElementById('viewPostModal').classList.remove('active');
    }

    updatePreview() {
        const content = document.getElementById('postContent').value;
        const preview = document.getElementById('editorPreview');
        if (window.marked) {
            preview.innerHTML = window.marked.parse(content);
        } else {
            preview.innerHTML = content.replace(/\n/g, '<br>');
        }
    }

    insertMarkdown(cmd) {
        const textarea = document.getElementById('postContent');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);
        let insert = '';

        switch (cmd) {
            case 'bold': insert = `**${selected || '粗体文字'}**`; break;
            case 'italic': insert = `*${selected || '斜体文字'}*`; break;
            case 'heading': insert = `## ${selected || '标题'}`; break;
            case 'code': insert = selected ? `\`${selected}\`` : '```\n\n```'; break;
            case 'link': insert = `[${selected || '链接文字'}](url)`; break;
            case 'list': insert = selected.split('\n').map(l => `- ${l}`).join('\n'); break;
            case 'image': insert = `![${selected || '图片描述'}](url)`; break;
        }

        if (insert) {
            textarea.focus();
            document.execCommand('insertText', false, insert);
            this.updatePreview();
        }
    }

    bindEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.filterPosts(btn.dataset.filter));
        });

        // New post button
        document.getElementById('newPostBtn').addEventListener('click', () => this.openEditor());

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeEditor();
                this.closeViewPost();
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                this.closeEditor();
                this.closeViewPost();
            });
        });

        // Editor buttons
        document.querySelectorAll('.editor-btn').forEach(btn => {
            btn.addEventListener('click', () => this.insertMarkdown(btn.dataset.cmd));
        });

        // Preview toggle
        document.getElementById('togglePreview')?.addEventListener('change', (e) => {
            const preview = document.getElementById('editorPreview');
            preview.style.display = e.target.checked ? 'block' : 'none';
        });

        // Save and cancel
        document.getElementById('savePost').addEventListener('click', () => this.savePost());
        document.getElementById('cancelPost').addEventListener('click', () => this.closeEditor());

        // Live preview
        document.getElementById('postContent').addEventListener('input', () => this.updatePreview());
    }
}

const blogManager = new BlogManager();