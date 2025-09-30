document.addEventListener('DOMContentLoaded', async () => {
    // --- DOM Elements ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOpen = document.getElementById('sidebar-open');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const documentationContent = document.getElementById('documentation-content');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const tocMenu = document.getElementById('toc-menu');
    const breadcrumbsContainer = document.getElementById('breadcrumbs');
    const lastUpdatedDate = document.getElementById('last-updated-date');

    // Check if we are on the documentation page
    if (!documentationContent) return;

    // --- State ---
    const currentLang = getLanguage(); // From app.js
    let docsConfig = {};
    let searchIndex;
    let documents = {};
    let currentDocInfo = {};
    let translations = {};

    // --- Showdown and Prism Setup ---
    const converter = new showdown.Converter({ ghCompatibleHeaderId: true, tables: true, simplifiedAutoLink: true });

    // --- Document Loading and Rendering ---
    const loadDocument = async (docInfo) => {
        if (!docInfo || !docInfo.file) return;
        currentDocInfo = docInfo;
        const filePath = `docs/${currentLang}/${docInfo.file}`;

        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
            const markdown = await response.text();

            // Render Markdown and update content
            documentationContent.innerHTML = converter.makeHtml(markdown);

            // Post-render actions
            Prism.highlightAllUnder(documentationContent);
            updateBreadcrumbs();
            buildToc();
            updateFooter();

            // Update active state in sidebar
            document.querySelectorAll('#sidebar-menu a').forEach(a => {
                a.classList.toggle('font-bold', a.dataset.file === docInfo.file);
                a.classList.toggle('bg-gray-200', a.dataset.file === docInfo.file);
                a.classList.toggle('dark:bg-gray-700', a.dataset.file === docInfo.file);
            });

        } catch (error) {
            console.error(`Error loading document: ${filePath}`, error);
            documentationContent.innerHTML = `<p class="text-red-500">Error loading document. Please check the console for details.</p>`;
        }
    };

    // --- UI Building (Sidebar, TOC, Breadcrumbs, Footer) ---
    const buildSidebar = () => {
        const docList = docsConfig[currentLang] || [];
        const menuList = document.createElement('ul');
        menuList.className = 'space-y-1';

        docList.forEach(docInfo => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = docInfo.title;
            link.dataset.file = docInfo.file;
            link.className = 'block py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadDocument(docInfo);
                if (window.innerWidth < 768) sidebar.classList.add('hidden');
            });
            listItem.appendChild(link);
            menuList.appendChild(listItem);
        });
        sidebarMenu.innerHTML = '';
        sidebarMenu.appendChild(menuList);
    };

    const buildToc = () => {
        tocMenu.innerHTML = '';
        const headings = documentationContent.querySelectorAll('h2, h3');
        if (headings.length === 0) return;

        const tocList = document.createElement('ul');
        tocList.className = 'space-y-2';

        headings.forEach(h => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${h.id}`;
            link.textContent = h.textContent;
            link.className = `block text-sm hover:text-blue-600 dark:hover:text-blue-400 ${h.tagName === 'H3' ? 'ml-4' : ''}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                h.scrollIntoView({ behavior: 'smooth' });
            });
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        tocMenu.appendChild(tocList);
    };

    const updateBreadcrumbs = () => {
        breadcrumbsContainer.innerHTML = `
            <a href="documentation.html" class="hover:underline">${translations.docs || 'Docs'}</a>
            <span class="mx-2">/</span>
            <span>${currentDocInfo.title}</span>
        `;
    };

    const updateFooter = () => {
        lastUpdatedDate.textContent = new Date().toLocaleDateString(currentLang, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    // --- Search ---
    const buildSearchIndex = async () => {
        const docList = docsConfig[currentLang] || [];
        const fetchPromises = docList.map(docInfo =>
            fetch(`docs/${currentLang}/${docInfo.file}`)
                .then(res => res.text())
                .then(text => {
                    const doc = { id: docInfo.file, title: docInfo.title, body: text };
                    documents[doc.id] = doc;
                    return doc;
                })
        );
        const docs = await Promise.all(fetchPromises);
        searchIndex = lunr(function () {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('body');
            docs.forEach(doc => this.add(doc));
        });
    };

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        const results = searchIndex.search(query);
        searchResults.innerHTML = '';
        if (results.length > 0) {
            const resultList = document.createElement('ul');
            results.slice(0, 5).forEach(result => {
                const doc = documents[result.ref];
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = doc.title;
                link.className = 'block p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700';
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadDocument(doc);
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                });
                listItem.appendChild(link);
                resultList.appendChild(listItem);
            });
            searchResults.appendChild(resultList);
        } else {
            searchResults.innerHTML = `<p class="p-2 text-sm">${translations.no_results || 'No results found.'}</p>`;
        }
    });

    // --- Event Listeners and Initialization ---
    const setupEventListeners = () => {
        sidebarToggle?.addEventListener('click', () => sidebar.classList.add('hidden'));
        sidebarOpen?.addEventListener('click', () => sidebar.classList.remove('hidden'));

        let activeTocLink = null;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const tocLink = tocMenu.querySelector(`a[href="#${id}"]`);
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    tocLink?.classList.add('font-bold');
                    activeTocLink = tocLink;
                } else {
                    tocLink?.classList.remove('font-bold');
                }
            });
        }, { rootMargin: "0px 0px -80% 0px", threshold: 0.5 });

        documentationContent.querySelectorAll('h2, h3').forEach(h => observer.observe(h));
    };

    const init = async () => {
        try {
            const [trans, config] = await Promise.all([
                loadTranslations(currentLang),
                fetch('docs.json').then(res => res.json())
            ]);
            translations = trans;
            docsConfig = config;
        } catch (error) {
            console.error("Failed to load initial configuration", error);
            documentationContent.innerHTML = '<p class="text-red-500">Could not load documentation configuration (docs.json).</p>';
            return;
        }

        buildSidebar();
        await buildSearchIndex();

        const initialDoc = (docsConfig[currentLang] && docsConfig[currentLang][0]) || null;
        if (initialDoc) {
            await loadDocument(initialDoc);
        } else {
            documentationContent.innerHTML = `<p>No documentation available for ${currentLang}.</p>`;
        }
        setupEventListeners();
    };

    init();
});