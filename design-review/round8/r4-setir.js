/* 4. Sətir (line): editorial. Big type, hairline rules, events as a list, a podcast with an episode list, and the skyline as the ground of the footer. */
AZ.variants.push({
  id: 'setir',
  name: 'Sətir',
  cls: 'r5',
  tagline: 'Editorial. Large type, thin rules, events as a clean list, an episode list for the podcast, and the skyline standing on the footer.',
  mount: function (ctx) {
    var root = ctx.root;
    function row(d, m, t, meta, left, tone) {
      return '<a href="#" class="st-row ' + tone + '" data-reveal><span class="st-d"><b>' + d + '</b><i>' + m + '</i></span><span class="st-t"><strong>' + t + '</strong><em>' + meta + '</em></span><span class="st-s">' + left + '</span><span class="st-go" aria-hidden="true">→</span></a>';
    }
    function ep(n, t, len) { return '<li data-reveal><span>' + n + '</span><strong>' + t + '</strong><em>' + len + '</em></li>'; }
    function pillar(tone, t, p) { return '<article class="st-pillar ' + tone + '" data-reveal><i></i><h3>' + t + '</h3><p>' + p + '</p></article>'; }

    root.innerHTML =
      '<header class="st-nav" id="stnav"><a href="#" class="st-brand">' + AZ.logo({ mode: 'solid', cls: 'st-navlogo' }) + '<span class="st-wm">Azerbaijan–UK<br>Youth Association</span></a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav><button type="button" class="st-join" data-join>Join us</button></header>' +
      '<section class="st-hero"><div class="st-hl"><p class="st-label">Azərbaycan · United Kingdom</p><h1>Two homes.<br><em>One community.</em></h1>' +
          '<p class="st-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
          '<div class="st-actions"><button type="button" class="st-btn" data-join>Join the community</button><a href="#events" class="st-link">See what&apos;s on</a></div></div>' +
        '<div class="st-hr">' + R3.mark('st-mk') + '</div></section>' +
      '<div class="st-rule" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<a href="#events" class="st-next"><span class="st-label">Next up</span><strong>14 Nov · Language Café, Camden</strong><span class="st-go" aria-hidden="true">→</span></a>' +
      '<main class="st-main"><section class="st-sec" id="events"><div class="st-head"><p class="st-label">01 — Events</p><h2>On the calendar</h2><a href="#" class="st-link">All events</a></div><div class="st-rows">' +
          row('14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places', 'b') + row('22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places', 'g') + row('05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left', 'r') + '</div></section>' +
        '<section class="st-sec st-pod"><div class="st-pl" data-reveal><p class="st-label">02 — Podcast</p><h2>Between Two Homes</h2><p class="st-meta">Episode 14 · with Aysel Mammadova</p><p>Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what &ldquo;home&rdquo; means when you have two.</p></div>' +
          '<div class="st-pr" data-reveal><div class="st-player"><button type="button" class="st-play" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 24 24" width="26" height="26"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></button>' +
          '<div class="st-wave" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + R3.bars(34) + '</div><span class="st-time">0:00 / 42:00</span></div>' +
          '<ol class="st-eps">' + ep('13', 'Bridges, not borders', '38 min') + ep('12', 'A first job in London', '35 min') + ep('11', 'Mugham for beginners', '41 min') + '</ol></div></section>' +
        '<section class="st-sec"><div class="st-head"><p class="st-label">03 — About</p><h2>What it&apos;s about</h2></div><div class="st-pillars">' + pillar('b', 'Culture', 'Music, food, language and the traditions we carry with us.') + pillar('r', 'Learning', 'Talks, workshops and networking that help you grow.') + pillar('g', 'Community', 'A place to belong, wherever you were born.') + '</div></section></main>' +
      '<footer class="st-footer"><div class="st-sky">' + R3.citySvg({ cls: 'st-city', near: '#0e1f45', far: '#1b4793', farOp: 0.08, towers: 'colour', ground: true }) + '</div>' +
        '<div class="st-fin"><div class="st-lockup"><span class="st-badge">' + AZ.logo({ mode: 'solid', cls: 'st-footlogo' }) + '</span><p>Azerbaijan–UK<br>Youth Association</p></div><p class="st-c2">© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></div></footer>';

    R3.join(root, { '--sheet-bg': 'rgba(252,251,247,0.9)', '--sheet-fg': '#0e1f45', '--sheet-accent': '#0e1f45', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Fraunces, serif', '--sheet-input-bg': '#fff', '--sheet-input-border': '#cfd7e8', '--sheet-solid': '#fcfbf7' });
    AZ.revealOnScroll(ctx, root);
    R3.markStart(ctx, root);
    var nav = root.querySelector('#stnav');
    R3.drift(ctx, function (y) { nav.classList.toggle('is-scrolled', y > 24); });
    R3.player(ctx, root, { play: '.st-play', wave: '.st-wave', time: '.st-time' });
    R3.press(root, '.st-row, .st-next');
  },
});
