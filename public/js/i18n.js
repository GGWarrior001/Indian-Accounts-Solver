(function() {
  const STORAGE_KEY = 'app_lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = ['en', 'hi', 'kn', 'ta', 'te', 'bn'];
  const LOCALES_BASE = '/locales';

  const localeCache = {};
  let currentLang = DEFAULT_LANG;
  let enMessages = {};
  let activeMessages = {};

  function normalizeLang(lang) {
    if (!lang || typeof lang !== 'string') return DEFAULT_LANG;
    const baseLang = lang.toLowerCase().split('-')[0];
    return SUPPORTED_LANGS.includes(baseLang) ? baseLang : DEFAULT_LANG;
  }

  function getBrowserLang() {
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
      return normalizeLang(navigator.languages[0]);
    }
    return normalizeLang(navigator.language || DEFAULT_LANG);
  }

  async function fetchLocale(lang) {
    if (localeCache[lang]) {
      return localeCache[lang];
    }

    try {
      const response = await fetch(LOCALES_BASE + '/' + lang + '.json', { cache: 'default' });
      if (!response.ok) throw new Error('Failed locale request');
      const data = await response.json();
      const parsed = (data && typeof data === 'object') ? data : {};
      localeCache[lang] = parsed;
      return parsed;
    } catch (err) {
      console.warn('i18n: locale load failed for', lang, err);
      localeCache[lang] = {};
      return localeCache[lang];
    }
  }

  function applyTranslations() {
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(function(node) {
      const key = node.getAttribute('data-i18n');
      node.textContent = t(key);
    });

    const optionNodes = document.querySelectorAll('#lang-switcher option[data-i18n]');
    optionNodes.forEach(function(optionNode) {
      const key = optionNode.getAttribute('data-i18n');
      const translated = t(key);
      optionNode.label = translated;
      optionNode.textContent = translated;
    });

    const ariaNodes = document.querySelectorAll('[data-i18n-aria-label]');
    ariaNodes.forEach(function(node) {
      const key = node.getAttribute('data-i18n-aria-label');
      node.setAttribute('aria-label', t(key));
    });
  }

  function syncLanguageSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;
    switcher.value = currentLang;
  }

  async function loadLanguage(lang) {
    if (!Object.keys(enMessages).length) {
      enMessages = await fetchLocale(DEFAULT_LANG);
    }

    const normalized = normalizeLang(lang);
    const target = normalized === DEFAULT_LANG ? enMessages : await fetchLocale(normalized);

    currentLang = normalized;
    activeMessages = Object.assign({}, enMessages, target);
    document.documentElement.setAttribute('lang', currentLang);
    applyTranslations();
    syncLanguageSwitcher();
  }

  async function setLanguage(lang) {
    const next = normalizeLang(lang);
    localStorage.setItem(STORAGE_KEY, next);
    await loadLanguage(next);
  }

  function t(key) {
    if (!key) return '';
    if (Object.prototype.hasOwnProperty.call(activeMessages, key)) {
      return activeMessages[key];
    }
    if (Object.prototype.hasOwnProperty.call(enMessages, key)) {
      return enMessages[key];
    }
    return key;
  }

  function attachLanguageSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;

    switcher.addEventListener('change', function(event) {
      setLanguage(event.target.value);
    });

    switcher.addEventListener('keydown', function(event) {
      const currentIndex = SUPPORTED_LANGS.indexOf(switcher.value);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % SUPPORTED_LANGS.length;
        switcher.value = SUPPORTED_LANGS[nextIndex];
        setLanguage(switcher.value);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const nextIndex = (currentIndex - 1 + SUPPORTED_LANGS.length) % SUPPORTED_LANGS.length;
        switcher.value = SUPPORTED_LANGS[nextIndex];
        setLanguage(switcher.value);
      } else if (event.key === 'Home') {
        event.preventDefault();
        switcher.value = SUPPORTED_LANGS[0];
        setLanguage(switcher.value);
      } else if (event.key === 'End') {
        event.preventDefault();
        switcher.value = SUPPORTED_LANGS[SUPPORTED_LANGS.length - 1];
        setLanguage(switcher.value);
      }
    });
  }

  async function init() {
    attachLanguageSwitcher();

    const stored = localStorage.getItem(STORAGE_KEY);
    const resolvedLang = stored ? normalizeLang(stored) : getBrowserLang();
    await loadLanguage(resolvedLang || DEFAULT_LANG);
  }

  window.i18n = {
    init: init,
    setLanguage: setLanguage,
    t: t
  };
})();
