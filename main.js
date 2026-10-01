(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Lahore clock ---- */
  var clock = document.querySelector('[data-clock]');
  function tick() {
    if (!clock) return;
    try {
      clock.textContent = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Karachi'
      }).format(new Date());
    } catch (e) { clock.parentNode.style.display = 'none'; }
  }
  tick(); setInterval(tick, 20000);

  /* ---- theme ---- */
  var themeBtn = document.querySelector('.theme');
  var themeLabel = document.querySelector('[data-theme-label]');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function current() { return root.dataset.theme || (mq.matches ? 'dark' : 'light'); }
  function syncLabel() { themeLabel.textContent = current() === 'dark' ? 'Light' : 'Dark'; }
  syncLabel();
  mq.addEventListener && mq.addEventListener('change', syncLabel);
  themeBtn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncLabel();
  });

  /* ---- evaluation protocol switch ---- */
  var inst = document.querySelector('.instrument');
  if (inst) {
    var acc = inst.querySelector('[data-acc]');
    var cap = inst.querySelector('[data-caption]');
    var captions = {
      reported: 'Validation accuracy under the original harness',
      corrected: 'Validation accuracy under the corrected 11-way protocol'
    };
    var values = { reported: 46.7, corrected: 89.7 };
    var shown = 46.7, raf;
    inst.querySelectorAll('[data-set]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.dataset.set;
        if (inst.dataset.protocol === p) return;
        inst.dataset.protocol = p;
        inst.querySelectorAll('[data-set]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        cap.textContent = captions[p];
        var from = shown, to = values[p];
        if (reduce) { shown = to; acc.textContent = to.toFixed(1); return; }
        var t0 = performance.now();
        cancelAnimationFrame(raf);
        (function step(now) {
          var k = Math.min(1, (now - t0) / 600);
          var e = 1 - Math.pow(1 - k, 3);
          shown = from + (to - from) * e;
          acc.textContent = shown.toFixed(1);
          if (k < 1) raf = requestAnimationFrame(step);
        })(t0);
      });
    });
  }

  /* ---- copy email ---- */
  var copyBtn = document.querySelector('[data-copy]');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var text = copyBtn.dataset.copy;
    var done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy address'; }, 1800); };
    var fallback = function () {
      var r = document.createRange(); var a = document.querySelector('.email-row .btn');
      r.selectNodeContents(a); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      copyBtn.textContent = 'Selected, press Ctrl+C';
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  });

  /* ---- header border + current section ---- */
  var top = document.querySelector('.top');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.top nav a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });

  /* ---- signal trace ---- */
  var page = document.querySelector('.page');
  var svg = document.querySelector('.trace');
  var base = svg && svg.querySelector('.trace-base');
  var live = svg && svg.querySelector('.trace-live');
  var clip = svg && svg.querySelector('.trace-clip');
  var dot = svg && svg.querySelector('.trace-dot');
  var X = 12, marks = [], yStart = 0, yEnd = 0;

  function burst(d, big) {
    // decaying ringing after each mark: a small, damped oscillation
    if (d < 0 || d > 64) return 0;
    var amp = big ? 10 : 7;
    return amp * Math.sin((2 * Math.PI * d) / 13) * Math.exp(-d / 16);
  }
  function offset(y) {
    var s = 0;
    for (var i = 0; i < marks.length; i++) s += burst(y - marks[i].y, marks[i].big);
    return s;
  }
  function layout() {
    if (!svg || getComputedStyle(svg).display === 'none') return;
    var pr = page.getBoundingClientRect();
    marks = Array.prototype.map.call(document.querySelectorAll('[data-mark]'), function (el, i) {
      var anchor = el.querySelector('.margin > *') || el;
      var r = anchor.getBoundingClientRect();
      return { y: Math.round(r.top - pr.top + 6), big: i === 0 };
    });
    if (!marks.length) return;
    yStart = marks[0].y - 40;
    yEnd = page.offsetHeight - 24;
    svg.setAttribute('height', page.offsetHeight);
    var d = 'M' + X + ' ' + yStart;
    for (var y = yStart; y <= yEnd; y += 1.5) d += 'L' + (X + offset(y)).toFixed(2) + ' ' + y.toFixed(1);
    base.setAttribute('d', d);
    live.setAttribute('d', d);
    onScroll();
  }
  function onScroll() {
    top.classList.toggle('scrolled', window.scrollY > 8);
    var active = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < window.innerHeight * 0.4) active = i; });
    navLinks.forEach(function (a, i) { a.setAttribute('aria-current', String(i === active)); });

    if (!svg || !marks.length || getComputedStyle(svg).display === 'none') return;
    var pr = page.getBoundingClientRect();
    var y = window.innerHeight * 0.42 - pr.top;
    y = Math.max(yStart, Math.min(yEnd, y));
    clip.setAttribute('height', y);
    dot.setAttribute('cx', (X + offset(y)).toFixed(2));
    dot.setAttribute('cy', y.toFixed(1));
  }
  var queued = false;
  window.addEventListener('scroll', function () {
    if (queued) return; queued = true;
    requestAnimationFrame(function () { queued = false; onScroll(); });
  }, { passive: true });
  window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  window.addEventListener('load', layout);
  layout();
})();
