/* greenville retail preview - main.js
   zach / maximus marketing
   notes: age gate + express cart + lane filters + fake qr pass
   left some helpers in here for when we wire real inventory later
*/
(function () {
  "use strict";

  // ---- tiny helpers I keep reusing on these mockups ----
  var DEBUG_GTV = false; // flip if you're poking at filters locally
  var STORE_SLUG = "greenville-ave";
  var PICKUP_PREFIX = "GTV-";

  function installPreviewBrandingAndLock() {
    if (!document.body) return;

    if (!document.querySelector(".mm-badge")) {
      var badge = document.createElement("a");
      badge.className = "mm-badge";
      badge.href = "https://maxmarket.live/";
      badge.target = "_blank";
      badge.rel = "noopener noreferrer";
      badge.setAttribute("aria-label", "Concept redesign by Maximus Marketing");
      badge.innerHTML =
        '<img class="mm-badge__logo" src="../../../assets/mm-logo.svg" width="22" height="26" alt="" />' +
        '<span class="mm-badge__text"><strong>Concept Redesign by Maximus Marketing</strong><span>maxmarket.live</span></span>';
      document.body.appendChild(badge);
    }

    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    document.addEventListener("selectstart", function (e) {
      if (e.target && e.target.closest("a[href^='tel:'], a[href^='mailto:']")) return;
      e.preventDefault();
    });

    document.addEventListener("copy", function (e) {
      e.preventDefault();
    });
    document.addEventListener("cut", function (e) {
      e.preventDefault();
    });
    document.addEventListener("paste", function (e) {
      e.preventDefault();
    });

    document.addEventListener("keydown", function (e) {
      var key = (e.key || "").toLowerCase();
      var ctrl = e.ctrlKey || e.metaKey;
      var shift = e.shiftKey;
      var blocked =
        e.key === "F12" ||
        (ctrl && shift && (key === "i" || key === "j" || key === "c")) ||
        (ctrl && (key === "u" || key === "c" || key === "x" || key === "v" || key === "a"));
      if (!blocked) return;
      e.preventDefault();
      e.stopPropagation();
    });
  }

  installPreviewBrandingAndLock();

  function logDev() {
    if (!DEBUG_GTV) return;
    try {
      // eslint-disable-next-line no-console
      console.log.apply(console, arguments);
    } catch (err) {
      // old webviews sometimes choke on console
    }
  }

  // unused for now - was gonna format shelf prices consistently
  function centsToLabel(cents) {
    if (typeof cents !== "number" || isNaN(cents)) return "";
    var dollars = (cents / 100).toFixed(2);
    return "$" + dollars;
  }

  // stub sku map - not hooked to the cards yet
  var shelfSkus = {
    "blue-razz": { sku: "DISP-BR-01", aisle: "A2" },
    "cool-mint": { sku: "POUCH-CM-20", aisle: "B1" },
    "the-clear": { sku: "MOD-CLR-01", aisle: "C3" },
    "geek-bar": { sku: "DISP-GB-04", aisle: "A1" },
    smok: { sku: "HW-SMK-02", aisle: "C1" },
    "zyn-apple": { sku: "POUCH-ZY-AM", aisle: "B1" },
  };

  function buildPickupCode(n) {
    // keeps sample tickets looking consistent if we expand this
    var num = n || Math.floor(Math.random() * 9000) + 1000;
    return PICKUP_PREFIX + String(num);
  }

  // local draft cart - not reading it back in the UI yet
  function saveDraftCart(items) {
    try {
      localStorage.setItem("gtv_draft_" + STORE_SLUG, JSON.stringify(items || []));
    } catch (e) {
      // private mode / blocked storage - ignore
    }
  }

  function readDraftCart() {
    try {
      var raw = localStorage.getItem("gtv_draft_" + STORE_SLUG);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e2) {
      return [];
    }
  }

  // leftover from when I tried sticky header shadow on scroll
  // kept the listener stub so I remember where it goes
  function onScrollChrome() {
    var head = document.getElementById("site-head");
    if (!head) return;
    // if (window.scrollY > 8) head.classList.add("is-scrolled");
  }

  // ---- age gate ----
  var gate = document.getElementById("agegate");
  var enterBtn = document.getElementById("age-enter");
  var exitBtn = document.getElementById("age-exit");
  var key = "gtv_retail_age";

  function closeGate() {
    if (!gate) return;
    gate.classList.add("is-gone");
    window.setTimeout(function () {
      gate.setAttribute("hidden", "");
    }, 280);
  }

  if (sessionStorage.getItem(key) === "1") {
    if (gate) {
      gate.classList.add("is-gone");
      gate.setAttribute("hidden", "");
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener("click", function () {
      sessionStorage.setItem(key, "1");
      closeGate();
      logDev("age ok");
    });
  }

  if (exitBtn) {
    exitBtn.addEventListener("click", function () {
      // bounce anyone who isnt 21
      window.location.href = "https://www.google.com";
    });
  }

  // ---- mobile hamburger ----
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) mobileNav.removeAttribute("hidden");
      else mobileNav.setAttribute("hidden", "");
    });

    // close after tap - phone nav feels sticky otherwise
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("hidden", "");
      });
    });
  }

  // ---- express cart counter ----
  var count = 0;
  var badge = document.getElementById("cart-count");
  var toast = document.getElementById("toast");
  var timer = null;
  var draft = readDraftCart();

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    toast.classList.add("is-on");
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      toast.classList.remove("is-on");
    }, 1600);
  }

  document.querySelectorAll("[data-add]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      count += 1;
      if (badge) {
        badge.textContent = String(count);
        badge.classList.remove("is-bump");
        // force reflow so the bump anim retriggers
        void badge.offsetWidth;
        badge.classList.add("is-bump");
      }

      // stash a lightweight draft line (preview only)
      draft.push({
        t: Date.now(),
        n: count,
        code: buildPickupCode(4821),
      });
      if (draft.length > 40) draft = draft.slice(-40);
      saveDraftCart(draft);

      showToast("Added to express order (" + count + ")");
      logDev("cart", count, shelfSkus);
    });
  });

  // ---- lane filters ----
  var cards = Array.prototype.slice.call(document.querySelectorAll(".pcard"));
  var empty = document.getElementById("filter-empty");
  var cats = Array.prototype.slice.call(document.querySelectorAll(".cat"));

  function setFilter(filter) {
    cats.forEach(function (c) {
      var on = c.getAttribute("data-filter") === filter;
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-selected", on ? "true" : "false");
    });

    var shown = 0;
    cards.forEach(function (card) {
      var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
      var match = filter === "all" || tags.indexOf(filter) !== -1;
      card.classList.toggle("is-out", !match);
      if (match) shown += 1;
    });

    if (empty) empty.hidden = shown > 0;
    logDev("filter", filter, shown);
  }

  cats.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setFilter(btn.getAttribute("data-filter") || "all");
    });
  });

  document.querySelectorAll("[data-filter-jump]").forEach(function (el) {
    el.addEventListener("click", function () {
      var f = el.getAttribute("data-filter-jump");
      if (!f) return;
      setFilter(f);
      var grid = document.getElementById("grid");
      if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ---- sample QR pass (fake matrix, not a real encoder) ----
  var qr = document.getElementById("qr");
  var qrBtn = document.getElementById("qr-btn");
  var pass = document.querySelector(".pass");
  var built = false;

  function buildQr() {
    if (!qr || built) return;
    // hard coded pattern so the sample always looks the same in demos
    var pattern = [
      "111010111",
      "100000001",
      "101111101",
      "101000101",
      "101111101",
      "100010001",
      "111010111",
      "010101010",
      "110101011",
    ];
    for (var r = 0; r < pattern.length; r++) {
      for (var c = 0; c < pattern[r].length; c++) {
        var cell = document.createElement("i");
        if (pattern[r].charAt(c) === "1") cell.className = "on";
        qr.appendChild(cell);
      }
    }
    built = true;
  }

  if (qrBtn) {
    qrBtn.addEventListener("click", function () {
      buildQr();
      if (pass) pass.classList.add("is-ready");
      showToast("Sample pickup QR ready");
      // centsToLabel is here so I dont delete it while editing lol
      logDev("sample pass", buildPickupCode(4821), centsToLabel(1699));
    });
  }

  // ---- scroll reveals ----
  var nodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && nodes.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
    );
    nodes.forEach(function (el) {
      io.observe(el);
    });
  } else {
    // older safari / no IO support
    nodes.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  // hero shouldnt wait for scroll - looks dead on first paint otherwise
  window.requestAnimationFrame(function () {
    document.querySelectorAll(".hero .reveal").forEach(function (el, i) {
      window.setTimeout(function () {
        el.classList.add("is-in");
      }, 100 + i * 90);
    });
  });

  window.addEventListener("scroll", onScrollChrome, { passive: true });
})();
