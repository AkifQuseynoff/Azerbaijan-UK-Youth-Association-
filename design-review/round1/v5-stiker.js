/* 5. Stiker: a zine and a sticker sheet in the flag colours. */
AZ.variants.push({
  id: 'stiker',
  name: 'Stiker',
  cls: 'v5',
  tagline: 'Playful zine: marker highlights, a tape-and-sticker collage, and stickers you can throw across the page. They keep your momentum.',
  mount: function (ctx) {
    var root = ctx.root;
    var B = '#00b5e2', R = '#ef3340', G = '#509e2f', K = '#1a1410';
    var st = AZ.star8(50, 50, 40);
    var crescent = 'M73.5 22.73A36 36 0 1 0 73.5 77.27A30 30 0 1 1 73.5 22.73Z';
    var stickers = [
      { cls: 'star', w: 150, rot: -12, svg: '<svg viewBox="0 0 100 100"><polygon points="' + st[0] + '" fill="' + B + '"/><polygon points="' + st[1] + '" fill="' + B + '"/><circle cx="50" cy="50" r="12" fill="#fff"/></svg>' },
      { cls: 'moon', w: 150, rot: 14, svg: '<svg viewBox="0 0 100 100"><path d="' + crescent + '" fill="' + R + '"/></svg>' },
      { cls: 'nar', w: 140, rot: -6, svg: '<svg viewBox="0 0 100 100"><path d="M50 22 L40 10 L46 18 L50 6 L54 18 L60 10Z" fill="' + G + '"/><circle cx="50" cy="56" r="34" fill="' + R + '"/><path d="M36 50q14 -14 28 0" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".6"/><circle cx="42" cy="64" r="3.4" fill="#fff" opacity=".85"/><circle cx="55" cy="68" r="3.4" fill="#fff" opacity=".85"/><circle cx="62" cy="58" r="3.4" fill="#fff" opacity=".85"/></svg>' },
      { cls: 'tea', w: 130, rot: 9, svg: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="88" rx="34" ry="6" fill="' + B + '"/><path d="M30 18h40c2 12 -2 22 -8 26 6 4 10 12 6 30 -1 5 -4 8 -9 8H41c-5 0 -8 -3 -9 -8 -4 -18 0 -26 6 -30 -6 -4 -10 -14 -8 -26z" fill="#fff" stroke="' + K + '" stroke-width="3"/><path d="M33 26h34c1 8 -2 14 -6 17H39c-4 -3 -7 -9 -6 -17z" fill="' + R + '"/></svg>' },
      { cls: 'free', w: 168, rot: -8, svg: '<svg viewBox="0 0 100 100"><polygon points="' + (function () { var p = []; for (var i = 0; i < 24; i++) { var a = i * 15 * Math.PI / 180, r = i % 2 ? 40 : 48; p.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1)); } return p.join(' '); })() + '" fill="' + G + '"/><text x="50" y="46" text-anchor="middle" font-family="Bricolage, sans-serif" font-weight="800" font-size="16" fill="#fff">FREE</text><text x="50" y="62" text-anchor="middle" font-family="Bricolage, sans-serif" font-weight="800" font-size="12" fill="#fff">TO JOIN</text></svg>' },
    ];
    var stickerHtml = stickers.map(function (s, i) { return '<div class="v5-sticker ' + s.cls + '" data-i="' + i + '" style="width:' + s.w + 'px" role="img" aria-label="Draggable sticker">' + s.svg + '</div>'; }).join('');
    var bars = '';
    for (var i = 0; i < 36; i++) bars += '<i style="--h:' + (0.25 + 0.75 * Math.abs(Math.sin(i * 0.75) * Math.cos(i * 0.31))).toFixed(2) + '"></i>';
    function page(tone, rot, d, m, t, meta, left) {
      return '<a href="#" class="v5-page ' + tone + '" style="--r:' + rot + 'deg"><i class="v5-tape"></i><span class="v5-date"><b>' + d + '</b>' + m + '</span><span class="v5-pt">' + t + '</span><span class="v5-pm">' + meta + '</span><span class="v5-left">' + left + '</span></a>';
    }

    root.innerHTML =
      '<header class="v5-nav"><a href="#" class="v5-logo"><span>' + AZ.emblem('#ef3340') + '</span>Az Youth UK</a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav>' +
        '<button type="button" class="v5-btn v5-btn-sm" data-join>Join us</button></header>' +
      '<section class="v5-hero" id="v5-hero"><div class="v5-copy"><p class="v5-eyebrow">Azərbaycan · United Kingdom</p>' +
        '<h1><mark class="b">Young</mark> <span>&amp;</span> <mark class="r">Azerbaijani</mark> <span>&amp;</span> <mark class="g">here.</mark></h1>' +
        '<p class="v5-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
        '<div class="v5-actions"><button type="button" class="v5-btn" data-join>Join the community</button><a href="#events" class="v5-link">See what&apos;s on</a></div>' +
        '<p class="v5-tip">Psst. Try throwing a sticker.</p></div>' + stickerHtml +
        '<i class="v5-strip s1"><b></b><b></b><b></b></i><i class="v5-strip s2"><b></b><b></b><b></b></i></section>' +
      '<section class="v5-sec" id="events"><div class="v5-sh"><h2>Coming up</h2><a href="#" class="v5-link">All events</a></div><div class="v5-pages">' +
        page('b', -1.6, '14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places') +
        page('r', 1.2, '22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places') +
        page('g', -0.8, '05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left') +
      '</div></section>' +
      '<section class="v5-sec"><div class="v5-tape-card"><div class="v5-reels" aria-hidden="true"><i class="reel"><b></b></i><i class="reel"><b></b></i></div>' +
        '<div class="v5-pod-main"><p class="v5-eyebrow">The podcast · Episode 14 · 42 min</p><h2>Between Two Homes</h2><p>with Aysel Mammadova</p>' +
          '<div class="v5-wave" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + bars + '</div>' +
          '<div class="v5-ctl"><button type="button" class="v5-play" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 24 24" width="28" height="28"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></button><span class="v5-time">0:00 / 42:00</span></div></div></div></section>' +
      '<section class="v5-sec"><div class="v5-sh"><h2>What it&apos;s about</h2></div><div class="v5-polaroids">' +
        '<article class="b"><div></div><h3>Culture</h3><p>Music, food, language and the traditions we carry with us.</p></article>' +
        '<article class="r"><div></div><h3>Learning</h3><p>Talks, workshops and networking that help you grow.</p></article>' +
        '<article class="g"><div></div><h3>Community</h3><p>A place to belong, wherever you were born.</p></article></div></section>' +
      '<section class="v5-final"><h2>Join us. <mark>It&apos;s free.</mark></h2><button type="button" class="v5-btn v5-btn-big" data-join>Create your account</button></section>' +
      '<footer class="v5-foot"><i class="v5-strip"><b></b><b></b><b></b></i><p>© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    root.querySelectorAll('[data-join]').forEach(function (b) {
      b.addEventListener('click', function () {
        AZ.openSheet({ vars: { '--sheet-bg': 'rgba(255,248,232,0.92)', '--sheet-fg': '#1a1410', '--sheet-accent': '#ef3340', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Bricolage, sans-serif', '--sheet-input-bg': '#fff', '--sheet-input-border': '#1a1410', '--sheet-solid': '#fff8e8' } });
      });
    });

    /* ---- Throwable stickers: 1:1 while held, velocity handed to a spring on release,
     *      flick projected to a landing point, softly rubber-banded at the page edges. ---- */
    var hero = root.querySelector('#v5-hero');
    var start = [[0.73, 0.08], [0.9, 0.2], [0.76, 0.44], [0.91, 0.52], [0.82, 0.76]];
    root.querySelectorAll('.v5-sticker').forEach(function (el, i) {
      var base = stickers[i].rot;
      var sx = new AZ.Spring(0, { response: 0.45, damping: 0.8, precision: 0.05 }), sy = new AZ.Spring(0, { response: 0.45, damping: 0.8, precision: 0.05 });
      var sr = new AZ.Spring(base, { response: 0.4, damping: 0.65, precision: 0.02 }), ss = new AZ.Spring(1, { response: 0.25, damping: 0.8, precision: 0.001 });
      var held = false, gx = 0, gy = 0, w = 0, h = 0;
      function apply() { el.style.transform = 'translate(' + sx.x.toFixed(1) + 'px,' + sy.x.toFixed(1) + 'px) rotate(' + sr.x.toFixed(2) + 'deg) scale(' + ss.x.toFixed(3) + ')'; }
      [sx, sy, sr, ss].forEach(function (s) { s.on(apply); });
      function place() {
        var r = hero.getBoundingClientRect(); w = el.offsetWidth; h = el.offsetHeight;
        var narrow = r.width < 1000;
        var px = narrow ? [0.16, 0.64, 0.4, 0.82, 0.12][i] : start[i][0], py = narrow ? [0.66, 0.72, 0.86, 0.62, 0.93][i] : start[i][1];
        sx.jump(px * r.width - w / 2); sy.jump(py * r.height - h / 2);
      }
      place();
      ctx.listen(window, 'resize', place);
      function bounds() { var r = hero.getBoundingClientRect(); return { minX: -w * 0.25, maxX: r.width - w * 0.75, minY: -h * 0.1, maxY: r.height - h * 0.85, W: r.width, H: r.height }; }
      AZ.drag(el, {
        start: function () { held = true; sx.stop(); sy.stop(); gx = sx.x; gy = sy.x; ss.to(1.1); sr.to(base + (i % 2 ? 6 : -6)); el.classList.add('is-held'); },
        move: function (d) {
          var b = bounds(), nx = gx + d.dx, ny = gy + d.dy;
          function soft(v, lo, hi, dim) { return v < lo ? lo + AZ.rubber(v - lo, dim) : v > hi ? hi + AZ.rubber(v - hi, dim) : v; }
          sx.jump(soft(nx, b.minX, b.maxX, b.W)); sy.jump(soft(ny, b.minY, b.maxY, b.H));
          sr.to(base + AZ.clamp(d.dx * 0.05, -25, 25));
        },
        end: function (d) {
          held = false; el.classList.remove('is-held');
          var b = bounds();
          var tx = AZ.clamp(sx.x + AZ.project(d.vx, 0.99), b.minX, b.maxX), ty = AZ.clamp(sy.x + AZ.project(d.vy, 0.99), b.minY, b.maxY);
          sx.tune(0.5, 0.85); sy.tune(0.5, 0.85);
          sx.to(tx, { velocity: d.vx }); sy.to(ty, { velocity: d.vy });
          sr.to(base + AZ.clamp(d.vx * 0.004, -30, 30)); setTimeout(function () { if (!held) sr.to(base); }, 220);
          ss.to(1);
        },
      });
      ctx.onCleanup(function () { [sx, sy, sr, ss].forEach(function (s) { s.stop(); }); });
    });

    /* ---- Podcast: reels spin while playing; the stripe bar scrubs ---- */
    var play = root.querySelector('.v5-play'), wave = root.querySelector('.v5-wave'), time = root.querySelector('.v5-time'), reels = root.querySelector('.v5-reels');
    var barsEl = [].slice.call(wave.children), prog = 0, playing = false, raf = 0, last = 0;
    function paint() {
      var n = Math.round(prog * barsEl.length);
      barsEl.forEach(function (b, k) { b.classList.toggle('on', k < n); b.style.setProperty('--c', [B, R, G][Math.floor(k / (barsEl.length / 3))]); });
      var sec = Math.round(prog * 2520); time.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') + ' / 42:00';
      wave.setAttribute('aria-valuenow', String(Math.round(prog * 100)));
    }
    function tick(t) { prog = Math.min(1, prog + (t - last) / 1000 / 45); last = t; paint(); if (playing && prog < 1) raf = requestAnimationFrame(tick); else { playing = false; play.classList.remove('is-on'); reels.classList.remove('is-on'); } }
    play.addEventListener('click', function () {
      playing = !playing; play.classList.toggle('is-on', playing); reels.classList.toggle('is-on', playing); play.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (playing) { if (prog >= 1) prog = 0; last = performance.now(); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
    });
    function scrub(x) { var r = wave.getBoundingClientRect(); prog = AZ.clamp((x - r.left) / r.width, 0, 1); paint(); }
    AZ.drag(wave, { start: function (e) { scrub(e.clientX); }, move: function (d) { scrub(d.x); } });
    wave.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { prog = Math.min(1, prog + 0.03); paint(); } if (e.key === 'ArrowLeft') { prog = Math.max(0, prog - 0.03); paint(); } });
    ctx.onCleanup(function () { cancelAnimationFrame(raf); });
    paint();

    root.querySelectorAll('.v5-page').forEach(function (p) {
      p.addEventListener('pointerdown', function () { p.classList.add('is-down'); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { p.addEventListener(ev, function () { p.classList.remove('is-down'); }); });
    });
  },
});
