(function () {
  "use strict";

  /* Header shrink-on-scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile nav */
  var hamburger = document.querySelector(".hamburger");
  var mobileNav = document.querySelector(".mobile-nav");
  var mobileNavClose = document.querySelector(".mobile-nav__close");
  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", openMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener("click", closeMobileNav);
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
  }

  /* Practice-areas dropdown (desktop hover/focus already handled by CSS;
     this adds click support for touch/keyboard, plus outside-click and
     Escape to close) */
  function closeAllDropdowns() {
    document.querySelectorAll(".has-dropdown.is-open").forEach(function (li) {
      li.classList.remove("is-open");
      var toggle = li.querySelector("[data-dropdown-toggle]");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }
  document.querySelectorAll("[data-dropdown-toggle]").forEach(function (btn) {
    var parentLi = btn.closest(".has-dropdown");
    if (!parentLi) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = !parentLi.classList.contains("is-open");
      closeAllDropdowns();
      if (willOpen) {
        parentLi.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
  document.addEventListener("click", closeAllDropdowns);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllDropdowns();
  });

  /* CSS opens the dropdown on :focus-within alone (for keyboard users
     tabbing through), independent of the click/is-open state above —
     keep aria-expanded in sync with that so it never reports "collapsed"
     while the menu is visibly open. */
  document.querySelectorAll(".has-dropdown").forEach(function (li) {
    var toggle = li.querySelector("[data-dropdown-toggle]");
    if (!toggle) return;
    li.addEventListener("focusin", function () {
      toggle.setAttribute("aria-expanded", "true");
    });
    li.addEventListener("focusout", function (e) {
      if (!li.contains(e.relatedTarget) && !li.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* Case category filters */
  var filterBar = document.querySelector("[data-case-filters]");
  var caseGrid = document.querySelector("[data-case-grid]");
  if (filterBar && caseGrid) {
    var cards = caseGrid.querySelectorAll("[data-category]");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      filterBar.querySelectorAll("button").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      var filter = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* Theme toggle (light/dark) — may appear more than once (header + mobile
     menu), so every instance gets wired up and kept in sync together. */
  var themeToggles = document.querySelectorAll("[data-theme-toggle]");
  themeToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var root = document.documentElement;
      var current = root.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("ofirlaw-theme", next);
      } catch (e) {}
      updateThemeToggleLabel(next);
    });
  });
  function updateThemeToggleLabel(theme) {
    themeToggles.forEach(function (toggle) {
      var toLight = toggle.getAttribute("data-label-to-light");
      var toDark = toggle.getAttribute("data-label-to-dark");
      var label = theme === "dark" ? toLight : toDark;
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    });
  }
  if (themeToggles.length) {
    updateThemeToggleLabel(document.documentElement.getAttribute("data-theme") || "light");
  }

  /* Hide the floating WhatsApp + accessibility buttons while the footer's
     bottom row is in view, so they never sit on top of the copyright,
     legal links, or credit line. */
  var floatingButtons = document.querySelectorAll(".whatsapp-float, .a11y-widget");
  var footerBottom = document.querySelector(".site-footer__bottom");
  if (floatingButtons.length && footerBottom && "IntersectionObserver" in window) {
    var footerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        floatingButtons.forEach(function (btn) {
          btn.classList.toggle("is-hidden", entry.isIntersecting);
        });
      });
    });
    footerObserver.observe(footerBottom);
  }

  /* Contact form -> mailto (no backend configured yet) */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    /* Neither phone nor email is individually required, but at least one
       of the two must be filled in — HTML has no native way to express
       that, so it's enforced via setCustomValidity, which plugs into the
       browser's normal validation flow (same bubble UI as "required"). */
    var phoneInput = contactForm.querySelector("#phone");
    var emailInput = contactForm.querySelector("#email");
    function validateContactMethod() {
      if (!phoneInput || !emailInput) return;
      var hasContactMethod = phoneInput.value.trim() !== "" || emailInput.value.trim() !== "";
      phoneInput.setCustomValidity(
        hasContactMethod ? "" : contactForm.getAttribute("data-error-contact-method") || ""
      );
    }
    if (phoneInput && emailInput) {
      phoneInput.addEventListener("input", validateContactMethod);
      emailInput.addEventListener("input", validateContactMethod);
      validateContactMethod();
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      var name = (data.get("name") || "").toString();
      var phone = (data.get("phone") || "").toString();
      var email = (data.get("email") || "").toString();
      var subject = (data.get("subject") || "").toString();
      var message = (data.get("message") || "").toString();
      var to = contactForm.getAttribute("data-mailto") || "";

      var bodyLines = [];
      bodyLines.push(contactForm.getAttribute("data-label-name") + ": " + name);
      bodyLines.push(contactForm.getAttribute("data-label-phone") + ": " + phone);
      bodyLines.push(contactForm.getAttribute("data-label-email") + ": " + email);
      bodyLines.push("");
      bodyLines.push(message);

      var defaultSubject = contactForm.getAttribute("data-default-subject") || "";

      var mailto =
        "mailto:" +
        encodeURIComponent(to) +
        "?subject=" +
        encodeURIComponent(subject || defaultSubject) +
        "&body=" +
        encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;
    });
  }
})();
