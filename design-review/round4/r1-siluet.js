/* Siluet, round 4: a soft dawn sky, the skyline in three layers of haze, and the whole logo drawing itself in the sky.
 * The three Flame Towers glow in the logo's blue, red and green. */
AZ.variants.push({
  id: 'siluet',
  name: 'Siluet',
  cls: 'r3',
  tagline: 'Dawn over Baku in the logo colours. The flame ignites like a real fire and keeps flickering by itself. Nothing reacts to the cursor.',
  mount: function (ctx) {
    var root = ctx.root;
    var sk = R3.skyline('#1b4793');
    function ticket(d, m, t, meta, left, tone) {
      return '<a href="#" class="si-ticket ' + tone + '"><span class="si-when"><b>' + d + '</b><i>' + m + '</i></span><span class="si-tm"><strong>' + t + '</strong><em>' + meta + '</em></span><span class="si-left">' + left + '</span></a>';
    }
    function pillar(tone, t, p) { return '<article class="si-pillar ' + tone + '" data-reveal><h3>' + t + '</h3><p>' + p + '</p></article>'; }

    root.innerHTML = R3.fireDefs() +
      '<header class="si-nav" id="sinav"><a href="#" class="si-brand">' + AZ.logo({ mode: 'solid', cls: 'si-navlogo' }) + '<span class="si-wm">Az Youth UK</span></a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav><button type="button" class="si-join" data-join>Join us</button></header>' +
      '<section class="si-hero" id="sihero"><div class="si-sun"></div>' +
        '<svg class="si-city" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
          '<g class="L1"><g opacity=".08" transform="translate(-60 -22) scale(1.04)">' + sk.base + '</g></g>' +
          '<g class="L2"><g opacity=".18" transform="translate(70 -8)">' + sk.base + '</g></g>' +
          '<g class="L3"><g fill="#0e1f45">' + sk.base.replace('fill="#1b4793"', 'fill="#0e1f45"') + '</g><g class="si-towers">' + sk.towers + '</g></g>' +
          '<rect y="763" width="1600" height="60" fill="#0e1f45"/></svg>' +
        '<div class="si-inner"><div class="si-copy"><p class="si-eyebrow">Azərbaycan · United Kingdom</p><h1>Two homes.<br><em>One community.</em></h1>' +
          '<p class="si-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
          '<div class="si-actions"><button type="button" class="si-btn" data-join>Join the community</button><a href="#events" class="si-link">See what&apos;s on</a></div></div>' +
          '<div class="si-mark">' + AZ.logo({ mode: 'draw', cls: 'si-logo' }) + '</div></div></section>' +
      '<main class="si-main"><section class="si-sec" id="events"><div class="si-head"><h2>On the calendar</h2><a href="#" class="si-link">All events</a></div><div class="si-tickets" data-reveal>' +
          ticket('14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places', 'b') + ticket('22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places', 'g') + ticket('05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left', 'r') + '</div></section>' +
        '<section class="si-night"><div class="si-sec si-podsec"><div class="si-pod" data-reveal><div class="si-pt"><p class="si-eyebrow">The podcast · Episode 14 · 42 min</p><h2>Between Two Homes</h2><p class="si-meta">with Aysel Mammadova</p><p>Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what &ldquo;home&rdquo; means when you have two.</p></div>' +
          '<div class="si-player"><button type="button" class="si-play" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 24 24" width="26" height="26"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></button>' +
          '<div class="si-wave" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + R3.bars(34) + '</div><span class="si-time">0:00 / 42:00</span></div></div></div></section>' +
        '<section class="si-sec"><div class="si-head"><h2>What it&apos;s about</h2></div><div class="si-pillars">' + pillar('b', 'Culture', 'Music, food, language and the traditions we carry with us.') + pillar('r', 'Learning', 'Talks, workshops and networking that help you grow.') + pillar('g', 'Community', 'A place to belong, wherever you were born.') + '</div></section></main>' +
      '<footer class="si-footer"><div class="si-lockup"><span class="si-badge">' + AZ.logo({ mode: 'solid', cls: 'si-footlogo' }) + '</span><p>Azerbaijan–UK<br>Youth Association</p></div><p class="si-c2">© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    R3.join(root, { '--sheet-bg': 'rgba(255,255,255,0.88)', '--sheet-fg': '#0e1f45', '--sheet-accent': '#c23028', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Fraunces, serif', '--sheet-input-bg': '#fff', '--sheet-input-border': '#c9d6ec', '--sheet-solid': '#fff' });
    R3.fire(root.querySelector('.si-logo'));
    AZ.revealOnScroll(ctx, root);

    var nav = root.querySelector('#sinav'), l1 = root.querySelector('.L1'), l2 = root.querySelector('.L2'), l3 = root.querySelector('.L3'), mark = root.querySelector('.si-mark');
    R3.drift(ctx, function (y) {
      nav.classList.toggle('is-scrolled', y > 24);
      if (AZ.reduced()) return;
      l1.style.transform = 'translateY(' + (y * 0.05).toFixed(1) + 'px)'; l2.style.transform = 'translateY(' + (y * 0.1).toFixed(1) + 'px)'; l3.style.transform = 'translateY(' + (y * 0.16).toFixed(1) + 'px)';
      mark.style.transform = 'translateY(' + (-y * 0.08).toFixed(1) + 'px)';
    });
    R3.player(ctx, root, { play: '.si-play', wave: '.si-wave', time: '.si-time' });
    R3.press(root, '.si-ticket');
  },
});
