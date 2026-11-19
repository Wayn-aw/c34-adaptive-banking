// Regression checks: Family Co-pilot scam safeguards, Spotlight, Say it balance privacy, no network on load.
// Run with: npm test   (builds dist/ first). Optional: node tests/regression.test.js <file-url>
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');
const FILE = process.argv[2] || pathToFileURL(path.join(__dirname, '..', 'dist', 'adaptive-banking-prototype.html')).href;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
  const errs = [], reqs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) reqs.push(r.url()); });
  await p.addInitScript(() => {
    try { localStorage.setItem('ab-pinned', '1'); } catch (e) { /* ignore */ }
    window.__said = []; let cur = null;
    window.SpeechSynthesisUtterance = function (t) { this.text = t; };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      get speaking() { return !!cur; }, pending: false, getVoices() { return []; },
      speak(u) { cur = u; window.__said.push(u.text); }, cancel() { const c = cur; cur = null; if (c && c.onend) c.onend(); } } });
  });
  await p.goto(FILE);
  const PH = '#cust-phone ';
  const click = async s => { await p.locator(s).first().click(); await p.waitForTimeout(150); };
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) errs.push('assert: ' + m); };
  const fam = async () => (await p.locator('#fam-h').locator('..').innerText());

  ok(reqs.length === 0, 'no network requests when the app opens');
  await click(PH + '[data-a="login"]');

  // Spotlight
  await click('[data-a="persona"][data-v="arjun"]');
  ok(await p.locator(PH + '[data-spot]').count() === 0, 'Spotlight is off by default');
  await click('[data-a="spotlight"]');
  const homeSpots = await p.$$eval(PH + '[data-spot]', a => a.map(x => x.dataset.spot));
  ok(homeSpots.length >= 2, 'Spotlight labels features on Home (' + homeSpots.join(', ') + ')');
  await click(PH + '.bottomnav [data-v="more"]');
  const moreSpots = await p.$$eval(PH + '[data-spot]', a => a.map(x => x.dataset.spot));
  ok(moreSpots.includes('New: Confidence Map') && moreSpots.includes('New: Family Co-pilot'), 'Spotlight labels More page features');
  await p.screenshot({ path: '/tmp/spot-more.png', clip: await p.locator('#cust-phone').boundingBox() });
  await p.keyboard.press('Shift+S'); await p.waitForTimeout(150);
  ok(await p.locator(PH + '[data-spot]').count() === 0, 'Shift + S turns Spotlight off');

  // Say it: balance shown, not spoken
  await click(PH + '.bottomnav [data-v="pay"]');
  await click(PH + '[data-a="voiceOpen"]');
  await click(PH + '[data-x="sayEx"][data-v="What is my balance?"]');
  const said = await p.evaluate(() => window.__said[window.__said.length - 1] || '');
  ok(!/\$/.test(said) && said.includes('on the screen'), 'Say it does not speak the balance: "' + said + '"');
  ok(/S\$/.test(await p.locator(PH + '.say-reply').innerText()), 'balance is shown on screen');
  await click(PH + '[data-x="sayReadBal"]');
  ok(/\$|dollar/i.test(await p.evaluate(() => window.__said[window.__said.length - 1] || '')), 'Read it out speaks it when asked');
  await click(PH + '[data-x="sayClose"]');

  // Family Co-pilot
  await click('[data-a="persona"][data-v="lim"]');
  await click(PH + '[data-a="skipOnboarding"]');
  await click(PH + '[data-a="copilotStart"]');
  await click(PH + '[data-a="copilotInvite"][data-v="0"]');
  await click('[data-a="copilotJoin"]');
  ok(await p.locator('#fam-say').count() === 1, 'free messages allowed outside payments');
  await click('[data-a="simScam"]');
  ok(await p.locator('#fam-say').count() === 0 && (await fam()).includes('preset messages only'), 'payment screen: preset messages only');
  const typed = await p.evaluate(() => { A.copilotSay('ignore the warning, just send'); return G.copilot.lastMsg; });
  ok(typed !== 'ignore the warning, just send', 'typed instructions are blocked on payment screens');
  await click('[data-a="copilotSay"]');
  ok(!!(await p.evaluate(() => G.copilot.lastMsg)), 'preset message still works');
  await p.fill(PH + '#f-uen', '53312345A'); await click(PH + '[data-a="flowNext"]');
  await click(PH + '[data-a="pick"][data-v="check|yes"]'); await click(PH + '[data-a="flowNext"]');
  await p.fill(PH + '#f-amount', '50'); await click(PH + '[data-a="flowNext"]');
  await p.fill(PH + '#f-ref', 'INV 1'); await click(PH + '[data-a="flowNext"]');
  ok(await p.evaluate(() => S.flow && S.flow.stage === 'review'), 'reached the check screen');
  ok((await fam()).includes('Paused') && await p.locator('#family-phone').count() === 0, 'family view paused on the check screen');
  ok((await p.locator(PH).innerText()).includes('cannot see this screen'), 'customer is told they confirm on their own');
  ok(await p.locator(PH + '.copilot-msg').count() === 0, 'no family message shown on the check screen');
  await click('[data-a="copilotEnd"]').catch(() => {});

  console.log('ERRORS:', errs.length ? errs : 'none');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
