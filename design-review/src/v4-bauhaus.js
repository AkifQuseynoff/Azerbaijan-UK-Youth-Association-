/* 4. Bauhaus Bakı: geometry in the flag colours. */
AZ.variants.push({
  id: 'bauhaus',
  name: 'Bauhaus Bakı',
  cls: 'v4',
  tagline: 'Geometry in the flag colours: circles, stars and crescents on a grid. Tap any tile and it turns with a springy overshoot.',
  mount: function (ctx) {
    var root = ctx.root;
    var B = '#00b5e2', R = '#ef3340', G = '#509e2f', C = '#f4efe3', K = '#101820';
    var s = AZ.star8(50, 50, 34);
    var crescent = 'M73.5 22.73A36 36 0 1 0 73.5 77.27A30 30 0 1 1 73.5 22.73Z';
    var tiles = [
      { bg: B, svg: '<path d="M0 100V0a100 100 0 0 1 100 100z" fill="' + R + '" transform="translate(0 0)"/>' },
      { bg: C, svg: '<circle cx="50" cy="50" r="34" fill="' + G + '"/>' },
      { bg: R, svg: '<path d="M10 70a40 40 0 0 1 80 0z" fill="' + C + '"/><rect x="10" y="74" width="80" height="8" fill="' + K + '"/>' },
      { bg: B, svg: '<polygon points="' + s[0] + '" fill="' + C + '"/><polygon points="' + s[1] + '" fill="' + C + '"/><circle cx="50" cy="50" r="9" fill="' + B + '"/>' },
      { bg: C, svg: '<rect y="0" width="100" height="34" fill="' + B + '"/><rect y="34" width="100" height="33" fill="' + R + '"/><rect y="67" width="100" height="33" fill="' + G + '"/>' },
      { bg: G, svg: '<path d="' + crescent + '" fill="' + C + '" transform="translate(-4 0)"/>' },
      { bg: C, svg: '<polygon points="50,14 88,84 12,84" fill="' + K + '"/><circle cx="50" cy="62" r="9" fill="' + R + '"/>' },
      { bg: K, svg: '<circle cx="50" cy="50" r="38" fill="' + R + '"/><circle cx="50" cy="50" r="26" fill="' + B + '"/><circle cx="50" cy="50" r="14" fill="' + G + '"/>' },
      { bg: R, svg: '<polygon points="0,100 100,0 100,100" fill="' + B + '"/><circle cx="34" cy="34" r="16" fill="' + C + '"/>' },
      { bg: C, svg: '<rect width="50" height="50" fill="' + B + '"/><rect x="50" width="50" height="50" fill="' + R + '"/><rect y="50" width="50" height="50" fill="' + G + '"/><circle cx="75" cy="75" r="22" fill="' + K + '"/>' },
    ];
    var tilesHtml = tiles.map(function (t, i) {
      return '<button type="button" class="v4-tile t' + (i + 1) + '" style="background:' + t.bg + '" aria-label="Turn tile ' + (i + 1) + '"><svg viewBox="0 0 100 100" aria-hidden="true">' + t.svg + '</svg></button>';
    }).join('');
    var bars = '';
    for (var i = 0; i < 40; i++) bars += '<i class="' + ['b', 'r', 'g'][i % 3] + '" style="--h:' + (0.2 + 0.8 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.29))).toFixed(2) + '"></i>';
    function block(tone, shape, d, m, t, meta, left) {
      var shapes = { circle: '<circle cx="50" cy="50" r="38"/>', tri: '<polygon points="50,12 90,84 10,84"/>', sq: '<rect x="14" y="14" width="72" height="72"/>' };
      return '<a href="#" class="v4-block ' + tone + '"><svg class="v4-shape" viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="5">' + shapes[shape] + '</svg><span class="v4-d"><b>' + d + '</b>' + m + '</span><span class="v4-bt">' + t + '</span><span class="v4-bm">' + meta + '</span><span class="v4-left">' + left + '</span></a>';
    }

    root.innerHTML =
      '<header class="v4-nav"><a href="#" class="v4-logo"><span class="v4-dots"><i></i><i></i><i></i></span>Az Youth UK</a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav>' +
        '<button type="button" class="v4-join" data-join>Join us</button></header>' +
      '<section class="v4-board">' +
        '<div class="v4-head"><h1><span>Young<i class="b"></i></span><span>Azerbaijani<i class="r"></i></span><span>Here<i class="g"></i></span></h1>' +
          '<div class="v4-head-foot"><p>A free community for young Azerbaijanis in the UK. Events, a podcast, and people who get it.</p><button type="button" class="v4-round" data-join aria-label="Join the community"><span>Join</span><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button></div></div>' +
        tilesHtml +
      '</section><p class="v4-hint">Tap the tiles. They turn.</p>' +
      '<section class="v4-sec" id="events"><div class="v4-sh"><h2>Coming up</h2><a href="#" class="v4-link">All events</a></div><div class="v4-blocks">' +
        block('b', 'circle', '14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places') +
        block('r', 'tri', '22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places') +
        block('g', 'sq', '05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left') +
      '</div></section>' +
      '<section class="v4-sec"><div class="v4-pod"><div class="v4-pod-art" aria-hidden="true"><i class="c1"></i><i class="c2"></i><svg viewBox="0 0 100 100"><path d="' + crescent + '" fill="' + C + '"/></svg></div>' +
        '<div class="v4-pod-main"><p class="v4-k">The podcast · Episode 14 · 42 min</p><h2>Between Two Homes</h2><p>with Aysel Mammadova</p>' +
          '<div class="v4-wave" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + bars + '</div>' +
          '<div class="v4-ctl"><button type="button" class="v4-play" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 24 24" width="30" height="30"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></button><span class="v4-time">0:00 / 42:00</span></div></div></div></section>' +
      '<section class="v4-sec"><div class="v4-sh"><h2>What it&apos;s about</h2></div><div class="v4-three">' +
        '<article><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="' + B + '"/></svg><h3>Culture</h3><p>Music, food, language and the traditions we carry with us.</p></article>' +
        '<article><svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,10 92,86 8,86" fill="' + R + '"/></svg><h3>Learning</h3><p>Talks, workshops and networking that help you grow.</p></article>' +
        '<article><svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="12" width="76" height="76" fill="' + G + '"/></svg><h3>Community</h3><p>A place to belong, wherever you were born.</p></article></div></section>' +
      '<section class="v4-cta"><h2>Join.<br>It&apos;s free.</h2><button type="button" class="v4-join v4-join-big" data-join>Create your account</button></section>' +
      '<footer class="v4-foot"><i></i><i></i><i></i><p>© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    root.querySelectorAll('[data-join]').forEach(function (b) {
      b.addEventListener('click', function () {
        AZ.openSheet({ vars: { '--sheet-bg': 'rgba(244,239,227,0.9)', '--sheet-fg': '#101820', '--sheet-accent': '#ef3340', '--sheet-font': 'Jost, system-ui, sans-serif', '--sheet-display': 'Jost, sans-serif', '--sheet-input-bg': '#fff', '--sheet-input-border': '#101820', '--sheet-solid': '#f4efe3' } });
      });
    });

    /* Tiles turn on a springy rotation (a little overshoot, because a tap is a physical flick). */
    root.querySelectorAll('.v4-tile').forEach(function (t) {
      var rot = new AZ.Spring(0, { response: 0.55, damping: 0.62, precision: 0.02 }), sc = new AZ.Spring(1, { response: 0.22, damping: 1, precision: 0.001 });
      var turns = 0;
      function apply() { t.style.transform = 'rotate(' + rot.x.toFixed(2) + 'deg) scale(' + sc.x.toFixed(3) + ')'; }
      rot.on(apply); sc.on(apply);
      t.addEventListener('pointerdown', function () { sc.to(0.92); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { t.addEventListener(ev, function () { sc.to(1); }); });
      t.addEventListener('click', function () { turns += 90; rot.to(turns); });
      ctx.onCleanup(function () { rot.stop(); sc.stop(); });
    });
    /* Event shapes turn when the block is hovered or pressed */
    root.querySelectorAll('.v4-block').forEach(function (b) {
      var shape = b.querySelector('.v4-shape'), a = new AZ.Spring(0, { response: 0.6, damping: 0.7, precision: 0.02 });
      a.on(function (v) { shape.style.transform = 'rotate(' + v.toFixed(2) + 'deg)'; });
      b.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') a.to(90); });
      b.addEventListener('pointerleave', function () { a.to(0); });
      b.addEventListener('pointerdown', function () { b.classList.add('is-down'); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { b.addEventListener(ev, function () { b.classList.remove('is-down'); }); });
      ctx.onCleanup(function () { a.stop(); });
    });

    /* Podcast */
    var play = root.querySelector('.v4-play'), wave = root.querySelector('.v4-wave'), time = root.querySelector('.v4-time'), art = root.querySelector('.v4-pod-art');
    var barsEl = [].slice.call(wave.children), prog = 0, playing = false, raf = 0, last = 0;
    function paint() {
      var n = Math.round(prog * barsEl.length);
      barsEl.forEach(function (b, k) { b.classList.toggle('on', k < n); });
      var sec = Math.round(prog * 2520); time.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') + ' / 42:00';
      wave.setAttribute('aria-valuenow', String(Math.round(prog * 100)));
    }
    function tick(t) { prog = Math.min(1, prog + (t - last) / 1000 / 45); last = t; paint(); if (playing && prog < 1) raf = requestAnimationFrame(tick); else { playing = false; play.classList.remove('is-on'); art.classList.remove('is-on'); } }
    play.addEventListener('click', function () {
      playing = !playing; play.classList.toggle('is-on', playing); art.classList.toggle('is-on', playing); play.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (playing) { if (prog >= 1) prog = 0; last = performance.now(); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
    });
    function scrub(x) { var r = wave.getBoundingClientRect(); prog = AZ.clamp((x - r.left) / r.width, 0, 1); paint(); }
    AZ.drag(wave, { start: function (e) { scrub(e.clientX); }, move: function (d) { scrub(d.x); } });
    wave.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { prog = Math.min(1, prog + 0.03); paint(); } if (e.key === 'ArrowLeft') { prog = Math.max(0, prog - 0.03); paint(); } });
    ctx.onCleanup(function () { cancelAnimationFrame(raf); });
    paint();
  },
});
