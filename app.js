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
    halfpage: "300×600",
    rectangle: "300×250",
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
    // innerHTML से आए <script> खुद नहीं चलते — इन्हें दोबारा बनाना पड़ता है।
    // बाहरी स्क्रिप्ट के load होने का इंतज़ार करते हैं, ताकि उसके बाद वाला
    // inline कोड (जैसे AdSense का push) सही क्रम में चले।
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
        setTimeout(finish, 8000); // स्क्रिप्ट ब्लॉक हो जाए तो आगे बढ़ें
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
        /* AdSense script अभी लोड नहीं हुआ — कोई बात नहीं */
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

    // अगर index.html में सीधे कोड पेस्ट किया है तो उसे छेड़ेंगे नहीं।
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
      // अगर snippet में push({}) पहले से है तो दोबारा push नहीं करेंगे।
      if (!hasPush) pushAdSense(slot);

      slot.dispatchEvent(new CustomEvent("ad:filled", { bubbles: true, detail: { slot: key } }));
      console.log("[ads] loaded:", key);
    });
  }

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

      var isHidden = slot.classList.contains("ad-slot-hidden");

      if (!observer || isHidden) {
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
     Anchor ad (नीचे चिपकने वाला)
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

    // कोड है या placeholder दिख रहा है — दोनों में दिखाएँ ताकि जांच हो सके।
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
    var y = window.scrollY || window.pageYOffset;
    toTop.classList.toggle("show", y > 500);
  }

  if (toTop) {
    window.addEventListener("scroll", onScroll, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll();
  }

  /* ---------------------------------------------------------
     Load more posts (+ 1 ad slot each time)
     --------------------------------------------------------- */

  var extraPosts = [
    {
      cat: "Tip",
      title: "Battery draining fast? Change these 3 settings first",
      text: "Location, background refresh and screen brightness together use the most battery."
    },
    {
      cat: "Money",
      title: "Online shopping refund not arrived? Do this",
      text: "Save the order ID, bank statement and support chat screenshot while you follow up."
    },
    {
      cat: "How-to",
      title: "Turn an old phone into a home CCTV camera",
      text: "One free app, a bit of space and a charger — that is all you need."
    }
  ];

  var feed = document.getElementById("more-feed");
  var loadBtn = document.getElementById("load-more");
  var added = 0;
  var MAX_POSTS = extraPosts.length;

  function makeMiniPost(post) {
    var article = document.createElement("article");
    article.className = "mini-post";

    var cat = document.createElement("p");
    cat.className = "kicker";
    cat.textContent = post.cat;

    var title = document.createElement("h3");
    title.textContent = post.title;

    var text = document.createElement("p");
    text.textContent = post.text;

    article.appendChild(cat);
    article.appendChild(title);
    article.appendChild(text);
    return article;
  }

  function makeAdSlot(index) {
    var slot = document.createElement("aside");
    slot.className = "ad-slot";
    slot.setAttribute("data-slot", "deep-" + index);
    slot.setAttribute("data-size", "native");
    slot.setAttribute("aria-label", "Advertisement");
    return slot;
  }

  if (feed && loadBtn) {
    loadBtn.addEventListener("click", function () {
      if (added >= MAX_POSTS) return;

      var post = extraPosts[added];
      added += 1;

      feed.appendChild(makeMiniPost(post));

      var slot = makeAdSlot(added);
      feed.appendChild(slot);
      registerSlots(feed);
      mount(slot); // यहाँ तुरंत mount, क्योंकि यूज़र खुद इस जगह तक आया है।

      if (added >= MAX_POSTS) {
        loadBtn.textContent = "No more posts";
        loadBtn.disabled = true;
      }
    });
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
})();
