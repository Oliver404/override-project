import showdown from 'showdown';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import footnotes from '@webdesigndecal/showdown-footnotes';
import { initToc } from './toc.js';

// --- MARKDOWN RENDERING MANAGEMENT ---

// Configure Showdown with all necessary extensions
const converter = new showdown.Converter({
    ghCompatibleHeaderId: true,
    tables: true,
    tasklists: true,
    strikethrough: true,
    simplifiedAutoLink: true,
    openLinksInNewWindow: true,
    emoji: true,
    extensions: [footnotes] // Correctly register the footnotes extension
});

const documentationContent = document.getElementById('documentation-content');
const lastUpdatedDate = document.getElementById('last-updated-date');

// Function to fetch and render a document
async function loadDocument(filePath) {
    if (!documentationContent) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to fetch document: ${response.statusText}`);

        const markdown = await response.text();

        // 1. Convert Markdown to HTML
        const rawHtml = converter.makeHtml(markdown);

        // 2. Sanitize HTML for security
        const cleanHtml = DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['id'] }); // Allow id for footnotes

        // 3. Render to the page
        documentationContent.innerHTML = cleanHtml;

        // 4. Highlight syntax in code blocks using the imported Prism
        Prism.highlightAllUnder(documentationContent);

        // 5. Initialize the Table of Contents for the new content
        initToc();

        // 6. Update the footer
        updateFooter();

    } catch (error) {
        console.error('Error loading document:', error);
        documentationContent.innerHTML = `<p class="text-red-500">Error: Could not load the requested document.</p>`;
    }
}

// Function to update the last updated date in the footer
function updateFooter() {
    if (lastUpdatedDate) {
        lastUpdatedDate.textContent = new Date().toLocaleDateString(navigator.language, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }
}

// Main initialization function for the documentation page
export const initDocs = (lang, translations) => {
    if (document.getElementById('documentation-content')) {
        console.log("Documentation page detected. Markdown module is ready.");
    }
};

// Expose loadDocument globally so the sidebar can call it
window.loadDocument = loadDocument;