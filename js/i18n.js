(function () {
  const STORAGE_KEY = 'mrav_lang';
  const DEFAULT_LANG = 'hr';
  let translations = {};

  async function loadTranslations() {
    try {
      const res = await fetch('js/i18n.json');
      translations = await res.json();
    } catch (e) {
      console.warn('i18n: failed to load translations', e);
    }
  }

  function applyLang(lang) {
    const t = translations[lang] || translations[DEFAULT_LANG];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function initSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.dataset.lang);
      });
    });
  }

  async function init() {
    await loadTranslations();
    const savedLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    initSwitcher();
    applyLang(savedLang);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
