/* ===========================================================
   TechSarthi — ad loader + page interactions
   =========================================================== */
(function () {
  "use strict";

  var config = Object.assign(
    { showPlaceholders: true, lazyLoad: false, anchorEnabled: true },
    window.ADS_CONFIG || {}
  );
  var codes = window.AD_CODES || {};
  var mountedSlots = new WeakSet();

  var SIZE_HINTS = {
    leaderboard: "728×90 / responsive",
    billboard: "300×250 / 336×280",
    native: "responsive native",
    rectangle: "300×250",
    skyscraper: "160×600",
    "sky-short": "160×300",
    anchor: "anchor / sticky",
    vignette: "interstitial",
    script: "script only"
  };

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */

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
    hint.textContent = (SIZE_HINTS[size] || "ad space") + " — paste your code in ads.js";

    box.appendChild(label);
    box.appendChild(name);
    box.appendChild(hint);
    slot.appendChild(box);
  }

  function runScripts(root, done) {
    // Scripts inserted with innerHTML do not execute, so rebuild them.
    // Wait for each external script to load before running the next one.
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
        setTimeout(finish, 8000);
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
      } catch (e) {
        /* The AdSense library has not loaded yet. */
      }
    });
  }

  /* ---------------------------------------------------------
     Mount one slot
     --------------------------------------------------------- */

  function mount(slot) {
    if (mountedSlots.has(slot)) return;
    mountedSlots.add(slot);

    var key = slot.getAttribute("data-slot") || "";
    var isHiddenSlot = slot.classList.contains("ad-slot-hidden");

    // Code pasted directly in HTML: leave it alone.
    if (slot.childElementCount > 0 || slot.textContent.trim() !== "") return;

    var code = (codes[key] || "").trim();

    if (!code) {
      if (!isHiddenSlot) {
        showPlaceholder(slot);
        slot.dispatchEvent(new CustomEvent("ad:placeholder", { bubbles: true, detail: { slot: key } }));
      }
      return;
    }

    var hasPush = /\.push\s*\(/.test(code);

    slot.innerHTML = code;
    slot.classList.add("ad-filled");

    runScripts(slot, function () {
      if (!hasPush) pushAdSense(slot);

      slot.dispatchEvent(new CustomEvent("ad:filled", { bubbles: true, detail: { slot: key } }));
      console.log("[ads] loaded:", key);
    });
  }

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
    }, { rootMargin: "700px 0px", threshold: 0 });
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
     Sticky anchor ad
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
     Back to top
     --------------------------------------------------------- */

  var toTop = document.getElementById("to-top");

  function onScroll() {
    if (!toTop) return;
    toTop.classList.toggle("show", (window.scrollY || 0) > 400);
  }

  if (toTop) {
    window.addEventListener("scroll", onScroll, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll();
  }

  /* ---------------------------------------------------------
     Start
     --------------------------------------------------------- */

  function boot() {
    registerSlots(document);
    enableAnchor();

    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Useful if you add slots dynamically later.
  window.TechSarthiAds = {
    mount: function (scope) { registerSlots(scope || document); },
    mountSlot: mount
  };
})();
