/* 3. Naxış: the flag colours as embroidery thread. */
AZ.variants.push({
  id: 'naxis',
  name: 'Naxış',
  cls: 'v3',
  tagline: 'Hand-stitched. The flag colours become thread: a running stitch down the page, patches for events, a sewn button to play the podcast.',
  mount: function (ctx) {
    var root = ctx.root;
    var s1 = AZ.star8(0, 0, 21), crescent = 'M73.5 22.73A36 36 0 1 0 73.5 77.27A30 30 0 1 1 73.5 22.73Z';
    function pts(p) { return 'M' + p.split(' ').join('L') + 'Z'; }
    var starA = pts(s1[0]), starB = pts(s1[1]);
    function stitched(id, d, color, delay, extra) {
      return '<mask id="v3m-' + id + '"><path d="' + d + '" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round" pathLength="1" class="draw" style="animation-delay:' + delay + 'ms"' + (extra || '') + '/></mask>' +
        '<g mask="url(#v3m-' + id + ')"><path d="' + d + '" fill="url(#v3h-' + color.slice(1) + ')" stroke="none"' + (extra || '') + '/><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.9" stroke-dasharray="5 3.6" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '/></g>';
    }
    function hatch(color) { return '<pattern id="v3h-' + color.slice(1) + '" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="' + color + '" fill-opacity="0.12"/><line x1="0" y1="0" x2="0" y2="4" stroke="' + color + '" stroke-width="1.2" stroke-opacity="0.65"/></pattern>'; }
    function ringStitches() {
      var out = '';
      for (var i = 0; i < 72; i++) { var a = i * 5 * Math.PI / 180, r1 = 142, r2 = 150; var c = ['#00b5e2', '#ef3340', '#509e2f'][i % 3]; out += '<line x1="' + (160 + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (160 + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (160 + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (160 + r2 * Math.sin(a)).toFixed(1) + '" stroke="' + c + '" stroke-width="3" stroke-linecap="round" class="ringline" style="animation-delay:' + (1700 + i * 14) + 'ms"/>'; }
      return out;
    }
    function patch(tone, d, m, t, meta, left) {
      return '<a href="#" class="v3-patch ' + tone + '"><i class="v3-ribbon"><b></b><b></b><b></b></i><span class="v3-date"><strong>' + d + '</strong>' + m + '</span><span class="v3-ptitle">' + t + '</span><span class="v3-pmeta">' + meta + '</span><span class="v3-left">' + left + '</span></a>';
    }

    root.innerHTML =
      '<div class="v3-thread" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<header class="v3-nav"><a href="#" class="v3-logo"><span>' + AZ.emblem('#ef3340') + '</span>Az Youth UK</a>' +
        '<nav aria-label="Main"><a href="#">News</a><a href="#">Events</a><a href="#">Podcast</a><a href="#">Help</a></nav>' +
        '<button type="button" class="v3-label" data-join>Join us</button></header>' +
      '<section class="v3-hero"><div class="v3-hero-copy"><p class="v3-eyebrow">Azərbaycan · United Kingdom</p>' +
        '<h1>Stitched together from <em>two homes.</em></h1>' +
        '<p class="v3-lede">A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.</p>' +
        '<div class="v3-actions"><button type="button" class="v3-btn" data-join>Join the community</button><a href="#events" class="v3-link">See what&apos;s on</a></div></div>' +
        '<div class="v3-hero-art"><svg viewBox="0 0 320 320" role="img" aria-label="Embroidered crescent and star in the colours of the Azerbaijani flag"><defs>' + hatch('#00b5e2') + hatch('#ef3340') + hatch('#509e2f') + '</defs>' +
          '<circle cx="160" cy="160" r="156" fill="#fffaf0"/><circle cx="160" cy="160" r="156" fill="none" stroke="#c9b99a" stroke-width="1"/>' +
          ringStitches() +
          '<g transform="translate(160 164) scale(3.05) translate(-50 -50)">' +
            stitched('c', crescent, '#509e2f', 100) +
            '<g transform="translate(64 50)">' + stitched('a', starA, '#00b5e2', 800) + stitched('b', starB, '#ef3340', 1250) + '</g>' +
          '</g></svg></div></section>' +
      '<section class="v3-sec" id="events"><div class="v3-head"><h2>Coming up</h2><a href="#" class="v3-link">All events</a></div><div class="v3-grid">' +
        patch('blue', '14', 'Nov', 'Language Café', 'Camden, London · 18:30', '12 places') +
        patch('green', '22', 'Nov', 'Mugham &amp; Mingle', 'Barbican, London · 19:00', '40 places') +
        patch('red', '05', 'Dec', 'Career Night: Law &amp; Finance', 'The City, London · 18:00', 'Only 3 left') +
      '</div></section>' +
      '<section class="v3-sec"><div class="v3-pod"><button type="button" class="v3-button" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" class="rim"/><circle cx="60" cy="60" r="44" class="face"/>' +
          '<g class="holes"><circle cx="48" cy="48" r="5"/><circle cx="72" cy="48" r="5"/><circle cx="48" cy="72" r="5"/><circle cx="72" cy="72" r="5"/></g>' +
          '<g class="cross" fill="none" stroke-width="3.2" stroke-linecap="round"><path d="M48 48L72 72" stroke="#ef3340"/><path d="M72 48L48 72" stroke="#00b5e2"/><path d="M48 48L72 48M48 72L72 72" stroke="#509e2f" opacity=".0"/></g></svg><span class="v3-ptxt">Play</span></button>' +
        '<div class="v3-pod-main"><p class="v3-eyebrow">The podcast · Episode 14</p><h2>Between Two Homes</h2><p class="v3-pmeta2">with Aysel Mammadova · 42 min</p>' +
          '<p>Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what &ldquo;home&rdquo; means when you have two.</p>' +
          '<div class="v3-line" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="b"></i><i class="r"></i><i class="g"></i></div><p class="v3-time">0:00 / 42:00</p></div></div></section>' +
      '<section class="v3-sec"><div class="v3-head"><h2>What it&apos;s about</h2></div><div class="v3-grid v3-three">' +
        '<article class="v3-patch blue v3-plain"><h3>Culture</h3><p>Music, food, language and the traditions we carry with us.</p></article>' +
        '<article class="v3-patch red v3-plain"><h3>Learning</h3><p>Talks, workshops and networking that help you grow.</p></article>' +
        '<article class="v3-patch green v3-plain"><h3>Community</h3><p>A place to belong, wherever you were born.</p></article></div></section>' +
      '<section class="v3-banner"><div><h2>Membership is free.</h2><p>Make an account, register for events in one tap and get your ticket on your phone.</p><button type="button" class="v3-btn" data-join>Join the community</button></div></section>' +
      '<footer class="v3-foot"><div class="v3-zig"></div><p>© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    root.querySelectorAll('[data-join]').forEach(function (b) {
      b.addEventListener('click', function () {
        AZ.openSheet({ vars: { '--sheet-bg': 'rgba(255,250,240,0.9)', '--sheet-fg': '#33210f', '--sheet-accent': '#ef3340', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Fraunces, serif', '--sheet-input-bg': '#fff', '--sheet-input-border': '#d8c9aa', '--sheet-solid': '#fffaf0' } });
      });
    });

    /* Running stitch down the left edge fills as you read. */
    var strands = [].slice.call(root.querySelectorAll('.v3-thread i'));
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        var p = AZ.clamp(window.scrollY / max, 0, 1);
        strands.forEach(function (s, i) { s.style.transform = 'scaleY(' + (AZ.clamp(p * 1.0 - i * 0.015, 0.02, 1)).toFixed(3) + ')'; });
      });
    }
    ctx.listen(window, 'scroll', onScroll, { passive: true });
    onScroll();

    /* Patches tilt toward the pointer on a spring, and settle back when it leaves. */
    root.querySelectorAll('.v3-patch').forEach(function (p) {
      var rx = new AZ.Spring(0, { response: 0.45, damping: 0.8, precision: 0.005 }), ry = new AZ.Spring(0, { response: 0.45, damping: 0.8, precision: 0.005 });
      function apply() { p.style.transform = 'perspective(800px) rotateX(' + rx.x.toFixed(2) + 'deg) rotateY(' + ry.x.toFixed(2) + 'deg)'; }
      rx.on(apply); ry.on(apply);
      p.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = p.getBoundingClientRect();
        ry.to(((e.clientX - r.left) / r.width - 0.5) * 9); rx.to(-((e.clientY - r.top) / r.height - 0.5) * 9);
      });
      p.addEventListener('pointerleave', function () { rx.to(0); ry.to(0); });
      p.addEventListener('pointerdown', function () { p.classList.add('is-down'); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { p.addEventListener(ev, function () { p.classList.remove('is-down'); }); });
      ctx.onCleanup(function () { rx.stop(); ry.stop(); });
    });

    /* Podcast: sewn button plays; the stitched line fills blue, red, green and can be scrubbed. */
    var btn = root.querySelector('.v3-button'), line = root.querySelector('.v3-line'), time = root.querySelector('.v3-time');
    var segs = [].slice.call(line.children), txt = root.querySelector('.v3-ptxt');
    var prog = 0, playing = false, raf = 0, last = 0;
    function paint() {
      segs.forEach(function (s, i) { s.style.transform = 'scaleX(' + AZ.clamp(prog * 3 - i, 0, 1).toFixed(3) + ')'; });
      var sec = Math.round(prog * 2520); time.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') + ' / 42:00';
      line.setAttribute('aria-valuenow', String(Math.round(prog * 100)));
    }
    function tick(t) { prog = Math.min(1, prog + (t - last) / 1000 / 45); last = t; paint(); if (playing && prog < 1) raf = requestAnimationFrame(tick); else { playing = false; btn.classList.remove('is-on'); txt.textContent = 'Play'; } }
    btn.addEventListener('click', function () {
      playing = !playing; btn.classList.toggle('is-on', playing); btn.setAttribute('aria-pressed', playing ? 'true' : 'false'); txt.textContent = playing ? 'Pause' : 'Play';
      if (playing) { if (prog >= 1) prog = 0; last = performance.now(); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
    });
    function scrub(x) { var r = line.getBoundingClientRect(); prog = AZ.clamp((x - r.left) / r.width, 0, 1); paint(); }
    AZ.drag(line, { start: function (e) { scrub(e.clientX); }, move: function (d) { scrub(d.x); } });
    line.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { prog = Math.min(1, prog + 0.03); paint(); } if (e.key === 'ArrowLeft') { prog = Math.max(0, prog - 0.03); paint(); } });
    ctx.onCleanup(function () { cancelAnimationFrame(raf); });
    paint();
  },
});
