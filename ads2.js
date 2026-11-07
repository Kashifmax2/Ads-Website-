/* ===========================================================
   Page 2 — second ad provider (ProfitOn) + Adsterra banners
   -----------------------------------------------------------
   This file is loaded only by page2.html.
   Page 1 keeps using ads.js, so the two pages never mix config.

   HOW TO ADD PROFITON CODES
   -------------------------
   Paste each ProfitOn snippet between backticks and give it the
   matching slot key below, for example:

     "p2-top": `<script src="https://...profiton..."><\/script>`
              + `<div id="profiton-slot-1"></div>`,

   Slots still empty ("") will show a sponsored button instead of a
   dead box, so the page is never blank.
   =========================================================== */

window.ADS_CONFIG = {
  showPlaceholders: false,
  lazyLoad: true,
  anchorEnabled: true,
  /* ProfitOn smartlink — used by the top CTA and by empty slots */
  sponsorUrl: "https://sb.inveilfunds.com/iKWsbv6LyrYGh/161011"
};

(function () {
  "use strict";

  /* Adsterra banner keys used as the default fill for page 2 */
  var KEY_728 = "108b7b9c4b4ba4a48b1cc80c01c8846c";
  var KEY_300 = "0aab1b3563f21f24a4a5eb419267d682";
  var KEY_468 = "323f1f92767842867de91169792ac12b";

  function banner(key, w, h) {
    return "<script>atOptions = {'key':'" + key + "','format':'iframe','height':" + h +
      ",'width':" + w + ",'params':{}};<\/script>" +
      '<script src="https://www.highrevenueformat.com/' + key + '/invoke.js"><\/script>';
  }

  window.AD_CODES = {

    /* ---------- 728x90 ---------- */
    "p2-top": banner(KEY_728, 728, 90),
    "p2-bottom": banner(KEY_728, 728, 90),
    "p2-anchor": banner(KEY_728, 728, 90),

    /* ---------- 468x60 ---------- */
    "p2-center-1": banner(KEY_468, 468, 60),
    "p2-center-5": banner(KEY_468, 468, 60),

    /* ---------- 300x250 (rails) ---------- */
    "p2-left-1": banner(KEY_300, 300, 250),
    "p2-left-2": banner(KEY_300, 300, 250),
    "p2-left-3": banner(KEY_300, 300, 250),
    "p2-right-1": banner(KEY_300, 300, 250),
    "p2-right-2": banner(KEY_300, 300, 250),
    "p2-right-3": banner(KEY_300, 300, 250),

    /* ---------- 300x250 (center) ---------- */
    "p2-center-2": banner(KEY_300, 300, 250),
    "p2-center-3": banner(KEY_300, 300, 250),
    "p2-center-6": banner(KEY_300, 300, 250),
    "p2-center-7": banner(KEY_300, 300, 250),
    "p2-center-8": banner(KEY_300, 300, 250),

    /* =========================================================
       PROFITON SLOTS — pasted codes
       ========================================================= */

    /* Shuffle box (ProfitOn) — visible in-feed widget */
    "p2-center-4": '<script data-cfasync="false" async type="text/javascript" src="https://rn.kirantisalem.com/stBXnOeQSyJBTGMw/161012"><\/script>',

    /* Pops (ProfitOn) */
    "p2-pop": '<script data-cfasync="false" async type="text/javascript" src="https://ll.sunrosehippi.com/rgYXM4X8TKB5YvtRu/161010"><\/script>',

    /* Extra global script slot (kept for future codes) */
    "p2-global": "",

    /* Social bar (no code supplied yet) */
    "p2-social": "",

    /* Interstitial / vignette (no code supplied yet) */
    "p2-vignette": ""
  };
})();
