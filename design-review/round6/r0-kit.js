/* Round 3 shared kit. Everything here is built for phones first:
 * motion that plays by itself on load, motion tied to scrolling, and motion that answers a tap.
 * Nothing important depends on a mouse pointer. */
AZ.introTitle = 'Azerbaijan Youth Association: Siluet, round six';
AZ.introText = 'Round five: the logo ignites, then the blue, red and green flames rise one after another and sway slowly by themselves. Nothing reacts to the cursor. The events and the episode are sample content for design purposes only.';

window.R3 = (function () {
  'use strict';
  var R = {};
  R.coarse = function () { return window.matchMedia('(pointer: coarse), (max-width: 760px)').matches; };
  R.BLUE = '#1b4793'; R.SKY = '#2f6cc0'; R.RED = '#c23028'; R.GREEN = '#3e894c'; R.INK = '#0e1f45';

  /* ---- A strip of V-stitches that fills with progress: blue, then red, then green ---- */
  function vTile(y) {
    var d = 'M3.5 3.5L9 12L14.5 3.5';
    return "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="15"><path d="' + d + '" fill="none" stroke="' + y.sh + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 1.2)"/><path d="' + d + '" fill="none" stroke="' + y.hi + '" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>') + "')";
  }
  R.rail = function (o) {
    o = o || {};
    var el = document.createElement('div');
    el.className = 'r3-rail ' + (o.cls || '');
    var track = { sh: o.dark ? 'rgba(255,255,255,0.06)' : 'rgba(14,31,69,0.06)', hi: o.dark ? 'rgba(255,255,255,0.22)' : 'rgba(14,31,69,0.2)' };
    el.innerHTML = '<i class="t" style="background-image:' + vTile(track) + '"></i>' +
      ['blue', 'red', 'green'].map(function (c) { return '<i class="f" style="background-image:' + vTile(AZ.yarn[c]) + '"></i>'; }).join('');
    var f = [].slice.call(el.querySelectorAll('.f'));
    el.set = function (p) {
      p = AZ.clamp(p, 0, 1);
      f.forEach(function (n, i) {
        var a = i / 3, b = (i + 1) / 3;
        n.style.clipPath = 'inset(0 ' + AZ.clamp(100 - Math.min(p, b) * 100, 0, 100) + '% 0 ' + (a * 100) + '%)';
        n.style.visibility = p > a ? 'visible' : 'hidden';
      });
    };
    el.set(0);
    return el;
  };

  /* ---- Reading progress along the top edge, for phones (a vertical bar is hidden by a thumb) ---- */
  R.topProgress = function (ctx, dark) {
    var bar = R.rail({ cls: 'r3-top', dark: dark });
    document.body.appendChild(bar);
    var ticking = false;
    function upd() { var m = Math.max(1, document.documentElement.scrollHeight - innerHeight); bar.set(scrollY / m); }
    ctx.listen(window, 'scroll', function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; upd(); }); }, { passive: true });
    ctx.onCleanup(function () { bar.remove(); });
    upd();
  };
  /* The crocheted scrollbar on desktops, the stitched top line on phones. */
  R.progress = function (ctx, dark) {
    if (R.coarse()) R.topProgress(ctx, dark); else AZ.crochetScrollbar(ctx, { dark: dark });
  };

  /* ---- Ignition of the three flames (blue, red, green), one flowing into the next.
   * Each flame is unveiled from its base to its tip through a feathered mask, while it clears from a soft blur and a glow of its own colour.
   * Nothing is scaled up from nothing: the flame is already its full size and simply emerges. Time-driven only. ---- */
  var NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs) { var e = document.createElementNS(NS, name); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); return e; }
  R.ignite = function (ctx, svg, o) {
    o = o || {};
    if (AZ.reduced() || !svg || !svg.animate) return;
    var T = o.start || 2300, GAP = o.gap || 650, DUR = o.duration || 2500;
    var seq = [
      { sel: '.lg-swoosh', glow: '47,108,192' },
      { sel: '.lg-red', glow: '226,87,76' },
      { sel: '.lg-green', glow: '104,180,121' },
    ];
    var defs = svg.querySelector('defs'), uid = 'ig' + Math.random().toString(36).slice(2, 7), live = [];
    seq.forEach(function (s, i) {
      var g = svg.querySelector(s.sel), fill = g && g.querySelector('.lg-fill');
      if (!fill) return;
      var bb = g.getBBox(), pad = 14, S = bb.height + pad * 2, F = Math.max(180, bb.height * 0.6), L = 2 * S + F, top = bb.y - pad;
      var id = uid + i, x0 = bb.x - 120, w0 = bb.width + 240;
      var grad = el('linearGradient', { id: id + 'g', x1: '0', y1: '0', x2: '0', y2: '1' });
      [[0, '#000'], [S / L, '#000'], [(S + F) / L, '#fff'], [1, '#fff']].forEach(function (st) { grad.appendChild(el('stop', { offset: String(st[0]), 'stop-color': st[1] })); });
      var mask = el('mask', { id: id, maskUnits: 'userSpaceOnUse', x: String(x0), y: String(bb.y - 120), width: String(w0), height: String(bb.height + 240) });
      var rect = el('rect', { x: String(x0), y: String(top), width: String(w0), height: String(L), fill: 'url(#' + id + 'g)' });
      mask.appendChild(rect); defs.appendChild(grad); defs.appendChild(mask);
      fill.setAttribute('mask', 'url(#' + id + ')');
      var delay = T + i * GAP, g0 = 'rgba(' + s.glow + ',0)', g1 = 'rgba(' + s.glow + ',0.85)';
      var wipe = rect.animate([{ transform: 'translateY(0px)' }, { transform: 'translateY(' + (-(S + F)) + 'px)' }], { duration: DUR, delay: delay, easing: 'cubic-bezier(0.45, 0.05, 0.25, 1)', fill: 'both' });
      var fx = fill.animate([
        { opacity: 0, filter: 'blur(26px) drop-shadow(0 0 0 ' + g0 + ')', transform: 'translateY(60px)' },
        { opacity: 0.85, filter: 'blur(12px) drop-shadow(0 0 46px ' + g1 + ')', transform: 'translateY(26px)', offset: 0.4 },
        { opacity: 1, filter: 'blur(0px) drop-shadow(0 0 0 ' + g0 + ')', transform: 'translateY(0px)' },
      ], { duration: DUR + 500, delay: delay, easing: 'cubic-bezier(0.3, 0, 0.2, 1)', fill: 'both' });
      live.push(wipe, fx);
      fx.finished.then(function () { wipe.cancel(); fx.cancel(); fill.removeAttribute('mask'); mask.remove(); grad.remove(); }).catch(function () { /* cancelled */ });
    });
    ctx.onCleanup(function () { live.forEach(function (a) { try { a.cancel(); } catch (e) { /* ignore */ } }); });
  };

  /* ---- The flame: it breathes by itself, leans with scroll on a phone or the pointer on a laptop, and flares on tap/press ---- */
  R.flame = function (ctx, svg, hero, o) {
    o = o || {};
    var parts = [['.lg-red', 1.0, 0.7, 0.62], ['.lg-green', 0.8, 0.85, 0.6], ['.lg-swoosh', 0.4, 1.0, 0.7]].map(function (c) {
      var el = svg.querySelector(c[0]); if (!el) return null;
      el.style.transformBox = 'fill-box'; el.style.transformOrigin = '50% 100%';
      return { el: el, k: c[1], skew: new AZ.Spring(0, { response: c[2], damping: c[3], precision: 0.002 }), flare: new AZ.Spring(1, { response: 0.35, damping: 0.55, precision: 0.001 }) };
    }).filter(Boolean);
    var tx = 0, press = 0, t0 = performance.now(), raf = 0, alive = true, fine = !R.coarse();
    parts.forEach(function (s) {
      function ap() { s.el.style.transform = 'skewX(' + (-s.skew.x).toFixed(2) + 'deg) scaleY(' + s.flare.x.toFixed(3) + ') scaleX(' + (1 + (s.flare.x - 1) * 0.6).toFixed(3) + ')'; }
      s.skew.on(ap); s.flare.on(ap);
    });
    function loop(now) {
      if (!alive) return;
      var t = (now - t0) / 1000, idle = AZ.reduced() ? 0 : 1;
      if (!fine) tx = Math.sin(scrollY / 170) * 0.8;
      parts.forEach(function (s, i) {
        s.skew.to(tx * 13 * s.k + Math.sin(t * (1.0 + i * 0.21) + i * 1.3) * 3.2 * idle);
        s.flare.to(1 + press * (0.1 + i * 0.03) + Math.sin(t * 1.6 + i) * 0.012 * idle);
      });
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    ctx.listen(window, 'pointermove', function (e) {
      if (!fine || e.pointerType === 'touch') return;
      var r = svg.getBoundingClientRect(); tx = AZ.clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth * 0.45), -1, 1);
    }, { passive: true });
    function down(e) { if (e.target.closest('a, button')) return; press = 1; if (o.onLit) o.onLit(true); if (navigator.vibrate && e.pointerType === 'touch') { try { navigator.vibrate(8); } catch (x) { /* ignore */ } } }
    function up() { press = 0; if (o.onLit) o.onLit(false); }
    ctx.listen(hero, 'pointerdown', down);
    ['pointerup', 'pointercancel'].forEach(function (ev) { ctx.listen(window, ev, up); });
    ctx.onCleanup(function () { alive = false; cancelAnimationFrame(raf); parts.forEach(function (s) { s.skew.stop(); s.flare.stop(); }); });
  };

  /* ---- Podcast player with a bar waveform; bars take the logo colours as they play ---- */
  R.player = function (ctx, root, sel) {
    var play = root.querySelector(sel.play), wave = root.querySelector(sel.wave), time = root.querySelector(sel.time), rail = sel.rail ? root.querySelector(sel.rail) : null;
    var b = [].slice.call(wave.children), prog = 0, playing = false, praf = 0, last = 0, cols = [R.SKY, R.RED, R.GREEN];
    function paint() {
      var n = Math.round(prog * b.length);
      b.forEach(function (el, k) { el.classList.toggle('on', k < n); el.style.setProperty('--c', cols[Math.min(2, Math.floor(k / (b.length / 3)))]); });
      var sec = Math.round(prog * 2520); time.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') + ' / 42:00';
      wave.setAttribute('aria-valuenow', String(Math.round(prog * 100)));
      if (rail && rail.set) rail.set(prog);
    }
    function stop() { playing = false; play.classList.remove('is-on'); wave.classList.remove('is-playing'); play.setAttribute('aria-pressed', 'false'); }
    function tick(t) { prog = Math.min(1, prog + (t - last) / 1000 / 45); last = t; paint(); if (playing && prog < 1) praf = requestAnimationFrame(tick); else stop(); }
    play.addEventListener('click', function () {
      playing = !playing; play.classList.toggle('is-on', playing); wave.classList.toggle('is-playing', playing); play.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (playing) { if (prog >= 1) prog = 0; last = performance.now(); praf = requestAnimationFrame(tick); } else cancelAnimationFrame(praf);
    });
    function scrub(x) { var r = wave.getBoundingClientRect(); prog = AZ.clamp((x - r.left) / r.width, 0, 1); paint(); }
    AZ.drag(wave, { start: function (e) { scrub(e.clientX); }, move: function (d) { scrub(d.x); } });
    wave.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { prog = Math.min(1, prog + 0.03); paint(); } if (e.key === 'ArrowLeft') { prog = Math.max(0, prog - 0.03); paint(); } });
    ctx.onCleanup(function () { cancelAnimationFrame(praf); });
    paint();
  };
  R.bars = function (n) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<i style="--h:' + (0.22 + 0.78 * Math.abs(Math.sin(i * 0.72) * Math.cos(i * 0.27))).toFixed(2) + ';--i:' + i + '"></i>';
    return s;
  };
  R.press = function (root, sel) {
    root.querySelectorAll(sel).forEach(function (c) {
      c.addEventListener('pointerdown', function () { c.classList.add('is-down'); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { c.addEventListener(ev, function () { c.classList.remove('is-down'); }); });
    });
  };
  R.join = function (root, vars) {
    root.querySelectorAll('[data-join]').forEach(function (b) { b.addEventListener('click', function () { AZ.openSheet({ vars: vars }); }); });
  };
  /* Scroll-linked drift for layers; also runs on phones because it is bound to scroll, not to the pointer. */
  R.drift = function (ctx, fn) {
    var ticking = false;
    function on() { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; fn(Math.min(scrollY, 1400)); }); }
    ctx.listen(window, 'scroll', on, { passive: true });
    fn(Math.min(scrollY, 1400));
  };

  /* Skyline with the three Flame Towers as a separate group so they can glow in the logo colours. */
  R.skyline = function (fill, towers) {
    var full = AZ.skyline(fill);
    var m = full.match(/<path d="M(1232|1316|1404) [^>]*\/>/g);
    return { base: full, towers: m ? m.join('') : '' };
  };
  return R;
})();
