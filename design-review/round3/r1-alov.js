/* 1. Alov (flame), refined: one calm composition. The flame from the logo inside a ring, a quiet skyline, a crocheted moon. */
AZ.variants.push({
  id: 'alov',
  name: 'Alov',
  cls: 'r1',
  tagline: 'Calm and centred. The flame draws itself on inside a ring, then breathes. On a phone it leans as you scroll and flares when you tap it.',
  mount: function (ctx) {
    var root = ctx.root;
    function card(d, m, t, meta, left, tone) {
      return '<a href="#" class="ao-card ' + tone + '" data-reveal><span class="ao-date"><b>' + d + '</b>' + m + '</span><span class="ao-cm"><strong>' + t + '</strong><em>' + meta + '</em></span><span class="ao-left">' + left + '</span></a>';
    }
    function pillar(tone, n, t, p) { return '<article class="ao-pillar ' + tone + '" data-reveal><i>' + n + '</i><h3>' + t + '</h3><p>' + p + '</p></article>'; }
    var ring = '<svg class="ao-ring" viewBox="0 0 200 200" aria-hidden="true"><circle class="a" cx="100" cy="100" r="94" pathLength="100"/><circle class="b" cx="100" cy="100" r="94" pathLength="100"/><circle class="c" cx="100" cy="100" r="94" pathLength="100"/></svg>';
    var city = R3.skyline('#1b4793');

    root.innerHTML =
      '<header class="ao-nav" id="aonav"><a href="#" class="ao-brand">' + AZ.logo({ mode: 'solid', cls: 'ao-navlogo' }) + '<span class="ao-wm">Az Youth UK</span></a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav><button type="button" class="ao-join" data-join>Join us</button></header>' +
      '<section class="ao-hero" id="aohero">' +
        '<svg class="ao-city" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g class="far" opacity=".07" transform="translate(120 -4)">' + city.base.replace('fill="#1b4793"', 'fill="#1b4793"') + '</g><g class="near" opacity=".14">' + city.base + '<rect y="763" width="1600" height="60" fill="#1b4793"/></g></svg>' +
        '<div class="ao-moon">' + AZ.crochetMoon({ moon: AZ.yarn.blue, star: AZ.yarn.red }) + '</div>' +
        '<div class="ao-stage"><div class="ao-glow"></div>' + ring + '<div class="ao-flamebox" id="aoflame">' + AZ.logo({ mode: 'draw', only: ['swoosh', 'red', 'green'], viewBox: '590 380 380 760', cls: 'ao-flame' }) + '</div></div>' +
        '<div class="ao-copy"><p class="ao-eyebrow">Azərbaycan · United Kingdom</p><h1>From the Land of Fire <span>to the UK.</span></h1>' +
          '<p class="ao-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
          '<div class="ao-actions"><button type="button" class="ao-btn" data-join>Join the community</button><a href="#events" class="ao-link">See what&apos;s on</a></div></div></section>' +
      '<main class="ao-main"><section class="ao-sec" id="events"><div class="ao-head"><h2>On the calendar</h2><a href="#" class="ao-link">All events</a></div><div class="ao-cards">' +
          card('14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places', 'b') + card('22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places', 'g') + card('05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left', 'r') + '</div></section>' +
        AZ.stitchRule() +
        '<section class="ao-sec"><div class="ao-pod" data-reveal><div class="ao-pt"><p class="ao-eyebrow">The podcast · Episode 14 · 42 min</p><h2>Between Two Homes</h2><p class="ao-meta">with Aysel Mammadova</p><p>Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what &ldquo;home&rdquo; means when you have two.</p></div>' +
          '<div class="ao-player"><button type="button" class="ao-play" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 24 24" width="26" height="26"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></button>' +
          '<div class="ao-wave" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + R3.bars(34) + '</div><span class="ao-time">0:00 / 42:00</span></div></div></section>' +
        AZ.stitchRule() +
        '<section class="ao-sec"><div class="ao-head"><h2>What it&apos;s about</h2></div><div class="ao-cards ao-three">' + pillar('b', '01', 'Culture', 'Music, food, language and the traditions we carry with us.') + pillar('r', '02', 'Learning', 'Talks, workshops and networking that help you grow.') + pillar('g', '03', 'Community', 'A place to belong, wherever you were born.') + '</div></section></main>' +
      '<footer class="ao-footer"><div class="ao-lockup"><span class="ao-badge">' + AZ.logo({ mode: 'solid', cls: 'ao-footlogo' }) + '</span><p>Azerbaijan–UK<br>Youth Association</p></div><p class="ao-c2">© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    R3.join(root, { '--sheet-bg': 'rgba(255,255,255,0.88)', '--sheet-fg': '#0e1f45', '--sheet-accent': '#1b4793', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Fraunces, serif', '--sheet-input-bg': '#fff', '--sheet-input-border': '#c9d6ec', '--sheet-solid': '#fff' });
    AZ.logoAlive(ctx, root.querySelector('.ao-navlogo'));
    R3.progress(ctx, false);
    AZ.revealOnScroll(ctx, root);

    var stage = root.querySelector('.ao-stage');
    R3.flame(ctx, root.querySelector('.ao-flame'), root.querySelector('#aohero'), { onLit: function (on) { stage.classList.toggle('is-lit', on); } });

    var nav = root.querySelector('#aonav'), near = root.querySelector('.ao-city .near'), far = root.querySelector('.ao-city .far'), moon = root.querySelector('.ao-moon');
    R3.drift(ctx, function (y) {
      nav.classList.toggle('is-scrolled', y > 24);
      if (AZ.reduced()) return;
      near.style.transform = 'translateY(' + (y * 0.06).toFixed(1) + 'px)';
      far.style.transform = 'translate(120px,' + (-4 + y * 0.03).toFixed(1) + 'px)';
      moon.style.transform = 'translateY(' + (-y * 0.12).toFixed(1) + 'px)';
    });
    R3.player(ctx, root, { play: '.ao-play', wave: '.ao-wave', time: '.ao-time' });
    R3.press(root, '.ao-card');
  },
});
