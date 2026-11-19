/* Build 4.2: Spotlight mode.
   A demo switch that outlines each feature our team added to the OCBC app and labels it, so judges can see what is new.
   It only adds outlines and labels after each render. It never changes what the app does. Turn it on in Demo controls or with Shift + S. */
(function () {
  G.spotlight = false;
  // [selector, label, optional function that picks the element to outline]
  const SPOTS = [
    ['[data-a="liveUndo"]', 'New: Live Adaptation', el => el.closest('.banner') || el.parentElement],
    ['[data-a="liveWhy"]', 'New: says why it changed'],
    ['.modebar', 'New: Visual / Text / Voice / Chat'],
    ['[data-a="ghost"]', 'New: Show me how'],
    ['[data-a="tellMore"]', 'New: help per task'],
    ['[data-a="showFull"]', 'New: help per task'],
    ['[data-a="payeeNo"]', "New: Check who you're paying", el => el.closest('.card') || el.parentElement],
    ['[data-a="nameNo"]', 'New: business name check', el => el.closest('.card') || el.parentElement],
    ['#pause-title', 'New: purpose-based safety check', el => el.closest('[role="dialog"]') || el.parentElement],
    ['[data-a="undoSend"]', 'New: Undo for transfers to people', el => el.closest('.card') || el],
    ['[data-new="copilot-pause"]', 'New: confirm on your own'],
    ['[data-a="openHelper"]', 'New: OCBC Helper'],
    ['[data-a="helpCode"]', 'New: help code'],
    ['[data-a="startPractice"]', 'New: Practice Hub'],
    ['[data-a="practiceToReal"]', 'New: practise, then do it for real'],
    ['[data-a="suggestWhy"]', 'New: "Why am I seeing this?"', el => el.closest('.card, .banner') || el],
    ['[data-a="speakText"]', 'New: Read aloud'],
    ['[data-a="voiceOpen"]', 'New: Say it'],
    ['.fy', 'New: "For you" payment'],
    ['.o-safe', 'New: Safe to spend'],
    ['[data-a="go"][data-v="adaptations"]', 'New: Your adaptations'],
    ['[data-a="go"][data-v="passport"]', 'New: Assistance Passport'],
    ['[data-a="go"][data-v="confidence"]', 'New: Confidence Map'],
    ['[data-a="go"][data-v="safety"]', 'New: cooling time, trusted contact'],
    ['[data-a="go"][data-v="copilotSetup"]', 'New: Family Co-pilot'],
    ['[data-a="setLang"]', 'New: Malay and Tamil', el => el.closest('.card') || el.parentElement],
    ['[data-a="setDialect"]', 'New: Dialect audio', el => el.closest('.card') || el.parentElement]
  ];
  function paint() {
    document.querySelectorAll('[data-spot]').forEach(el => { el.removeAttribute('data-spot'); el.classList.remove('spot-rel'); });
    document.body.classList.toggle('spotlight', !!G.spotlight);
    if (!G.spotlight) return;
    const root = document.getElementById('cust-phone') || document.querySelector('.phone') || document.body;
    SPOTS.forEach(([sel, label, pick]) => {
      root.querySelectorAll(sel).forEach(found => {
        const el = pick ? pick(found) : found;
        if (!el || el.hasAttribute('data-spot')) return;
        for (let up = el.parentElement; up; up = up.parentElement) if (up.dataset && up.dataset.spot === label) return;
        el.setAttribute('data-spot', label);
        if (getComputedStyle(el).position === 'static') el.classList.add('spot-rel');
      });
    });
  }
  const _render = render;
  render = function () { _render(); paint(); };
  A.spotlight = function () { G.spotlight = !G.spotlight; };
  document.addEventListener('keydown', e => {
    if (e.shiftKey && (e.key === 'S' || e.key === 's') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName)) { G.spotlight = !G.spotlight; render(); }
  });
})();
