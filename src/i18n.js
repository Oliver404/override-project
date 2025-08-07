document.addEventListener('DOMContentLoaded', () => {
    const translations = {};
    let currentLanguage = 'en'; // Default language
    const languageSelector = document.getElementById('language-selector');

    const loadTranslations = async (lang) => {
        try {
            const response = await fetch(`src/locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            translations[lang] = await response.json();
        } catch (error) {
            console.error(error);
            // Fallback to English if the selected language fails to load
            if (lang !== 'en') {
                await loadTranslations('en');
                setLanguage('en');
            }
        }
    };

    const applyTranslations = () => {
        const lang = currentLanguage;
        if (!translations[lang]) {
            console.warn(`Translations for ${lang} not loaded yet.`);
            return;
        }
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
        document.documentElement.lang = lang;
        languageSelector.value = lang;
    };

    const setLanguage = async (lang) => {
        currentLanguage = lang;
        if (!translations[lang]) {
            await loadTranslations(lang);
        }
        applyTranslations();
        localStorage.setItem('language', lang); // Save language preference
    };

    const getInitialLanguage = () => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            return savedLanguage;
        }
        const browserLanguage = navigator.language.split('-')[0];
        const supportedLanguages = ['en', 'es', 'zh'];
        if (supportedLanguages.includes(browserLanguage)) {
            return browserLanguage;
        }
        return 'en'; // Default to English
    };

    const init = async () => {
        const initialLang = getInitialLanguage();
        await setLanguage(initialLang);

        languageSelector.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    };

    init();
});
