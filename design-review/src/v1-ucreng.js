/* 1. Üç Rəng: the flag is the interface. */
AZ.variants.push({
  id: 'ucreng',
  name: 'Üç Rəng',
  cls: 'v1',
  tagline: 'The flag is the page. Three stripes you open like drawers, with the crescent and star following the action.',
  mount: function (ctx) {
    var root = ctx.root;
    var bars = '';
    for (var i = 0; i < 44; i++) bars += '<i style="--h:' + (0.25 + 0.75 * Math.abs(Math.sin(i * 0.8) * Math.cos(i * 0.31))).toFixed(2) + '"></i>';

    root.innerHTML =
      '<header class="v1-top">' +
        '<a href="#" class="v1-logo" data-noop><span class="v1-logo-mark">' + AZ.emblem('currentColor') + '</span>Az Youth UK</a>' +
        '<nav class="v1-nav" aria-label="Main"><a href="#" data-noop>News</a><a href="#" data-noop>Events</a><a href="#" data-noop>Podcast</a><a href="#" data-noop>Help</a></nav>' +
        '<button class="v1-join" type="button" data-join>Join us</button>' +
      '</header>' +
      '<section class="v1-flag" aria-label="Start here">' +
        '<article class="v1-band v1-blue" tabindex="0" role="button" aria-expanded="false" aria-label="Come along: events">' +
          '<div class="v1-head"><span class="v1-n">01</span><h2 class="v1-h">Come along</h2><p class="v1-sub">Events, socials and nights out</p></div>' +
          '<div class="v1-body"><ul class="v1-events">' +
            '<li><b>14<small>Nov</small></b><span><strong>Language Café</strong><em>Camden, London · 18:30</em></span><u>12 places</u></li>' +
            '<li><b>22<small>Nov</small></b><span><strong>Mugham &amp; Mingle</strong><em>Barbican, London · 19:00</em></span><u>40 places</u></li>' +
            '<li><b>05<small>Dec</small></b><span><strong>Career Night</strong><em>The City, London · 18:00</em></span><u class="is-low">3 left</u></li>' +
          '</ul><a href="#" class="v1-more" data-noop>All events →</a></div>' +
        '</article>' +
        '<article class="v1-band v1-red" tabindex="0" role="button" aria-expanded="false" aria-label="Listen in: podcast">' +
          '<div class="v1-head"><span class="v1-n">02</span><h2 class="v1-h">Listen in</h2><p class="v1-sub">The podcast, every other week</p></div>' +
          '<div class="v1-body"><div class="v1-ep">' +
            '<button class="v1-play" type="button" aria-pressed="false" aria-label="Play episode"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><polygon class="p" points="8,5 19,12 8,19" fill="currentColor"/><g class="u" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></g></svg></button>' +
            '<div class="v1-ep-main"><p class="v1-ep-k">Episode 14 · 42 min</p><h3>Between Two Homes</h3><div class="v1-wave" role="slider" tabindex="0" aria-label="Scrub episode" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + bars + '</div><p class="v1-time">0:00 / 42:00</p></div>' +
          '</div></div>' +
        '</article>' +
        '<article class="v1-band v1-green" tabindex="0" role="button" aria-expanded="false" aria-label="Belong: join">' +
          '<div class="v1-head"><span class="v1-n">03</span><h2 class="v1-h">Belong</h2><p class="v1-sub">Free to join. Always.</p></div>' +
          '<div class="v1-body"><div class="v1-join-box"><p>Make an account, register for events in one tap, and get your ticket on your phone.</p><button class="v1-cta" type="button" data-join>Join the community</button><ul><li>Free membership</li><li>Event tickets &amp; waitlists</li><li>Never miss an episode</li></ul></div></div>' +
        '</article>' +
        '<div class="v1-emblem" aria-hidden="true">' + AZ.emblem('currentColor') + '</div>' +
      '</section>' +
      '<div class="v1-tape" aria-hidden="true"><div class="v1-tape-track">' +
        [0, 1].map(function () { return '<div><span class="b">Free to join</span><span class="r">Events</span><span class="g">Podcast</span><span class="b">Community</span><span class="r">News</span><span class="g">Come along</span></div>'; }).join('') +
      '</div></div>' +
      '<section class="v1-about"><h2>One flag. Three ways in.</h2><div class="v1-cols">' +
        '<article class="b"><h3>Culture</h3><p>Music, food, language and the traditions we carry with us, shared at events people actually want to go to.</p></article>' +
        '<article class="r"><h3>Learning</h3><p>Talks, workshops and networking that help young people grow their skills and careers.</p></article>' +
        '<article class="g"><h3>Community</h3><p>A place to belong, whether you were born in Baku, Birmingham or somewhere in between.</p></article>' +
      '</div></section>' +
      '<footer class="v1-foot"><div class="v1-foot-bars"><i></i><i></i><i></i></div><p>© 2026 Azerbaijan UK Youth Association · Privacy · Terms · Help</p></footer>';

    root.addEventListener('click', function (e) { if (e.target.closest('[data-noop]')) e.preventDefault(); });
    root.querySelectorAll('[data-join]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        AZ.openSheet({ vars: { '--sheet-accent': '#EF3340', '--sheet-font': 'InstrumentSans, system-ui, sans-serif', '--sheet-display': 'Archivo, sans-serif' }, title: 'Join the community' });
      });
    });

    /* ---- Stripes: flex-grow springs. Critically damped, interruptible: a new tap just retargets. ---- */
    var flag = root.querySelector('.v1-flag');
    var bands = [].slice.call(root.querySelectorAll('.v1-band'));
    var emblem = root.querySelector('.v1-emblem');
    var grow = bands.map(function () { return new AZ.Spring(1, { response: 0.5, damping: 1, precision: 0.002 }); });
    var open = bands.map(function () { return new AZ.Spring(0, { response: 0.5, damping: 1, precision: 0.002 }); });
    var pEmb = new AZ.Spring(0, { response: 0.55, damping: 0.92, precision: 0.002 });
    var openIndex = -1;

    function layoutEmblem() {
      var fh = flag.clientHeight, fw = flag.clientWidth;
      var red = bands[1];
      var big = Math.min(fh * 0.34, fw * 0.5);
      var small = 58;
      var p = pEmb.x;
      var size = AZ.lerp(big, small, p);
      var cx = AZ.lerp(fw / 2, fw - 40, p);
      var cy = AZ.lerp(red.offsetTop + red.offsetHeight / 2, 40, p);
      emblem.style.width = size + 'px';
      emblem.style.height = size + 'px';
      emblem.style.transform = 'translate(' + (cx - size / 2) + 'px,' + (cy - size / 2) + 'px) rotate(' + (p * 45) + 'deg)';
      emblem.style.color = p > 0.5 ? '#06222b' : '#fff';
    }
    grow.forEach(function (g, i) {
      g.on(function (v) { bands[i].style.flexGrow = v.toFixed(3); bands[i].style.setProperty('--c', AZ.clamp((1 - v) / 0.58, 0, 1).toFixed(3)); layoutEmblem(); });
    });
    open.forEach(function (o, i) {
      o.on(function (v) {
        var b = bands[i];
        b.style.setProperty('--o', v.toFixed(3));
      });
    });
    pEmb.on(layoutEmblem);
    window.addEventListener('resize', layoutEmblem);
    ctx.onCleanup(function () { window.removeEventListener('resize', layoutEmblem); grow.concat(open, [pEmb]).forEach(function (s) { s.stop(); }); });

    function setOpen(i) {
      openIndex = i;
      bands.forEach(function (b, j) {
        var isOpen = j === i;
        b.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        grow[j].to(i === -1 ? 1 : isOpen ? 4.2 : 0.42);
        open[j].to(isOpen ? 1 : 0);
      });
      pEmb.to(i === -1 ? 0 : 1);
    }
    bands.forEach(function (b, i) {
      b.addEventListener('click', function (e) {
        if (e.target.closest('button, a, [role=slider]')) return;
        setOpen(openIndex === i ? -1 : i);
      });
      b.addEventListener('keydown', function (e) {
        if (e.target !== b) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(openIndex === i ? -1 : i); }
      });
      /* A hint of life on hover, only on real pointers, only while nothing is open. */
      b.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse' || openIndex !== -1) return;
        grow.forEach(function (g, j) { g.to(j === i ? 1.22 : 0.9); });
      });
      b.addEventListener('pointerleave', function (e) {
        if (e.pointerType !== 'mouse' || openIndex !== -1) return;
        grow.forEach(function (g) { g.to(1); });
      });
    });
    ctx.listen(document, 'keydown', function (e) { if (e.key === 'Escape' && openIndex !== -1 && !document.querySelector('.az-sheet')) setOpen(-1); });
    layoutEmblem();

    /* ---- Podcast: play toggles; the waveform scrubs 1:1 under the finger ---- */
    var play = root.querySelector('.v1-play');
    var wave = root.querySelector('.v1-wave');
    var time = root.querySelector('.v1-time');
    var waveBars = [].slice.call(wave.children);
    var progress = 0, playing = false, raf = 0, last = 0;
    function paint() {
      var n = Math.round(progress * waveBars.length);
      waveBars.forEach(function (b, k) { b.classList.toggle('on', k < n); });
      var s = Math.round(progress * 42 * 60);
      time.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + ' / 42:00';
      wave.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    }
    function tick(t) {
      var dt = (t - last) / 1000; last = t;
      progress = Math.min(1, progress + dt / 60);
      paint();
      raf = playing && progress < 1 ? requestAnimationFrame(tick) : 0;
      if (progress >= 1) { playing = false; play.setAttribute('aria-pressed', 'false'); play.classList.remove('is-on'); }
    }
    play.addEventListener('click', function () {
      playing = !playing;
      play.setAttribute('aria-pressed', playing ? 'true' : 'false');
      play.classList.toggle('is-on', playing);
      if (playing) { last = performance.now(); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
    });
    function scrub(x) { var r = wave.getBoundingClientRect(); progress = AZ.clamp((x - r.left) / r.width, 0, 1); paint(); }
    AZ.drag(wave, { start: function (e) { scrub(e.clientX); }, move: function (d) { scrub(d.x); }, end: function (d) { if (!d.moved) scrub(d.e.clientX); } });
    wave.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { progress = Math.min(1, progress + 0.03); paint(); } if (e.key === 'ArrowLeft') { progress = Math.max(0, progress - 0.03); paint(); } });
    ctx.onCleanup(function () { cancelAnimationFrame(raf); });
    paint();
  },
});
