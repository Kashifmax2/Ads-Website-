# TechSarthi — Ad-Only Page

A page built only for ads: **top banner, left rail, center stack, right rail, bottom banner,
sticky anchor, plus popunder / vignette / social-bar script slots** — 21 slots in total.
Every slot is empty right now, so dashed placeholders show where each ad will appear.

## Files

| File | Purpose |
|---|---|
| `index.html` | Ad layout with all slots |
| `styles.css` | Responsive ad-wall design |
| `ads.js` | **Paste all ad codes here** |
| `app.js` | Ad loader, anchor, back-to-top |
| `privacy.html` | Privacy policy |

## Preview locally

Double-click `index.html`, or run:

```bash
npx serve .
```

## Add ad codes

Open `ads.js`, find the slot in `window.AD_CODES`, paste the snippet inside the backticks:

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
- AdSense: use the full snippet (ins + script).
- Monetag / Adsterra `<script>` tags work the same way.
- Popunder / vignette / social bar go in the hidden slots (`pop`, `vignette`, `social-bar`).
- After adding the codes, set `ADS_CONFIG.showPlaceholders` to `false`.
- You can also paste code directly inside the matching `<div class="ad-slot">` in `index.html`.

### Slot map

| Slot key | Position | Size |
|---|---|---|
| `top-banner` | Top of the page | 728×90 / responsive |
| `left-1` | Left rail, top | 160×600 |
| `left-2` | Left rail, middle | 160×300 |
| `left-3` | Left rail, bottom | 160×600 |
| `center-1` | Center, first | 300×250 / 336×280 |
| `center-2` | Center | 300×250 |
| `center-3` | Center | 300×250 |
| `center-4` | Center | native |
| `center-5` | Center | 300×250 / 336×280 |
| `center-6` | Center | 300×250 |
| `center-7` | Center | 300×250 |
| `center-8` | Center | native |
| `right-1` | Right rail, top | 160×600 |
| `right-2` | Right rail, middle | 160×300 |
| `right-3` | Right rail, bottom | 160×600 |
| `bottom-banner` | Bottom of the page | 728×90 |
| `anchor` | Sticky at the bottom of the screen | anchor |
| `vignette` | Interstitial / overlay | network builds it |
| `pop` | Popunder / pop ads | script only |
| `social-bar` | Social bar | script only |
| `global-scripts` | Any other script-only network | script only |

## Deploy to GitHub + Vercel

```bash
git add .
git commit -m "ad-only page"
git push
```

Then Vercel → **Add New Project** → import `Ads-Website-` → Framework: **Other** →
leave build command and output directory empty → **Deploy**.

## Notes

- An ad-only page without content is **not eligible for AdSense** (their policy requires
  content), but networks like Monetag, Adsterra and PropellerAds usually accept it.
- Keep one network per slot so you can tell which one earns.
- `index.html` includes `noindex, nofollow` — remove that tag if you want search traffic.
