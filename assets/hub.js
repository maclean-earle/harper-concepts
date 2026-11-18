/* Harper concepts: a light sign-in check and a way back to the list of versions.
   This is a courtesy gate for a static site, not real security. */
(function () {
  var HOME = '/harper-concepts/';
  var KEY = 'hh-concepts-ok';
  var ok = false;
  try { ok = localStorage.getItem(KEY) === '1'; } catch (e) { ok = true; }
  if (!ok) { location.replace(HOME); return; }

  function addPill() {
    if (document.getElementById('hh-back')) return;
    var a = document.createElement('a');
    a.id = 'hh-back';
    a.href = HOME;
    a.textContent = 'All versions';
    a.setAttribute('aria-label', 'Back to all Harper website versions');
    a.style.cssText = [
      'all:initial', 'position:fixed', 'z-index:2147483000',
      'right:calc(16px + env(safe-area-inset-right, 0px))',
      'bottom:calc(16px + env(safe-area-inset-bottom, 0px))',
      'display:inline-flex', 'align-items:center', 'gap:8px',
      'padding:10px 16px 10px 12px', 'border-radius:999px',
      'background:#122749', 'color:#fff', 'cursor:pointer',
      'font:600 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif',
      'box-shadow:0 10px 24px -10px rgba(18,39,73,.55),0 0 0 1px rgba(255,255,255,.18)'
    ].join(';');
    a.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7fd6e3" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block"><path d="M15 6l-6 6 6 6"/></svg><span style="all:unset">All versions</span>';
    a.addEventListener('focus', function () { a.style.outline = '3px solid #7fd6e3'; a.style.outlineOffset = '3px'; });
    a.addEventListener('blur', function () { a.style.outline = 'none'; });
    document.body.appendChild(a);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addPill);
  else addPill();
})();
