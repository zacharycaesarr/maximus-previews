(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  /* ---------- Age gate ---------- */
  var gate = document.getElementById("agegate");
  var enterBtn = document.getElementById("age-enter");
  var exitBtn = document.getElementById("age-exit");
  var gateKey = "gtv_age_ok";

  function pinTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function revealHero() {
    pinTop();
    document.body.classList.add("hero-ready");
    runSlogan();
  }

  function openGate() {
    document.body.classList.add("gate-locked");
    pinTop();
    if (!gate) return;
    gate.classList.remove("is-gone");
    gate.removeAttribute("hidden");
    window.requestAnimationFrame(function () {
      gate.classList.add("is-live");
    });
  }

  function closeGate() {
    pinTop();
    document.body.classList.remove("gate-locked");
    if (!gate) {
      revealHero();
      return;
    }
    gate.classList.remove("is-live");
    gate.classList.add("is-gone");
    window.setTimeout(function () {
      gate.setAttribute("hidden", "");
      pinTop();
      revealHero();
      window.setTimeout(pinTop, 50);
    }, reduceMotion ? 0 : 320);
  }

  if (sessionStorage.getItem(gateKey) === "1") {
    if (gate) {
      gate.classList.add("is-gone");
      gate.setAttribute("hidden", "");
    }
    document.body.classList.remove("gate-locked");
    window.setTimeout(revealHero, 40);
  } else {
    openGate();
  }

  if (enterBtn) {
    enterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.setItem(gateKey, "1");
      closeGate();
    });
  }

  if (exitBtn) {
    exitBtn.addEventListener("click", function () {
      window.location.href = "https://www.google.com";
    });
  }

  var hoursPill = document.getElementById("hours-pill");
  if (hoursPill) {
    hoursPill.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        hoursPill.click();
      }
    });
  }

  function runSlogan() {
    var slogan = document.getElementById("slogan");
    if (!slogan) return;
    if (reduceMotion) {
      slogan.classList.add("is-in");
      return;
    }
    slogan.classList.remove("is-in");
    void slogan.offsetWidth;
    slogan.classList.add("is-in");
  }

  /* ---------- Toast ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(msg) {
    if (!toast || !msg) return;
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
      }, 180);
    }, 1600);
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-tap]");
    if (!el) return;
    var msg = el.getAttribute("data-tap");
    if (msg) showToast(msg);
  });

  /* ---------- Cart counter ---------- */
  var cartCount = 0;
  var cartBadge = document.getElementById("cart-count");

  function setCart(n) {
    cartCount = Math.max(0, n);
    if (cartBadge) cartBadge.textContent = String(cartCount);
  }

  document.querySelectorAll("[data-add-cart]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setCart(cartCount + 1);
      showToast("Added to cart (" + cartCount + ")");
    });
  });

  /* ---------- Category sheet ---------- */
  var catCopy = {
    disposables: {
      title: "Disposables",
      body: "Ready to pull devices in the flavors people ask for every day.",
    },
    devices: {
      title: "Devices",
      body: "Pods, kits, and rebuild gear without the confusing wall of options.",
    },
    eliquid: {
      title: "E-Liquid",
      body: "Bottles for the people who still like to fill their own.",
    },
    pouches: {
      title: "Nicotine Pouches",
      body: "The reason half of Staunton walks through the door.",
    },
    coils: {
      title: "Coils",
      body: "Replacements for the kits we sell so you are not hunting mid week.",
    },
    accessories: {
      title: "Accessories",
      body: "Chargers, cases, the little stuff that keeps your day moving.",
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
    sheetBody.innerHTML =
      data.body + ' Coming soon with <span class="oa">Order Ahead</span>.';
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
      reduceMotion ? 0 : 240
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

  if (qrFlip) {
    qrFlip.addEventListener("click", function () {
      if (!qrDemo) return;
      buildQr();
      var back = qrDemo.querySelector(".qr-demo__back");
      if (back) back.hidden = false;
      qrDemo.classList.add("is-flipped");
      showToast("Sample pickup QR ready");
    });
  }

  if (qrReset) {
    qrReset.addEventListener("click", function () {
      if (qrDemo) qrDemo.classList.remove("is-flipped");
    });
  }

  /* ---------- Rails ---------- */
  var rail = document.getElementById("product-rail");
  var prevBtn = document.getElementById("prod-prev");
  var nextBtn = document.getElementById("prod-next");

  function scrollRail(dir) {
    if (!rail) return;
    rail.scrollBy({ left: dir * Math.min(280, rail.clientWidth * 0.8), behavior: "smooth" });
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { scrollRail(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { scrollRail(1); });

  function enableDrag(el) {
    if (!el) return;
    var down = false;
    var startX = 0;
    var startScroll = 0;
    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      down = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (!down) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
    });
    el.addEventListener("pointerup", function () { down = false; });
    el.addEventListener("pointercancel", function () { down = false; });
  }

  enableDrag(rail);
  enableDrag(document.querySelector(".review-rail"));
  enableDrag(document.querySelector(".lane-rail"));

  /* ---------- Scroll UI ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var dock = document.getElementById("dock");
  var shopbar = document.getElementById("shopbar");
  var ticking = false;

  if (reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
    if (dock) dock.classList.add("is-shown");
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
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  function onScrollFrame() {
    var y = window.scrollY || 0;
    if (dock) {
      if (y > 160) dock.classList.add("is-shown");
      else dock.classList.remove("is-shown");
      if (y > 320) dock.classList.add("is-compact");
      else dock.classList.remove("is-compact");
    }
    if (shopbar) {
      if (y > 90) shopbar.classList.add("is-scrolled");
      else shopbar.classList.remove("is-scrolled");
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    },
    { passive: true }
  );
  onScrollFrame();

  var searchForm = document.getElementById("shop-search");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = document.getElementById("search-q");
      var val = q && q.value ? q.value.trim() : "";
      showToast(val ? 'Search: "' + val + '"' : "Search preview");
    });
  }

  var helpFab = document.getElementById("help-fab");
  var helpPanel = document.getElementById("help-panel");
  var helpClose = document.getElementById("help-close");

  function openHelp() {
    if (!helpPanel || !helpFab) return;
    helpPanel.hidden = false;
    window.requestAnimationFrame(function () {
      helpPanel.classList.add("is-open");
    });
    helpFab.setAttribute("aria-expanded", "true");
  }

  function closeHelp() {
    if (!helpPanel || !helpFab) return;
    helpPanel.classList.remove("is-open");
    helpFab.setAttribute("aria-expanded", "false");
    window.setTimeout(function () {
      helpPanel.hidden = true;
    }, reduceMotion ? 0 : 180);
  }

  if (helpFab) {
    helpFab.addEventListener("click", function () {
      if (helpPanel && helpPanel.classList.contains("is-open")) closeHelp();
      else openHelp();
    });
  }
  if (helpClose) helpClose.addEventListener("click", closeHelp);

  /* ---------- Lightweight clouds (mobile-safe) ---------- */
  var canvas = document.getElementById("cloud-canvas");
  if (!canvas || reduceMotion) return;

  var ctx = canvas.getContext("2d", { alpha: true });
  var clouds = [];
  var dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
  var w = 0;
  var h = 0;
  var last = 0;
  var lastW = 0;
  var running = true;
  var rafId = 0;
  var frameBudget = isMobile ? 42 : 22; // ~24fps mobile, ~45fps desktop

  function resize(forceSeed) {
    var nextW = window.innerWidth;
    var nextH = window.innerHeight;
    w = nextW;
    h = nextH;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (forceSeed || !clouds.length || Math.abs(nextW - lastW) > 100) {
      lastW = nextW;
      seedClouds();
    }
  }

  function spawnCloud() {
    var baseR = isMobile ? 40 + Math.random() * 42 : 48 + Math.random() * 58;
    var puffs = isMobile ? 3 : 4;
    var c = {
      x: Math.random() * (w + 240) - 120,
      y: 40 + Math.random() * Math.max(160, h - 80),
      speed: 0.02 + Math.random() * 0.03,
      alpha: 0.12 + Math.random() * 0.12,
      spread: baseR * 1.35,
      morph: Math.random() * Math.PI * 2,
      puffs: [],
    };
    for (var i = 0; i < puffs; i++) {
      c.puffs.push({
        ox: (Math.random() - 0.5) * c.spread,
        oy: (Math.random() - 0.5) * c.spread * 0.35,
        r: baseR * (0.55 + Math.random() * 0.4),
      });
    }
    return c;
  }

  function seedClouds() {
    clouds = [];
    var count = isMobile ? 5 : 8;
    for (var i = 0; i < count; i++) clouds.push(spawnCloud());
  }

  function drawCloud(c, t) {
    var breathe = 1 + Math.sin(t * 0.0002 + c.morph) * 0.025;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.globalAlpha = c.alpha;
    ctx.fillStyle = "#ffffff";
    for (var i = 0; i < c.puffs.length; i++) {
      var p = c.puffs[i];
      var rr = p.r * breathe;
      ctx.beginPath();
      ctx.ellipse(p.ox, p.oy, rr * 1.1, rr * 0.74, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function tick(ts) {
    if (!running) {
      rafId = 0;
      return;
    }
    if (!last) last = ts;
    var dt = Math.min(frameBudget, ts - last);
    if (ts - last < frameBudget - 2) {
      rafId = window.requestAnimationFrame(tick);
      return;
    }
    last = ts;

    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      c.x += c.speed * (dt * 0.04);
      c.morph += dt * 0.00015;
      if (c.x - c.spread > w + 40) {
        c.x = -140;
        c.y = 40 + Math.random() * Math.max(160, h - 80);
      }
      drawCloud(c, ts);
    }
    rafId = window.requestAnimationFrame(tick);
  }

  function start() {
    if (running && rafId) return;
    running = true;
    last = 0;
    rafId = window.requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  resize(true);
  start();

  window.addEventListener("resize", function () {
    resize(false);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });
})();
