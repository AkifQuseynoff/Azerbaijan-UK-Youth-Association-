/* 2. Ilmə (stitch): the logo, the page and the scrollbar are all crocheted. */
AZ.variants.push({
  id: 'ilme',
  name: 'Ilmə',
  cls: 'r2',
  tagline: 'Crochet everywhere. The logo is crocheted live row by row by a hook, events are granny squares, the podcast is a ball of yarn.',
  mount: function (ctx) {
    var root = ctx.root, uid = 'il';
    var BRAND = ['blue', 'red', 'green'];
    function granny(d, i) {
      var id = uid + 'g' + i, rings = [['blue', 0, 200], ['cream', 26, 148], ['red', 52, 96], ['green', 74, 52]];
      var defs = ['blue', 'cream', 'red', 'green'].map(function (c) { return AZ.stitchPattern(id + c, AZ.yarn[c], 0.2); }).join('');
      var body = rings.map(function (r) { return '<rect x="' + r[1] + '" y="' + r[1] + '" width="' + (200 - 2 * r[1]) + '" height="' + (200 - 2 * r[1]) + '" rx="' + (r[0] === 'blue' ? 10 : 4) + '" fill="url(#' + id + r[0] + ')"/><rect x="' + (r[1] + 2) + '" y="' + (r[1] + 2) + '" width="' + (200 - 2 * r[1] - 4) + '" height="' + (200 - 2 * r[1] - 4) + '" rx="' + (r[0] === 'blue' ? 9 : 3) + '" fill="none" stroke="' + AZ.yarn[r[0]].hi + '" stroke-width="1.4" stroke-dasharray="5 3" opacity=".8"/>'; }).join('');
      return '<svg viewBox="0 0 200 200" class="il-granny" aria-hidden="true"><defs>' + defs + '</defs>' + body + '<text x="100" y="116" text-anchor="middle" font-family="Fraunces, serif" font-size="46" font-weight="500" fill="#fff" style="paint-order:stroke" stroke="#1e4a28" stroke-width="3">' + d + '</text></svg>';
    }
    function tile(d, m, t, meta, left, i) { return '<a href="#" class="il-tile" data-reveal>' + granny(d, i) + '<span class="il-tm"><i>' + m + '</i><strong>' + t + '</strong><em>' + meta + '</em><u>' + left + '</u></span></a>'; }
    function patch(tone, t, p) { return '<article class="il-patch ' + tone + '" data-reveal><h3>' + t + '</h3><p>' + p + '</p></article>'; }
    var wave = 'M0 30C40 4 80 56 120 30S200 4 240 30S320 56 360 30S440 4 480 30S560 56 600 30S680 4 720 30S800 56 840 30S920 4 960 30';

    root.innerHTML =
      '<header class="il-nav"><a href="#" class="il-brand">' + AZ.logo({ mode: 'solid', cls: 'il-navlogo' }) + '<span class="il-wm">Az Youth UK</span></a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav><button type="button" class="il-label" data-join>Join us</button></header>' +
      '<section class="il-hero"><div class="il-copy"><p class="il-eyebrow">Azərbaycan · United Kingdom</p>' +
        '<h1>Stitched together from <em>two homes.</em></h1>' +
        '<p class="il-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
        '<div class="il-actions"><button type="button" class="il-btn" data-join>Join the community</button><a href="#events" class="il-link">See what&apos;s on</a></div></div>' +
        '<div class="il-art"><div class="il-logo-wrap" id="il-wrap"><div class="il-holder" id="il-holder"></div>' +
          '<svg class="il-tools" id="il-tools" aria-hidden="true"><path id="il-thread" d="" fill="none" stroke="#c23028" stroke-width="3" stroke-linecap="round"/>' +
            '<g id="il-ball"><circle r="26" fill="#c23028"/><path d="M-22 -8Q0 -22 22 -8M-25 4Q0 -12 25 4M-20 16Q0 4 20 16" stroke="#e2574c" stroke-width="2.6" fill="none"/><path d="M-24 -4Q-4 18 20 12" stroke="#932019" stroke-width="2.4" fill="none"/></g>' +
            '<g id="il-hook"><path d="M18 -44L2 -4" stroke="#d9b36a" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M2 -4q-4 5.5 -10 3" stroke="#d9b36a" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="18" cy="-44" r="4.2" fill="#b98f45"/></g></svg></div>' +
          '<button type="button" class="il-again" id="il-again">↻ Crochet it again</button></div></section>' +
      '<main class="il-main"><section class="il-sec" id="events"><div class="il-head"><h2>Coming up</h2><a href="#" class="il-link">All events</a></div><div class="il-tiles">' +
          tile('14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places', 1) + tile('22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places', 2) + tile('05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left', 3) + '</div></section>' +
        AZ.stitchRule() +
        '<section class="il-sec"><div class="il-pod" data-reveal>' +
          '<button class="il-ball" type="button" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 160 160" aria-hidden="true"><defs>' + ['blue', 'red', 'green'].map(function (c) { return AZ.stitchPattern('ilb' + c, AZ.yarn[c], 0.18); }).join('') + '<clipPath id="ilbc"><circle cx="80" cy="80" r="74"/></clipPath></defs>' +
            '<g class="spin" clip-path="url(#ilbc)"><rect width="160" height="160" fill="url(#ilbred)"/><path d="M-10 40C40 10 120 10 170 50L170 90C120 50 40 50 -10 90Z" fill="url(#ilbblue)"/><path d="M-10 100C40 70 120 70 170 110L170 150C120 110 40 110 -10 150Z" fill="url(#ilbgreen)"/></g>' +
            '<circle cx="80" cy="80" r="74" fill="none" stroke="#6d1611" stroke-width="3" opacity=".5"/></svg><span class="il-bi"><svg viewBox="0 0 24 24" width="38" height="38"><polygon class="p" points="8,5 19,12 8,19" fill="#fff"/><g class="u" fill="#fff"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></span></button>' +
          '<div class="il-pm"><p class="il-eyebrow">The podcast · Episode 14</p><h2>Between Two Homes</h2><p class="il-meta">with Aysel Mammadova · 42 min</p><p>Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what &ldquo;home&rdquo; means when you have two.</p>' +
            '<div class="il-thread" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><svg viewBox="0 0 960 60" preserveAspectRatio="none" aria-hidden="true"><path d="' + wave + '" class="t0" pathLength="1"/><path d="' + wave + '" class="t1" pathLength="1" stroke="#2f6cc0"/><path d="' + wave + '" class="t2" pathLength="1" stroke="#c23028"/><path d="' + wave + '" class="t3" pathLength="1" stroke="#3e894c"/></svg></div><p class="il-time">0:00 / 42:00</p></div></div></section>' +
        AZ.stitchRule() +
        '<section class="il-sec"><div class="il-head"><h2>What it&apos;s about</h2></div><div class="il-patches">' + patch('blue', 'Culture', 'Music, food, language and the traditions we carry with us.') + patch('red', 'Learning', 'Talks, workshops and networking that help you grow.') + patch('green', 'Community', 'A place to belong, wherever you were born.') + '</div></section>' +
        '<section class="il-banner" data-reveal><div><h2>Membership is free.</h2><p>Make an account, register for events in one tap and get your ticket on your phone.</p><button type="button" class="il-btn il-btn-light" data-join>Join the community</button></div></section></main>' +
      '<footer class="il-foot"><div class="il-lockup">' + AZ.logo({ mode: 'solid', cls: 'il-footlogo' }) + '<p>Azerbaijan–UK<br>Youth Association</p></div><p class="il-copy2">© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    root.querySelectorAll('[data-join]').forEach(function (b) {
      b.addEventListener('click', function () {
        AZ.openSheet({ vars: { '--sheet-bg': 'rgba(255,250,240,0.9)', '--sheet-fg': '#2b1d12', '--sheet-accent': '#c23028', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Fraunces, serif', '--sheet-input-bg': '#fff', '--sheet-input-border': '#d8c9aa', '--sheet-solid': '#fffaf0' } });
      });
    });
    AZ.logoAlive(ctx, root.querySelector('.il-navlogo'));
    AZ.crochetScrollbar(ctx, { dark: false });
    AZ.revealOnScroll(ctx, root);

    /* ---- The logo is crocheted live; a hook works down it row by row, trailing yarn from a ball ---- */
    var holder = root.querySelector('#il-holder'), wrap = root.querySelector('#il-wrap'), tools = root.querySelector('#il-tools');
    var hook = root.querySelector('#il-hook'), ball = root.querySelector('#il-ball'), thread = root.querySelector('#il-thread');
    var ROWS = 34, DUR = 4800, DELAY = 400, startAt = 0, hookRaf = 0, disposeAlive = null;
    function crochet() {
      cancelAnimationFrame(hookRaf);
      if (disposeAlive) disposeAlive();
      holder.innerHTML = AZ.logo({ mode: 'yarn', cls: 'il-bigmark' });
      var svg = holder.firstChild;
      svg.style.setProperty('--lg-dur', DUR + 'ms'); svg.style.setProperty('--lg-delay', DELAY + 'ms');
      disposeAlive = AZ.logoAlive(ctx, svg);
      startAt = performance.now();
      if (AZ.reduced()) { place(1, 0); return; }
      hookRaf = requestAnimationFrame(frame);
    }
    function place(f, within) {
      var r = holder.firstChild.getBoundingClientRect(), w = wrap.getBoundingClientRect(), W = r.width, H = r.height, ox = r.left - w.left, oy = r.top - w.top;
      var row = Math.min(ROWS - 1, Math.floor(f * ROWS)), x, y;
      if (f >= 1) { x = W * 1.0; y = H * 0.98; } else { var fr = within; x = (row % 2 === 0 ? fr : 1 - fr) * W; y = ((row + 1) / ROWS) * H; }
      var hx = ox + x, hy = oy + y, bx = ox + W + 34, by = oy + H - 6;
      hook.setAttribute('transform', 'translate(' + hx.toFixed(1) + ' ' + hy.toFixed(1) + ')');
      ball.setAttribute('transform', 'translate(' + bx.toFixed(1) + ' ' + by.toFixed(1) + ')');
      thread.setAttribute('d', 'M' + bx.toFixed(1) + ' ' + (by - 20).toFixed(1) + 'Q' + ((bx + hx) / 2).toFixed(1) + ' ' + (Math.max(by, hy) + 46).toFixed(1) + ' ' + hx.toFixed(1) + ' ' + hy.toFixed(1));
    }
    function frame(now) {
      var t = now - startAt - DELAY, f = AZ.clamp(t / DUR, 0, 1), p = f * ROWS;
      place(f, p - Math.floor(p));
      if (f < 1) hookRaf = requestAnimationFrame(frame);
    }
    root.querySelector('#il-again').addEventListener('click', crochet);
    ctx.onCleanup(function () { cancelAnimationFrame(hookRaf); });
    ctx.listen(window, 'resize', function () { if (holder.firstChild) place(1, 0); });
    crochet();

    /* ---- Granny squares tug on a spring when pressed ---- */
    root.querySelectorAll('.il-tile').forEach(function (t) {
      var sq = t.querySelector('.il-granny'), a = new AZ.Spring(0, { response: 0.45, damping: 0.55, precision: 0.01 }), sc = new AZ.Spring(1, { response: 0.2, damping: 1, precision: 0.001 });
      function ap() { sq.style.transform = 'rotate(' + a.x.toFixed(2) + 'deg) scale(' + sc.x.toFixed(3) + ')'; }
      a.on(ap); sc.on(ap);
      t.addEventListener('pointerdown', function () { sc.to(0.94); a.to(-5); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { t.addEventListener(ev, function () { sc.to(1); a.to(0); }); });
      t.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') a.to(3); });
      t.addEventListener('pointerleave', function () { a.to(0); });
      ctx.onCleanup(function () { a.stop(); sc.stop(); });
    });

    /* ---- Podcast: the ball of yarn spins and the thread fills blue, red, green; drag the thread to scrub ---- */
    var btn = root.querySelector('.il-ball'), spin = root.querySelector('.il-ball .spin'), track = root.querySelector('.il-thread'), time = root.querySelector('.il-time');
    var t1 = track.querySelector('.t1'), t2 = track.querySelector('.t2'), t3 = track.querySelector('.t3');
    var prog = 0, playing = false, raf = 0, last = 0, rot = 0;
    function paint() {
      [[t1, 0], [t2, 1], [t3, 2]].forEach(function (p) { var f = AZ.clamp(prog * 3 - p[1], 0, 1), seg = 1 / 3, from = p[1] * seg; p[0].style.strokeDasharray = (f * seg) + ' 2'; p[0].style.strokeDashoffset = String(-from); });
      var sec = Math.round(prog * 2520); time.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') + ' / 42:00';
      track.setAttribute('aria-valuenow', String(Math.round(prog * 100)));
    }
    function tick(t) { var dt = t - last; last = t; prog = Math.min(1, prog + dt / 1000 / 45); rot += dt * 0.12; spin.style.transform = 'rotate(' + rot + 'deg)'; paint(); if (playing && prog < 1) raf = requestAnimationFrame(tick); else { playing = false; btn.classList.remove('is-on'); btn.setAttribute('aria-pressed', 'false'); } }
    btn.addEventListener('click', function () {
      playing = !playing; btn.classList.toggle('is-on', playing); btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (playing) { if (prog >= 1) prog = 0; last = performance.now(); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
    });
    function scrub(x) { var r = track.getBoundingClientRect(); prog = AZ.clamp((x - r.left) / r.width, 0, 1); paint(); }
    AZ.drag(track, { start: function (e) { scrub(e.clientX); }, move: function (d) { scrub(d.x); } });
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { prog = Math.min(1, prog + 0.03); paint(); } if (e.key === 'ArrowLeft') { prog = Math.max(0, prog - 0.03); paint(); } });
    ctx.onCleanup(function () { cancelAnimationFrame(raf); });
    paint();
  },
});
