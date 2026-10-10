/* Shared harness + physics. Variants register with AZ.variants.push({ id, name, tagline, cls, mount(ctx) }). */
(function () {
  'use strict';
  var AZ = (window.AZ = { variants: [] });
  AZ.fail = function (msg) {
    var box = document.getElementById('az-error');
    if (!box) {
      box = document.createElement('div');
      box.id = 'az-error';
      box.setAttribute('role', 'alert');
      box.style.cssText = 'position:fixed;left:12px;right:12px;top:12px;z-index:2147483647;padding:14px 16px;border-radius:12px;background:#fff;color:#8a0f1a;font:14px/1.45 -apple-system,system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.3)';
      document.body.appendChild(box);
    }
    box.innerHTML = '<b>Something went wrong on this device.</b><br>Please send this text back so it can be fixed:<br><code style="word-break:break-all">' + String(msg).replace(/</g, '&lt;') + '</code><br>(' + navigator.userAgent.replace(/</g, '&lt;') + ')';
  };
  window.addEventListener('error', function (e) { AZ.fail((e.message || 'error') + ' @ line ' + (e.lineno || '?')); });
  var loading = document.getElementById('az-loading');
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  AZ.reduced = function () { return RM.matches; };

  /* ------------------------------------------------------------------
   * Springs. Designer-friendly parameters (apple-design): `response` is how
   * quickly the value reaches its target in seconds, `damping` 1 = no overshoot.
   * New input only changes the target, so motion is always continuous and
   * interruptible; a release velocity can be handed in.
   * ------------------------------------------------------------------ */
  function Spring(value, opts) {
    opts = opts || {};
    this.x = value || 0;
    this.v = 0;
    this.target = this.x;
    this.precision = opts.precision || 0.01;
    this.listeners = [];
    this.raf = 0;
    this.last = 0;
    this.tune(opts.response || 0.4, opts.damping == null ? 1 : opts.damping);
  }
  Spring.prototype.tune = function (response, damping) {
    var w = (2 * Math.PI) / response;
    this.k = w * w;
    this.c = 2 * damping * w;
    return this;
  };
  Spring.prototype.to = function (target, o) {
    o = o || {};
    this.target = target;
    if (o.velocity != null) this.v = o.velocity;
    if (AZ.reduced()) return this.jump(target);
    this.run();
    return this;
  };
  Spring.prototype.jump = function (value) {
    this.x = this.target = value;
    this.v = 0;
    this.emit();
    return this;
  };
  Spring.prototype.on = function (fn) { this.listeners.push(fn); return this; };
  Spring.prototype.emit = function () { for (var i = 0; i < this.listeners.length; i++) this.listeners[i](this.x, this); };
  Spring.prototype.stop = function () { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; };
  Spring.prototype.run = function () {
    var self = this;
    if (self.raf) return;
    self.last = performance.now();
    function tick(t) {
      var dt = Math.min((t - self.last) / 1000, 1 / 30);
      self.last = t;
      var steps = Math.max(1, Math.ceil(dt / (1 / 240)));
      var h = dt / steps;
      for (var i = 0; i < steps; i++) {
        var a = self.k * (self.target - self.x) - self.c * self.v;
        self.v += a * h;
        self.x += self.v * h;
      }
      if (Math.abs(self.v) < self.precision && Math.abs(self.target - self.x) < self.precision) {
        self.x = self.target;
        self.v = 0;
        self.raf = 0;
        self.emit();
        return;
      }
      self.emit();
      self.raf = requestAnimationFrame(tick);
    }
    self.raf = requestAnimationFrame(tick);
  };
  AZ.Spring = Spring;

  /* Where a flick will come to rest (exponential decay, as Apple's sample code). */
  AZ.project = function (velocity, rate) { rate = rate || 0.998; return (velocity / 1000) * rate / (1 - rate); };
  /* Soft boundary: the further past the edge, the less the element follows. */
  AZ.rubber = function (over, dimension, c) { c = c || 0.55; return (over * dimension * c) / (dimension + c * Math.abs(over)); };
  AZ.clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  AZ.lerp = function (a, b, t) { return a + (b - a) * t; };

  /* Pointer drag with velocity tracking. Tracking is 1:1 from the grab point; on release you
   * get the pointer velocity (px/s) to hand to a spring. A tiny hysteresis separates taps from drags. */
  AZ.drag = function (el, h) {
    var id = null, hist = [], sx = 0, sy = 0, moved = false;
    function down(e) {
      if (id !== null || (e.button && e.button > 0)) return;
      if (h.filter && !h.filter(e)) return;
      id = e.pointerId;
      try { el.setPointerCapture(id); } catch (err) { /* ignore */ }
      sx = e.clientX; sy = e.clientY; moved = false;
      hist = [{ t: e.timeStamp, x: e.clientX, y: e.clientY }];
      if (h.start) h.start(e);
    }
    function move(e) {
      if (e.pointerId !== id) return;
      hist.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
      while (hist.length > 2 && e.timeStamp - hist[0].t > 100) hist.shift();
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      if (h.move) h.move({ dx: dx, dy: dy, x: e.clientX, y: e.clientY, e: e });
    }
    function up(e) {
      if (e.pointerId !== id) return;
      var a = hist[0], b = hist[hist.length - 1], dt = Math.max(1, b.t - a.t);
      var vx = ((b.x - a.x) / dt) * 1000, vy = ((b.y - a.y) / dt) * 1000;
      try { el.releasePointerCapture(id); } catch (err) { /* ignore */ }
      id = null;
      if (h.end) h.end({ moved: moved, vx: vx, vy: vy, dx: e.clientX - sx, dy: e.clientY - sy, e: e });
    }
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return function () {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  };

  /* ------------------------------------------------------------------
   * Join sheet: opens with a spring, follows the finger 1:1, rubber-bands upwards,
   * and on release projects the flick to decide dismiss vs. snap back.
   * ------------------------------------------------------------------ */
  AZ.openSheet = function (theme) {
    theme = theme || {};
    if (document.querySelector('.az-sheet')) return;
    var opener = document.activeElement;
    var scrim = document.createElement('div');
    scrim.className = 'az-sheet-scrim';
    var sheet = document.createElement('div');
    sheet.className = 'az-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-labelledby', 'az-sheet-title');
    var vars = theme.vars || {};
    Object.keys(vars).forEach(function (k) { sheet.style.setProperty(k, vars[k]); });
    sheet.innerHTML =
      '<div class="az-sheet-grab" aria-hidden="true"><span></span></div>' +
      '<h2 id="az-sheet-title">' + (theme.title || 'Join the community') + '</h2>' +
      '<p>' + (theme.text || 'Free for everyone. Register for events, get your ticket, never miss an episode.') + '</p>' +
      '<label for="az-n">Your name</label><input id="az-n" autocomplete="name" placeholder="Leyla">' +
      '<label for="az-e">Email</label><input id="az-e" type="email" autocomplete="email" placeholder="you@example.com">' +
      '<button class="az-sheet-cta" type="button">' + (theme.cta || 'Create my account') + '</button>' +
      '<button class="az-sheet-close" type="button">Not now</button>' +
      '<p class="az-sheet-note">Design preview: nothing is sent or saved.</p>';
    document.body.appendChild(scrim);
    document.body.appendChild(sheet);
    document.documentElement.style.overflow = 'hidden';

    var height = sheet.offsetHeight;
    var y = new Spring(height + 40, { response: 0.42, damping: 0.88, precision: 0.05 });
    var closed = false;
    function render(v) {
      sheet.style.transform = 'translate(-50%,' + v + 'px)';
      scrim.style.opacity = String(AZ.clamp(1 - Math.max(0, v) / height, 0, 1));
    }
    y.on(render);
    y.jump(height + 40);
    y.to(0);

    function finish() {
      if (closed) return;
      closed = true;
      y.stop();
      document.removeEventListener('keydown', onKey);
      scrim.remove();
      sheet.remove();
      document.documentElement.style.overflow = '';
      if (opener && opener.focus) opener.focus();
    }
    function dismiss(velocity) {
      if (closed) return;
      y.on(function (v) { if (v >= height + 20) finish(); });
      y.tune(0.34, 1);
      y.to(height + 40, { velocity: velocity || 0 });
      if (AZ.reduced()) finish();
    }
    function onKey(e) { if (e.key === 'Escape') dismiss(0); }
    document.addEventListener('keydown', onKey);
    scrim.addEventListener('pointerdown', function () { dismiss(0); });
    sheet.querySelector('.az-sheet-close').addEventListener('click', function () { dismiss(0); });
    sheet.querySelector('.az-sheet-cta').addEventListener('click', function () { dismiss(0); });

    var base = 0;
    AZ.drag(sheet, {
      filter: function (e) { return !/^(INPUT|BUTTON|LABEL)$/.test(e.target.tagName); },
      start: function () { y.stop(); base = y.x; },
      move: function (d) {
        var next = base + d.dy;
        y.jump(next < 0 ? AZ.rubber(next, height) : next);
      },
      end: function (d) {
        y.tune(0.38, 0.9);
        var projected = y.x + AZ.project(d.vy);
        if (projected > height * 0.5 || d.vy > 900) dismiss(d.vy);
        else y.to(0, { velocity: d.vy });
      },
    });
    var first = sheet.querySelector('input');
    if (first && !AZ.reduced()) setTimeout(function () { first.focus({ preventScroll: true }); }, 380);
  };

  /* ------------------------------------------------------------------
   * Harness: picker, intro, "choose this design".
   * ------------------------------------------------------------------ */
  var stage = document.getElementById('stage');
  var current = -1, ctx = null;
  var picked = null;
  try { picked = sessionStorage.getItem('az-picked'); } catch (e) { /* storage may be blocked */ }

  function makeCtx(root) {
    var cleanups = [];
    return {
      root: root,
      listen: function (target, ev, fn, opts) {
        target.addEventListener(ev, fn, opts);
        cleanups.push(function () { target.removeEventListener(ev, fn, opts); });
      },
      onCleanup: function (fn) { cleanups.push(fn); },
      destroy: function () { cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; },
    };
  }

  function mount(i) {
    if (ctx) ctx.destroy();
    stage.innerHTML = '';
    document.documentElement.style.overflow = '';
    var v = AZ.variants[i];
    requestAnimationFrame(function () {
      var root = document.createElement('div');
      root.className = 'az-root ' + v.cls;
      stage.appendChild(root);
      ctx = makeCtx(root);
      root.addEventListener('click', function (e) { var a = e.target.closest('a[href="#"]'); if (a) e.preventDefault(); });
      window.scrollTo(0, 0);
      var l = document.getElementById('az-loading'); if (l) l.remove();
      try { v.mount(ctx); } catch (err) { AZ.fail(err && err.message ? err.message : err); }
      updateTagline();
    });
  }

  var picker, highlight, items = [], tagline, chooseBtn;
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }

  function moveHighlight() {
    var it = items[current];
    if (!it) return;
    highlight.style.width = it.offsetWidth + 'px';
    highlight.style.transform = 'translateX(' + it.offsetLeft + 'px)';
  }
  function updateTagline() {
    var v = AZ.variants[current];
    tagline.innerHTML = '<b>' + (current + 1) + '. ' + v.name + '</b><span>' + v.tagline + '</span><em>Sample content, design preview only.</em>';
    var isPicked = picked === v.id;
    chooseBtn.textContent = isPicked ? '✓ Your pick' : 'Choose this design';
    chooseBtn.classList.toggle('is-picked', isPicked);
    chooseBtn.classList.toggle('is-primary', !isPicked);
  }
  function setActive(i) {
    if (i < 0 || i >= AZ.variants.length) return;
    current = i;
    items.forEach(function (it, j) {
      if (j === i) { it.setAttribute('data-active', ''); it.setAttribute('aria-current', 'true'); }
      else { it.removeAttribute('data-active'); it.removeAttribute('aria-current'); }
    });
    moveHighlight();
    try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) { location.hash = String(i + 1); }
    mount(i);
  }

  function dialog(html, onMount) {
    var scrim = el('div', 'rv-dialog-scrim');
    var box = el('div', 'rv-dialog');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = html;
    scrim.appendChild(box);
    document.body.appendChild(scrim);
    requestAnimationFrame(function () { scrim.classList.add('is-in'); });
    function close() { scrim.classList.remove('is-in'); setTimeout(function () { scrim.remove(); }, 200); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', esc);
    scrim.addEventListener('pointerdown', function (e) { if (e.target === scrim) close(); });
    onMount(box, close);
    return close;
  }

  function showIntro() {
    var list = AZ.variants.map(function (v, i) { return '<li><i>' + (i + 1) + '</i><div><b>' + v.name + '</b><small>' + v.tagline + '</small></div></li>'; }).join('');
    dialog(
      '<h2>Azerbaijan Youth Association: choose a look</h2>' +
        '<p>Five different design directions for the new website, each using the colours of the Azerbaijani flag in its own way. They are fully clickable previews, and the event and podcast details are sample content for design purposes only.</p>' +
        '<ol>' + list + '</ol>' +
        '<p><b>How to look:</b> use the bar at the bottom (or the keys <b>1–5</b> and <b>← →</b>), scroll each page, and try the buttons. Press <b>Join</b> to drag the sheet. When one stands out, press <b>Choose this design</b> at the top right.</p>' +
        '<div class="rv-actions"><button class="rv-btn is-primary" data-go>Start looking</button></div>',
      function (box, close) { box.querySelector('[data-go]').addEventListener('click', close); box.querySelector('[data-go]').focus(); }
    );
  }

  function showChoose() {
    var v = AZ.variants[current];
    dialog(
      '<h2>Your pick: ' + v.name + '</h2>' +
        '<p>Add a note if you like (what you love, what you would change), then copy the message and send it back.</p>' +
        '<label for="rv-who">Your name</label><input id="rv-who" placeholder="Optional">' +
        '<label for="rv-notes">Notes</label><textarea id="rv-notes" placeholder="For example: I like the colours, but the text is too small on my phone."></textarea>' +
        '<p class="rv-ok" id="rv-ok" role="status"></p>' +
        '<div class="rv-actions"><button class="rv-btn" data-cancel>Cancel</button><a class="rv-btn" data-mail style="text-decoration:none;display:inline-flex;align-items:center">Open email</a><button class="rv-btn is-primary" data-copy>Copy my message</button></div>',
      function (box, close) {
        function message() {
          var who = box.querySelector('#rv-who').value.trim();
          var notes = box.querySelector('#rv-notes').value.trim();
          return 'Azerbaijan Youth Association website design\nMy pick: ' + (current + 1) + '. ' + v.name + (who ? '\nFrom: ' + who : '') + (notes ? '\nNotes: ' + notes : '');
        }
        function setPicked() {
          picked = v.id;
          try { sessionStorage.setItem('az-picked', v.id); } catch (e) { /* ignore */ }
          updateTagline();
        }
        box.querySelector('[data-cancel]').addEventListener('click', close);
        box.querySelector('[data-mail]').addEventListener('click', function (e) {
          e.preventDefault();
          setPicked();
          location.href = 'mailto:?subject=' + encodeURIComponent('Website design pick: ' + v.name) + '&body=' + encodeURIComponent(message());
        });
        box.querySelector('[data-copy]').addEventListener('click', function () {
          var text = message();
          setPicked();
          var ok = box.querySelector('#rv-ok');
          function done() { ok.textContent = 'Copied. Paste it into a message and send it back.'; }
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
          else fallback();
          function fallback() {
            var ta = box.querySelector('#rv-notes');
            ta.value = text;
            ta.select();
            try { document.execCommand('copy'); done(); } catch (e) { ok.textContent = 'Select the text above and copy it manually.'; }
          }
        });
        box.querySelector('#rv-notes').focus();
      }
    );
  }

  function buildChrome() {
    picker = el('nav', 'proto-picker');
    picker.setAttribute('aria-label', 'Design directions');
    highlight = el('span', 'proto-picker-highlight');
    highlight.setAttribute('aria-hidden', 'true');
    picker.appendChild(highlight);
    AZ.variants.forEach(function (v, i) {
      var b = el('button', 'proto-picker-item');
      b.type = 'button';
      b.innerHTML = '<span class="pn">' + (i + 1) + '</span><span class="pt">' + v.name + '</span>';
      b.setAttribute('aria-label', (i + 1) + '. ' + v.name);
      b.addEventListener('click', function () { setActive(i); });
      items.push(b);
      picker.appendChild(b);
    });
    picker.appendChild(el('span', 'proto-picker-divider'));
    var rep = el('button', 'proto-picker-item proto-picker-replay', '↻');
    rep.type = 'button';
    rep.setAttribute('aria-label', 'Replay animation (R)');
    rep.addEventListener('click', function () { mount(current); });
    picker.appendChild(rep);
    document.body.appendChild(picker);

    tagline = el('div', 'rv-chrome rv-tagline');
    document.body.appendChild(tagline);
    var cw = el('div', 'rv-chrome rv-choose');
    var help = el('button', 'rv-pill', 'About');
    help.type = 'button';
    help.addEventListener('click', showIntro);
    chooseBtn = el('button', 'rv-pill is-primary', 'Choose this design');
    chooseBtn.type = 'button';
    chooseBtn.addEventListener('click', showChoose);
    cw.appendChild(help);
    cw.appendChild(chooseBtn);
    document.body.appendChild(cw);

    window.addEventListener('resize', moveHighlight);
    document.addEventListener('keydown', function (e) {
      var t = e.target;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector('.rv-dialog-scrim') || document.querySelector('.az-sheet')) return;
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= AZ.variants.length) setActive(n - 1);
      else if (e.key === 'ArrowRight') setActive((current + 1) % AZ.variants.length);
      else if (e.key === 'ArrowLeft') setActive((current - 1 + AZ.variants.length) % AZ.variants.length);
      else if (e.key === 'r' || e.key === 'R') mount(current);
    });
  }

  AZ.start = function () {
    buildChrome();
    var n = parseInt((location.hash || '').replace('#', ''), 10);
    setActive(n >= 1 && n <= AZ.variants.length ? n - 1 : 0);
    requestAnimationFrame(function () { requestAnimationFrame(function () { picker.setAttribute('data-ready', ''); }); });
    var seen = false;
    try { seen = sessionStorage.getItem('az-intro') === '1'; sessionStorage.setItem('az-intro', '1'); } catch (e) { /* ignore */ }
    if (!seen) setTimeout(showIntro, 350);
  };

  /* Shared artwork helpers */
  AZ.star8 = function (cx, cy, r) {
    function sq(rot) {
      var pts = [];
      for (var k = 0; k < 4; k++) { var a = ((rot + k * 90) * Math.PI) / 180; pts.push((cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2)); }
      return pts.join(' ');
    }
    return [sq(45), sq(0)];
  };
  /* The flag's emblem: crescent plus eight-pointed star, drawn in a 100x100 box. */
  AZ.emblem = function (fill, extra) {
    var star = AZ.star8(64, 50, 13);
    // Crescent = outer circle (c 50,50 r 36) minus inner circle (c 61,50 r 30); tips at x 73.5.
    return '<svg viewBox="0 0 100 100" ' + (extra || '') + ' aria-hidden="true">' +
      '<path fill="' + fill + '" d="M73.5 22.73A36 36 0 1 0 73.5 77.27A30 30 0 1 1 73.5 22.73Z"/>' +
      '<polygon fill="' + fill + '" points="' + star[0] + '"/><polygon fill="' + fill + '" points="' + star[1] + '"/></svg>';
  };
})();
