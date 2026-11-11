/* ===========================================================
   TechSarthi — ad loader
   -----------------------------------------------------------
   Banners are isolated in their own srcdoc iframe, so every
   placement loads in parallel and no two ad scripts can
   overwrite each other's globals.

   A band stays hidden until a real creative is detected inside
   it. If the network returns nothing, the band is removed from
   the layout completely: no empty boxes, no grey placeholders
   and no fallback link to an offer.
   =========================================================== */
(function () {
  "use strict";

  var config = Object.assign(
    { showPlaceholders: false, lazyLoad: true, anchorEnabled: false },
    window.ADS_CONFIG || {}
  );
  var codes = window.AD_CODES || {};
  var mounted = new WeakSet();

  var SIZES = {
    leaderboard: { w: 728, h: 90 },
    rectangle: { w: 300, h: 250 },
    wide: { w: 468, h: 60 },
    anchor: { w: 728, h: 90 }
  };

  /* ---------------------------------------------------------
     Fill detection
     --------------------------------------------------------- */

  function hasCreative(root, depth) {
    if (!root || depth > 2) return false;

    var images = root.querySelectorAll("img");
    for (var i = 0; i < images.length; i++) {
      if (images[i].naturalWidth > 8) return true;
    }

    var links = root.querySelectorAll("a[href]");
    for (var j = 0; j < links.length; j++) {
      var lr = links[j].getBoundingClientRect();
      if (lr.width > 8 && lr.height > 8) return true;
    }

    var media = root.querySelectorAll("canvas, video, ins.adsbygoogle, object, embed");
    for (var k = 0; k < media.length; k++) {
      var mr = media[k].getBoundingClientRect();
      if (mr.width > 8 && mr.height > 8) return true;
    }

    var frames = root.querySelectorAll("iframe");
    for (var n = 0; n < frames.length; n++) {
      if (frames[n].clientWidth > 8 && frames[n].clientHeight > 8) return true;
      var inner = null;
      try { inner = frames[n].contentDocument; } catch (e) { return true; }
      if (hasCreative(inner, depth + 1)) return true;
    }

    return false;
  }

  /* ---------------------------------------------------------
     Band visibility
     --------------------------------------------------------- */

  function bandOf(slot) {
    return slot.closest(".ad");
  }

  function reveal(slot) {
    slot.classList.remove("is-empty");
    slot.classList.add("ad-filled");
    var band = bandOf(slot);
    if (band) band.classList.remove("is-empty");
    scheduleFit();
  }

  function fold(slot) {
    if (slot.classList.contains("ad-filled")) return;
    slot.classList.add("is-empty");
    var band = bandOf(slot);
    if (band) band.classList.add("is-empty");
  }

  function watchFill(slot, frame) {
    /* Keep looking for a while: networks can answer late. */
    [700, 1500, 3000, 6000, 10000, 15000].forEach(function (ms) {
      setTimeout(function () {
        var filled = false;

        if (frame && frame.isConnected) {
          var doc = null;
          try {
            doc = frame.contentDocument;
          } catch (e) {
            filled = true;
          }
          if (!filled) filled = hasCreative(doc, 0);
        } else {
          filled = hasCreative(slot, 0);
        }

        if (filled) {
          reveal(slot);
        } else if (ms >= 6000) {
          fold(slot);
        }
      }, ms);
    });
  }

  /* ---------------------------------------------------------
     Mount
     --------------------------------------------------------- */

  function mountBanner(slot, code, size, key) {
    var frame = document.createElement("iframe");

    frame.className = "ad-frame";
    frame.width = size.w;
    frame.height = size.h;
    frame.setAttribute("frameborder", "0");
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("title", "Advertisement");

    frame.srcdoc =
      '<!doctype html><html><head><meta charset="utf-8">' +
      '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}' +
      "iframe,img{max-width:100%;border:0;display:block}</style></head><body>" +
      code +
      "</body></html>";

    slot.appendChild(frame);
    slot.classList.add("ad-mounting");
    watchFill(slot, frame);
  }

  function mount(slot) {
    if (mounted.has(slot)) return;
    mounted.add(slot);

    if (slot.childElementCount > 0 || slot.textContent.trim() !== "") return;

    var key = slot.getAttribute("data-slot") || "";
    var code = (codes[key] || "").trim();
    var size = SIZES[slot.getAttribute("data-size")];

    if (!code || !size) {
      fold(slot);
      return;
    }

    mountBanner(slot, code, size, key);
  }

  /* ---------------------------------------------------------
     Fit oversized banners on narrow screens
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
     Lazy loading
     --------------------------------------------------------- */

  var observer = null;

  if (config.lazyLoad && "IntersectionObserver" in window) {
    observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        mount(entry.target);
      });
    }, { rootMargin: "700px 0px", threshold: 0 });
  }

  function registerSlots(scope) {
    var slots = (scope || document).querySelectorAll(".ad-slot:not([data-ad-watched])");

    Array.prototype.forEach.call(slots, function (slot) {
      slot.setAttribute("data-ad-watched", "1");

      if (!observer) {
        mount(slot);
        return;
      }

      var rect = slot.getBoundingClientRect();
      if (rect.top < window.innerHeight + 600) {
        mount(slot);
      } else {
        observer.observe(slot);
      }
    });
  }

  /* If the reader jumps down the page, mount what is now close. */
  var sweepTimer = null;

  function sweep() {
    var slots = document.querySelectorAll(".ad-slot[data-ad-watched]:not(.ad-mounting)");
    var limit = window.innerHeight + 900;

    Array.prototype.forEach.call(slots, function (slot) {
      var rect = slot.getBoundingClientRect();
      if (rect.top < limit && rect.bottom > -900) {
        if (observer) observer.unobserve(slot);
        mount(slot);
      }
    });
  }

  window.addEventListener("scroll", function () {
    if (sweepTimer) return;
    sweepTimer = setTimeout(function () {
      sweepTimer = null;
      sweep();
    }, 200);
  }, { passive: true });

  /* ---------------------------------------------------------
     Start
     --------------------------------------------------------- */

  function boot() {
    registerSlots(document);
    setTimeout(fitAdFrames, 600);
    setTimeout(fitAdFrames, 2500);
    setTimeout(sweep, 800);
    setTimeout(sweep, 2500);
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
