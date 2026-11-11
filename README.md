# TechSarthi

A small technology publication: three tested guides, an about page and a
privacy policy, with clearly labelled display advertising between the
articles.

Live at **https://webadsforadsads.vercel.app**

## Pages

| File | What it is |
|---|---|
| `index.html` | Home — hero, the three guides, about strip |
| `fast-charging.html` | Guide: checking whether a phone is fast-charging |
| `sell-android-phone.html` | Guide: preparing an Android phone for sale |
| `wifi-drops-evening.html` | Guide: evening Wi-Fi slowdowns |
| `about.html` | Who writes the desk, how it is tested and funded |
| `privacy.html` | Privacy and cookies, including ad partners |
| `styles.css` | The whole design system |
| `ads.js` | The live ad codes (one 300×250 placement, three slots) |
| `app.js` | Ad loader: iframe isolation, fill detection, responsive fit |
| `robots.txt`, `sitemap.xml` | Crawling and discovery |
| `vercel.json` | Redirects for the old `/page2`–`/page4` ad walls |

## Ads

Only placements that actually fill are kept.

| Slot | Size | Where |
|---|---|---|
| `in-article` | 300×250 | Home (below the guides), inside each guide |
| `sidebar` | 300×250 | Guide rail |
| `footer` | 300×250 | Home, under the about strip |

All three load the same 300×250 MultiTag creative. A fourth placement is
one line in `ads.js` plus one `.ad` block in the page.

### What was removed, and why

The old page was a wall of fourteen boxes. On a normal Chrome user agent
every Adsterra banner answered `200` and then rendered **0×0** — no
creative, no impression, no revenue. What filled the boxes instead was a
fallback "sponsored" button pointing at a ProfitOn smartlink, which
redirected through random `.cfd` domains and landed on the AdZilla memecoin
pages. That is the part that put the ad account at risk: an ad-only page
whose only working unit is a redirect chain.

Removed for good:

- Adsterra 728×90, 468×60 and 300×250 banners (all empty fills)
- Adsterra native banner, social bar and popunder
- The ProfitOn smartlink buttons, including the automatic fallback that
  covered every empty box
- `page2.html`, `page3.html`, `page4.html` and `ads2.js`, `ads3.js`,
  `ads4.js` — three orphan ad walls with no content and no inbound links

`/page2`, `/page3` and `/page4` now 308 to `/` through `vercel.json`, so
old links keep working without serving an ad-only page.

### How a band behaves

Every `.ad` block starts with `class="ad is-empty"`, which collapses it to
zero height and hides it. `app.js` mounts the creative, watches the frame
for about fifteen seconds, and only then removes `is-empty`. If nothing
fills, the band stays invisible — no grey placeholder, no reserved gap, no
fallback link.

The slot is kept in the layout while hidden (rather than `display:none`) so
a late fill can still be measured; `height: 0; overflow: hidden;
visibility: hidden` removes it visually without breaking detection.

## Content rules

- Guides are written per page, tested on hardware, and dated.
- No affiliate links in body text, no paid rankings.
- Ads are labelled "Advertisement" and sit between sections.
- Nothing asks for an OTP, UPI PIN, bank password or card number.
- No pop-under, no in-page push, no fake system warnings.

## Deploying

```bash
git add .
git commit -m "Describe the change"
git push
```

Vercel deploys the repository root automatically. There is no build step
and no dependency to install.

## Adding a network

1. Create the zone at 300×250 (or the size you need).
2. Paste the snippet into `ads.js` under a new key.
3. Add a matching `.ad` block with `data-slot="<key>"`.
4. Keep `data-size="rectangle"` so the loader reserves the right box.
5. Deploy and scroll the page on a phone and a desktop: the band should
   appear only when the network actually returns a creative.

The verification metas for ProfitOn, CCNSAD and Monetag are on every page
and are harmless to keep even for networks that are not currently in use.
