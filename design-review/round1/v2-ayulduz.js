/* 2. Ay & Ulduz: the flag read as an evening landscape. */
AZ.variants.push({
  id: 'ayulduz',
  name: 'Ay & Ulduz',
  cls: 'v2',
  tagline: 'The flag as an evening landscape: blue sky, red dusk, green earth, with the crescent and star overhead. Glass panels, depth, gentle parallax.',
  mount: function (ctx) {
    var root = ctx.root;
    var star = AZ.star8(0, 0, 21);
    function tower(x, w, h, lean) {
      return '<path d="M' + x + ' 760 C' + (x - 4) + ' ' + (760 - h * 0.5) + ' ' + (x + w * 0.1 + lean) + ' ' + (760 - h * 0.85) + ' ' + (x + w * 0.5 + lean) + ' ' + (760 - h) + ' C' + (x + w * 0.9 + lean) + ' ' + (760 - h * 0.85) + ' ' + (x + w + 4) + ' ' + (760 - h * 0.5) + ' ' + (x + w) + ' 760Z"/>';
    }
    var blocks = '';
    var seed = [60, 90, 52, 120, 70, 44, 100, 64, 84, 40, 110, 58];
    for (var i = 0; i < 28; i++) { var bh = (seed[i % seed.length] + (i % 3) * 14) * Math.min(1, Math.max(0.22, (i * 58 - 160) / 900)); blocks += '<rect x="' + (i * 58 - 20) + '" y="' + (760 - bh) + '" width="' + (36 + (i % 4) * 8) + '" height="' + bh + '"/>'; }
    var ring = function (a, b, c) { return '<circle class="ring" r="52" cx="60" cy="60" stroke="' + c + '" pathLength="100" stroke-dasharray="' + a + ' ' + (100 - a) + '" stroke-dashoffset="' + (-b) + '"/>'; };

    root.innerHTML =
      '<header class="v2-nav" id="v2nav"><a href="#" class="v2-logo"><span>' + AZ.emblem('currentColor') + '</span>Az Youth UK</a>' +
      '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav>' +
      '<button type="button" class="v2-join" data-join>Join us</button></header>' +
      '<section class="v2-hero"><svg class="v2-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
        '<rect width="1600" height="480" fill="#00b5e2"/><rect y="480" width="1600" height="260" fill="#ef3340"/><rect y="740" width="1600" height="200" fill="#509e2f"/>' +
        '<g id="v2-moon" fill="#fff6e6"><path transform="translate(1180 200) scale(2.3) translate(-50 -50)" d="M73.5 22.73A36 36 0 1 0 73.5 77.27A30 30 0 1 1 73.5 22.73Z"/>' +
          '<g id="v2-star" transform="translate(1262 200)"><polygon points="' + star[0] + '"/><polygon points="' + star[1] + '"/></g></g>' +
        '<g id="v2-city" fill="#06222b">' +
          '<g transform="translate(0 -20)">' + blocks + '</g>' +
          tower(1120, 54, 440, 6) + tower(1196, 58, 520, -4) + tower(1278, 52, 380, 8) +
          '<path d="M452 760 L460 540 L548 540 L556 760Z"/><path d="M452 540 L548 540 L538 516 L462 516Z"/><rect x="556" y="560" width="26" height="200"/><rect x="474" y="500" width="52" height="16"/>' +
          '<path d="M740 760 L740 660 A60 60 0 0 1 860 660 L860 760Z"/><rect x="796" y="560" width="8" height="40"/><rect x="884" y="470" width="14" height="290"/><path d="M880 470 L891 440 L902 470Z"/><rect x="880" y="540" width="22" height="8"/>' +
        '</g>' +
        '<path d="M0 820 C240 770 480 800 760 790 C1060 780 1320 760 1600 810 L1600 900 L0 900Z" fill="#3d7a22"/>' +
        '<path d="M0 860 C300 830 620 850 900 840 C1180 830 1400 850 1600 846 L1600 900 L0 900Z" fill="#2c5f17"/>' +
      '</svg>' +
      '<div class="v2-hero-copy"><p class="v2-eyebrow">Azərbaycan · United Kingdom</p>' +
        '<h1>Under the<br><em>same moon.</em></h1>' +
        '<p class="v2-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
        '<div class="v2-actions"><button type="button" class="v2-btn" data-join>Join the community</button><a href="#events" class="v2-link">See what&apos;s on ↓</a></div></div>' +
      '</section>' +
      '<main class="v2-main">' +
        '<section class="v2-sec" id="events"><div class="v2-head"><h2>On the calendar</h2><a href="#" class="v2-link">All events</a></div>' +
        '<div class="v2-cards">' +
          card('14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places', 'blue') +
          card('22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places', 'green') +
          card('05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left', 'red') +
        '</div></section>' +
        '<section class="v2-sec v2-pod"><div class="v2-glass v2-pod-card">' +
          '<button class="v2-play" type="button" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 120 120" aria-hidden="true"><circle r="52" cx="60" cy="60" class="track"/>' +
            '<g transform="rotate(-90 60 60)"><circle class="ring r1" r="52" cx="60" cy="60" pathLength="100"/><circle class="ring r2" r="52" cx="60" cy="60" pathLength="100"/><circle class="ring r3" r="52" cx="60" cy="60" pathLength="100"/></g></svg>' +
            '<span class="v2-play-icon"><svg viewBox="0 0 24 24" width="30" height="30"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></span></button>' +
          '<div><p class="v2-eyebrow">The podcast · Episode 14</p><h2>Between Two Homes</h2><p class="v2-meta">with Aysel Mammadova · 42 min</p><p>Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what &ldquo;home&rdquo; means when you have two.</p><p class="v2-time">0:00 / 42:00</p></div>' +
        '</div></section>' +
        '<section class="v2-sec"><div class="v2-head"><h2>What it&apos;s about</h2></div><div class="v2-cards v2-three">' +
          pillar('blue', 'Culture', 'Music, food, language and the traditions we carry with us.') +
          pillar('red', 'Learning', 'Talks, workshops and networking that help you grow.') +
          pillar('green', 'Community', 'A place to belong, wherever you were born.') +
        '</div></section>' +
      '</main>' +
      '<footer class="v2-foot"><i></i><i></i><i></i><p>© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    function card(d, m, t, meta, left, tone) {
      return '<a href="#" class="v2-glass v2-card"><span class="v2-date"><b>' + d + '</b>' + m + '</span><span class="v2-card-main"><strong>' + t + '</strong><em>' + meta + '</em></span><span class="v2-chip ' + tone + '"><i></i>' + left + '</span></a>';
    }
    function pillar(tone, t, p) { return '<article class="v2-glass v2-pillar ' + tone + '"><h3>' + t + '</h3><p>' + p + '</p></article>'; }

    root.querySelectorAll('[data-join]').forEach(function (b) {
      b.addEventListener('click', function () {
        AZ.openSheet({ vars: { '--sheet-bg': 'rgba(6,34,43,0.72)', '--sheet-fg': '#fff', '--sheet-accent': '#ef3340', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Fraunces, serif', '--sheet-input-bg': 'rgba(255,255,255,0.08)', '--sheet-input-border': 'rgba(255,255,255,0.22)', '--sheet-solid': '#06222b' } });
      });
    });

    /* Scroll: translucent nav gains an edge, layers drift at different speeds (transform only). */
    var nav = root.querySelector('#v2nav'), moon = root.querySelector('#v2-moon'), city = root.querySelector('#v2-city'), starEl = root.querySelector('#v2-star');
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = Math.min(window.scrollY, 900);
        nav.classList.toggle('is-scrolled', y > 24);
        if (AZ.reduced()) return;
        moon.setAttribute('transform', 'translate(' + (y * 0.05) + ' ' + (-y * 0.22) + ')');
        city.setAttribute('transform', 'translate(0 ' + (y * 0.1) + ')');
        starEl.setAttribute('transform', 'translate(1262 200) rotate(' + y * 0.18 + ')');
      });
    }
    ctx.listen(window, 'scroll', onScroll, { passive: true });
    onScroll();

    /* Podcast: a three-colour ring (blue, red, green) fills as the episode plays. */
    var btn = root.querySelector('.v2-play'), time = root.querySelector('.v2-time');
    var rings = [].slice.call(root.querySelectorAll('.ring'));
    var segs = [[0, 33.3, '#00b5e2'], [33.3, 33.3, '#ef3340'], [66.6, 33.4, '#509e2f']];
    var prog = 0, playing = false, raf = 0, last = 0;
    function paint() {
      rings.forEach(function (r, i) {
        var s = segs[i], filled = AZ.clamp((prog * 100 - s[0]) / s[1], 0, 1) * s[1];
        r.setAttribute('stroke', s[2]);
        r.setAttribute('stroke-dasharray', filled + ' ' + (100 - filled));
        r.setAttribute('stroke-dashoffset', -s[0]);
      });
      var sec = Math.round(prog * 2520);
      time.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') + ' / 42:00';
    }
    function tick(t) {
      prog = Math.min(1, prog + (t - last) / 1000 / 45); last = t; paint();
      if (playing && prog < 1) raf = requestAnimationFrame(tick); else { playing = false; btn.classList.remove('is-on'); btn.setAttribute('aria-pressed', 'false'); }
    }
    btn.addEventListener('click', function () {
      playing = !playing; btn.classList.toggle('is-on', playing); btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (playing) { if (prog >= 1) prog = 0; last = performance.now(); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
    });
    ctx.onCleanup(function () { cancelAnimationFrame(raf); });
    paint();

    /* Glass cards respond on press, the instant the pointer goes down. */
    root.querySelectorAll('.v2-card').forEach(function (c) {
      c.addEventListener('pointerdown', function () { c.classList.add('is-down'); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { c.addEventListener(ev, function () { c.classList.remove('is-down'); }); });
    });
  },
});
