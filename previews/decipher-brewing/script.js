(function () {
  "use strict";

  var GATE_KEY = "mm_decipher_21";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var CIPHER = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789#%*<>/\\|";

  var iconTap =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 0112.6-5.5L19 9"/><path d="M19.5 4v5h-5"/><path d="M19.5 12a7.5 7.5 0 01-12.6 5.5L5 15"/><path d="M5 20v-5h5"/></svg>';
  var iconPizza =
    '<svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" aria-hidden="true"><path d="M5.624 3.896c-.917-1.419-.036-3.774 2.084-3.895 1.001-.034 5.603.891 9.132 3.588 1.07.818 2.036 1.767 2.881 2.816 2.685 3.332 4.279 8.261 4.279 9.677 0 1.669-2.009 2.887-3.653 2.185l-20.347 5.733 5.624-20.104zm-2.737 17.212l16.145-4.547c-1.975-6.675-4.971-9.905-11.62-11.627l-4.525 16.174zm3.616-5.11c.83 0 1.502.674 1.502 1.501 0 .829-.672 1.501-1.502 1.501-.829 0-1.5-.672-1.5-1.501 0-.827.671-1.501 1.5-1.501m4.194-.972c.798.276 1.22 1.147.945 1.945-.276.798-1.148 1.22-1.945.945 0 0-.47-.166-.32-.599.149-.432.62-.268.62-.268.319.11.668-.059.778-.377.11-.32-.059-.668-.378-.78 0 0-.481-.127-.319-.594.147-.424.619-.272.619-.272m-3.04-12.094c7.157 1.773 11.111 5.485 13.315 13.068.211.726 1.276.356 1.111-.25-2.22-8.142-6.831-12.522-14.128-13.938-.641-.125-.941.961-.298 1.12m6.352 9.067c1.104 0 2 .897 2 2.001 0 1.105-.896 2-2 2-1.105 0-2.002-.895-2.002-2 0-1.104.897-2.001 2.002-2.001m-5.837 2.99c-.814-.192-1.32-1.009-1.128-1.822.193-.814 1.01-1.319 1.823-1.127 0 0 .48.116.377.558-.105.442-.584.327-.584.327-.327-.077-.653.125-.729.451-.078.325.124.652.449.729 0 0 .487.078.375.554-.103.433-.583.33-.583.33m1.834-7.581c1.104 0 2.001.897 2.001 2 0 1.104-.897 2-2.001 2-1.105 0-2.001-.896-2.001-2 0-1.103.896-2 2.001-2"/></svg>';
  var iconPatio =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8c1.2 1.6.8 2.8-.2 3.8 1.5.1 3.2 1.2 3.2 3.1 0 1.7-1.4 3-3 3s-3-1.3-3-3c0-1.4.9-2.4 1.8-3.1C10.2 5.4 11 4.2 12 2.8z"/><path d="M5 14.5h14"/><path d="M6.5 14.5V19"/><path d="M17.5 14.5V19"/><path d="M4 19h16"/><path d="M8 14.5v-2h8v2"/></svg>';
  var iconKey =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="10" r="3.4"/><path d="M11 10h9"/><path d="M17 10v3.2"/><path d="M20 10v2.2"/><circle cx="8" cy="10" r="1" fill="currentColor" stroke="none"/></svg>';
  var iconDog =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11l2-4 3 1 2-3 2 3 3-1 2 4v5a3 3 0 01-3 3H8a3 3 0 01-3-3v-5z"/><circle cx="9" cy="12" r="0.8" fill="currentColor"/><circle cx="15" cy="12" r="0.8" fill="currentColor"/></svg>';
  var iconShield =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>';
  var iconFire =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c2 3 1 5-1 7 3 0 6 2 6 6a7 7 0 11-14 0c0-3 2-5 4-7-1 3 1 5 2 5 0-3 1-6 3-11z"/></svg>';
  var iconNavy =
    '<img src="assets/branch-navy.png" width="18" height="18" alt="" />';
  var iconAir =
    '<img src="assets/branch-airforce.png" width="18" height="18" alt="" />';
  var iconMail =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="6" width="17" height="12" rx="1.5"/><path d="M4 8l8 6 8-6"/></svg>';
  var iconStar =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.4l2.2 4.6 5 .7-3.6 3.5.9 5.1L12 15.2 7.5 17.3l.9-5.1L4.8 8.7l5-.7z"/></svg>';
  var iconBeer =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 9h8v9a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"/><path d="M15 10h2.4a2.6 2.6 0 010 5.2H15"/><path d="M8 5.5c.8-.8 1.8-1.2 3-1.2s2.2.4 3 1.2"/><path d="M9.2 5.8c.4-.3.9-.5 1.5-.5s1.1.2 1.5.5"/></svg>';
  var iconMedal =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="14" r="5"/><path d="M9.2 9.4L8 3.8l4 1.8 4-1.8-1.2 5.6"/><path d="M12 12.2v1.8"/><path d="M12 16.4h.01"/></svg>';
  var iconClock =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.2"/><path d="M12 8.2V12l2.6 2.2"/></svg>';
  var iconPin =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/></svg>';

  function drawerLink(href, label, icon) {
    return (
      '<a href="' +
      href +
      '"><span class="nav__drawer-icon" aria-hidden="true">' +
      icon +
      "</span><span>" +
      label +
      "</span></a>"
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function lineBlock(tag, className, text) {
    var safe = escapeHtml(text);
    return (
      "<" +
      tag +
      ' class="line ' +
      className +
      '">' +
      '<span class="line__sizer" aria-hidden="true">' +
      safe +
      "</span>" +
      '<span class="line__live" data-decode="' +
      safe +
      '"></span>' +
      "</" +
      tag +
      ">"
    );
  }

  function featureCard(id, code, title, detail, icon) {
    return (
      '<button class="card" type="button" data-card="' +
      id +
      '" data-detail="' +
      escapeHtml(detail) +
      '" aria-expanded="false">' +
      '<div class="card__top">' +
      '<span class="card__icon">' +
      icon +
      "</span>" +
      "<div>" +
      '<p class="card__label">// ' +
      code +
      "</p>" +
      "<h3>" +
      title +
      "</h3>" +
      '<p class="card__hint">tap to decode</p>' +
      "</div>" +
      "</div>" +
      '<div class="card__body"><div><p class="card__decoded"></p></div></div>' +
      "</button>"
    );
  }

  function crewItem(name, role, detail, branchIcon) {
    return (
      '<article class="crew__item">' +
      '<div class="crew__name">' +
      branchIcon +
      "<span>" +
      name +
      "</span></div>" +
      "<strong>" +
      role +
      "</strong>" +
      "<em>" +
      detail +
      "</em>" +
      "</article>"
    );
  }

  var MARKUP =
    '<div class="agegate" id="agegate" role="dialog" aria-modal="true" aria-labelledby="age-title">' +
    '  <div class="agegate__panel">' +
    '    <div class="agegate__mark"><img src="assets/decipher-mark.png" width="64" height="64" alt="" /></div>' +
    '    <div class="agegate__logo"><img src="assets/decipher-logo.png" width="360" height="115" alt="decipher BREWING" /></div>' +
    lineBlock("h1", "agegate__title", "Are you 21 or older?").replace(
      "<h1 ",
      '<h1 id="age-title" '
    ) +
    "    <p>You need to be 21+ to enter this taproom preview.</p>" +
    '    <div class="agegate__actions">' +
    '      <button class="btn btn--solid" type="button" id="age-yes">Yes, I am 21+</button>' +
    '      <button class="btn btn--ghost" type="button" id="age-no">No, take me out</button>' +
    "    </div>" +
    "  </div>" +
    "</div>" +
    '<div class="shell" id="shell">' +
    '  <div class="shell__grid" aria-hidden="true"></div>' +
    '  <div class="shell__bits" id="shell-bits" aria-hidden="true"></div>' +
    '  <header class="nav" id="nav">' +
    '    <a class="nav__brand" href="#top" aria-label="Decipher Brewing home">' +
    '      <span class="nav__mark"><img src="assets/decipher-mark.png" width="34" height="34" alt="" /></span>' +
    '      <span class="nav__logo"><span class="glitch"><img src="assets/decipher-logo.png" width="360" height="115" alt="decipher BREWING" /></span></span>' +
    "    </a>" +
    '    <nav class="nav__links" aria-label="Page">' +
    '      <a href="#features">Features</a>' +
    '      <a href="#pours">Pours</a>' +
    '      <a href="#about">Veterans</a>' +
    '      <a href="#visit">Visit</a>' +
    "    </nav>" +
    '    <a class="nav__cta" href="tel:4349955777">Call Taproom</a>' +
    '    <button class="nav__toggle" type="button" id="nav-toggle" aria-expanded="false" aria-controls="nav-drawer" aria-label="Menu"><span></span></button>' +
    '    <div class="nav__drawer" id="nav-drawer">' +
    drawerLink("#features", "Features", iconStar) +
    drawerLink("#pours", "Pours", iconBeer) +
    drawerLink("#about", "Veterans", iconMedal) +
    drawerLink("#hours", "Hours", iconClock) +
    drawerLink("#visit", "Visit", iconPin) +
    "    </div>" +
    "  </header>" +
    '  <main id="top">' +
    '    <section class="hero" aria-label="Decipher Brewing">' +
    '      <div class="hero__copy">' +
    '        <p class="hero__tag">Charlottesville · Est. 2019</p>' +
    lineBlock("h1", "", "what's your solution?") +
    lineBlock("p", "hero__sub", "Craft beer & cryptography") +
    lineBlock(
      "p",
      "hero__lead",
      "Veteran-owned taproom in Woolen Mills. Pizza, fire pits, and a pint list worth decoding."
    ) +
    '        <div class="hero__actions">' +
    '          <a class="btn btn--solid" href="#features">View On Tap</a>' +
    '          <a class="btn btn--ghost" href="#hours">Taproom Hours</a>' +
    "        </div>" +
    '        <div class="hero__pills">' +
    '          <span class="pill">' +
    iconShield +
    " 100% veteran-owned</span>" +
    '          <span class="pill">' +
    iconDog +
    " Pet friendly</span>" +
    '          <span class="pill">' +
    iconFire +
    " Fire pits</span>" +
    "        </div>" +
    "      </div>" +
    "    </section>" +
    '    <aside class="hours" id="hours" data-reveal aria-label="Hours">' +
    '      <div class="hours__inner">' +
    '        <div class="hours__status"><span class="hours__dot" id="open-dot" aria-hidden="true"></span><span id="open-label">Checking hours…</span></div>' +
    '        <ul class="hours__list">' +
    "          <li><strong>Sun</strong> 12-8</li>" +
    "          <li><strong>Mon-Thu</strong> 3-9</li>" +
    "          <li><strong>Fri</strong> 2-10</li>" +
    "          <li><strong>Sat</strong> 12-10</li>" +
    "        </ul>" +
    "      </div>" +
    "    </aside>" +
    '    <section class="section" id="features" data-reveal>' +
    '      <div class="section__head">' +
    '        <p class="section__tag">// decode the taproom</p>' +
    "        <h2>Four things to know</h2>" +
    "      </div>" +
    '      <div class="features">' +
    featureCard(
      "tap",
      "on tap",
      "Rotating pours",
      "Flagships, seasonals, and Babington barrel projects. Flights welcome. No TVs.",
      iconTap
    ) +
    featureCard(
      "food",
      "food",
      "House pizzas",
      "Cheese, margherita, pepperoni, ricotta mushroom, Calabrian chili, plus soft pretzels.",
      iconPizza
    ) +
    featureCard(
      "patio",
      "patio",
      "Fire pits outside",
      "Covered and open patio seats with smokeless fire pits when the night cools off.",
      iconPatio
    ) +
    featureCard(
      "room40",
      "loyalty",
      "Room 40",
      "Point-per-penny rewards. Cash in on Dead Drops for beer and merch.",
      iconKey
    ) +
    "      </div>" +
    "    </section>" +
    '    <section class="section" id="pours" data-reveal>' +
    '      <div class="pour">' +
    '        <div class="pour__copy">' +
    '          <p class="section__tag">// on the bar</p>' +
    "          <h2>Beers that carry the cipher</h2>" +
    "          <p>From 80/- Scottish Ale to Broken Logic IPA and award-winning Barley Late Kolsch. Same gear-and-keyhole mark on the glass and the cans.</p>" +
    '          <div class="pour__chips"><span>80/-</span><span>Broken Logic</span><span>Barley Late</span><span>Babington series</span></div>' +
    "        </div>" +
    '        <div class="pour__gallery">' +
    '          <div class="pour__frame pour__frame--mug"><img src="assets/beer-mug.png" width="420" height="560" alt="Decipher Brewing pint glass" /></div>' +
    '          <div class="pour__frame"><img src="assets/beer-cans.png" width="480" height="640" alt="80/- Scottish Ale cans with a filled mug" /></div>' +
    '          <div class="pour__frame pour__frame--wide"><img src="assets/beer-lineup.png" width="520" height="700" alt="Decipher cans and koozies lineup" /></div>' +
    "        </div>" +
    "      </div>" +
    "    </section>" +
    '    <section class="section" id="about" data-reveal>' +
    '      <div class="crew-wrap">' +
    '        <div class="crew-intro">' +
    '          <p class="section__tag">// veteran built</p>' +
    "          <h2>Brad, Scott &amp; Megan</h2>" +
    "          <p>Navy and Air Force founders. Still the people behind the bar, the recipes, and the weird holiday costumes.</p>" +
    "        </div>" +
    '        <div class="crew">' +
    crewItem("Brad Burton", "Head brewer", "Navy · teaches craft brewing at PVCC", iconNavy) +
    crewItem(
      "Scott Burton",
      "FOH / brewer",
      "Navy · runs front of house, HR, and the beertender crew",
      iconNavy
    ) +
    crewItem("Megan Burton", "Admin", "Air Force · 20 years · keeps the lights on", iconAir) +
    crewItem("Contact", "decipherbrewingco@gmail.com", "1740 Broadway St. #9, Charlottesville", iconMail) +
    "        </div>" +
    "      </div>" +
    "    </section>" +
    '    <section class="section" id="visit" data-reveal>' +
    '      <div class="visit">' +
    '        <div class="visit__copy">' +
    "          <h2>Woolen Mills taproom</h2>" +
    "          <p>1740 Broadway St. #9, Charlottesville, VA 22902</p>" +
    '          <div class="visit__actions">' +
    '            <a class="btn btn--solid" href="tel:4349955777">Call 434-995-5777</a>' +
    '            <a class="btn btn--ghost" href="https://maps.google.com/?q=1740+Broadway+St+%239+Charlottesville+VA+22902" target="_blank" rel="noopener noreferrer">Open in Maps</a>' +
    '            <a class="btn btn--ghost" href="mailto:decipherbrewingco@gmail.com">Email</a>' +
    "          </div>" +
    "        </div>" +
    '        <div class="visit__map">' +
    '          <iframe title="Decipher Brewing on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=1740%20Broadway%20St%20%239%2C%20Charlottesville%2C%20VA%2022902&z=15&output=embed"></iframe>' +
    "        </div>" +
    "      </div>" +
    "    </section>" +
    "  </main>" +
    '  <footer class="footer">' +
    "    <p>decipher brewing · charlottesville, va</p>" +
    '    <p>Concept Redesign by <a href="https://maxmarket.live/" target="_blank" rel="noopener noreferrer">Maximus Marketing</a> | Built for Decipher Brewing</p>' +
    "  </footer>" +
    "</div>";

  function randChar() {
    return CIPHER.charAt(Math.floor(Math.random() * CIPHER.length));
  }

  function decodeText(el, finalText, options) {
    options = options || {};
    if (!el) return Promise.resolve();

    if (reduceMotion) {
      el.textContent = finalText;
      el.style.filter = "none";
      el.style.opacity = "1";
      el.style.transform = "none";
      return Promise.resolve();
    }

    var duration = options.duration || 1100;
    var clean = !!options.clean;
    var maxBlur = clean ? 2.2 : 7;
    var maxY = clean ? 1.5 : 6;
    var start = null;

    return new Promise(function (resolve) {
      function frame(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / duration);
        var ease = clean ? t * t * (3 - 2 * t) : 1 - Math.pow(1 - t, 3);
        var revealed = Math.floor(ease * finalText.length);
        var out = "";

        for (var i = 0; i < finalText.length; i += 1) {
          var ch = finalText.charAt(i);
          if (ch === " " || ch === "·") {
            out += ch;
          } else if (i < revealed) {
            out += ch;
          } else if (clean && i < revealed + 2) {
            out += randChar();
          } else if (!clean) {
            out += randChar();
          } else {
            out += " ";
          }
        }

        el.textContent = out;
        el.style.filter = "blur(" + ((1 - ease) * maxBlur).toFixed(2) + "px)";
        el.style.opacity = String(0.45 + ease * 0.55);
        el.style.transform = "translateY(" + ((1 - ease) * maxY).toFixed(2) + "px)";

        if (t < 1) {
          window.requestAnimationFrame(frame);
        } else {
          el.textContent = finalText;
          el.style.filter = "none";
          el.style.opacity = "1";
          el.style.transform = "none";
          resolve();
        }
      }

      window.requestAnimationFrame(frame);
    });
  }

  function runHeroDecode() {
    var nodes = document.querySelectorAll(".hero [data-decode]");
    var chain = Promise.resolve();
    nodes.forEach(function (node, index) {
      var finalText = node.getAttribute("data-decode") || "";
      var clean = index === 1;
      chain = chain.then(function () {
        return decodeText(node, finalText, {
          duration: index === 0 ? 1200 : index === 1 ? 1000 : 800,
          clean: clean,
        });
      });
    });
    return chain;
  }

  function setOpenStatus() {
    var dot = document.getElementById("open-dot");
    var label = document.getElementById("open-label");
    if (!dot || !label) return;

    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).formatToParts(new Date());

    var map = {};
    parts.forEach(function (p) {
      if (p.type !== "literal") map[p.type] = p.value;
    });

    var dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var day = dayMap[map.weekday];
    var mins = Number(map.hour) * 60 + Number(map.minute);
    var ranges = {
      0: [12 * 60, 20 * 60],
      1: [15 * 60, 21 * 60],
      2: [15 * 60, 21 * 60],
      3: [15 * 60, 21 * 60],
      4: [15 * 60, 21 * 60],
      5: [14 * 60, 22 * 60],
      6: [12 * 60, 22 * 60],
    };
    var range = ranges[day];
    var open = typeof day === "number" && mins >= range[0] && mins < range[1];
    dot.classList.toggle("is-open", open);
    dot.classList.toggle("is-closed", !open);
    label.textContent = open ? "Open now" : "Closed now";
  }

  function bindNav() {
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("nav-toggle");
    var drawer = document.getElementById("nav-drawer");
    if (!nav || !toggle) return;

    function closeDrawer() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    if (drawer) {
      drawer.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeDrawer);
      });
    }
  }

  function bindCards() {
    var cards = document.querySelectorAll("[data-card]");
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var willOpen = !card.classList.contains("is-open");
        cards.forEach(function (other) {
          other.classList.remove("is-open");
          other.setAttribute("aria-expanded", "false");
          var p = other.querySelector(".card__decoded");
          if (p) {
            p.textContent = "";
            p.style.filter = "none";
            p.style.opacity = "1";
            p.style.transform = "none";
          }
        });
        if (!willOpen) return;

        card.classList.add("is-open");
        card.setAttribute("aria-expanded", "true");
        var target = card.querySelector(".card__decoded");
        var finalText = card.getAttribute("data-detail") || "";
        decodeText(target, finalText, { duration: 950 });
      });
    });
  }

  function runAgeDecode() {
    var node = document.querySelector(".agegate [data-decode]");
    if (!node) return Promise.resolve();
    var finalText = node.getAttribute("data-decode") || "";
    return decodeText(node, finalText, { duration: 1100, clean: true });
  }

  function mountAmbientBits() {
    var host = document.getElementById("shell-bits");
    if (!host || reduceMotion) return;
    var glyphs = ["#", "*", "/", "<>", "0x", "||", "::", "[]", "01", "AF"];
    var html = "";
    for (var i = 0; i < 10; i += 1) {
      var left = 6 + ((i * 9.3) % 88);
      var top = 8 + ((i * 17) % 78);
      var delay = (i * 0.55).toFixed(2);
      var dur = (7 + (i % 4) * 1.4).toFixed(1);
      html +=
        '<span class="shell__bit" style="left:' +
        left +
        "%;top:" +
        top +
        "%;animation-duration:" +
        dur +
        "s;animation-delay:" +
        delay +
        's">' +
        glyphs[i % glyphs.length] +
        "</span>";
    }
    host.innerHTML = html;
  }

  function bindReveal() {
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    if (reduceMotion) {
      nodes.forEach(function (node) {
        node.classList.add("is-in");
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (node) {
        node.classList.add("is-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach(function (node) {
      io.observe(node);
    });
  }

  function goLive() {
    var gate = document.getElementById("agegate");
    var shell = document.getElementById("shell");
    document.body.classList.remove("gate-locked");
    if (shell) shell.classList.add("is-live");
    if (gate) {
      gate.classList.add("is-gone");
      window.setTimeout(function () {
        gate.setAttribute("hidden", "");
      }, reduceMotion ? 0 : 400);
    }
    mountAmbientBits();
    bindReveal();
    runHeroDecode();
  }

  function bindAgeGate() {
    var gate = document.getElementById("agegate");
    var yes = document.getElementById("age-yes");
    var no = document.getElementById("age-no");
    var unlocked = false;
    try {
      unlocked = sessionStorage.getItem(GATE_KEY) === "1";
    } catch (err) {}

    if (unlocked) {
      goLive();
      if (gate) {
        gate.classList.add("is-gone");
        gate.setAttribute("hidden", "");
      }
    } else {
      document.body.classList.add("gate-locked");
      window.setTimeout(function () {
        runAgeDecode();
      }, reduceMotion ? 0 : 280);
    }

    if (yes) {
      yes.addEventListener("click", function () {
        try {
          sessionStorage.setItem(GATE_KEY, "1");
        } catch (err2) {}
        goLive();
      });
    }

    if (no) {
      no.addEventListener("click", function () {
        window.location.href = "https://www.google.com";
      });
    }
  }

  if (!window.MaximusPreviewLock) {
    document.body.innerHTML =
      "<p style='padding:2rem;font-family:sans-serif'>Preview lock failed to load.</p>";
    return;
  }

  window.MaximusPreviewLock.boot({
    logoSrc: "../../assets/mm-logo.svg",
    markup: MARKUP,
    onReady: function () {
      setOpenStatus();
      bindNav();
      bindCards();
      bindAgeGate();
      window.setInterval(setOpenStatus, 60000);
    },
  });
})();
