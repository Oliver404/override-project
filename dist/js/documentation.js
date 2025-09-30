document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOpen = document.getElementById('sidebar-open');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const documentationContent = document.getElementById('documentation-content');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    const converter = new showdown.Converter({ ghCompatibleHeaderId: true });
    let searchIndex;
    const documents = {};
    let currentDoc = '';

    // List of documentation files
    const docFiles = [
        'docs/getting-started.md'
    ];

    // Function to generate a slug for a header
    const slugify = (text) => {
        return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    };

    // Fetch and load a document
    const loadDocument = async (file, anchor) => {
        try {
            const response = await fetch(file);
            const markdown = await response.text();
            documents[file] = markdown; // Store the document content
            documentationContent.innerHTML = converter.makeHtml(markdown);
            currentDoc = file;

            if (anchor) {
                setTimeout(() => {
                    const element = document.getElementById(anchor);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        } catch (error) {
            documentationContent.innerHTML = `<p class="text-red-500">Error loading document: ${file}</p>`;
            console.error(error);
        }
    };

    // Build the sidebar menu
    const buildSidebar = async () => {
        const menuList = document.createElement('ul');
        menuList.className = 'space-y-2';

        for (const file of docFiles) {
            const listItem = document.createElement('li');
            const response = await fetch(file);
            const markdown = await response.text();
            const title = file.replace('docs/', '').replace('.md', '');

            const fileButton = document.createElement('button');
            fileButton.textContent = title;
            fileButton.className = 'w-full text-left py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-bold flex justify-between items-center';

            const sublist = document.createElement('ul');
            sublist.className = 'pl-4 mt-2 space-y-1 hidden';

            const headers = markdown.match(/^##\s(.+)/gm);
            if (headers) {
                headers.forEach(header => {
                    const headerText = header.replace('## ', '');
                    const anchor = slugify(headerText);
                    const subItem = document.createElement('li');
                    const subLink = document.createElement('a');
                    subLink.href = `#${anchor}`;
                    subLink.textContent = headerText;
                    subLink.className = 'block py-1 px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700';
                    subLink.addEventListener('click', async (e) => {
                        e.preventDefault();
                        if (currentDoc !== file) {
                            await loadDocument(file, anchor);
                        } else {
                            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                    subItem.appendChild(subLink);
                    sublist.appendChild(subItem);
                });
            }

            fileButton.addEventListener('click', async () => {
                if (currentDoc !== file) {
                    await loadDocument(file);
                }
                sublist.classList.toggle('hidden');
            });

            listItem.appendChild(fileButton);
            listItem.appendChild(sublist);
            menuList.appendChild(listItem);
        }
        sidebarMenu.appendChild(menuList);
    };

    // Build the search index
    const buildSearchIndex = async () => {
        const fetchPromises = docFiles.map(file =>
            fetch(file).then(response => response.text()).then(text => ({
                id: file,
                title: file.replace('docs/', '').replace('.md', ''),
                body: text
            }))
        );

        const docs = await Promise.all(fetchPromises);
        docs.forEach(doc => {
            documents[doc.id] = doc.body;
        });

        searchIndex = lunr(function () {
            this.ref('id');
            this.field('title');
            this.field('body');

            docs.forEach(doc => {
                this.add(doc);
            });
        });
    };

    // Handle search input
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        const results = searchIndex.search(query);
        searchResults.innerHTML = '';

        if (results.length > 0) {
            const resultList = document.createElement('ul');
            results.forEach(result => {
                const docId = result.ref;
                const title = docId.replace('docs/', '').replace('.md', '');
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = title;
                link.className = 'block py-1 px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700';
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadDocument(docId);
                    searchResults.innerHTML = '';
                    searchInput.value = '';
                });
                listItem.appendChild(link);
                resultList.appendChild(listItem);
            });
            searchResults.appendChild(resultList);
        } else {
            searchResults.innerHTML = '<p class="p-2">No results found.</p>';
        }
    });

    // Toggle sidebar visibility
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.add('hidden');
        sidebarOpen.classList.remove('hidden');
    });

    sidebarOpen.addEventListener('click', () => {
        sidebar.classList.remove('hidden');
        sidebarOpen.classList.add('hidden');
    });

    // Initialize documentation page
    const init = async () => {
        await buildSidebar();
        await buildSearchIndex();
        await loadDocument(docFiles[0]); // Load the first document by default
    };

    init();
});