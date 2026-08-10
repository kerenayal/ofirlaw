(function () {
  "use strict";

  var STORAGE_KEY = "ofirlaw-a11y";
  var root = document.documentElement;
  var MIN_SCALE = 0.85;
  var MAX_SCALE = 1.45;
  var STEP = 0.1;

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function savePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {}
  }

  function applyPrefs(prefs) {
    root.style.setProperty("--font-scale", prefs.fontScale || 1);
    if (prefs.contrast) root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");
    if (prefs.underline) root.setAttribute("data-underline-links", "true");
    else root.removeAttribute("data-underline-links");
    if (prefs.motion) root.setAttribute("data-motion", "reduce");
    else root.removeAttribute("data-motion");
  }

  var prefs = Object.assign({ fontScale: 1, contrast: false, underline: false, motion: false }, loadPrefs());
  applyPrefs(prefs);

  document.addEventListener("DOMContentLoaded", function () {
    var widget = document.querySelector("[data-a11y-widget]");
    if (!widget) return;

    var toggle = widget.querySelector("[data-a11y-toggle]");
    var panel = widget.querySelector("[data-a11y-panel]");
    var increase = widget.querySelector("[data-a11y-increase]");
    var decrease = widget.querySelector("[data-a11y-decrease]");
    var resetFont = widget.querySelector("[data-a11y-reset-font]");
    var contrastBtn = widget.querySelector("[data-a11y-contrast]");
    var underlineBtn = widget.querySelector("[data-a11y-underline]");
    var motionBtn = widget.querySelector("[data-a11y-motion]");
    var resetAll = widget.querySelector("[data-a11y-reset-all]");
    var closeBtn = widget.querySelector("[data-a11y-close]");

    function refreshUI() {
      if (contrastBtn) contrastBtn.setAttribute("aria-pressed", String(!!prefs.contrast));
      if (underlineBtn) underlineBtn.setAttribute("aria-pressed", String(!!prefs.underline));
      if (motionBtn) motionBtn.setAttribute("aria-pressed", String(!!prefs.motion));
    }
    refreshUI();

    function update(partial) {
      prefs = Object.assign({}, prefs, partial);
      applyPrefs(prefs);
      savePrefs(prefs);
      refreshUI();
    }

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var isOpen = panel.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }
    if (closeBtn && panel && toggle) {
      closeBtn.addEventListener("click", function () {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      });
    }
    if (increase) {
      increase.addEventListener("click", function () {
        update({ fontScale: Math.min(MAX_SCALE, Math.round((prefs.fontScale + STEP) * 100) / 100) });
      });
    }
    if (decrease) {
      decrease.addEventListener("click", function () {
        update({ fontScale: Math.max(MIN_SCALE, Math.round((prefs.fontScale - STEP) * 100) / 100) });
      });
    }
    if (resetFont) {
      resetFont.addEventListener("click", function () {
        update({ fontScale: 1 });
      });
    }
    if (contrastBtn) {
      contrastBtn.addEventListener("click", function () {
        update({ contrast: !prefs.contrast });
      });
    }
    if (underlineBtn) {
      underlineBtn.addEventListener("click", function () {
        update({ underline: !prefs.underline });
      });
    }
    if (motionBtn) {
      motionBtn.addEventListener("click", function () {
        update({ motion: !prefs.motion });
      });
    }
    if (resetAll) {
      resetAll.addEventListener("click", function () {
        update({ fontScale: 1, contrast: false, underline: false, motion: false });
      });
    }
  });
})();
