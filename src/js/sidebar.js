// --- LEFT SIDEBAR MANAGEMENT ---

const sidebarMenu = document.getElementById('sidebar-menu');
const searchInput = document.getElementById('search-input');
let docsConfig = {};
let currentLang = 'en'; // Default, will be updated on init

// Function to create a single menu item or category
function createMenuItem(item) {
    const listItem = document.createElement('li');

    if (item.isCategory) {
        // It's a collapsible category
        listItem.classList.add('category');

        const button = document.createElement('button');
        button.className = 'w-full text-left py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-bold flex justify-between items-center';
        button.setAttribute('aria-expanded', 'false');

        const titleSpan = document.createElement('span');
        titleSpan.textContent = item.title;

        const icon = document.createElement('i');
        icon.className = 'fas fa-chevron-right transition-transform';

        button.appendChild(titleSpan);
        button.appendChild(icon);

        const sublist = document.createElement('ul');
        sublist.className = 'pl-4 mt-1 space-y-1 hidden';
        item.children.forEach(child => sublist.appendChild(createMenuItem(child)));

        button.addEventListener('click', () => {
            const isExpanded = sublist.classList.toggle('hidden');
            button.setAttribute('aria-expanded', !isExpanded);
            icon.classList.toggle('fa-chevron-down', !isExpanded);
            icon.classList.toggle('fa-chevron-right', isExpanded);
        });

        listItem.appendChild(button);
        listItem.appendChild(sublist);

    } else {
        // It's a direct link
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = item.title;
        link.dataset.file = item.file;
        link.className = 'block py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700';

        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Use the globally exposed loadDocument function
            if (window.loadDocument) {
                window.loadDocument(`docs/${currentLang}/${item.file}`);
            }
            // Update URL with the current page without reloading
            const url = new URL(window.location);
            url.searchParams.set('page', item.file);
            window.history.pushState({}, '', url);

            // Add active class styling
            document.querySelectorAll('#sidebar-menu a').forEach(a => a.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'font-bold'));
            link.classList.add('bg-gray-200', 'dark:bg-gray-700', 'font-bold');
        });
        listItem.appendChild(link);
    }

    return listItem;
}

// Function to build the entire sidebar menu from the config
function buildSidebar() {
    if (!sidebarMenu || !docsConfig[currentLang]) return;

    const menuList = document.createElement('ul');
    menuList.className = 'space-y-1';

    docsConfig[currentLang].forEach(item => {
        menuList.appendChild(createMenuItem(item));
    });

    sidebarMenu.innerHTML = '';
    sidebarMenu.appendChild(menuList);
}

// Function to handle search filtering
function filterSidebar() {
    const filterText = searchInput.value.toLowerCase();
    const categories = sidebarMenu.querySelectorAll('li.category');

    categories.forEach(category => {
        const links = category.querySelectorAll('a');
        let hasVisibleLink = false;

        links.forEach(link => {
            const text = link.textContent.toLowerCase();
            const listItem = link.closest('li');
            if (text.includes(filterText)) {
                listItem.style.display = '';
                hasVisibleLink = true;
            } else {
                listItem.style.display = 'none';
            }
        });

        if (hasVisibleLink) {
            category.style.display = '';
            if (filterText.length > 0) {
                const sublist = category.querySelector('ul');
                const button = category.querySelector('button');
                sublist.classList.remove('hidden');
                button.setAttribute('aria-expanded', 'true');
                button.querySelector('i').classList.replace('fa-chevron-right', 'fa-chevron-down');
            }
        } else {
            category.style.display = 'none';
        }
    });
}

// Main initialization function for the sidebar
export const initSidebar = async (lang) => {
    if (!sidebarMenu) return;
    currentLang = lang;

    try {
        const response = await fetch('docs.json');
        docsConfig = await response.json();
        buildSidebar();

        const urlParams = new URLSearchParams(window.location.search);
        const pageFile = urlParams.get('page');
        let docToLoadInfo = null;

        if (pageFile) {
            for (const category of docsConfig[currentLang]) {
                if (category.isCategory) {
                    docToLoadInfo = category.children.find(child => child.file === pageFile);
                    if (docToLoadInfo) break;
                } else if (category.file === pageFile) {
                    docToLoadInfo = category;
                    break;
                }
            }
        }

        if (!docToLoadInfo) {
            docToLoadInfo = docsConfig[currentLang]?.[0]?.children?.[0] || docsConfig[currentLang]?.[0];
            if (docToLoadInfo) {
                const url = new URL(window.location);
                url.searchParams.set('page', docToLoadInfo.file);
                window.history.replaceState({}, '', url);
            }
        }

        if (docToLoadInfo && window.loadDocument) {
            window.loadDocument(`docs/${currentLang}/${docToLoadInfo.file}`);
            const activeLink = sidebarMenu.querySelector(`a[data-file="${docToLoadInfo.file}"]`);
            if (activeLink) {
                activeLink.classList.add('bg-gray-200', 'dark:bg-gray-700', 'font-bold');
                const parentUl = activeLink.closest('ul');
                if (parentUl && parentUl.classList.contains('hidden')) {
                    const button = parentUl.previousElementSibling;
                    button.click();
                }
            }
        }

    } catch (error) {
        console.error("Failed to load or build sidebar:", error);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterSidebar);
    }
};