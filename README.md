# TechSarthi — Ad-Only Page (Adsterra)

A page built only for ads. All Adsterra / Profitableratecpm formats are already installed:
**728×90, 300×250, 468×60, native banner, popunder, social bar and smartlink.**

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
| `index.html` | Ad layout + smartlink CTA |
| `styles.css` | Responsive ad-wall design |
| `ads.js` | All ad codes (already filled) |
| `app.js` | Ad loader, sequential script queue, iframe fitter, anchor |
| `privacy.html` | Privacy policy (not linked, keep for network review) |

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
| Smartlink | CTA banner in `index.html` | Profitableratecpm smartlink |

Empty hidden slots: `vignette`, `global-scripts` (ready for future networks).

## How it works

- Scripts are injected one slot at a time, so Adsterra's global `atOptions` never gets
  overwritten by another banner.
- Popunder and social bar are mounted first, so click-triggered ads are ready early.
- `fitAdFrames()` scales oversized iframes (for example 728×90 on a phone) to fit the
  screen, keeping every banner visible.
- Placeholders are off (`showPlaceholders: false`) because every visible slot has a code.

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
