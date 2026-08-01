(function () {
  "use strict";

  var gate = document.getElementById("agegate");
  var enterBtn = document.getElementById("age-enter");
  var exitBtn = document.getElementById("age-exit");
  var key = "gtv_industrial_age";

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
    }, 1500);
  }

  document.querySelectorAll("[data-add]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      count += 1;
      if (badge) badge.textContent = String(count);
      showToast("Added to cart (" + count + ")");
    });
  });

  var qr = document.getElementById("qr");
  var qrBtn = document.getElementById("qr-btn");
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
      showToast("Sample pickup QR ready");
    });
  }

  /* Scroll / enter reveals */
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    nodes.forEach(function (el) {
      io.observe(el);
    });
  } else {
    nodes.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* Soft enter on first paint for above-the-fold hero bits */
  window.requestAnimationFrame(function () {
    document.querySelectorAll(".hero .reveal").forEach(function (el, i) {
      window.setTimeout(function () {
        el.classList.add("is-in");
      }, 120 + i * 90);
    });
  });
})();
