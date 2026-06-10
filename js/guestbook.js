class GuestbookManager {
    constructor() {
        this.messages = [];
        // Change this URL after deploying to Vercel
        this.apiUrl = 'https://your-project.vercel.app/api/messages';
        this.init();
    }

    init() {
        this.loadMessages();
        this.bindEvents();
    }

    async loadMessages() {
        try {
            // Try to fetch from API
            const response = await fetch('api/messages');
            if (response.ok) {
                this.messages = await response.json();
            } else {
                throw new Error('API not available');
            }
        } catch (e) {
            // Fallback: load from localStorage for local development
            console.log('API not available, using localStorage fallback');
            const saved = localStorage.getItem('zeaple_guestbook');
            if (saved) {
                this.messages = JSON.parse(saved);
            } else {
                this.messages = [];
                this.saveMessages();
            }
        }
        this.renderMessages();
    }

    saveMessages() {
        localStorage.setItem('zeaple_guestbook', JSON.stringify(this.messages));
    }

    renderMessages() {
        const container = document.getElementById('guestbookMessages');

        if (this.messages.length === 0) {
            container.innerHTML = `
                <div class="guestbook-empty">
                    <i class="fas fa-comment-dots"></i>
                    <p>还没有留言，来说点什么吧！</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.messages.map(msg => `
            <div class="guestbook-message">
                <div class="msg-header">
                    <span class="msg-name"><i class="fas fa-user-circle"></i> ${msg.name}</span>
                    <span class="msg-time">${msg.time}</span>
                </div>
                <div class="msg-text">${msg.text}</div>
            </div>
        `).join('');
    }

    async addMessage() {
        const nameInput = document.getElementById('guestName');
        const msgInput = document.getElementById('guestMessage');
        const name = nameInput.value.trim();
        const text = msgInput.value.trim();

        if (!name) { alert('请输入你的名字！'); return; }
        if (!text) { alert('请输入留言内容！'); return; }

        try {
            // Try to post to API
            const response = await fetch('api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, text })
            });

            if (response.ok) {
                const newMsg = await response.json();
                this.messages.unshift(newMsg);
            } else {
                throw new Error('API not available');
            }
        } catch (e) {
            // Fallback: save to localStorage
            console.log('API not available, using localStorage fallback');
            const now = new Date();
            const timeStr = now.toLocaleDateString('zh-CN') + ' ' + 
                String(now.getHours()).padStart(2, '0') + ':' + 
                String(now.getMinutes()).padStart(2, '0');

            this.messages.unshift({
                id: Date.now(),
                name,
                text,
                time: timeStr
            });
            this.saveMessages();
        }

        this.renderMessages();
        nameInput.value = '';
        msgInput.value = '';
    }

    bindEvents() {
        document.getElementById('submitGuestMsg').addEventListener('click', () => this.addMessage());
        document.getElementById('guestMessage').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.addMessage();
        });
    }
}

const guestbookManager = new GuestbookManager();