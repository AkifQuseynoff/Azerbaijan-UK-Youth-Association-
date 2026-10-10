/* 3. Ilmə (stitch), calmer: warm linen, stitched edges and granny-square dates. The logo ignites like the others. No yarn, no moon, no crocheted scrollbar. */
AZ.variants.push({
  id: 'ilme',
  name: 'Ilmə',
  cls: 'r2',
  tagline: 'Warm linen, stitched edges and granny-square dates, with the same igniting logo. The crochet is a detail now, not the whole page.',
  mount: function (ctx) {
    var root = ctx.root, uid = 'il';
    function granny(d, i) {
      var id = uid + 'g' + i, rings = [['blue', 0, 200], ['cream', 26, 148], ['red', 52, 96], ['green', 74, 52]];
      var defs = ['blue', 'cream', 'red', 'green'].map(function (c) { return AZ.stitchPattern(id + c, AZ.yarn[c], 0.2); }).join('');
      var body = rings.map(function (r) { return '<rect x="' + r[1] + '" y="' + r[1] + '" width="' + (200 - 2 * r[1]) + '" height="' + (200 - 2 * r[1]) + '" rx="' + (r[0] === 'blue' ? 10 : 4) + '" fill="url(#' + id + r[0] + ')"/><rect x="' + (r[1] + 2) + '" y="' + (r[1] + 2) + '" width="' + (200 - 2 * r[1] - 4) + '" height="' + (200 - 2 * r[1] - 4) + '" rx="' + (r[0] === 'blue' ? 9 : 3) + '" fill="none" stroke="' + AZ.yarn[r[0]].hi + '" stroke-width="1.4" stroke-dasharray="5 3" opacity=".8"/>'; }).join('');
      return '<svg viewBox="0 0 200 200" class="il-granny" aria-hidden="true"><defs>' + defs + '</defs>' + body + '<text x="100" y="116" text-anchor="middle" font-family="Fraunces, serif" font-size="46" font-weight="500" fill="#fff" style="paint-order:stroke" stroke="#1e4a28" stroke-width="3">' + d + '</text></svg>';
    }
    function tile(d, m, t, meta, left, i) { return '<a href="#" class="il-tile" data-reveal>' + granny(d, i) + '<span class="il-tm"><i>' + m + '</i><strong>' + t + '</strong><em>' + meta + '</em><u>' + left + '</u></span></a>'; }
    function patch(tone, t, p) { return '<article class="il-patch ' + tone + '" data-reveal><h3>' + t + '</h3><p>' + p + '</p></article>'; }

    root.innerHTML =
      '<header class="il-nav"><a href="#" class="il-brand">' + AZ.logo({ mode: 'solid', cls: 'il-navlogo' }) + '<span class="il-wm">Az Youth UK</span></a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav><button type="button" class="il-label" data-join>Join us</button></header>' +
      '<section class="il-hero"><div class="il-art">' + R3.mark('il-mk') + '</div>' +
        '<div class="il-copy"><p class="il-eyebrow">Azərbaycan · United Kingdom</p>' +
        '<h1>Stitched together from <em>two homes.</em></h1>' +
        '<p class="il-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
        '<div class="il-actions"><button type="button" class="il-btn" data-join>Join the community</button><a href="#events" class="il-link">See what&apos;s on</a></div></div></section>' +
      '<main class="il-main"><section class="il-sec" id="events"><div class="il-head"><h2>Coming up</h2><a href="#" class="il-link">All events</a></div><div class="il-tiles">' +
          tile('14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places', 1) + tile('22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places', 2) + tile('05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left', 3) + '</div></section>' +
        '<section class="il-sec"><div class="il-pod" data-reveal><div class="il-pm"><p class="il-eyebrow">The podcast · Episode 14</p><h2>Between Two Homes</h2><p class="il-meta">with Aysel Mammadova · 42 min</p><p>Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what &ldquo;home&rdquo; means when you have two.</p></div>' +
          '<div class="il-player"><button type="button" class="il-play" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 24 24" width="30" height="30"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></button>' +
          '<div class="il-wave" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + R3.bars(30) + '</div><span class="il-time">0:00 / 42:00</span></div></div></section>' +
        '<section class="il-sec"><div class="il-head"><h2>What it&apos;s about</h2></div><div class="il-patches">' + patch('blue', 'Culture', 'Music, food, language and the traditions we carry with us.') + patch('red', 'Learning', 'Talks, workshops and networking that help you grow.') + patch('green', 'Community', 'A place to belong, wherever you were born.') + '</div></section>' +
        '<section class="il-banner" data-reveal><div><h2>Membership is free.</h2><p>Make an account, register for events in one tap and get your ticket on your phone.</p><button type="button" class="il-btn il-btn-light" data-join>Join the community</button></div></section></main>' +
      '<footer class="il-foot"><div class="il-lockup">' + AZ.logo({ mode: 'solid', cls: 'il-footlogo' }) + '<p>Azerbaijan–UK<br>Youth Association</p></div><p class="il-copy2">© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    R3.join(root, { '--sheet-bg': 'rgba(255,250,240,0.9)', '--sheet-fg': '#2b1d12', '--sheet-accent': '#c23028', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Fraunces, serif', '--sheet-input-bg': '#fff', '--sheet-input-border': '#d8c9aa', '--sheet-solid': '#fffaf0' });
    AZ.revealOnScroll(ctx, root);
    R3.markStart(ctx, root);
    R3.player(ctx, root, { play: '.il-play', wave: '.il-wave', time: '.il-time' });
    R3.press(root, '.il-tile');
  },
});
