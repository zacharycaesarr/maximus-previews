/**
 * Maximus Preview Lock
 * Soft anti-theft + floating badge. No password gate (cold-call previews stay open).
 */
(function (global) {
  "use strict";

  var LOCK_CSS =
    "@import url('https://fonts.googleapis.com/css2?family=Karla:wght@500;600&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');" +
    ".mm-badge{position:fixed;right:14px;bottom:14px;z-index:99990;display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid rgba(0,0,0,.12);background:rgba(255,255,255,.94);color:#1a1a1a;text-decoration:none;backdrop-filter:blur(10px);box-shadow:0 10px 40px rgba(0,0,0,.18)}" +
    ".mm-badge__logo{width:22px;height:26px;flex:0 0 auto;opacity:.95}" +
    ".mm-badge__text{display:flex;flex-direction:column;gap:2px;line-height:1.2}" +
    ".mm-badge__text strong{font-size:12px;font-weight:600;letter-spacing:.02em;font-family:'Playfair Display',Georgia,serif}" +
    ".mm-badge__text span{font-size:11px;color:#444;letter-spacing:.04em;text-transform:lowercase;font-family:Karla,system-ui,sans-serif;font-weight:600;font-style:normal}" +
    "@media (max-width:640px){.mm-badge{right:10px;bottom:10px;padding:8px 10px}.mm-badge__text strong{font-size:11px}}";

  function injectCss(css) {
    if (document.getElementById("mm-lock-css")) return;
    var s = document.createElement("style");
    s.id = "mm-lock-css";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function softProtect() {
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    document.addEventListener("keydown", function (e) {
      var key = e.key || "";
      var lower = key.toLowerCase();
      var ctrl = e.ctrlKey || e.metaKey;
      var shift = e.shiftKey;
      var blocked =
        key === "F12" ||
        (ctrl && shift && (lower === "i" || lower === "j" || lower === "c")) ||
        (ctrl && lower === "u");
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  }

  function mountBadge(logoSrc) {
    if (document.querySelector(".mm-badge")) return;
    var a = document.createElement("a");
    a.className = "mm-badge";
    a.href = "https://maxmarket.live/";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", "Concept redesign by Maximus Marketing");
    a.innerHTML =
      '<img class="mm-badge__logo" src="' +
      logoSrc +
      '" width="22" height="26" alt="" />' +
      '<span class="mm-badge__text"><strong>Concept Redesign by Maximus Marketing</strong><span>maxmarket.live</span></span>';
    document.body.appendChild(a);
  }

  /**
   * @param {object} opts
   * @param {string} opts.markup HTML string for #app
   * @param {string} [opts.logoSrc]
   * @param {function} [opts.onReady]
   */
  function boot(opts) {
    injectCss(LOCK_CSS);
    softProtect();

    var app = document.getElementById("app");
    if (!app) {
      console.error("Maximus Preview Lock: #app missing");
      return;
    }

    app.innerHTML = opts.markup;
    mountBadge(opts.logoSrc || "../../assets/mm-logo.svg");
    if (typeof opts.onReady === "function") opts.onReady();
  }

  global.MaximusPreviewLock = { boot: boot };
})(window);
