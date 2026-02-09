const TRANSLATION_PATH = 'i18n/translations.json';

const getStoredLanguage = () => {
  try {
    return localStorage.getItem('tqhcfr_lang');
  } catch {
    return null;
  }
};

const setStoredLanguage = (lang) => {
  try {
    localStorage.setItem('tqhcfr_lang', lang);
  } catch {
    // ignore storage errors
  }
};

const setToggleLabel = (lang) => {
  const toggle = document.querySelector('#langToggle');
  if (!toggle) {
    return;
  }
  toggle.textContent = lang === 'en' ? 'FI' : 'EN';
};

const applyTranslations = (dictionary, lang) => {
  const translations = dictionary[lang] || {};

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (!key) {
      return;
    }
    const text = translations[key];
    if (typeof text === 'string') {
      node.textContent = text;
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    const attr = node.getAttribute('data-i18n-attr');
    if (!key || !attr) {
      return;
    }
    const text = translations[key];
    if (typeof text === 'string') {
      node.setAttribute(attr, text);
    }
  });

  document.documentElement.lang = lang;
  setToggleLabel(lang);
};

const initTranslations = async () => {
  let dictionary = {};
  try {
    const response = await fetch(TRANSLATION_PATH, { cache: 'no-store' });
    if (response.ok) {
      dictionary = await response.json();
    }
  } catch {
    dictionary = {};
  }

  const available = Object.keys(dictionary);
  const stored = getStoredLanguage();
  const fallback = available.includes('fi') ? 'fi' : available[0];
  let currentLang = stored && available.includes(stored) ? stored : fallback;

  if (!currentLang) {
    return;
  }

  applyTranslations(dictionary, currentLang);

  const toggle = document.querySelector('#langToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const nextLang = currentLang === 'en' ? 'fi' : 'en';
      if (!dictionary[nextLang]) {
        return;
      }
      currentLang = nextLang;
      setStoredLanguage(currentLang);
      applyTranslations(dictionary, currentLang);
    });
  }
};

document.addEventListener('DOMContentLoaded', initTranslations);
