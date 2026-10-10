/* 1. Siluet: the Baku skyline at dusk, in the logo's colours. */
AZ.introTitle = 'Azerbaijan Youth Association: three new directions';
AZ.introText = 'A second round built from your feedback: the Baku skyline you liked, the crocheted moon, star and scrollbar, and the new logo animated. The event and podcast details are sample content for design purposes only.';

AZ.variants.push({
  id: 'siluet',
  name: 'Siluet',
  cls: 'r1',
  tagline: 'The Baku skyline at dusk in the logo colours. The logo draws itself on, the moon and star are crocheted, and the scrollbar is a strip of yarn.',
  mount: function (ctx) {
    var root = ctx.root;
    function card(d, m, t, meta, left, tone) { return '<a href="#" class="r1-glass r1-card" data-reveal><span class="r1-date"><b>' + d + '</b>' + m + '</span><span class="r1-cm"><strong>' + t + '</strong><em>' + meta + '</em></span><span class="r1-chip ' + tone + '"><i></i>' + left + '</span></a>'; }
    function pillar(tone, t, p) { return '<article class="r1-glass r1-pillar ' + tone + '" data-reveal><h3>' + t + '</h3><p>' + p + '</p></article>'; }

    root.innerHTML =
      '<header class="r1-nav" id="r1nav"><a href="#" class="r1-brand"><span class="r1-badge r1-badge-sm">' + AZ.logo({ mode: 'solid', cls: 'r1-navlogo' }) + '</span><span class="r1-wm">Az Youth UK</span></a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav><button type="button" class="r1-join" data-join>Join us</button></header>' +
      '<section class="r1-hero"><div class="r1-sky"><svg class="r1-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
          '<rect width="1600" height="470" fill="#1b4793"/><rect y="470" width="1600" height="272" fill="#c23028"/><rect y="742" width="1600" height="180" fill="#3e894c"/>' +
          '<g id="r1-city">' + AZ.skyline('#0b1a3d') + '</g>' +
          '<path d="M0 826C240 776 480 806 760 796C1060 786 1320 766 1600 816L1600 900L0 900Z" fill="#2f7040"/><path d="M0 864C300 836 620 856 900 846C1180 836 1400 856 1600 852L1600 900L0 900Z" fill="#245a33"/></svg>' +
        '<div class="r1-moon" id="r1-moon">' + AZ.crochetMoon({ moon: AZ.yarn.cream, star: AZ.yarn.cream }) + '</div></div>' +
        '<div class="r1-copy r1-glass"><div class="r1-herologo"><span class="r1-badge">' + AZ.logo({ mode: 'draw', cls: 'r1-bigmark' }) + '</span></div>' +
          '<p class="r1-eyebrow">Azərbaycan · United Kingdom</p><h1>Under the<br><em>same moon.</em></h1>' +
          '<p class="r1-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
          '<div class="r1-actions"><button type="button" class="r1-btn" data-join>Join the community</button><a href="#events" class="r1-link">See what&apos;s on ↓</a></div></div></section>' +
      '<main class="r1-main"><section class="r1-sec" id="events"><div class="r1-head"><h2>On the calendar</h2><a href="#" class="r1-link">All events</a></div><div class="r1-cards">' +
          card('14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places', 'b') + card('22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places', 'g') + card('05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left', 'r') + '</div></section>' +
        AZ.stitchRule() +
        '<section class="r1-sec"><div class="r1-glass r1-pod" data-reveal>' +
          '<button class="r1-play" type="button" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 120 120" aria-hidden="true"><circle r="52" cx="60" cy="60" class="track"/><g transform="rotate(-90 60 60)"><circle class="ring" r="52" cx="60" cy="60" pathLength="100"/><circle class="ring" r="52" cx="60" cy="60" pathLength="100"/><circle class="ring" r="52" cx="60" cy="60" pathLength="100"/></g></svg><span class="r1-pi"><svg viewBox="0 0 24 24" width="34" height="34"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></span></button>' +
          '<div><p class="r1-eyebrow">The podcast · Episode 14</p><h2>Between Two Homes</h2><p class="r1-meta">with Aysel Mammadova · 42 min</p><p>Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what &ldquo;home&rdquo; means when you have two.</p><p class="r1-time">0:00 / 42:00</p></div></div></section>' +
        AZ.stitchRule() +
        '<section class="r1-sec"><div class="r1-head"><h2>What it&apos;s about</h2></div><div class="r1-cards r1-three">' +
          pillar('b', 'Culture', 'Music, food, language and the traditions we carry with us.') + pillar('r', 'Learning', 'Talks, workshops and networking that help you grow.') + pillar('g', 'Community', 'A place to belong, wherever you were born.') + '</div></section></main>' +
      '<footer class="r1-foot"><div class="r1-lockup"><span class="r1-badge">' + AZ.logo({ mode: 'solid', cls: 'r1-footlogo' }) + '</span><p class="r1-lockup-t">Azerbaijan–UK<br>Youth Association</p></div><p>© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    root.querySelectorAll('[data-join]').forEach(function (b) {
      b.addEventListener('click', function () {
        AZ.openSheet({ vars: { '--sheet-bg': 'rgba(11,26,61,0.74)', '--sheet-fg': '#fff', '--sheet-accent': '#c23028', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Fraunces, serif', '--sheet-input-bg': 'rgba(255,255,255,0.08)', '--sheet-input-border': 'rgba(255,255,255,0.24)', '--sheet-solid': '#0b1a3d' } });
      });
    });

    AZ.logoAlive(ctx, root.querySelector('.r1-navlogo'));
    AZ.logoAlive(ctx, root.querySelector('.r1-bigmark'));
    AZ.crochetScrollbar(ctx, { dark: true });
    AZ.revealOnScroll(ctx, root);

    /* Scroll: translucent nav gains an edge; layers drift at different speeds (transform only). */
    var nav = root.querySelector('#r1nav'), moon = root.querySelector('#r1-moon'), city = root.querySelector('#r1-city'), star = root.querySelector('.az-star');
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = Math.min(window.scrollY, 900);
        nav.classList.toggle('is-scrolled', y > 24);
        if (AZ.reduced()) return;
        moon.style.transform = 'translate3d(' + (y * 0.04) + 'px,' + (-y * 0.2) + 'px,0)';
        city.setAttribute('transform', 'translate(0 ' + (y * 0.1) + ')');
        if (star) star.style.transform = 'rotate(' + (y * 0.2) + 'deg)';
      });
    }
    ctx.listen(window, 'scroll', onScroll, { passive: true });
    onScroll();

    /* Podcast: a ring in the three flame colours fills as it plays. */
    var btn = root.querySelector('.r1-play'), time = root.querySelector('.r1-time'), rings = [].slice.call(root.querySelectorAll('.ring'));
    var segs = [[0, 33.3, '#2f6cc0'], [33.3, 33.3, '#c23028'], [66.6, 33.4, '#3e894c']], prog = 0, playing = false, raf = 0, last = 0;
    function paint() {
      rings.forEach(function (r, i) { var s = segs[i], f = AZ.clamp((prog * 100 - s[0]) / s[1], 0, 1) * s[1]; r.setAttribute('stroke', s[2]); r.setAttribute('stroke-dasharray', f + ' ' + (100 - f)); r.setAttribute('stroke-dashoffset', -s[0]); });
      var sec = Math.round(prog * 2520); time.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') + ' / 42:00';
    }
    function tick(t) { prog = Math.min(1, prog + (t - last) / 1000 / 45); last = t; paint(); if (playing && prog < 1) raf = requestAnimationFrame(tick); else { playing = false; btn.classList.remove('is-on'); btn.setAttribute('aria-pressed', 'false'); } }
    btn.addEventListener('click', function () {
      playing = !playing; btn.classList.toggle('is-on', playing); btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (playing) { if (prog >= 1) prog = 0; last = performance.now(); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
    });
    ctx.onCleanup(function () { cancelAnimationFrame(raf); });
    paint();

    root.querySelectorAll('.r1-card').forEach(function (c) {
      c.addEventListener('pointerdown', function () { c.classList.add('is-down'); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { c.addEventListener(ev, function () { c.classList.remove('is-down'); }); });
    });
  },
});
