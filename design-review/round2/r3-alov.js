/* 3. Alov (flame): the Land of Fire, built around the flame in the logo. */
AZ.variants.push({
  id: 'alov',
  name: 'Alov',
  cls: 'r3',
  tagline: 'The flame from the logo is the hero: three tongues that lean toward you and flare when you press. Night sky, a small skyline, a crocheted moon.',
  mount: function (ctx) {
    var root = ctx.root;
    var bars = '';
    for (var i = 0; i < 38; i++) bars += '<i style="--h:' + (0.22 + 0.78 * Math.abs(Math.sin(i * 0.72) * Math.cos(i * 0.27))).toFixed(2) + ';--i:' + i + '"></i>';
    function card(d, m, t, meta, left, tone, lit) {
      var fl = [0, 1, 2].map(function (k) { return '<span class="' + (k < lit ? 'on ' : '') + 'f' + k + '"></span>'; }).join('');
      return '<a href="#" class="r3-card ' + tone + '" data-reveal><span class="r3-date"><b>' + d + '</b>' + m + '</span><span class="r3-cm"><strong>' + t + '</strong><em>' + meta + '</em></span><span class="r3-foot"><span class="r3-flames" aria-hidden="true">' + fl + '</span><span>' + left + '</span></span></a>';
    }
    function pillar(tone, t, p) { return '<article class="r3-pillar ' + tone + '" data-reveal><h3>' + t + '</h3><p>' + p + '</p></article>'; }

    root.innerHTML =
      '<header class="r3-nav" id="r3nav"><a href="#" class="r3-brand"><span class="r3-badge">' + AZ.logo({ mode: 'solid', cls: 'r3-navlogo' }) + '</span><span class="r3-wm">Az Youth UK</span></a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav><button type="button" class="r3-join" data-join>Join us</button></header>' +
      '<section class="r3-hero" id="r3hero"><div class="r3-stars" aria-hidden="true"></div>' +
        '<svg class="r3-city" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><rect y="560" width="1600" height="340" fill="#6b1d1d" opacity=".42"/><rect y="640" width="1600" height="260" fill="#8a2a1e" opacity=".3"/>' + AZ.skyline('#050b22') + '<rect y="760" width="1600" height="140" fill="#050b22"/></svg>' +
        '<div class="r3-moon">' + AZ.crochetMoon({ moon: AZ.yarn.cream, star: AZ.yarn.cream }) + '</div>' +
        '<div class="r3-flamebox" id="r3flamebox">' + AZ.logo({ mode: 'draw', only: ['swoosh', 'red', 'green'], viewBox: '590 380 380 760', cls: 'r3-flame' }) + '</div>' +
        '<div class="r3-copy"><p class="r3-eyebrow">Azərbaycan · United Kingdom</p><h1>From the <em>Land of Fire</em><br>to the UK.</h1>' +
          '<p class="r3-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
          '<div class="r3-actions"><button type="button" class="r3-btn" data-join>Join the community</button><a href="#events" class="r3-link">See what&apos;s on ↓</a></div><p class="r3-tip">Press and hold the flame.</p></div></section>' +
      '<main class="r3-main"><section class="r3-sec" id="events"><div class="r3-head"><h2>On the calendar</h2><a href="#" class="r3-link">All events</a></div><div class="r3-cards">' +
          card('14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places', 'b', 2) + card('22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places', 'g', 3) + card('05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left', 'r', 1) + '</div></section>' +
        AZ.stitchRule() +
        '<section class="r3-sec"><div class="r3-pod" data-reveal><div class="r3-pt"><p class="r3-eyebrow">The podcast · Episode 14 · 42 min</p><h2>Between Two Homes</h2><p class="r3-meta">with Aysel Mammadova</p><p>Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what &ldquo;home&rdquo; means when you have two.</p></div>' +
          '<div class="r3-player"><div class="r3-wave" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + bars + '</div>' +
          '<div class="r3-ctl"><button type="button" class="r3-play" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 24 24" width="30" height="30"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></button><span class="r3-time">0:00 / 42:00</span></div></div></div></section>' +
        AZ.stitchRule() +
        '<section class="r3-sec"><div class="r3-head"><h2>What it&apos;s about</h2></div><div class="r3-cards r3-three">' + pillar('b', 'Culture', 'Music, food, language and the traditions we carry with us.') + pillar('r', 'Learning', 'Talks, workshops and networking that help you grow.') + pillar('g', 'Community', 'A place to belong, wherever you were born.') + '</div></section></main>' +
      '<footer class="r3-footer"><div class="r3-lockup"><span class="r3-badge">' + AZ.logo({ mode: 'solid', cls: 'r3-footlogo' }) + '</span><p>Azerbaijan–UK<br>Youth Association</p></div><p class="r3-c2">© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    root.querySelectorAll('[data-join]').forEach(function (b) {
      b.addEventListener('click', function () {
        AZ.openSheet({ vars: { '--sheet-bg': 'rgba(8,18,46,0.78)', '--sheet-fg': '#fff', '--sheet-accent': '#c23028', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Fraunces, serif', '--sheet-input-bg': 'rgba(255,255,255,0.08)', '--sheet-input-border': 'rgba(255,255,255,0.24)', '--sheet-solid': '#08122e' } });
      });
    });
    AZ.logoAlive(ctx, root.querySelector('.r3-navlogo'));
    AZ.crochetScrollbar(ctx, { dark: true });
    AZ.revealOnScroll(ctx, root);

    /* ---- The flame: three tongues lean toward the pointer on springs; press and hold to flare ---- */
    var flame = root.querySelector('.r3-flame'), box = root.querySelector('#r3flamebox');
    var red = flame.querySelector('.lg-red'), green = flame.querySelector('.lg-green'), sw = flame.querySelector('.lg-swoosh');
    [red, green, sw].forEach(function (e) { e.style.transformBox = 'fill-box'; e.style.transformOrigin = '50% 100%'; });
    var cfg = [[red, 1.0, 0.7, 0.62], [green, 0.8, 0.85, 0.6], [sw, 0.4, 1.0, 0.7]];
    var springs = cfg.map(function (c) { return { el: c[0], k: c[1], skew: new AZ.Spring(0, { response: c[2], damping: c[3], precision: 0.002 }), flare: new AZ.Spring(1, { response: 0.35, damping: 0.55, precision: 0.001 }) }; });
    var tx = 0, press = 0, t0 = performance.now(), raf = 0, alive = true;
    springs.forEach(function (s) { function ap() { s.el.style.transform = 'skewX(' + (-s.skew.x).toFixed(2) + 'deg) scaleY(' + s.flare.x.toFixed(3) + ') scaleX(' + (1 + (s.flare.x - 1) * 0.6).toFixed(3) + ')'; } s.skew.on(ap); s.flare.on(ap); });
    function loop(now) {
      if (!alive) return; var t = (now - t0) / 1000, idle = AZ.reduced() ? 0 : 1;
      springs.forEach(function (s, i) { s.skew.to(tx * 14 * s.k + Math.sin(t * (1.1 + i * 0.23) + i) * 3 * idle); s.flare.to(1 + press * (0.1 + i * 0.03)); });
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    function move(e) { var r = box.getBoundingClientRect(); tx = AZ.clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth * 0.45), -1, 1); }
    ctx.listen(window, 'pointermove', move, { passive: true });
    var hero = root.querySelector('#r3hero');
    ctx.listen(hero, 'pointerdown', function (e) { if (e.target.closest('a, button')) return; press = 1; box.classList.add('is-lit'); });
    ['pointerup', 'pointercancel'].forEach(function (ev) { ctx.listen(window, ev, function () { press = 0; box.classList.remove('is-lit'); }); });
    ctx.onCleanup(function () { alive = false; cancelAnimationFrame(raf); springs.forEach(function (s) { s.skew.stop(); s.flare.stop(); }); });

    /* nav edge + gentle depth */
    var nav = root.querySelector('#r3nav'), city = root.querySelector('.r3-city'), moon = root.querySelector('.r3-moon'), star = root.querySelector('.az-star'), ticking = false;
    function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; var y = Math.min(scrollY, 900); nav.classList.toggle('is-scrolled', y > 24); if (AZ.reduced()) return; city.style.transform = 'translateY(' + (y * 0.12) + 'px)'; moon.style.transform = 'translateY(' + (-y * 0.2) + 'px)'; if (star) star.style.transform = 'rotate(' + (y * 0.2) + 'deg)'; }); }
    ctx.listen(window, 'scroll', onScroll, { passive: true });
    onScroll();

    /* ---- Podcast: flame-wave. Bars rise like tongues while playing; played bars take the logo colours ---- */
    var play = root.querySelector('.r3-play'), wave = root.querySelector('.r3-wave'), time = root.querySelector('.r3-time');
    var b = [].slice.call(wave.children), prog = 0, playing = false, praf = 0, last = 0, cols = ['#2f6cc0', '#c23028', '#3e894c'];
    function paint() {
      var n = Math.round(prog * b.length);
      b.forEach(function (el, k) { el.classList.toggle('on', k < n); el.style.setProperty('--c', cols[Math.min(2, Math.floor(k / (b.length / 3)))]); });
      var sec = Math.round(prog * 2520); time.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') + ' / 42:00';
      wave.setAttribute('aria-valuenow', String(Math.round(prog * 100)));
    }
    function tick(t) { prog = Math.min(1, prog + (t - last) / 1000 / 45); last = t; paint(); if (playing && prog < 1) praf = requestAnimationFrame(tick); else { playing = false; play.classList.remove('is-on'); wave.classList.remove('is-playing'); play.setAttribute('aria-pressed', 'false'); } }
    play.addEventListener('click', function () {
      playing = !playing; play.classList.toggle('is-on', playing); wave.classList.toggle('is-playing', playing); play.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (playing) { if (prog >= 1) prog = 0; last = performance.now(); praf = requestAnimationFrame(tick); } else cancelAnimationFrame(praf);
    });
    function scrub(x) { var r = wave.getBoundingClientRect(); prog = AZ.clamp((x - r.left) / r.width, 0, 1); paint(); }
    AZ.drag(wave, { start: function (e) { scrub(e.clientX); }, move: function (d) { scrub(d.x); } });
    wave.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { prog = Math.min(1, prog + 0.03); paint(); } if (e.key === 'ArrowLeft') { prog = Math.max(0, prog - 0.03); paint(); } });
    ctx.onCleanup(function () { cancelAnimationFrame(praf); });
    paint();

    root.querySelectorAll('.r3-card').forEach(function (c) {
      c.addEventListener('pointerdown', function () { c.classList.add('is-down'); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { c.addEventListener(ev, function () { c.classList.remove('is-down'); }); });
    });
  },
});
