import { ref } from 'vue';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import DOMPurify from 'dompurify';
import mdFootnote from 'markdown-it-footnote';

// Initialize markdown-it with plugins
const md = new MarkdownIt({
  html: true, // Enable HTML tags in source
  linkify: true, // Autoconvert URL-like text to links
  typographer: true, // Enable some language-neutral replacement + quotes beautification
  highlight: function (str, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return `<pre class="language-${lang}"><code>${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>`;
      } catch (__) {}
    }
    // Fallback for no language or error
    return `<pre class="language-none"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
}).use(mdFootnote);

export function useMarkdown() {
  const renderedContent = ref('');
  const isLoading = ref(false);
  const error = ref(null);

  const renderMarkdown = async (filePath) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`File not found: ${filePath}`);

      const markdown = await response.text();

      // Render and sanitize
      const rawHtml = md.render(markdown);
      renderedContent.value = DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['id', 'target'] });

    } catch (e) {
      console.error('Markdown rendering error:', e);
      error.value = e.message;
      renderedContent.value = `<p class="text-red-500">Failed to load documentation: ${e.message}</p>`;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    renderedContent,
    isLoading,
    error,
    renderMarkdown
  };
}