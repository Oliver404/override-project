// --- RIGHT TOC SIDEBAR MANAGEMENT ---

const tocMenu = document.getElementById('toc-menu');
const documentationContent = document.getElementById('documentation-content');
let headingElements = [];

// Function to build the Table of Contents from H2/H3 headings
function buildToc() {
    if (!tocMenu || !documentationContent) return;

    tocMenu.innerHTML = '';
    headingElements = Array.from(documentationContent.querySelectorAll('h2, h3'));

    if (headingElements.length === 0) return;

    const tocList = document.createElement('ul');
    tocList.className = 'space-y-2';

    headingElements.forEach(h => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${h.id}`;
        link.textContent = h.textContent;
        link.className = `block text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${h.tagName === 'H3' ? 'ml-4' : ''}`;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            h.scrollIntoView({ behavior: 'smooth' });
        });

        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });

    tocMenu.appendChild(tocList);
}

// Scroll spy functionality to highlight the active TOC link
function scrollSpy() {
    if (headingElements.length === 0) return;

    let current = '';
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                current = entry.target.id;
            }
        });

        tocMenu.querySelectorAll('a').forEach(a => {
            a.classList.toggle('font-bold', a.hash === `#${current}`);
            a.classList.toggle('text-blue-600', a.hash === `#${current}`);
            a.classList.toggle('dark:text-blue-400', a.hash === `#${current}`);
        });

    }, { threshold: 0.5, rootMargin: "-50% 0px -50% 0px" });

    headingElements.forEach(h => observer.observe(h));
}

// Main initialization function for the TOC
export const initToc = () => {
    buildToc();
    scrollSpy();
};