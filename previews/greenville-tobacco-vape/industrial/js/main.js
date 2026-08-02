(function () {
  "use strict";

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
    });
  }

  if (exitBtn) {
    exitBtn.addEventListener("click", function () {
      window.location.href = "https://www.google.com";
    });
  }

  /* Mobile nav */
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) mobileNav.removeAttribute("hidden");
      else mobileNav.setAttribute("hidden", "");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("hidden", "");
      });
    });
  }

  /* Cart */
  var count = 0;
  var badge = document.getElementById("cart-count");
  var toast = document.getElementById("toast");
  var timer = null;

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
        void badge.offsetWidth;
        badge.classList.add("is-bump");
      }
      showToast("Added to express order (" + count + ")");
    });
  });

  /* Category filters */
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

  /* QR pass */
  var qr = document.getElementById("qr");
  var qrBtn = document.getElementById("qr-btn");
  var pass = document.querySelector(".pass");
  var built = false;

  function buildQr() {
    if (!qr || built) return;
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
    });
  }

  /* Scroll reveals */
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
    nodes.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  window.requestAnimationFrame(function () {
    document.querySelectorAll(".hero .reveal").forEach(function (el, i) {
      window.setTimeout(function () {
        el.classList.add("is-in");
      }, 100 + i * 90);
    });
  });
})();
