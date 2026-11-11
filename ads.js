/* ===========================================================
   TechSarthi — live ad codes
   -----------------------------------------------------------
   Only placements that actually fill are kept here.

     in-article   300x250 MultiTag banner, inside the story
     sidebar      300x250 MultiTag banner, article rail
     footer       300x250 MultiTag banner, end of page

   Everything that used to sit on this domain and no longer
   returns a creative has been removed: the Adsterra 728x90 /
   468x60 / 300x250 banners (all 0x0 fills), the Adsterra
   native widget, the social bar, the popunder and the
   ProfitOn smartlink buttons. The smartlink redirected through
   random `.cfd` domains and was the source of the AdZilla
   memecoin pages this site kept opening.

   If a slot renders nothing, the page hides that band
   completely — there are no empty boxes and no fallback
   buttons pointing at an offer.
   =========================================================== */

window.ADS_CONFIG = {
  /* No grey placeholder boxes and no sponsored-button fallbacks. */
  showPlaceholders: false,
  sponsorUrl: "",
  /* Bands start collapsed, so a lazy slot would have no measurable size.
     Mount on load instead; there are only one or two slots per page. */
  lazyLoad: false,
  /* No sticky anchor until there is an anchor zone that fills. */
  anchorEnabled: false
};

var MULTITAG_300x250 = `<script>
(function(noewh){
var d = document,
    s = d.createElement('script'),
    l = d.currentScript || d.scripts[d.scripts.length - 1];
s.settings = noewh || {};
s.src = "\\/\\/conventionalresponse.com\\/bLX.VasDdQGMlu0\\/YMW-cQ\\/YeLmp9WuVZ\\/U-lSkFPvTjc\\/2eMwTIYO1BMUD\\/UjtONRz\\/YPxcNbj\\/Upw\\/OAQk";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
</script>`;

window.AD_CODES = {
  "in-article": MULTITAG_300x250,
  "sidebar": MULTITAG_300x250,
  "footer": MULTITAG_300x250
};
