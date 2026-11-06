# TechSarthi — Ads Starter Page

A simple, responsive English content page with **12 + 3 ad slots** already wired up.
Every slot is empty right now, so the page shows dashed placeholders — you can verify
the layout before adding any ad code.

## Files

| File | Purpose |
|---|---|
| `index.html` | The full page (content + ad slots) |
| `styles.css` | Design and responsive layout |
| `ads.js` | **Paste all ad codes here** |
| `app.js` | Ad loader, lazy load, load-more, anchor, back-to-top |
| `privacy.html` | Privacy policy (needed for AdSense) |

## Preview locally

Double-click `index.html`, or run:

```bash
npx serve .
```

## How to add ad codes

Open `ads.js` and find the `window.AD_CODES` object. Paste your snippet next to the
matching slot, for example:

```js
"top-banner": `
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
       data-ad-slot="1234567890"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
`,
```

- One network per slot.
- For AdSense, use the full snippet (ins + script).
- Monetag / Adsterra `<script>` tags work the same way.
- When you are done, set `ADS_CONFIG.showPlaceholders` to `false`.
- You can also paste a code directly inside the matching `<aside class="ad-slot">`
  in `index.html`; the loader will leave it untouched.

### Slot map

| Slot key | Position | Size |
|---|---|---|
| `top-banner` | Just below the hero | 728×90 / responsive |
| `in-article-1` | Inside article 1 | 300×250 / 336×280 |
| `feed-1` | After article 2 | native |
| `feed-2` | Inside article 3 | native |
| `in-article-2` | Inside article 4 | 300×250 |
| `native-1` | Before "More to read" | native |
| `sidebar-sticky` | Sticky in the sidebar | 300×600 |
| `sidebar-2` | Lower sidebar | 300×250 |
| `bottom-banner` | End of the page | 728×90 |
| `anchor` | Sticky at the bottom of the screen | anchor |
| `vignette` | Interstitial / overlay | network builds it |
| `global-scripts` | Social bar, popunder, script-only ads | invisible |
| `deep-1..3` | Added by "Show more posts" | native |

## Deploy to GitHub + Vercel

```bash
git init
git add .
git commit -m "ads starter page"
git branch -M main
git remote add origin https://github.com/Kashifmax2/Ads-Website-.git
git push -u origin main
```

Then open [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo →
Framework: **Other**, leave build command and output directory empty → **Deploy**.
It is a static site, so no build settings are required.

## Important (protect your accounts)

1. **Do not make "any click opens an ad".** That is clickjacking and gets AdSense and most
   other networks to ban your account. That is why it is not included.
2. Do not put too many AdSense units on one page. Start with 3-5 AdSense units and use
   other networks for the rest. Ads must not outnumber the content.
3. Enable anchor/sticky and vignette only if the network's policy allows it.
4. Replace the email in `privacy.html` with your real one, and add About/Contact pages
   before applying to AdSense.
5. After AdSense approval, add an `ads.txt` file to the site root:
   `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`

## Next step

After Vercel is live, send me all your ad codes. I will place each one correctly
(AdSense, Monetag, Adsterra, PropellerAds, etc.) and configure the formats.
