/* ==========================================================
   APP MODE
   The whole screen is the app. On a phone it fills the screen;
   on a tablet or computer the phone sits in the middle, sized to fit.
   The demo tools (personas, demo controls, behind the scenes and the
   other views) live in a drawer: the small button at the top left,
   Shift + D, or add ?tools to the address.
   ========================================================== */
(function () {
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  const qs = new URLSearchParams(location.search);
  G.ui = { tools: qs.has('tools') || location.hash === '#tools', pinned: store.get('ab-pinned') === '1' };
  const VIEWS = [
    ['app', 'Customer app', 'The banking app itself'],
    ['engine', 'Adaptive Engine', 'Change the inputs, watch a step rebuild'],
    ['four', 'One app, four experiences', 'Four customers side by side'],
    ['staff', 'Staff hand-off', 'What an officer sees before calling back'],
    ['dash', 'Bank insights', 'Outcomes, accessibility audit, dialect studio'],
    ['ml', 'Machine learning', 'Six models and the APIs they use']
  ];
  const SVG = (d, s) => '<svg aria-hidden="true" width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  const IC_TOOLS = SVG('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>');
  const IC_X = SVG('<path d="M6 6l12 12M18 6L6 18"/>');
  const IC_BACK = SVG('<path d="M15 18l-6-6 6-6"/>');

  const phoneMQ = window.matchMedia('(max-width: 600px), (max-height: 500px) and (pointer: coarse)');
  const isPhone = () => phoneMQ.matches;

  function fit() {
    const r = document.documentElement;
    if (isPhone() || G.view !== 'app') { r.style.setProperty('--fit', '1'); return; }
    const availH = window.innerHeight - (G.ui.pinned ? 120 : 40), availW = G.ui.pinned ? 440 : window.innerWidth - 32;
    r.style.setProperty('--fit', Math.max(0.5, Math.min(1, availH / 846, availW / 404)).toFixed(3));
  }

  function drawerHTML() {
    return '<div class="tl-head"><div><div class="tl-k">Demo tools</div><div class="tl-t">Adaptive Banking</div><div class="tl-s">Student concept prototype · OCBC Innovation Challenge PS4 · synthetic data · not an OCBC product</div></div>' +
      '<button class="tl-x" data-ui="close" aria-label="Close demo tools">' + IC_X + '</button></div>' +
      '<nav class="tl-views" aria-label="Prototype views">' + VIEWS.map(v => '<button data-a="view" data-v="' + v[0] + '" aria-current="' + (G.view === v[0] ? 'page' : 'false') + '"><b>' + v[1] + '</b><span>' + v[2] + '</span></button>').join('') + '</nav>' +
      (isPhone() ? '' : '<label class="tl-pin"><input type="checkbox" data-ui="pin"' + (G.ui.pinned ? ' checked' : '') + '> Show the panels beside the app (presenter layout)</label>') +
      '<div class="tl-tip">Shortcut: Shift + D opens and closes this drawer.</div>' +
      '<div class="tl-panels"></div>';
  }

  function decorate() {
    const app = document.getElementById('app'); if (!app) return;
    const b = document.body, phone = isPhone(), inApp = G.view === 'app', pinned = G.ui.pinned && !phone && inApp;
    b.classList.add('appmode');
    b.classList.toggle('is-phone', phone);
    b.classList.toggle('view-app', inApp);
    b.classList.toggle('tools-pinned', pinned);
    b.classList.toggle('presenter', G.ui.pinned && !phone);
    b.classList.toggle('tools-open', !!G.ui.tools);

    // Drawer with the views and, in app view, the demo panels moved into it
    const dr = document.createElement('aside');
    dr.id = 'tools'; dr.setAttribute('aria-label', 'Demo tools'); dr.setAttribute('aria-hidden', String(!G.ui.tools));
    if (!G.ui.tools) dr.setAttribute('inert', '');
    dr.innerHTML = drawerHTML();
    if (inApp && !pinned) {
      const host = dr.querySelector('.tl-panels');
      app.querySelectorAll('.stage > .side').forEach(s => host.appendChild(s));
    }
    const back = document.createElement('div'); back.className = 'tl-backdrop'; back.dataset.ui = 'close';
    const btn = document.createElement('button');
    btn.id = 'tools-btn'; btn.dataset.ui = 'toggle'; btn.setAttribute('aria-label', 'Demo tools'); btn.setAttribute('aria-expanded', String(!!G.ui.tools));
    btn.innerHTML = IC_TOOLS + '<span>Demo tools</span>';
    app.appendChild(back); app.appendChild(dr); app.appendChild(btn);

    // Other views: a slim bar to get back to the app
    if (!inApp && !(G.ui.pinned && !phone)) {
      const v = VIEWS.find(x => x[0] === G.view);
      const bar = document.createElement('div'); bar.className = 'tl-viewbar';
      bar.innerHTML = '<button data-a="view" data-v="app">' + IC_BACK + ' Back to the app</button><b>' + (v ? v[1] : '') + '</b>';
      app.insertBefore(bar, app.firstChild);
    }
    fit();
  }

  function setTools(open) {
    G.ui.tools = open;
    document.body.classList.toggle('tools-open', open);
    const dr = document.getElementById('tools'), btn = document.getElementById('tools-btn');
    if (dr) { dr.setAttribute('aria-hidden', String(!open)); if (open) dr.removeAttribute('inert'); else dr.setAttribute('inert', ''); }
    if (btn) btn.setAttribute('aria-expanded', String(open));
    if (open && dr) { const f = dr.querySelector('.tl-x'); if (f) f.focus(); }
    else if (btn) btn.focus({ preventScroll: true });
  }

  const _render = render;
  render = function () { _render(); decorate(); };

  document.addEventListener('click', e => {
    const u = e.target.closest('[data-ui]');
    if (u && u.dataset.ui !== 'pin') { e.preventDefault(); setTools(u.dataset.ui === 'toggle' ? !G.ui.tools : false); return; }
    // Picking a view closes the drawer; on a phone, so does picking a persona
    const a = e.target.closest('#tools [data-a]');
    if (a && (a.dataset.a === 'view' || (isPhone() && a.dataset.a === 'persona'))) G.ui.tools = false;
  }, true);
  document.addEventListener('change', e => {
    if (e.target.matches('[data-ui="pin"]')) { G.ui.pinned = e.target.checked; store.set('ab-pinned', G.ui.pinned ? '1' : '0'); G.ui.tools = false; render(); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && G.ui.tools) { setTools(false); return; }
    if (e.shiftKey && (e.key === 'D' || e.key === 'd') && !e.target.closest('input, textarea, select, [contenteditable]')) { e.preventDefault(); setTools(!G.ui.tools); }
  });
  window.addEventListener('resize', () => { const was = document.body.classList.contains('is-phone'); if (was !== isPhone()) render(); else fit(); });

  // Installable app and offline use when served from a web server
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && document.querySelector('link[rel="manifest"]')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { /* not critical */ }); });
  }
  render();
})();
