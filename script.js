(function () {
  "use strict";

  var LANG_KEY = "nl-lang";
  var TAB_KEY = "nl-tab";

  /* ---------- Language ---------- */

  function detectLang() {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved === "es" || saved === "en") return saved;
    var nav = (navigator.language || "es").toLowerCase();
    return nav.indexOf("en") === 0 ? "en" : "es";
  }

  function applyLang(lang) {
    document.querySelectorAll("[data-es][data-en]").forEach(function (el) {
      var value = el.getAttribute("data-" + lang);
      if (value == null) return;
      if (el.tagName === "META") el.setAttribute("content", value);
      else el.textContent = value;
    });
    // Swap hrefs for links that point to a per-language target (e.g. the CV).
    document.querySelectorAll("[data-es-href][data-en-href]").forEach(function (el) {
      var href = el.getAttribute("data-" + lang + "-href");
      if (href) el.setAttribute("href", href);
    });
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll(".lang-opt").forEach(function (opt) {
      opt.classList.toggle("active", opt.getAttribute("data-lang") === lang);
    });
    localStorage.setItem(LANG_KEY, lang);
  }

  /* ---------- Tabs ---------- */

  function applyTab(name) {
    var tabs = document.querySelectorAll(".tab");
    var valid = false;
    tabs.forEach(function (t) {
      if (t.getAttribute("data-tab") === name) valid = true;
    });
    if (!valid) name = "about";

    tabs.forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-tab") === name);
    });
    document.querySelectorAll(".panel").forEach(function (p) {
      p.hidden = p.id !== "panel-" + name;
    });
    localStorage.setItem(TAB_KEY, name);
  }

  function initialTab() {
    var hash = (location.hash || "").replace("#", "");
    if (hash && document.getElementById("panel-" + hash)) return hash;
    return localStorage.getItem(TAB_KEY) || "about";
  }

  /* ---------- Boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    var lang = detectLang();
    applyLang(lang);

    var toggle = document.getElementById("lang-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        lang = lang === "es" ? "en" : "es";
        applyLang(lang);
      });
    }

    applyTab(initialTab());
    document.querySelectorAll(".tab").forEach(function (t) {
      t.addEventListener("click", function () {
        applyTab(t.getAttribute("data-tab"));
      });
    });

    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
