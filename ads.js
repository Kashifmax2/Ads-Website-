/* ===========================================================
   TechSarthi — Ad codes config
   -----------------------------------------------------------
   Paste each ad code next to its slot below.
   Leave a slot empty and the page shows a dashed placeholder
   (handy while testing the layout).

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

  /* ---------- 1. Top banner ---------- */
  "top-banner": ``,

  /* ---------- 2. Inside the first article (in-article) ---------- */
  "in-article-1": ``,

  /* ---------- 3. After the second article (feed) ---------- */
  "feed-1": ``,

  /* ---------- 4. Inside the third article (feed) ---------- */
  "feed-2": ``,

  /* ---------- 5. Inside the fourth article (in-article) ---------- */
  "in-article-2": ``,

  /* ---------- 6. Before "More to read" (native) ---------- */
  "native-1": ``,

  /* ---------- 7. Sidebar — sticky 300x600 ---------- */
  "sidebar-sticky": ``,

  /* ---------- 8. Sidebar — lower 300x250 ---------- */
  "sidebar-2": ``,

  /* ---------- 9. Bottom banner ---------- */
  "bottom-banner": ``,

  /* ---------- 10. Sticky bottom anchor ---------- */
  "anchor": ``,

  /* ---------- 11. Vignette / interstitial (the code builds its own overlay) ---------- */
  "vignette": ``,

  /* ---------- 12. Script-only networks (social bar, popunder, etc.) ---------- */
  "global-scripts": ``,

  /* ---------- 13-15. Slots added by the "Show more posts" button ---------- */
  "deep-1": ``,
  "deep-2": ``,
  "deep-3": ``

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
     "sidebar-sticky": `
       <script src="https://your-network-tag.js"></script>
     `,
     ========================================================= */
};
