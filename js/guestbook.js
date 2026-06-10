class GuestbookManager {
    constructor() {
        this.messages = [];
        this.init();
    }

    init() {
        // [v2] localStorage first, API sync in background
        this.loadMessages();
        this.trySyncFromAPI();
        this.bindEvents();
    }

    loadMessages() {
        var saved = localStorage.getItem('zeaple_guestbook');
        if (saved) {
            this.messages = JSON.parse(saved);
        } else {
            this.messages = [];
            this.saveMessages();
        }
        this.renderMessages();
    }

    saveMessages() {
        localStorage.setItem('zeaple_guestbook', JSON.stringify(this.messages));
    }

    trySyncFromAPI() {
        var self = this;
        fetch('api/messages').then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('API not available');
        }).then(function(apiMessages) {
            if (apiMessages.length > self.messages.length) {
                self.messages = apiMessages;
                self.saveMessages();
                self.renderMessages();
            }
        }).catch(function() {
            // API not available - use localStorage only
        });
    }

    trySyncToAPI(name, text) {
        fetch('api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, text: text })
        }).catch(function() {
            // API not available - that's fine
        });
    }

    renderMessages() {
        var container = document.getElementById('guestbookMessages');

        if (this.messages.length === 0) {
            container.innerHTML = '<div class="guestbook-empty">' +
                '<i class="fas fa-comment-dots"></i>' +
                '<p>还没有留言，来说点什么吧！</p>' +
                '</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < this.messages.length; i++) {
            var msg = this.messages[i];
            html += '<div class="guestbook-message">' +
                '<div class="msg-header">' +
                '<span class="msg-name"><i class="fas fa-user-circle"></i> ' + msg.name + '</span>' +
                '<span class="msg-time">' + msg.time + '</span>' +
                '</div>' +
                '<div class="msg-text">' + msg.text + '</div>' +
                '</div>';
        }
        container.innerHTML = html;
    }

    addMessage() {
        var nameInput = document.getElementById('guestName');
        var msgInput = document.getElementById('guestMessage');
        var name = nameInput.value.trim();
        var text = msgInput.value.trim();

        if (!name) { alert('请输入你的名字！'); return; }
        if (!text) { alert('请输入留言内容！'); return; }

        var now = new Date();
        var timeStr = now.toLocaleDateString('zh-CN') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');

        var newMsg = {
            id: Date.now(),
            name: name,
            text: text,
            time: timeStr
        };

        this.messages.unshift(newMsg);
        this.saveMessages();
        this.renderMessages();

        this.trySyncToAPI(name, text);

        nameInput.value = '';
        msgInput.value = '';
    }

    bindEvents() {
        var self = this;
        document.getElementById('submitGuestMsg').addEventListener('click', function() {
            self.addMessage();
        });
        document.getElementById('guestMessage').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) self.addMessage();
        });
    }
}

var guestbookManager = new GuestbookManager();