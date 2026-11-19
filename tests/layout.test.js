// Layout checks for the "step simplifies itself" demo and the Helper button.
// Run with: npm test   (builds dist/ first). Optional: node tests/layout.test.js <file-url>
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');
const FILE = process.argv[2] || pathToFileURL(path.join(__dirname, '..', 'dist', 'adaptive-banking-prototype.html')).href;

(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 1500, height: 1000 } });
  await c.addInitScript(() => { try { localStorage.setItem('ab-pinned', '1'); } catch (e) { /* ignore */ } });
  const p = await c.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) errs.push('assert: ' + msg); };
  const PH = '#cust-phone ';
  const click = async s => { await p.locator(s).first().click({ force: true }); await p.waitForTimeout(250); };

  await p.goto(FILE);
  await click(PH + '[data-a="login"]');
  await p.waitForTimeout(4000);
  await click('[data-a="persona"][data-v="arjun"]');

  // Helper sits in the header, so no floating button covers the Home screen
  ok(await p.locator(PH + '.fab').count() === 0, 'no floating Helper button on Home');
  ok(await p.locator(PH + '.o-top [data-a="openHelper"]').count() === 1, 'Helper is in the Home header');

  // Wrong UEN twice: the step simplifies and the box stays visible above Next
  await click(PH + '.bottomnav [data-v="pay"]');
  await click(PH + '[data-a="payChooser"]');
  await click(PH + '[data-a="startTask"][data-v="uen"]');
  await p.fill(PH + '#f-uen', '5331234');
  await click(PH + '[data-a="flowNext"]');
  await click(PH + '[data-a="flowNext"]');
  await p.waitForTimeout(1500);
  const m = await p.evaluate(() => {
    const c = document.getElementById('content');
    const r = el => el ? el.getBoundingClientRect() : null;
    const banner = [...c.querySelectorAll('.banner')].find(x => /simpler/i.test(x.innerText));
    return { input: r(c.querySelector('#f-uen')), foot: r(c.querySelector('.footer-actions')), content: r(c), banner: r(banner) };
  });
  ok(!!m.banner, '"We made this step simpler" banner shown');
  ok(m.input && m.foot && m.input.bottom <= m.foot.top, 'UEN box is above the Next button, not under it');
  ok(m.banner && m.banner.bottom > m.content.top, 'banner is still on screen');

  console.log('ERRORS:', errs.length ? errs : 'none');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
