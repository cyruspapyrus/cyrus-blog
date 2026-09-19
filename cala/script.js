/* ============================================================
   Cala's Ceramics — small bits of behaviour.
   ============================================================ */

/* ── 1. CHANGE THIS ────────────────────────────────────────────
   Cala's enquiry address. It is written into the page at load
   time (rather than sitting in the HTML) so scrapers have to
   work a little harder for it.
   ─────────────────────────────────────────────────────────── */
const ENQUIRY_EMAIL = 'hello@example.com';   // <-- replace with the real address

const ENQUIRY_SUBJECT = 'Enquiry — Cala\'s Ceramics';
const ENQUIRY_BODY = [
  'Hi Cala,',
  '',
  'I saw your work and wanted to ask about:',
  '',
  '  Piece / idea:',
  '  How many:',
  '  Colours I like:',
  '  Needed by:',
  '',
  'Thanks!',
].join('\n');

/* ---------------------------------------------------------- */

(function enquiryLink() {
  const link = document.getElementById('emailLink');
  if (!link) return;
  link.href =
    'mailto:' + ENQUIRY_EMAIL +
    '?subject=' + encodeURIComponent(ENQUIRY_SUBJECT) +
    '&body=' + encodeURIComponent(ENQUIRY_BODY);
})();

(function year() {
  const el = document.getElementById('year');
  if (el) el.textContent = '© ' + new Date().getFullYear();
})();

/* ── sticky nav hairline ─────────────────────────────────── */

(function stickyNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── lightbox ────────────────────────────────────────────── */

(function lightbox() {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  const gallery = document.getElementById('gallery');
  if (!box || !gallery) return;

  const tiles = Array.from(gallery.querySelectorAll('.tile'));
  const items = tiles.map((tile) => {
    const picture = tile.querySelector('img');
    const name = tile.querySelector('.tile__name');
    return {
      src: picture.getAttribute('src'),
      alt: picture.getAttribute('alt'),
      caption: name ? name.textContent.trim() : '',
    };
  });

  let current = 0;
  let lastFocused = null;

  function show(i) {
    current = (i + items.length) % items.length;
    const item = items[current];
    img.src = item.src;
    img.alt = item.alt;
    cap.textContent = item.caption + '  ·  ' + (current + 1) + ' / ' + items.length;
  }

  function open(i) {
    lastFocused = document.activeElement;
    show(i);
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb__close').focus();
  }

  function close() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    const done = () => {
      box.hidden = true;
      box.removeEventListener('transitionend', done);
    };
    box.addEventListener('transitionend', done);
    setTimeout(done, 400);               // fallback if transitions are off
    if (lastFocused) lastFocused.focus();
  }

  tiles.forEach((tile, i) => {
    const btn = tile.querySelector('.tile__btn');
    if (btn) btn.addEventListener('click', () => open(i));
  });

  box.querySelector('.lb__close').addEventListener('click', close);
  box.querySelector('.lb__nav--prev').addEventListener('click', () => show(current - 1));
  box.querySelector('.lb__nav--next').addEventListener('click', () => show(current + 1));

  box.addEventListener('click', (e) => {
    if (e.target === box || e.target.classList.contains('lb__figure')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* swipe on touch */
  let startX = null;
  box.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();
