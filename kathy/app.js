// Hero fade-in and copy-to-clipboard. Nothing else.
(function () {
  var hero = document.querySelector('.hero img');
  if (hero) {
    if (hero.complete) hero.classList.add('loaded');
    else hero.addEventListener('load', function () { hero.classList.add('loaded'); });
  }

  // Instagram's in-app browser is the main entry point here and its support for
  // the async clipboard API is inconsistent, so fall back to execCommand rather
  // than leaving the discount-code button silently dead.
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject();
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-copy]');
    if (!el) return;
    // swap only the label so sibling icons survive the transient state
    var target = el.querySelector('[data-copy-label]') || el;
    if (target.dataset.busy) return;
    var original = target.textContent;
    var show = function (msg) {
      target.dataset.busy = '1';
      target.textContent = msg;
      setTimeout(function () {
        target.textContent = original;
        delete target.dataset.busy;
      }, 1500);
    };
    copyText(el.dataset.copy).then(function () { show('Copied'); },
                                   function () { show('Copy failed'); });
  });
})();
