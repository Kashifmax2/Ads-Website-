# TechSarthi — Ad-Only Page (Adsterra)

A page built only for ads. All Adsterra / Profitableratecpm formats are already installed:
**728×90, 300×250, 468×60, native banner, popunder, social bar and smartlink.**

## Two properties in this repo

| Folder | What it is | Deploy |
|---|---|---|
| repo root | The original ad-wall pages (`/` and `/page2`) | existing Vercel project |
| `cryptocurrency-website/` | **Chainwise**, a separate crypto publication for ad networks | its own Vercel project, Root Directory `cryptocurrency-website` |

Chainwise is a different site, not a page of this one. Its ad codes live in
`cryptocurrency-website/ads.js`, and its deploy steps are in
`cryptocurrency-website/README.md`.

## Live layout

```
top-banner (728x90)
┌──────────┬──────────────┬──────────┐
│ left-1   │ center-1 468 │ right-1  │
│ left-2   │ center-2 300 │ right-2  │
│ left-3   │ center-3 300 │ right-3  │
│          │ center-4 nat │          │
│          │ center-5 468 │          │
│          │ center-6 300 │          │
│          │ center-7 300 │          │
│          │ center-8 300 │          │
│          │ Smartlink CTA│          │
└──────────┴──────────────┴──────────┘
bottom-banner (728x90)
sticky anchor (728x90)
```

On screens narrower than 1160px the rails move below the center column, and on phones
everything becomes a single column.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page 1 — ad layout + smartlink CTA |
| `page2.html` | Page 2 — URL-only page for the second network (ProfitOn) |
| `styles.css` | Responsive ad-wall design (shared by both pages) |
| `ads.js` | Page 1 ad codes (Adsterra) |
| `ads2.js` | Page 2 ad codes (ProfitOn slots + Adsterra defaults) |
| `app.js` | Ad loader, parallel iframes, lazy loading, fitter, anchor |
| `vercel.json` | `cleanUrls` so `/page2` works without `.html` |
| `privacy.html` | Privacy policy (not linked, keep for network review) |

## Page 2 (`/page2`)

Page 2 is intentionally **not linked** from page 1 — there is no button, no menu item,
no footer link. It only opens when the URL is typed:

```
https://your-project.vercel.app/page2
```

`vercel.json` enables `cleanUrls`, so `/page2` serves `page2.html`. `/page2.html`
also works and redirects to `/page2`.

To add the second network's ads, open **`ads2.js`** and paste the snippets into the
matching `p2-*` keys. Every empty key falls back to a sponsored button instead of a
dead box.

Current ProfitOn setup on page 2:

| Slot | Format | Code |
|---|---|---|
| `p2-center-4` | Shuffle box (visible in-feed) | ProfitOn `161012` |
| `p2-pop` | Pops / popunder | ProfitOn `161010` |
| Top CTA + empty-slot fallback | Smartlink | ProfitOn `161011` |
| `p2-global` | Extra script slot | empty (for future codes) |

`p2-center-4` is marked `data-no-cta`, so the smartlink button never covers the
third-party widget.

Both pages carry the ProfitOn verification meta tag:

```html
<meta name="profiton-domain-verification" content="e95c9ff57c43ef7f27b93172f4b1ba4f611fa2ead5712ec9dd052ca87fd2babe" />
```


## Active slots

| Slot | Format | Code |
|---|---|---|
| `top-banner` | 728×90 | Adsterra 728 banner |
| `bottom-banner` | 728×90 | Adsterra 728 banner |
| `anchor` | 728×90 sticky | Adsterra 728 banner |
| `center-1`, `center-5` | 468×60 | Adsterra 468 banner |
| `left-1..3`, `right-1..3` | 300×250 | Adsterra 300 banner |
| `center-2`, `center-3`, `center-6..8` | 300×250 | Adsterra 300 banner |
| `center-4` | Native | Adsterra native banner |
| `pop` | Popunder | Adsterra popunder |
| `social-bar` | Social bar | Adsterra social bar |
| Smartlink | 2 CTA banners in `index.html` (top + center) | Profitableratecpm smartlink |

Empty hidden slots: `vignette`, `global-scripts` (ready for future networks).

## How it works

- Every banner runs inside its own `srcdoc` iframe, so all banners load **in parallel**
  and Adsterra's global `atOptions` can never be overwritten by another banner.
- Popunder and social bar are mounted first, so click-triggered ads are ready early.
- Banners below the fold are lazy-mounted (900px margin), which keeps the first paint
  under ~400ms.
- Each slot reserves its exact ad height in CSS, so the page never collapses or jumps
  while the network answers.
- `fitAdFrames()` scales oversized banners (for example 728×90 on a phone) to fit the
  screen, keeping every banner fully visible.
- Placeholders are off (`showPlaceholders: false`); the faint "Advertisement" layer is
  only visible if an ad is blocked.
- **No dead boxes:** after ~4s, if a slot still has no creative inside, that box turns
  into a real clickable sponsored ad button (smartlink). If the ad fills later, the
  button is removed automatically so a live ad is never covered.

## Deploy to GitHub + Vercel

```bash
git add .
git commit -m "Adsterra formats installed"
git push
```

Vercel → **Add New Project** → import `Ads-Website-` → Framework: **Other** →
leave build command and output directory empty → **Deploy**.

## Notes

- Popunder / social bar behaviour (frequency, click trigger) is controlled by Adsterra,
  not by this page. There is no forced or hidden click layer.
- An ad-only page is not eligible for AdSense. Adsterra, Monetag and PropellerAds accept it.
- If one banner key is reused in several slots, Adsterra may show the same creative in
  those places. Create extra banner zones in your Adsterra dashboard if you want more variety.
- `index.html` uses `noindex, nofollow`; remove that meta tag if you want search traffic.
