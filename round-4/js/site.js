(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  // Nav: border once the page scrolls, and the mobile menu.
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var menu = document.querySelector('.menu');
  var links = document.getElementById('nav-links');
  var setMenu = function (open) {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    links.classList.toggle('is-open', open);
  };
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('is-open')) { setMenu(false); menu.focus(); }
  });

  // How it works: draw the line once the steps come into view.
  var steps = document.querySelector('.steps');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { steps.classList.add('is-in'); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(steps);
  } else {
    steps.classList.add('is-in');
  }

  // Quote form: check the fields, then open the visitor's email app with the request ready.
  var form = document.querySelector('.quote-form');
  var email = form.querySelector('#q-email');
  var size = form.querySelector('#q-size');
  var msg = form.querySelector('.form-msg');

  var setErr = function (field, text) {
    var out = document.getElementById(field.id + '-err');
    out.textContent = text;
    if (text) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', out.id);
    } else {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
  };

  email.addEventListener('input', function () { if (email.getAttribute('aria-invalid')) setErr(email, ''); });
  size.addEventListener('change', function () { if (size.value) setErr(size, ''); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    var v = email.value.trim();
    if (!v) { setErr(email, 'Enter your work email so Harper can send the price.'); ok = false; }
    else if (!email.checkValidity()) { setErr(email, 'This email looks incomplete. Check for an @ and a domain, like you@yourshop.com.'); ok = false; }
    else setErr(email, '');
    if (!size.value) { setErr(size, 'Pick your team size so the price fits your team.'); ok = false; }
    else setErr(size, '');
    if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }

    msg.textContent = 'This is a concept. On the live site, this button sends your request to Harper, and Harper emails you a price.';
  });
})();
