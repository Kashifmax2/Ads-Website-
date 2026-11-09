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

  var SPONSOR_URL = config.sponsorUrl === ""
    ? ""
    : (config.sponsorUrl ||
      "https://sb.inveilfunds.com/iKWsbv6LyrYGh/161011");

  function addFallback(slot) {
    if (slot.querySelector(":scope > .ad-fallback")) return;

    var box = document.createElement("div");
    box.className = "ad-fallback";

    var label = document.createElement("span");
    label.className = "ad-fallback-label";
    label.textContent = "Advertisement";

    box.appendChild(label);
    slot.appendChild(box);
  }

  var CTA_LABELS = [
    "See today's offers",
    "Open the sponsored offer",
    "Check today's deal",
    "View sponsored offer"
  ];
  var ctaIndex = 0;

  /* If the network returns nothing for a slot, the box turns into a real
     clickable sponsored ad instead of staying dead. */
  function promoteFallback(slot) {
    if (!SPONSOR_URL) return;
    /* Slots that host a third-party widget must never be covered by our CTA. */
    if (slot.hasAttribute("data-no-cta")) return;
    var box = slot.querySelector(":scope > .ad-fallback");
    if (!box || box.getAttribute("data-promoted") === "1") return;
    box.setAttribute("data-promoted", "1");

    box.textContent = "";

    var link = document.createElement("a");
    link.className = "fallback-cta";
    link.href = SPONSOR_URL;
    link.target = "_blank";
    link.rel = "sponsored noopener nofollow";

    var tag = document.createElement("span");
    tag.className = "fallback-tag";
    tag.textContent = "Sponsored";

    var title = document.createElement("strong");
    title.textContent = CTA_LABELS[ctaIndex++ % CTA_LABELS.length];

    var arrow = document.createElement("span");
    arrow.className = "fallback-arrow";
    arrow.textContent = "\u2192";

    link.appendChild(tag);
    link.appendChild(title);
    link.appendChild(arrow);
    box.appendChild(link);

    slot.classList.add("ad-empty");
  }

  function revertFallback(slot) {
    var box = slot.querySelector(":scope > .ad-fallback");
    slot.classList.remove("ad-empty");
    if (!box || box.getAttribute("data-promoted") !== "1") return;
    box.removeAttribute("data-promoted");
    box.textContent = "";

    var label = document.createElement("span");
    label.className = "ad-fallback-label";
    label.textContent = "Advertisement";
    box.appendChild(label);
  }

  /* Does this document (or a nested ad document) actually show a creative? */
  function hasCreative(root, depth, ignore) {
    if (!root || depth > 3) return false;

    function skipped(el) {
      return !!(ignore && el && (el === ignore || ignore.contains(el)));
    }

    var img = root.querySelector("img");
    if (img && !skipped(img) && img.naturalWidth > 8) return true;

    var links = root.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      if (skipped(links[i])) continue;
      var lr = links[i].getBoundingClientRect();
      if (lr.width > 8 && lr.height > 8) return true;
    }

    var media = root.querySelectorAll("canvas, video, ins.adsbygoogle, object, embed");
    for (var j = 0; j < media.length; j++) {
      if (skipped(media[j])) continue;
      var mr = media[j].getBoundingClientRect();
      if (mr.width > 8 && mr.height > 8) return true;
    }

    var frames = root.querySelectorAll("iframe");
    for (var k = 0; k < frames.length; k++) {
      if (skipped(frames[k])) continue;
      var inner = null;
      try { inner = frames[k].contentDocument; } catch (e) { return true; }
      if (hasCreative(inner, depth + 1, null)) return true;
    }

    return false;
  }

  function watchFill(slot, frame) {
    var timers = [1800, 4000, 7000, 12000, 18000];

    timers.forEach(function (ms) {
      setTimeout(function () {
        var filled = false;

        if (frame && frame.isConnected) {
          var doc = null;
          try { doc = frame.contentDocument; } catch (e) { filled = true; }
          filled = filled || hasCreative(doc, 0, null);
        } else {
          filled = hasCreative(slot, 0, slot.querySelector(":scope > .ad-fallback"));
        }

        if (filled) {
          revertFallback(slot);
        } else if (ms >= 4000) {
          promoteFallback(slot);
        }
      }, ms);
    });
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
    watchFill(slot, frame);
    console.log("[ads] banner:", key);
  }

  function mountDirect(slot, code, key) {
    slot.innerHTML = code;
    slot.classList.add("ad-filled");

    if (!slot.classList.contains("ad-slot-hidden")) addFallback(slot);

    runScripts(slot, function () {
      if (!/\.push\s*\(/.test(code)) pushAdSense(slot);
      scheduleFit();
      watchFill(slot, null);
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

  /* Safety net: if the page jumps (End key, anchor link, fast flick),
     mount every slot near the new position right away. */
  var sweepTimer = null;

  function sweep() {
    var slots = document.querySelectorAll(".ad-slot[data-ad-watched]:not(.ad-filled)");
    var limit = window.innerHeight + 1200;

    Array.prototype.forEach.call(slots, function (slot) {
      if (slot.classList.contains("ad-slot-hidden")) return;
      var rect = slot.getBoundingClientRect();
      if (rect.top < limit && rect.bottom > -1200) {
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
    }, 150);
  }, { passive: true });

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

    // Layout grows as ads arrive, so re-check what is near the viewport.
    setTimeout(sweep, 600);
    setTimeout(sweep, 1800);
    setTimeout(sweep, 3500);
    setTimeout(sweep, 7000);
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
