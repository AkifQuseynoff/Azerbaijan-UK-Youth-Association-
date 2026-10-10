/* Crochet toolkit: yarn patterns, the crocheted scrollbar, the crocheted moon and star,
 * stitched dividers, and scroll-reveal. Everything is drawn with V-stitches like single crochet. */
(function () {
  'use strict';
  var uid = 0;
  var YARN = {
    blue: { base: '#143574', hi: '#3a6cc0', sh: '#0c2759' },
    red: { base: '#932019', hi: '#e2574c', sh: '#6d1611' },
    green: { base: '#2c6638', hi: '#68b479', sh: '#1e4a28' },
    cream: { base: '#cdbfa0', hi: '#fff7e4', sh: '#a89a7c' },
    navy: { base: '#0a1740', hi: '#2b4a96', sh: '#060e2a' },
  };
  AZ.yarn = YARN;

  /* One tile of single-crochet V-stitches (two offset rows). */
  AZ.stitchPattern = function (id, y, scale) {
    var vs = [[0, 0], [23, 0], [-11.5, 20], [11.5, 20], [34.5, 20]].map(function (p) {
      var d = 'M' + (p[0] + 3.5) + ' ' + (p[1] + 4) + 'L' + (p[0] + 11.5) + ' ' + (p[1] + 17) + 'L' + (p[0] + 19.5) + ' ' + (p[1] + 4);
      return '<path d="' + d + '" fill="none" stroke="' + y.sh + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 1.6)"/><path d="' + d + '" fill="none" stroke="' + y.hi + '" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>';
    }).join('');
    return '<pattern id="' + id + '" width="46" height="40" patternUnits="userSpaceOnUse"' + (scale ? ' patternTransform="scale(' + scale + ')"' : '') + '><rect width="46" height="40" fill="' + y.base + '"/>' + vs + '</pattern>';
  };

  /* ---------- Crocheted moon and star (rows appear one at a time) ---------- */
  var CRESCENT = 'M73.5 22.73A36 36 0 1 0 73.5 77.27A30 30 0 1 1 73.5 22.73Z';
  AZ.crochetMoon = function (o) {
    o = o || {};
    var id = 'cm' + ++uid, moon = o.moon || YARN.cream, star = o.star || YARN.cream, s = AZ.star8(64, 50, 13);
    var sc = o.scale || 0.2;
    return '<svg class="az-moon ' + (o.cls || '') + '" viewBox="0 0 100 100" aria-hidden="true"><defs>' +
      AZ.stitchPattern(id + 'a', moon, sc) + AZ.stitchPattern(id + 'b', star, sc) +
      '<mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect class="az-rows" x="0" y="0" width="100" height="100" fill="#fff"/></mask>' +
      '<clipPath id="' + id + 'c"><path d="' + CRESCENT + '"/></clipPath></defs>' +
      '<g mask="url(#' + id + 'm)"><g clip-path="url(#' + id + 'c)"><rect width="100" height="100" fill="url(#' + id + 'a)"/></g>' +
      '<path d="' + CRESCENT + '" fill="none" stroke="' + moon.hi + '" stroke-width="1.6" stroke-dasharray="4 2.4" stroke-linecap="round"/>' +
      '<g class="az-star"><polygon points="' + s[0] + '" fill="url(#' + id + 'b)"/><polygon points="' + s[1] + '" fill="url(#' + id + 'b)"/>' +
      '<polygon points="' + s[0] + '" fill="none" stroke="' + star.hi + '" stroke-width="1.2" stroke-dasharray="3.6 2.2" stroke-linecap="round"/><polygon points="' + s[1] + '" fill="none" stroke="' + star.hi + '" stroke-width="1.2" stroke-dasharray="3.6 2.2" stroke-linecap="round"/></g></g></svg>';
  };

  /* ---------- Stitched divider: a strip of V-stitches in the three brand yarns ---------- */
  function vTile(y) {
    var d = 'M3.5 3.5L9 12L14.5 3.5';
    return "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="15"><path d="' + d + '" fill="none" stroke="' + y.sh + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 1.2)"/><path d="' + d + '" fill="none" stroke="' + y.hi + '" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>') + "')";
  }
  AZ.stitchRule = function (o) {
    o = o || {};
    var cs = o.colors || ['blue', 'red', 'green'];
    return '<div class="az-rule" data-reveal aria-hidden="true"><div class="az-rule-in">' + cs.map(function (c) { return '<i style="background-image:' + vTile(YARN[c]) + '"></i>'; }).join('') + '</div></div>';
  };

  /* ---------- Scroll reveal ---------- */
  AZ.revealOnScroll = function (ctx, root) {
    var els = [].slice.call(root.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window) || AZ.reduced()) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
    ctx.onCleanup(function () { io.disconnect(); });
  };

  /* ---------- Crocheted scrollbar ----------
   * A vertical strip of V-stitches. The progress fills in blue, red, then green yarn (the three flame tongues);
   * a crochet hook rides the working edge. Drag it to scroll. The native bar is hidden while a design is open. */
  AZ.crochetScrollbar = function (ctx, o) {
    o = o || {};
    var id = 'cs' + ++uid, colors = ['blue', 'red', 'green'], dark = o.dark;
    var style = document.createElement('style');
    style.textContent = 'html{scrollbar-width:none}html::-webkit-scrollbar{display:none}';
    document.head.appendChild(style);
    var el = document.createElement('div');
    el.className = 'az-cs' + (dark ? ' is-dark' : '');
    el.setAttribute('aria-hidden', 'true');
    var tile = function (y, w) { return '<pattern id="' + id + '-' + y + '" width="26" height="15" patternUnits="userSpaceOnUse"><path d="M3.5 3L13 12.5L22.5 3" fill="none" stroke="' + (w.sh) + '" stroke-width="6.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 1.4)"/><path d="M3.5 3L13 12.5L22.5 3" fill="none" stroke="' + (w.hi) + '" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/></pattern>'; };
    var track = { sh: dark ? 'rgba(255,255,255,0.05)' : 'rgba(20,30,70,0.06)', hi: dark ? 'rgba(255,255,255,0.2)' : 'rgba(20,30,70,0.2)' };
    el.innerHTML = '<svg width="26" height="100%"><defs>' + tile('t', track) + colors.map(function (c) { return tile(c, YARN[c]); }).join('') +
      colors.map(function (c, i) { return '<clipPath id="' + id + '-c' + i + '"><rect class="clip" x="0" y="0" width="26" height="0"/></clipPath>'; }).join('') + '</defs>' +
      '<rect class="track" width="26" height="100%" fill="url(#' + id + '-t)"/>' +
      colors.map(function (c, i) { return '<g clip-path="url(#' + id + '-c' + i + ')"><rect class="seg" x="0" y="0" width="26" height="0" fill="url(#' + id + '-' + c + ')"/></g>'; }).join('') +
      '<g class="hook"><path d="M17 -34L4 -3" stroke="#d9b36a" stroke-width="4.4" stroke-linecap="round" fill="none"/><path d="M4 -3q-4 4.5 -9 2.4" stroke="#d9b36a" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="17" cy="-34" r="3.4" fill="#b98f45"/></g></svg>';
    document.body.appendChild(el);
    var svg = el.firstChild, clips = [].slice.call(el.querySelectorAll('.clip')), segs = [].slice.call(el.querySelectorAll('.seg')), hook = el.querySelector('.hook');
    var H = 0, ticking = false;
    function layout() { H = el.clientHeight; segs.forEach(function (s, i) { s.setAttribute('y', (H / 3) * i); s.setAttribute('height', H / 3 + 1); }); update(); }
    function update() {
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight), p = AZ.clamp(window.scrollY / max, 0, 1), fill = p * H;
      clips.forEach(function (c, i) { var start = (H / 3) * i; c.setAttribute('height', AZ.clamp(fill - start, 0, H / 3 + 1)); c.setAttribute('y', start); });
      hook.setAttribute('transform', 'translate(4 ' + (fill + 3).toFixed(1) + ')');
      el.classList.toggle('is-end', p > 0.995);
    }
    function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); }
    ctx.listen(window, 'scroll', onScroll, { passive: true });
    ctx.listen(window, 'resize', layout);
    function scrubTo(y) { var r = el.getBoundingClientRect(), p = AZ.clamp((y - r.top) / r.height, 0, 1); window.scrollTo(0, p * (document.documentElement.scrollHeight - innerHeight)); }
    var off = AZ.drag(el, { start: function (e) { el.classList.add('is-held'); scrubTo(e.clientY); }, move: function (d) { scrubTo(d.y); }, end: function () { el.classList.remove('is-held'); } });
    ctx.onCleanup(function () { off(); el.remove(); style.remove(); });
    layout();
  };
})();
