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
      const response = await fetch(`${LOCALES_BASE}/${lang}.json`, { cache: 'default' });
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

    const ariaNodes = document.querySelectorAll('[data-i18n-aria-label]');
    ariaNodes.forEach(function(node) {
      const key = node.getAttribute('data-i18n-aria-label');
      node.setAttribute('aria-label', t(key));
    });
  }

  function syncLanguageSwitcher() {
    const label = document.getElementById('lang-switcher-label');
    const optionNodes = document.querySelectorAll('#lang-switcher-list [role="option"]');
    if (!label || !optionNodes.length) return;

    label.textContent = t('language.' + currentLang);
    optionNodes.forEach(function(node) {
      const selected = node.getAttribute('data-lang') === currentLang;
      node.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  async function loadLanguage(lang) {
    if (!Object.keys(enMessages).length) {
      enMessages = await fetchLocale(DEFAULT_LANG);
    }

    const normalized = normalizeLang(lang);
    const target = normalized === DEFAULT_LANG ? enMessages : await fetchLocale(normalized);

    currentLang = normalized;
    activeMessages = { ...enMessages, ...target };
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
    const switcherButton = document.getElementById('lang-switcher-btn');
    const switcherList = document.getElementById('lang-switcher-list');
    const optionNodes = Array.prototype.slice.call(document.querySelectorAll('#lang-switcher-list [role="option"]'));
    if (!switcherButton || !switcherList || !optionNodes.length) return;

    function setExpanded(expanded) {
      switcherButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      switcherList.hidden = !expanded;
      if (!expanded) return;

      const selectedNode = optionNodes.find(function(node) {
        return node.getAttribute('data-lang') === currentLang;
      }) || optionNodes[0];

      selectedNode.focus();
    }

    function chooseLanguage(lang) {
      setLanguage(lang).catch(function(err) {
        console.warn('i18n: failed to switch language', err);
      });
    }

    function moveOptionFocus(step) {
      const activeEl = document.activeElement;
      const currentIndex = optionNodes.indexOf(activeEl);
      const safeIndex = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex = (safeIndex + step + optionNodes.length) % optionNodes.length;
      optionNodes[nextIndex].focus();
    }

    switcherButton.addEventListener('click', function() {
      const expanded = switcherButton.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
    });

    switcherButton.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setExpanded(true);
      }
    });

    switcherList.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveOptionFocus(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveOptionFocus(-1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        optionNodes[0].focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        optionNodes[optionNodes.length - 1].focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const activeEl = document.activeElement;
        const lang = activeEl && activeEl.getAttribute('data-lang');
        if (lang) {
          chooseLanguage(lang);
          setExpanded(false);
          switcherButton.focus();
        }
      } else if (event.key === 'Escape') {
        setExpanded(false);
        switcherButton.focus();
      }
    });

    optionNodes.forEach(function(node) {
      node.addEventListener('click', function() {
        chooseLanguage(node.getAttribute('data-lang'));
        setExpanded(false);
        switcherButton.focus();
      });
    });

    document.addEventListener('click', function(event) {
      if (!switcherButton.contains(event.target) && !switcherList.contains(event.target)) {
        setExpanded(false);
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
