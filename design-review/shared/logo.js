/* The Azerbaijan-UK Youth Association logo mark as live vector parts (traced from the supplied PDF):
 * the A, the blue swoosh, the Y, and the red and green flame tongues.
 * Three renderings: solid, "draw" (outlines stitch on, then fill, then flames rise) and "yarn" (crocheted, row by row). */
(function () {
  'use strict';
  var L = window.AZ_LOGO;
  var uid = 0;
  var VB = '100 140 1330 1000';
  var BRAND = { blue: '#1b4793', blue2: '#1a4088', swoosh: '#2f6cc0', swoosh2: '#1f56a6', red: '#c23028', green: '#3e894c', navy: '#0e1f45' };
  AZ.brand = BRAND;
  AZ.LOGO_VB = VB;

  function esc(s) { return String(s).replace(/"/g, '&quot;'); }

  /* mode: 'solid' | 'draw' | 'yarn'. Returns an <svg> string. */
  AZ.logo = function (o) {
    o = o || {};
    var id = 'lg' + ++uid, mode = o.mode || 'solid', c = Object.assign({}, BRAND, o.colors || {});
    var all = [
      { k: 'a', d: L.blue_1, c: 'letter', g: 'url(#' + id + '-gl)' },
      { k: 'swoosh', d: L.blue_2, c: 'swoosh', g: 'url(#' + id + '-gs)' },
      { k: 'y', d: L.blue_3, c: 'letter', g: 'url(#' + id + '-gl)' },
      { k: 'red', d: L.red, c: 'red', g: c.red },
      { k: 'green', d: L.green, c: 'green', g: c.green },
    ];
    var parts = o.only ? all.filter(function (p) { return o.only.indexOf(p.k) >= 0; }) : all;
    var defs =
      '<linearGradient id="' + id + '-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c.blue + '"/><stop offset="1" stop-color="' + c.blue2 + '"/></linearGradient>' +
      '<linearGradient id="' + id + '-gs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c.swoosh + '"/><stop offset="1" stop-color="' + c.swoosh2 + '"/></linearGradient>';
    var body = '';

    if (mode === 'yarn') {
      var yarn = {
        letter: { base: '#143574', hi: '#3a6cc0', sh: '#0c2759' },
        swoosh: { base: '#1f56a6', hi: '#5b92dc', sh: '#163f7e' },
        red: { base: '#932019', hi: '#e2574c', sh: '#6d1611' },
        green: { base: '#2c6638', hi: '#68b479', sh: '#1e4a28' },
      };
      Object.keys(yarn).forEach(function (k) {
        var y = yarn[k];
        defs +=
          '<pattern id="' + id + '-p-' + k + '" width="46" height="40" patternUnits="userSpaceOnUse"><rect width="46" height="40" fill="' + y.base + '"/>' +
          [[0, 0], [23, 0], [-11.5, 20], [11.5, 20], [34.5, 20]].map(function (p) {
            var x = p[0], yy = p[1];
            return '<path d="M' + (x + 3.5) + ' ' + (yy + 4) + 'L' + (x + 11.5) + ' ' + (yy + 17) + 'L' + (x + 19.5) + ' ' + (yy + 4) + '" fill="none" stroke="' + y.sh + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 1.6)"/>' +
              '<path d="M' + (x + 3.5) + ' ' + (yy + 4) + 'L' + (x + 11.5) + ' ' + (yy + 17) + 'L' + (x + 19.5) + ' ' + (yy + 4) + '" fill="none" stroke="' + y.hi + '" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>';
          }).join('') + '</pattern>';
      });
      defs += '<mask id="' + id + '-m" maskUnits="userSpaceOnUse" x="100" y="140" width="1330" height="1000"><rect class="lg-rows" x="100" y="140" width="1330" height="1000" fill="#fff"/></mask>';
      parts.forEach(function (p) { defs += '<clipPath id="' + id + '-c-' + p.k + '"><path fill-rule="evenodd" d="' + p.d + '"/></clipPath>'; });
      body = '<g mask="url(#' + id + '-m)">' + parts.map(function (p) {
        var key = p.c;
        return '<g class="lg-part lg-' + p.k + '"><g clip-path="url(#' + id + '-c-' + p.k + ')"><rect x="100" y="140" width="1330" height="1000" fill="url(#' + id + '-p-' + key + ')"/></g>' +
          '<path d="' + p.d + '" fill="none" stroke="' + yarn[key].hi + '" stroke-width="6" stroke-dasharray="22 11" stroke-linecap="round" fill-rule="evenodd" opacity=".9"/></g>';
      }).join('') + '</g>';
    } else {
      body = parts.map(function (p) {
        var outline = mode === 'draw'
          ? '<path class="lg-outline" d="' + p.d + '" pathLength="1" fill="none" stroke="' + (p.k === 'red' ? '#e2574c' : p.k === 'green' ? '#68b479' : '#5b92dc') + '" stroke-width="7" stroke-dasharray="1" stroke-dashoffset="1" stroke-linejoin="round"/>'
          : '';
        return '<g class="lg-part lg-' + p.k + '"><path class="lg-fill" fill="' + p.g + '" fill-rule="evenodd" d="' + p.d + '"/>' + outline + '</g>';
      }).join('');
    }
    return '<svg class="az-logo az-logo-' + mode + ' ' + (o.cls || '') + '" viewBox="' + (o.viewBox || VB) + '" role="img" aria-label="Azerbaijan-UK Youth Association logo"><defs>' + defs + '</defs>' + body + '</svg>';
  };

  /* Flame tongues lean toward the pointer on springs, with a slow idle sway so the logo stays alive. */
  AZ.logoAlive = function (ctx, svg, o) {
    o = o || {};
    var red = svg.querySelector('.lg-red'), green = svg.querySelector('.lg-green'), sw = svg.querySelector('.lg-swoosh');
    if (!red || !green) return function () {};
    [red, green].forEach(function (el) { el.style.transformBox = 'fill-box'; el.style.transformOrigin = '50% 100%'; });
    var sr = new AZ.Spring(0, { response: 0.7, damping: 0.62, precision: 0.002 }), sg = new AZ.Spring(0, { response: 0.85, damping: 0.6, precision: 0.002 });
    var target = 0, t0 = performance.now(), raf = 0, alive = true;
    function frame(now) {
      if (!alive) return;
      var t = (now - t0) / 1000;
      var idle = AZ.reduced() ? 0 : 1;
      sr.to(target * 9 + Math.sin(t * 1.3) * 2.4 * idle);
      sg.to(target * 7 + Math.sin(t * 1.1 + 1.4) * 2.8 * idle);
      raf = requestAnimationFrame(frame);
    }
    function apply() {
      red.style.transform = 'skewX(' + (-sr.x).toFixed(2) + 'deg) scaleY(' + (1 + Math.sin(sr.x * 0.1) * 0.01).toFixed(3) + ')';
      green.style.transform = 'skewX(' + (-sg.x).toFixed(2) + 'deg)';
    }
    sr.on(apply); sg.on(apply);
    function onMove(e) {
      var r = svg.getBoundingClientRect();
      target = AZ.clamp(((e.clientX - (r.left + r.width / 2)) / Math.max(200, window.innerWidth / 2)), -1, 1);
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    var disposed = false;
    function dispose() { if (disposed) return; disposed = true; alive = false; cancelAnimationFrame(raf); sr.stop(); sg.stop(); window.removeEventListener('pointermove', onMove); }
    ctx.onCleanup(dispose);
    return dispose;
  };
})();
