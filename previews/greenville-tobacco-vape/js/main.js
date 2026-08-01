(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Age gate ---------- */
  var gate = document.getElementById("agegate");
  var enterBtn = document.getElementById("age-enter");
  var exitBtn = document.getElementById("age-exit");
  var gateKey = "gtv_age_ok";

  function openGate() {
    document.body.classList.add("gate-locked");
    if (gate) gate.classList.remove("is-gone");
  }

  function closeGate() {
    document.body.classList.remove("gate-locked");
    if (!gate) return;
    gate.classList.add("is-gone");
    window.setTimeout(function () {
      gate.setAttribute("hidden", "");
    }, reduceMotion ? 0 : 360);
  }

  if (sessionStorage.getItem(gateKey) === "1") {
    if (gate) {
      gate.classList.add("is-gone");
      gate.setAttribute("hidden", "");
    }
  } else {
    openGate();
  }

  if (enterBtn) {
    enterBtn.addEventListener("click", function () {
      sessionStorage.setItem(gateKey, "1");
      closeGate();
    });
  }

  if (exitBtn) {
    exitBtn.addEventListener("click", function () {
      window.location.href = "https://www.google.com";
    });
  }

  /* ---------- Category copy + bottom sheet ---------- */
  var catCopy = {
    disposables: {
      title: "Disposables",
      body: "Ready to pull devices in the flavors people ask for every day. Order Ahead will let you lock one in before you show up.",
    },
    devices: {
      title: "Devices",
      body: "Pods, kits, and rebuild gear without the confusing wall of options. Grab what fits your setup.",
    },
    eliquid: {
      title: "E-Liquid",
      body: "Bottles for the people who still like to fill their own. Sweet, menthol, tobacco, the usual hits.",
    },
    pouches: {
      title: "Nicotine Pouches",
      body: "The reason half of Staunton walks through the door. Strengths and flavors kept stocked.",
    },
    coils: {
      title: "Coils",
      body: "Replacements for the kits we sell so you are not hunting across town mid week.",
    },
    accessories: {
      title: "Accessories",
      body: "Chargers, glass, cases, the little stuff that keeps your day moving.",
    },
  };

  var sheet = document.getElementById("sheet");
  var sheetTitle = document.getElementById("sheet-title");
  var sheetBody = document.getElementById("sheet-body");
  var sheetPanel = sheet ? sheet.querySelector(".sheet__panel") : null;
  var lastFocus = null;

  function openSheet(key) {
    var data = catCopy[key];
    if (!sheet || !data) return;
    lastFocus = document.activeElement;
    sheetTitle.textContent = data.title;
    sheetBody.textContent = data.body + " Coming soon with Order Ahead.";
    sheet.hidden = false;
    window.requestAnimationFrame(function () {
      sheet.classList.add("is-open");
      if (sheetPanel) sheetPanel.focus();
    });
  }

  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove("is-open");
    window.setTimeout(
      function () {
        sheet.hidden = true;
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      },
      reduceMotion ? 0 : 280
    );
  }

  document.querySelectorAll("[data-cat]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      openSheet(chip.getAttribute("data-cat"));
    });
  });

  document.querySelectorAll("[data-close-sheet]").forEach(function (el) {
    el.addEventListener("click", closeSheet);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sheet && !sheet.hidden) closeSheet();
  });

  /* ---------- Toast demos ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    window.requestAnimationFrame(function () {
      toast.classList.add("is-on");
    });
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-on");
      window.setTimeout(function () {
        toast.hidden = true;
      }, 200);
    }, 1900);
  }

  document.querySelectorAll("[data-demo-toast]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showToast(btn.getAttribute("data-demo-toast"));
    });
  });

  /* ---------- QR demo ---------- */
  var qrDemo = document.getElementById("qr-demo");
  var qrFlip = document.getElementById("qr-flip");
  var qrReset = document.getElementById("qr-reset");
  var qrCode = document.getElementById("qr-code");
  var qrBuilt = false;

  function buildQr() {
    if (!qrCode || qrBuilt) return;
    qrCode.innerHTML = "";
    var pattern = [
      "11110101011",
      "10010111001",
      "10111101011",
      "10000010101",
      "11101011101",
      "01010101010",
      "10111010111",
      "10101000001",
      "11010111101",
      "10011101001",
      "11010101111",
    ];
    for (var r = 0; r < pattern.length; r++) {
      for (var c = 0; c < pattern[r].length; c++) {
        var cell = document.createElement("i");
        if (pattern[r].charAt(c) === "1") cell.className = "on";
        qrCode.appendChild(cell);
      }
    }
    qrBuilt = true;
  }

  function showQr() {
    if (!qrDemo) return;
    buildQr();
    var back = qrDemo.querySelector(".qr-demo__back");
    if (back) back.hidden = false;
    qrDemo.classList.add("is-flipped");
  }

  function hideQr() {
    if (!qrDemo) return;
    qrDemo.classList.remove("is-flipped");
  }

  if (qrFlip) qrFlip.addEventListener("click", showQr);
  if (qrReset) qrReset.addEventListener("click", hideQr);

  /* ---------- Scroll reveals ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---------- Soft cloud parallax on scroll ---------- */
  var drifts = document.querySelectorAll("[data-drift]");
  if (!reduceMotion && drifts.length) {
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          var y = window.scrollY || 0;
          drifts.forEach(function (cloud, i) {
            var factor = (i + 1) * 0.018;
            cloud.style.translate = "0 " + y * factor + "px";
          });
          ticking = false;
        });
      },
      { passive: true }
    );
  }
})();
