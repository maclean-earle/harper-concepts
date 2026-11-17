(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nav shadow once the page moves */
  var nav = $('.nav');
  function onScroll() { nav.classList.toggle('is-stuck', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Phone menu */
  var menu = $('.menu'), links = $('#nav-links');
  menu.addEventListener('click', function () {
    var open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    menu.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    links.classList.toggle('open', !open);
  });
  $$('a', links).forEach(function (a) {
    a.addEventListener('click', function () {
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open menu');
      links.classList.remove('open');
    });
  });

  /* How it works: the photo beside the steps follows the step in view */
  var steps = $$('.step'), frames = $$('.stage .frame');
  if ('IntersectionObserver' in window && steps.length) {
    var stepIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = Number(e.target.getAttribute('data-step'));
        steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
        frames.forEach(function (f, k) { f.classList.toggle('is-on', k === i); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { stepIO.observe(s); });
  }

  /* Gentle reveal for blocks that start below the fold */
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = $$('.sec-head, .promise-box, .prov-photo, .prov-copy, .qs, .quote-box, .facts li');
    var below = targets.filter(function (el) { return el.getBoundingClientRect().top > window.innerHeight * 0.92; });
    below.forEach(function (el) { el.classList.add('rv'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    below.forEach(function (el) { io.observe(el); });
    /* Failsafe: nothing stays hidden */
    setTimeout(function () { below.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in'); }); }, 3000);
    window.addEventListener('beforeprint', function () { below.forEach(function (el) { el.classList.add('in'); }); });
  }

  /* Quote form: opens the visitor's email app with the request filled in */
  var form = $('.quote-form'), msg = $('.form-msg'), email = $('#q-email'), size = $('#q-size');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    [email, size].forEach(function (el) { el.removeAttribute('aria-invalid'); });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.setAttribute('aria-invalid', 'true'); first = email; }
    if (!size.value) { size.setAttribute('aria-invalid', 'true'); first = first || size; }
    if (first) {
      msg.className = 'form-msg err';
      msg.textContent = first === email ? 'Enter a work email, like you@yourshop.com.' : 'Pick your team size.';
      first.focus();
      return;
    }
    var body = 'Hi Harper team,%0D%0A%0D%0APlease send a quote.%0D%0ATeam size: ' + encodeURIComponent(size.value) + '%0D%0AReply to: ' + encodeURIComponent(email.value.trim()) + '%0D%0A%0D%0AThanks';
    window.location.href = 'mailto:contact@harperhealthnetwork.com?subject=' + encodeURIComponent('Quote request, ' + size.value + ' employees') + '&body=' + body;
    msg.className = 'form-msg';
    msg.textContent = 'Your email app should open with the request filled in. Send it, and Harper replies with your quote.';
  });
})();
