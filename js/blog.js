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
        this.posts = [];
        const saved = localStorage.getItem('zeaple_blog_posts');
        if (saved) {
            this.posts = JSON.parse(saved);
        }
        if (this.posts.length === 0) {
            this.posts = [
                {
                    id: Date.now() + 1,
                    title: '逐点牛顿迭代',
                    category: 'algorithm',
                    content: `实际上是 [P10461](https://www.luogu.com.cn/problem/P10461) 题解。

给定形式幂级数 $f$ 和集合幂级数 $G$，求 $F=f(G)$，保证 $[x^{\\emptyset}]G=0$，所以 $f$ 只有 $0\\sim n$ 次有用。

想法很高妙啊，先做 FWT，乘法变成 OR 卷积。把 $x^S$ 写成 $\\prod\\limits_{i\\in S}x_i$，求出 $[x_n^1]F$，然后 $G$ 就可以变成 $[x_n^0]G$ 了。对两边求 $x_n$ 的偏导，**不能直接应用链式法则，因为我们是在模 $x^2_i-x_i$ 的环上操作**，合理的做法是将 $f(G)$ 写成 $f(A+Bx_n)$，其中 $AB$ 均不含 $x_n$，泰勒展开得到 $f(A)+f'(A)Bx_n$，高阶项均被截断。对这个式子求导得到 $[x_n^1]F=[x_n^0]f'(G)\\times[x_n^1]G$。$f'(G)$ 只需保留不含 $x_n$ 的项。

从 $x_1$ 递推到 $x_n$，每次求出这一层的 $f^{(0)}(G_i),f^{(1)}(G_i),f^{(2)}(G_i),\\cdots,f^{(n-i)}(G_i)$。到下一层时通过上一层的信息递推，$[x_{i+1}^0]f^{(k)}(G_{i+1})=f^{(k)}(G_i)$，$[x_{i+1}^1]f^{(k+1)}(G_{i+1})=f^{k+1}(G_i)\\times[x_{i+1}^1]G_i$。

第 $i$ 层需要做规模为 $i-1$ 的卷积 $n-i+1$ 次，时间复杂度 $O(\\sum\\limits_{i=1}^n(n-i+1)2^{i-1}(i-1)^2)=O(n^22^n)$。`,
                    date: '2026-06-15'
                },
                {
                    id: Date.now(),
                    title: 'APIO 反思',
                    category: 'contest',
                    content: `一些事情，与另一些事情。

大概在进省队前，我认为我的长项在非传统和计数，周围有些人也这么认为。省选没有计数（d1t1 算吗？我不知道），只有一个签到交互，不过我还是凭借 d1t2 d1t3 d2t3 翻进队了。二轮省集时我用很厉害的做法通过了一个困难计数题，之前模拟赛也常常通过一些很不平凡的计数，这给我一种想法：NOI 看上去不会考计数，即使考了，我也有足够的水平应付，现在应该将训练重心放到最优化、非传统和构造上。同样是二轮省集，有一天我斩获 $100+80+80$，T1 是构造题，T2 需要分析性质，这种场次我一般都会爆掉，不过那天出奇的顺利，于是产生了一种错觉：我应当已经具备不低的水平，达到了历史最大值。

APIO 前我登顶了香山，在山顶写了个 "win"。很难说当时想赢的是什么，赢 APIO，赢 NOI，还有呢？比赛日我 4:30 就醒了，由于那个酒店实在令人难以获得舒适的睡眠，我开始打三国杀，打了一会，又睡了一会，就该出发了。到学校以后离进场还有很长时间，所以咖啡早早就喝完了。场上我其实获得了正确的开题顺序，但是在 T2 上花费了很长时间才获得大家都有的 $56$ 分，只凭 $<$ 和 $>$ 只有一次 $1$ bit 信息，sub4 需要做到一次 $\\sim1.5$ bit 的样子，于是我开始思考 $=$ 的作用，得出了惊人的结论：如果返回了 $0$，必然可以直接得到答案。这显然是错的，因为我所有的思考都建立在了自己已经知道了蛋糕的位置，导致后面的思考也全错了。幸运的是 ，我意识到这么做下去大概是做不出来的，因为将 $56$ 分做法优化掉一次询问就已经十分困难了。

T1，开场我就做出了 $w_i\\to w_i-1$ 的转化，同时对性质 B 做出了 $w_i\\to\\frac1{w_i}$ 的转化，进而得到一个延迟钦定做法，但当时我认为这个做法没法转移，或者转移复杂度太高，导致直到最后我也只会 $35+15$，$15$ 分是 $n\\leq50$ 时状压等价类转移，也不一定能过。T3，存在一个时刻我得到了性质 B 的正确做法，但后面我想错了一点东西，导致认为这个做法是错的。更有趣的事实是，省集时我尝试学习了树上圆理论但没学明白，不过做不出这个题也不怪我。

$139$ 也是我 WC2025 的得分，当时场上 catfood 做了三个小时才做明白。社会实践时并没有很玉玉，起码拿到了第一块 Cu。真正把我爆了的是另一件事情，在这不多说了。

这样看来我在之前作出的所有推断都是错的，我真的会非传统和计数吗？省选 day2 我是靠写了半场 T3 暴力进的队，APIO 唯一一个拿到非大众分的题也是 T3，是否说明我只会在别人不想写的 ds 题上写一大堆暴力？对 ascend 和 cake 的束手无策如果放到 NOI 上会怎么样？

前几天玉玉症的时候，Anonyme 表示"进队就别叫了"。我尝试拟合出一个函数，输入是一个人，输出是 $01$，代表他该不该叫。最后发现不存在这样一个普适的函数，每个人都会认为处境恰好比自己高一级的人不配叫。这样看来还是应该和处境差不多的人玉玉症。

好晚，另一些事情以后再写，吗？`,
                    date: '2026-06-10'
                }
            ];
            this.savePosts();
        }
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
        
        // Protect LaTeX math from markdown processing
        let html = this.renderContent(post.content);
        contentDiv.innerHTML = html;

        // Render LaTeX with KaTeX
        if (window.renderMathInElement) {
            renderMathInElement(contentDiv, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }

        modal.classList.add('active');
    }

    // Preprocess content: protect math from markdown, then render markdown
    renderContent(content) {
        // Extract and protect math expressions
        const blocks = [];
        let processed = content;
        
        // Protect display math $$...$$
        processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner) => {
            blocks.push(match);
            return `%%MATHBLOCK${blocks.length - 1}%%`;
        });
        
        // Protect inline math $...$
        processed = processed.replace(/\$([^\n$]*?)\$/g, (match, inner) => {
            blocks.push(match);
            return `%%MATHBLOCK${blocks.length - 1}%%`;
        });

        // Now safe to render markdown
        let html;
        if (window.marked) {
            html = window.marked.parse(processed);
        } else {
            html = processed.replace(/\n/g, '<br>');
        }

        // Restore math blocks
        html = html.replace(/%%MATHBLOCK(\d+)%%/g, (match, index) => {
            return blocks[parseInt(index)] || match;
        });

        return html;
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