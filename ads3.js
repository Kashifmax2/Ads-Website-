/* ===========================================================
   Page 3 — third ad page
   -----------------------------------------------------------
   This file is loaded only by page3.html.
   Page 1 keeps ads.js, page 2 keeps ads2.js, so no page can
   overwrite another page's slots.

   HOW IT IS FILLED
   ----------------
   Every visible slot starts with an Adsterra banner, so page 3
   is never a wall of dead boxes. When you get codes from another
   network (CCNSAD, ProfitOn, Monetag), paste them in the
   OVERRIDES block below. Any slot you override there replaces
   the Adsterra banner for that slot only.

     "p3-top": `<script ...><\/script>`,

   Keys left out of OVERRIDES keep Adsterra. The popunder slot
   (p3-pop) already runs the ProfitOn popunder as a safety net, so
   the page earns on clicks even before CCNSAD is installed; a
   CCNSAD snippet in OVERRIDES replaces it.
   =========================================================== */

window.ADS_CONFIG = {
  showPlaceholders: false,
  /* Fill every slot on load: this page exists only to show ads, and a
     slot that waits for a scroll is an impression lost. */
  lazyLoad: false,
  anchorEnabled: true,
  /* Used by the top CTA and by any slot that returns nothing. */
  sponsorUrl: "https://sb.inveilfunds.com/iKWsbv6LyrYGh/161011"
};

(function () {
  "use strict";

  var KEY_728 = "108b7b9c4b4ba4a48b1cc80c01c8846c";
  var KEY_300 = "0aab1b3563f21f24a4a5eb419267d682";
  var KEY_468 = "323f1f92767842867de91169792ac12b";

  function banner(key, w, h) {
    return "<script>atOptions = {'key':'" + key + "','format':'iframe','height':" + h +
      ",'width':" + w + ",'params':{}};<\/script>" +
      '<script src="https://www.highrevenueformat.com/' + key + '/invoke.js"><\/script>';
  }

  var codes = {

    /* ---------- 728x90 ---------- */
    "p3-top": banner(KEY_728, 728, 90),
    "p3-bottom": banner(KEY_728, 728, 90),
    "p3-anchor": banner(KEY_728, 728, 90),

    /* ---------- 468x60 ---------- */
    "p3-center-1": banner(KEY_468, 468, 60),
    "p3-center-5": banner(KEY_468, 468, 60),

    /* ---------- 300x250 (rails) ---------- */
    "p3-left-1": banner(KEY_300, 300, 250),
    "p3-left-2": banner(KEY_300, 300, 250),
    "p3-left-3": banner(KEY_300, 300, 250),
    "p3-right-1": banner(KEY_300, 300, 250),
    "p3-right-2": banner(KEY_300, 300, 250),
    "p3-right-3": banner(KEY_300, 300, 250),

    /* ---------- 300x250 (center) ---------- */
    "p3-center-2": banner(KEY_300, 300, 250),
    "p3-center-3": banner(KEY_300, 300, 250),
    "p3-center-6": banner(KEY_300, 300, 250),
    "p3-center-7": banner(KEY_300, 300, 250),
    "p3-center-8": banner(KEY_300, 300, 250),

    /* In-feed slot. Kept out of the iframe path so a native widget
       can render here; data-no-cta stops our CTA covering it. */
    "p3-center-4": banner(KEY_300, 300, 250),

    /* =========================================================
       HIDDEN / SCRIPT-ONLY SLOTS
       ========================================================= */

    /* ProfitOn popunder (zone 161010) — a safety net so page 3
       still earns on every click while CCNSAD has no codes yet.
       Override this key with the CCNSAD snippet when it arrives. */
    "p3-pop": '<script data-cfasync="false" async type="text/javascript" src="https://ll.sunrosehippi.com/rgYXM4X8TKB5YvtRu/161010"><\/script>',
    "p3-social": "",
    "p3-vignette": "",
    "p3-global": ""
  };

  /* =========================================================
     PASTE NEW-NETWORK CODES HERE
     ---------------------------------------------------------
     Example:
       "p3-top": '<script async src="https://..."></script>',
       "p3-pop": '<script async src="https://..."></script>',
     Leave a key out to keep the Adsterra banner already set above.
     ========================================================= */

  var overrides = {
    /* "p3-top": "", */
  };

  Object.keys(overrides).forEach(function (key) {
    var value = (overrides[key] || "").trim();
    if (value) codes[key] = value;
  });

  window.AD_CODES = codes;
})();
