/* ===========================================================
   TechSarthi — Ad codes config (ad-only page)
   -----------------------------------------------------------
   Paste each ad code next to its slot below.
   Empty slots show a dashed placeholder while testing.

   Rules:
   1. One network per slot.
   2. For AdSense, paste the full snippet (ins + script).
   3. Keep every code inside backticks ` `.
   4. Once all codes are in, set showPlaceholders to false.
   =========================================================== */

window.ADS_CONFIG = {
  showPlaceholders: true, // set to false after adding your codes
  lazyLoad: false,        // true = load each ad as it nears the viewport
  anchorEnabled: true     // sticky ad at the bottom of the screen
};

window.AD_CODES = {

  /* ---------- TOP BANNER ---------- */
  "top-banner": ``,

  /* ---------- LEFT RAIL ---------- */
  "left-1": ``,   // 160x600
  "left-2": ``,   // 160x300
  "left-3": ``,   // 160x600

  /* ---------- CENTER COLUMN ---------- */
  "center-1": ``, // 300x250 / 336x280
  "center-2": ``, // 300x250
  "center-3": ``, // 300x250
  "center-4": ``, // native
  "center-5": ``, // 300x250 / 336x280
  "center-6": ``, // 300x250
  "center-7": ``, // 300x250
  "center-8": ``, // native

  /* ---------- RIGHT RAIL ---------- */
  "right-1": ``,  // 160x600
  "right-2": ``,  // 160x300
  "right-3": ``,  // 160x600

  /* ---------- BOTTOM BANNER ---------- */
  "bottom-banner": ``,

  /* ---------- STICKY BOTTOM ANCHOR ---------- */
  "anchor": ``,

  /* ---------- HIDDEN / SCRIPT-ONLY SLOTS ---------- */
  "vignette": ``,      // interstitial / overlay (the code builds its own overlay)
  "pop": ``,           // popunder / pop ads
  "social-bar": ``,    // social bar
  "global-scripts": `` // any other script-only network

  /* =========================================================
     Example — AdSense (use your own client ID):

     "top-banner": `
       <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
       <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
     `,

     Example — Monetag / Adsterra banner:
     "left-1": `
       <script src="https://your-network-tag.js"></script>
     `,

     Example — popunder (script-only):
     "pop": `
       <script src="https://your-popunder-tag.js"></script>
     `,
     ========================================================= */
};
