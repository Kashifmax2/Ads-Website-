/* ===========================================================
   TechSarthi — fast ad loader
   -----------------------------------------------------------
   Banners are isolated in their own iframes (parallel loading,
   no global atOptions clashes). Popunder / social bar / native
   load directly. Nothing waits on an 8 second chain.
   =========================================================== */
(function () {
  "use strict";

  var config = Object.assign(
    { showPlaceholders: false, lazyLoad: false, anchorEnabled: true },
    window.ADS_CONFIG || {}
  );
  var codes = window.AD_CODES || {};
  var mountedSlots = new WeakSet();

  var BANNER_SIZES = {
    leaderboard: { w: 728, h: 90 },
    anchor: { w: 728, h: 90 },
    rectangle: { w: 300, h: 250 },
    wide: { w: 468, h: 60 }
  };

  var SIZE_HINTS = {
    leaderboard: "728×90",
    billboard: "300×250 / 336×280",
    native: "responsive native",
    rectangle: "300×250",
    wide: "468×60",
    anchor: "728×90 sticky",
    vignette: "interstitial",
    script: "script only"
  };

  /* ---------------------------------------------------------
     Fallback box (keeps the layout stable if an ad is blocked)
     --------------------------------------------------------- */

  function addFallback(slot) {
    if (slot.querySelector(":scope > .ad-fallback")) return;

    var box = document.createElement("div");
    box.className = "ad-fallback";

    var label = document.createElement("span");
    label.textContent = "Advertisement";

    box.appendChild(label);
    slot.appendChild(box);
  }

  function showPlaceholder(slot) {
    if (!config.showPlaceholders) return;

    var size = slot.getAttribute("data-size") || "";
    var box = document.createElement("div");
    box.className = "ad-placeholder";

    var label = document.createElement("span");
    label.className = "ad-placeholder-label";
    label.textContent = "Advertisement";

    var name = document.createElement("span");
    name.className = "ad-placeholder-name";
    name.textContent = slot.getAttribute("data-slot") || "ad";

    var hint = document.createElement("span");
    hint.className = "ad-placeholder-hint";
    hint.textContent = SIZE_HINTS[size] || "ad space";

    box.appendChild(label);
    box.appendChild(name);
    box.appendChild(hint);
    slot.appendChild(box);
  }

  /* ---------------------------------------------------------
     Run scripts for direct (non-iframe) slots
     --------------------------------------------------------- */

  function runScripts(root, done) {
    var scripts = Array.prototype.slice.call(root.querySelectorAll("script"));

    if (!scripts.length) {
      if (done) done();
      return;
    }

    var queue = scripts.map(function (old) {
      return {
        attrs: Array.prototype.map.call(old.attributes, function (attr) {
          return [attr.name, attr.value];
        }),
        text: old.textContent || ""
      };
    });

    scripts.forEach(function (old) { old.parentNode.removeChild(old); });

    var index = 0;

    function step() {
      if (index >= queue.length) {
        if (done) done();
        return;
      }

      var item = queue[index++];
      var fresh = document.createElement("script");

      item.attrs.forEach(function (pair) {
        fresh.setAttribute(pair[0], pair[1]);
      });
      fresh.text = item.text;

      var type = (fresh.getAttribute("type") || "").toLowerCase();
      var isDataScript = type && type !== "text/javascript" &&
        type !== "application/javascript" && type !== "module";

      if (fresh.src && !isDataScript) {
        var finished = false;
        var finish = function () {
          if (finished) return;
          finished = true;
          step();
        };
        fresh.addEventListener("load", finish);
        fresh.addEventListener("error", finish);
        setTimeout(finish, 5000);
        root.appendChild(fresh);
      } else {
        root.appendChild(fresh);
        step();
      }
    }

    step();
  }

  function pushAdSense(root) {
    var units = root.querySelectorAll("ins.adsbygoogle");
    if (!units.length) return;
    Array.prototype.forEach.call(units, function () {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
    });
  }

  /* ---------------------------------------------------------
     Mount helpers
     --------------------------------------------------------- */

  function mountBanner(slot, code, size, key) {
    var frame = document.createElement("iframe");

    frame.className = "ad-frame";
    frame.width = size.w;
    frame.height = size.h;
    frame.setAttribute("frameborder", "0");
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("title", "Advertisement");

    var inAnchor = !!slot.closest("#anchor-ad");
    var nearTop = slot.getBoundingClientRect().top < window.innerHeight + 200;
    frame.loading = (inAnchor || nearTop) ? "eager" : "lazy";

    frame.srcdoc =
      '<!doctype html><html><head><meta charset="utf-8">' +
      '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}' +
      'iframe,img{max-width:100%;border:0;display:block}</style></head><body>' +
      code +
      "</body></html>";

    frame.addEventListener("load", scheduleFit);
    slot.appendChild(frame);
    slot.classList.add("ad-filled");
    scheduleFit();
    console.log("[ads] banner:", key);
  }

  function mountDirect(slot, code, key) {
    slot.innerHTML = code;
    slot.classList.add("ad-filled");

    if (!slot.classList.contains("ad-slot-hidden")) addFallback(slot);

    runScripts(slot, function () {
      if (!/\.push\s*\(/.test(code)) pushAdSense(slot);
      scheduleFit();
      console.log("[ads] direct:", key);
    });
  }

  function mount(slot) {
    if (mountedSlots.has(slot)) return;
    mountedSlots.add(slot);

    var key = slot.getAttribute("data-slot") || "";
    var isHidden = slot.classList.contains("ad-slot-hidden");

    // Code already pasted directly in HTML.
    if (slot.childElementCount > 0 || slot.textContent.trim() !== "") return;

    var code = (codes[key] || "").trim();
    var size = BANNER_SIZES[slot.getAttribute("data-size")];

    if (!isHidden) addFallback(slot);

    if (!code) {
      if (!isHidden && config.showPlaceholders) showPlaceholder(slot);
      return;
    }

    if (!isHidden && size) {
      mountBanner(slot, code, size, key);
    } else {
      mountDirect(slot, code, key);
    }

    slot.dispatchEvent(new CustomEvent("ad:filled", { bubbles: true, detail: { slot: key } }));
  }

  /* ---------------------------------------------------------
     Fit oversized banners on small screens
     --------------------------------------------------------- */

  var fitTimer = null;

  function scheduleFit() {
    if (fitTimer) return;
    fitTimer = setTimeout(function () {
      fitTimer = null;
      fitAdFrames();
    }, 250);
  }

  function fitAdFrames() {
    var frames = document.querySelectorAll("iframe.ad-frame");

    Array.prototype.forEach.call(frames, function (frame) {
      var slot = frame.parentElement;
      if (!slot) return;

      frame.style.transform = "";
      frame.style.transformOrigin = "";
      slot.style.height = "";
      slot.classList.remove("ad-scaled");

      var available = slot.clientWidth;
      var frameWidth = frame.offsetWidth;

      if (!available || !frameWidth || frameWidth <= available + 1) return;

      var scale = Math.max(available / frameWidth, 0.28);
      frame.style.transformOrigin = "top center";
      frame.style.transform = "scale(" + scale + ")";
      slot.style.height = Math.ceil(frame.offsetHeight * scale) + "px";
      slot.classList.add("ad-scaled");
    });
  }

  window.addEventListener("load", fitAdFrames);
  window.addEventListener("resize", scheduleFit);

  /* ---------------------------------------------------------
     Lazy loading (optional)
     --------------------------------------------------------- */

  var observer = null;

  if (config.lazyLoad && "IntersectionObserver" in window) {
    observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        mount(entry.target);
      });
    }, { rootMargin: "900px 0px", threshold: 0 });
  }

  function registerSlots(scope) {
    var slots = (scope || document).querySelectorAll(".ad-slot:not([data-ad-watched])");

    Array.prototype.forEach.call(slots, function (slot) {
      slot.setAttribute("data-ad-watched", "1");

      if (!observer || slot.classList.contains("ad-slot-hidden")) {
        mount(slot);
        return;
      }

      var rect = slot.getBoundingClientRect();
      if (rect.top < window.innerHeight + 700) {
        mount(slot);
      } else {
        observer.observe(slot);
      }
    });
  }

  /* ---------------------------------------------------------
     Sticky anchor
     --------------------------------------------------------- */

  var anchorWrap = document.getElementById("anchor-ad");
  var anchorClose = document.getElementById("anchor-close");
  var anchorClosed = false;

  try {
    anchorClosed = sessionStorage.getItem("ts-anchor-closed") === "1";
  } catch (e) {}

  function enableAnchor() {
    if (!anchorWrap || !config.anchorEnabled || anchorClosed) return;
    var slot = anchorWrap.querySelector(".ad-slot");
    if (!slot) return;

    anchorWrap.hidden = false;
    mount(slot);
  }

  if (anchorClose) {
    anchorClose.addEventListener("click", function () {
      anchorWrap.hidden = true;
      anchorClosed = true;
      try { sessionStorage.setItem("ts-anchor-closed", "1"); } catch (e) {}
    });
  }

  /* ---------------------------------------------------------
     Start
     --------------------------------------------------------- */

  function boot() {
    // Popunder and social bar first, so click-triggered ads are ready.
    var hiddenSlots = document.querySelectorAll(".ad-slot-hidden");
    Array.prototype.forEach.call(hiddenSlots, mount);

    registerSlots(document);
    enableAnchor();

    setTimeout(fitAdFrames, 500);
    setTimeout(fitAdFrames, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.TechSarthiAds = {
    mount: function (scope) { registerSlots(scope || document); },
    mountSlot: mount,
    fit: fitAdFrames
  };
})();
