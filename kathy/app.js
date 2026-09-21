// Two clipboard handlers and a hero fade-in. Nothing else.
(function () {
  var hero = document.querySelector('.hero img');
  if (hero) {
    if (hero.complete) hero.classList.add('loaded');
    else hero.addEventListener('load', function () { hero.classList.add('loaded'); });
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-copy]');
    if (!el || !navigator.clipboard) return;
    var original = el.textContent;
    navigator.clipboard.writeText(el.dataset.copy).then(function () {
      el.textContent = 'Copied';
      setTimeout(function () { el.textContent = original; }, 1500);
    }).catch(function () {});
  });
})();
