(function () {
  var root = document.documentElement;

  /* ---- theme ---- */
  var themeBtn = document.querySelector('.theme');
  var themeLabel = document.querySelector('[data-theme-label]');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function current() { return root.dataset.theme || 'light'; }
  function syncLabel() { themeLabel.textContent = current() === 'dark' ? 'Light' : 'Dark'; }
  syncLabel();
  mq.addEventListener && mq.addEventListener('change', syncLabel);
  themeBtn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncLabel();
  });

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
})();
