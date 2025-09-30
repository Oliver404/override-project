// Function to create and inject the header
const createHeader = () => {
    const headerHTML = `
        <header class="bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg p-4 sticky top-0 z-50">
            <nav class="container mx-auto flex justify-between items-center">
                <a href="index.html" class="text-2xl font-bold text-white">Override Project</a>
                <div class="flex items-center space-x-4">
                    <a href="index.html" class="text-gray-300 hover:text-white transition-colors">Home</a>
                    <a href="documentation.html" class="text-gray-300 hover:text-white transition-colors">Documentation</a>
                    <button id="theme-toggle" class="text-gray-300 hover:text-white transition-colors">
                        <i class="fas fa-sun"></i>
                    </button>
                </div>
            </nav>
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
};

// Function to handle theme toggling
const themeHandler = () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Set initial theme from localStorage or system preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        html.classList.remove('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
};

// Wait for the DOM to be fully loaded before creating the header and setting up the theme handler
document.addEventListener('DOMContentLoaded', () => {
    createHeader();
    themeHandler();
});