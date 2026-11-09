/* ===========================================================
   Page 4 — fourth ad page, built for Monetag
   -----------------------------------------------------------
   This file is loaded only by page4.html.
   Page 1 = ads.js, page 2 = ads2.js, page 3 = ads3.js, so no
   page can overwrite another page's slots.

   MONETAG SETUP
   -------------
   The verification meta is already on every page:

     <meta name="monetag" content="f4abe85b2963045eeecfe285f434191b">

   Two tags are installed in OVERRIDES below and between them
   they run all five zones of this site:

     p4-global  Multitag 307882 — push 12224249,
                vignette 12224248, in-page push 12224247,
                OnClick multi 12224246
     p4-pop     OnClick (popunder) 12224255 — Happy tag

   p4-social and p4-vignette stay empty because the multitag
   already serves those formats; adding a code there would
   double-count the same impression.

   Visible banner slots keep Adsterra. A Monetag banner zone
   pasted into one of them (e.g. "p4-top") replaces only that
   slot's Adsterra banner.

   The Direct Link zone (12224273) is wired to sponsorUrl, so the
   top CTA and every empty slot point at Monetag, not at the
   ProfitOn smartlink used by pages 1 and 2.
   =========================================================== */

window.ADS_CONFIG = {
  showPlaceholders: false,
  /* Fill every slot on load: this page exists only to show ads. */
  lazyLoad: false,
  anchorEnabled: true,
  /* Monetag Direct Link (Wise tag, zone 12224273) — used by the top
     CTA and by any slot that comes back empty. */
  sponsorUrl: "https://uplcm.com/4/12224273"
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
    "p4-top": banner(KEY_728, 728, 90),
    "p4-bottom": banner(KEY_728, 728, 90),
    "p4-anchor": banner(KEY_728, 728, 90),

    /* ---------- 468x60 ---------- */
    "p4-center-1": banner(KEY_468, 468, 60),
    "p4-center-5": banner(KEY_468, 468, 60),

    /* ---------- 300x250 (rails) ---------- */
    "p4-left-1": banner(KEY_300, 300, 250),
    "p4-left-2": banner(KEY_300, 300, 250),
    "p4-left-3": banner(KEY_300, 300, 250),
    "p4-right-1": banner(KEY_300, 300, 250),
    "p4-right-2": banner(KEY_300, 300, 250),
    "p4-right-3": banner(KEY_300, 300, 250),

    /* ---------- 300x250 (center) ---------- */
    "p4-center-2": banner(KEY_300, 300, 250),
    "p4-center-3": banner(KEY_300, 300, 250),
    "p4-center-4": banner(KEY_300, 300, 250),
    "p4-center-6": banner(KEY_300, 300, 250),
    "p4-center-7": banner(KEY_300, 300, 250),
    "p4-center-8": banner(KEY_300, 300, 250),

    /* =========================================================
       HIDDEN / SCRIPT-ONLY SLOTS — Monetag goes here
       ========================================================= */

    "p4-pop": "",
    "p4-social": "",
    "p4-vignette": "",
    "p4-global": ""
  };

  /* =========================================================
     PASTE MONETAG CODES HERE
     ---------------------------------------------------------
     Copy the snippet for each zone from the Monetag dashboard
     and put it after the key, inside single quotes. Keep the
     <\/script> escaping exactly as shown.

       "p4-pop":    '<script src="//libtl.com/sdk.js" data-zone="1111111" data-sdk="show_1111111"><\/script>',
       "p4-social": '<script src="//libtl.com/sdk.js" data-zone="2222222" data-sdk="show_2222222"><\/script>',

     Visible slots work the same way; anything listed here
     replaces the Adsterra banner for that slot only.
     ========================================================= */

  var overrides = {

    /* OnClick (popunder) — Happy tag, zone 12224255 */
    "p4-pop":
      `<script>(function(s){s.dataset.zone='12224255',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))<\/script>`,

    /* Multitag "Crazy tag", zone 307882 — covers the rest of the zones:
       Push Notifications 12224249, Vignette Banner 12224248,
       In-Page Push 12224247, OnClick multi 12224246 */
    "p4-global":
      `<script src="https://quge5.com/88/tag.min.js" data-zone="307882" async data-cfasync="false"><\/script>`

    /* p4-social and p4-vignette are already served by the multitag
       above, so they stay empty on purpose. */
  };

  Object.keys(overrides).forEach(function (key) {
    var value = (overrides[key] || "").trim();
    if (value) codes[key] = value;
  });

  window.AD_CODES = codes;
})();
