// --- INTERNATIONALIZATION (i18n) MANAGEMENT ---

// Function to get the current language from localStorage or browser settings
export const getLanguage = () => {
    const lang = localStorage.getItem('language');
    // Ensure the language is supported, default to 'en'
    if (['en', 'es'].includes(lang)) return lang;
    return (navigator.language.split('-')[0] === 'es') ? 'es' : 'en';
};

// Function to load translation files for the given language
const loadTranslations = async (lang) => {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error('Translation file not found');
        return await response.json();
    } catch (error) {
        console.error(`Could not load translations for ${lang}. Falling back to English.`, error);
        // Fallback to English if the requested language file fails
        const response = await fetch(`locales/en.json`);
        return await response.json();
    }
};

// Function to apply the loaded translations to the UI
const applyTranslations = (translations) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) el.textContent = translations[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[key]) el.setAttribute('placeholder', translations[key]);
    });
};

// Main function to initialize i18n on any page
export const initializeI18n = async () => {
    const lang = getLanguage();
    const translations = await loadTranslations(lang);
    applyTranslations(translations);
    // Return the language and translations for other modules to use
    return { lang, translations };
};