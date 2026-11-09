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

   After the domain is verified, create a zone in the Monetag
   dashboard and paste the snippet it gives you into OVERRIDES
   below, on the slot that matches the format:

     p4-pop       OnClick / popunder        (main earner)
     p4-social    In-page push              (corner widget)
     p4-vignette  Vignette / interstitial
     p4-global    any extra zone

   A Monetag SDK snippet looks like this:

     '<script src="//libtl.com/sdk.js" data-zone="1234567"
        data-sdk="show_1234567"><\/script>'

   Visible banner slots keep Adsterra until you paste a Monetag
   banner zone into one of them, for example "p4-top".
   =========================================================== */

window.ADS_CONFIG = {
  showPlaceholders: false,
  /* Fill every slot on load: this page exists only to show ads. */
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
    /* "p4-pop": "", */
    /* "p4-social": "", */
    /* "p4-vignette": "", */
    /* "p4-global": "", */
  };

  Object.keys(overrides).forEach(function (key) {
    var value = (overrides[key] || "").trim();
    if (value) codes[key] = value;
  });

  window.AD_CODES = codes;
})();
