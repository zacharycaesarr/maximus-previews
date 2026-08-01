(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  /* ---------- Age gate ---------- */
  var gate = document.getElementById("agegate");
  var enterBtn = document.getElementById("age-enter");
  var exitBtn = document.getElementById("age-exit");
  var gateKey = "gtv_age_ok";
  var hero = document.getElementById("hero");

  function pinTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function revealHero() {
    pinTop();
    document.body.classList.add("hero-ready");
    runSlogan();
    var logo = document.getElementById("hero-logo");
    if (logo && logo.focus) {
      try {
        logo.setAttribute("tabindex", "-1");
      } catch (err) {}
    }
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
    }, reduceMotion ? 0 : 380);
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

  /* ---------- Slogan words ---------- */
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

  /* ---------- Toast + universal tap feedback ---------- */
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
      }, 200);
    }, 1700);
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-tap]");
    if (!el) return;
    var msg = el.getAttribute("data-tap");
    if (msg) showToast(msg);
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

  /* ---------- Product rail scroll (desktop arrows + drag) ---------- */
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

  /* ---------- Scroll reveals + dock ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var dock = document.getElementById("dock");

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
      { threshold: 0.14, rootMargin: "0px 0px -30px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  function updateDock() {
    if (!dock) return;
    var y = window.scrollY || 0;
    if (y > 160) dock.classList.add("is-shown");
    else dock.classList.remove("is-shown");
    if (y > 320) dock.classList.add("is-compact");
    else dock.classList.remove("is-compact");
  }

  var shopbar = document.getElementById("shopbar");

  function updateShopbar() {
    if (!shopbar) return;
    if (window.scrollY > 90) shopbar.classList.add("is-scrolled");
    else shopbar.classList.remove("is-scrolled");
  }

  updateDock();
  updateShopbar();
  window.addEventListener(
    "scroll",
    function () {
      updateDock();
      updateShopbar();
    },
    { passive: true }
  );

  var searchForm = document.getElementById("shop-search");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = document.getElementById("search-q");
      var val = q && q.value ? q.value.trim() : "";
      showToast(val ? 'Search preview: "' + val + '"' : "Search preview");
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
    }, reduceMotion ? 0 : 220);
  }

  if (helpFab) {
    helpFab.addEventListener("click", function () {
      if (helpPanel && helpPanel.classList.contains("is-open")) closeHelp();
      else openHelp();
    });
  }
  if (helpClose) helpClose.addEventListener("click", closeHelp);

  /* ---------- Calm full-page cloud canvas ---------- */
  var canvas = document.getElementById("cloud-canvas");
  if (!canvas || reduceMotion) return;

  var ctx = canvas.getContext("2d");
  var clouds = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0;
  var h = 0;
  var last = 0;
  var lastW = 0;
  var lastH = 0;

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

    var bigChange =
      Math.abs(nextW - lastW) > 80 || Math.abs(nextH - lastH) > 120;
    if (forceSeed || !clouds.length || bigChange) {
      lastW = nextW;
      lastH = nextH;
      seedClouds();
    }
  }

  function makePuff(base) {
    return {
      ox: (Math.random() - 0.5) * base.spread,
      oy: (Math.random() - 0.5) * base.spread * 0.4,
      r: base.r * (0.5 + Math.random() * 0.55),
      phase: Math.random() * Math.PI * 2,
    };
  }

  function spawnCloud(seedX) {
    var baseR = 48 + Math.random() * 70;
    var puffCount = 5 + Math.floor(Math.random() * 4);
    var c = {
      x: typeof seedX === "number" ? seedX : Math.random() * (w + 300) - 150,
      y: 30 + Math.random() * Math.max(120, h - 60),
      speed: 0.035 + Math.random() * 0.05,
      life: 0.55 + Math.random() * 0.45,
      grow: 0.00004 + Math.random() * 0.00006,
      fading: false,
      alpha: 0.14 + Math.random() * 0.16,
      spread: baseR * 1.5,
      r: baseR,
      puffs: [],
      morph: Math.random() * Math.PI * 2,
    };
    for (var i = 0; i < puffCount; i++) c.puffs.push(makePuff(c));
    return c;
  }

  function seedClouds() {
    clouds = [];
    var count = Math.max(10, Math.floor(w / 120));
    for (var i = 0; i < count; i++) clouds.push(spawnCloud());
  }

  function drawCloud(c, t) {
    var breathe = 1 + Math.sin(t * 0.00025 + c.morph) * 0.035;
    var a = c.alpha * c.life;
    if (a <= 0.02) return;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.globalAlpha = a;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255,255,255,0.4)";
    ctx.shadowBlur = 18;

    for (var i = 0; i < c.puffs.length; i++) {
      var p = c.puffs[i];
      var wriggle = Math.sin(t * 0.00035 + p.phase) * 2.2;
      var rr = p.r * breathe;
      ctx.beginPath();
      ctx.ellipse(p.ox + wriggle, p.oy, rr * 1.12, rr * 0.76, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function tick(ts) {
    if (!last) last = ts;
    var raw = ts - last;
    last = ts;
    // hard cap stops mobile scroll frame spikes from flinging clouds
    var dt = Math.min(22, Math.max(0, raw));

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      c.x += c.speed * (dt * 0.045);
      c.morph += dt * 0.0002;

      if (c.fading) {
        c.life -= c.grow * dt;
        if (c.life <= 0.35) {
          c.fading = false;
        }
      } else if (c.life < 1) {
        c.life += c.grow * dt;
        if (c.life > 1) c.life = 1;
      } else if (Math.random() < 0.0004) {
        c.fading = true;
      }

      if (c.x - c.spread > w + 60) {
        c.x = -160 - Math.random() * 80;
        c.y = 30 + Math.random() * Math.max(120, h - 60);
        c.life = 0.6 + Math.random() * 0.4;
        c.fading = false;
      }

      drawCloud(c, ts);
    }

    window.requestAnimationFrame(tick);
  }

  resize(true);
  window.addEventListener("resize", function () {
    resize(false);
  });
  window.requestAnimationFrame(tick);
})();
