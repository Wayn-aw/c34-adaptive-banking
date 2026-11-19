/* ==========================================================
   BUILD 4: realistic money, more machine learning, live APIs, voice
   - Realistic 60-day statements for each customer (synthetic, Singapore merchants)
   - Spending categoriser (Naive Bayes), safe-to-spend forecast (linear regression),
     recurring bill detection, next-action predictor (Naive Bayes on time context)
   - Say it: voice or typed payments in plain words, always ending on the check screen
   - One voice for the whole app, with a "Reading" bar and Stop
   - Live exchange rates (Frankfurter), nearest OCBC ATM (geolocation + OpenStreetMap),
     camera QR scanning (BarcodeDetector), share receipt (Web Share), haptics and chime
   All of it falls back gracefully offline.
   ========================================================== */
const DAY = 864e5;
const CAT = {
  food: { label: Q('Food & drinks', '餐饮', 'Makan & minum', 'உணவு'), color: '#eb6834', icon: 'plate' },
  groceries: { label: Q('Groceries', '杂货', 'Barang dapur', 'மளிகை'), color: '#1baf7a', icon: 'shop' },
  transport: { label: Q('Transport', '交通', 'Pengangkutan', 'போக்குவரத்து'), color: '#2a78d6', icon: 'plane' },
  bills: { label: Q('Bills', '账单', 'Bil', 'கட்டணங்கள்'), color: '#eda100', icon: 'bills' },
  shopping: { label: Q('Shopping', '购物', 'Membeli-belah', 'ஷாப்பிங்'), color: '#e87ba4', icon: 'gift' },
  health: { label: Q('Health', '健康', 'Kesihatan', 'உடல்நலம்'), color: '#008300', icon: 'heart' },
  people: { label: Q('Family & friends', '亲友', 'Keluarga & kawan', 'குடும்பம் & நண்பர்கள்'), color: '#6250d6', icon: 'users' },
  business: { label: Q('Business costs', '生意开销', 'Kos perniagaan', 'வணிகச் செலவு'), color: '#e34948', icon: 'bills' }
};
const CAT_ORDER = ['food', 'groceries', 'transport', 'bills', 'shopping', 'health', 'people', 'business'];

/* ---------- 1. Realistic statements ---------- */
// [description, category, min, max, how often] ; often: 'd' daily-ish, 'w' weekly, 'm:DD' monthly on that day, 'r' rare
const MERCH = {
  common: [
    ['NETS QR · Kopitiam, Toa Payoh Hub', 'food', 3.2, 7.5, 'd'], ['NETS QR · Ya Kun Kaya Toast', 'food', 4.6, 6.8, 'd'], ['Card · Toast Box, Raffles City', 'food', 5.2, 8.4, 'd'],
    ['NETS QR · Old Chang Kee', 'food', 2.4, 4.8, 'r'], ['Card · McDonald\'s, Bishan', 'food', 6.9, 12.5, 'r'],
    ['SimplyGo · Bus/MRT', 'transport', 1.09, 2.37, 'd'], ['Card · NTUC FairPrice, Bishan', 'groceries', 18, 76, 'w'], ['Card · Sheng Siong, Toa Payoh', 'groceries', 14, 58, 'w'],
    ['Card · Guardian, Junction 8', 'health', 6.5, 28, 'r'], ['Card · Watsons, Toa Payoh', 'health', 4.9, 22, 'r'], ['Card · Popular Bookstore', 'shopping', 4.5, 19, 'r'],
    ['GIRO · SP Group utilities', 'bills', 64, 98, 'm:22'], ['GIRO · Town Council S&CC', 'bills', 62.5, 62.5, 'm:15']
  ],
  lim: [['NETS QR · Hawker stall 01-23, Kampong Market', 'food', 3, 5, 'd'], ['Card · Polyclinic, Toa Payoh', 'health', 8, 15, 'r'], ['GIRO · Singtel mobile', 'bills', 28.9, 28.9, 'm:8']],
  arjun: [['GrabFood · Wingstop', 'food', 14, 26, 'r'], ['Grab · Ride', 'transport', 9, 18, 'r'], ['Shopee · Online order', 'shopping', 8, 45, 'r'], ['Card · Uniqlo, ION Orchard', 'shopping', 19.9, 59.9, 'r'],
    ['Card · Netflix', 'bills', 19.98, 19.98, 'm:12'], ['GIRO · Singtel mobile', 'bills', 40, 40, 'm:8']],
  nurul: [['Card · Phoon Huat baking supplies', 'business', 46, 160, 'w'], ['Ninja Van · Delivery', 'business', 6.5, 14, 'w'], ['Grab · Ride', 'transport', 9, 16, 'r'],
    ['GIRO · Rent, HDB shop unit', 'business', 2100, 2100, 'm:1'], ['GIRO · StarHub mobile', 'bills', 35, 35, 'm:8']],
  daniel: [['Grab · Ride', 'transport', 11, 24, 'd'], ['GrabFood · Saladstop!', 'food', 15, 24, 'd'], ['Card · Cold Storage, Great World', 'groceries', 40, 120, 'w'], ['Card · Zalora', 'shopping', 39, 129, 'r'],
    ['Card · Anytime Fitness', 'health', 98, 98, 'm:3'], ['GIRO · StarHub mobile', 'bills', 48, 48, 'm:8'], ['Card · Spotify', 'bills', 10.98, 10.98, 'm:18']]
};
const INCOME = {
  lim: [['CPF LIFE monthly payout', 1046, 1046, 'm:1'], ['PayNow from Mei Ling', 300, 300, 'm:5']],
  arjun: [['Salary · Lumen Labs Pte Ltd', 2850, 2850, 'm:28']],
  nurul: [['PayNow from customer', 18, 140, 'cust'], ['NETS settlement · Nurul\'s Kitchen', 210, 480, 'w']],
  daniel: [['Salary · Northbridge Capital', 6400, 6400, 'm:25']]
};
// People they pay, with the times they usually do it (this is what the next-action model learns)
const PAYPLAN = {
  lim: [[0, 'Groceries for Ma', 40, 80, [6], 18], [1, 'Kopi money', 10, 20, [2, 4], 10]],
  arjun: [[0, 'Dinner', 15, 30, [5], 20], [1, 'Utilities share', 45, 60, [0], 15]],
  nurul: [[0, 'Household', 100, 200, [1], 9], [1, 'Kuih order', 20, 45, [3, 6], 11]],
  daniel: [[0, 'Family expenses', 300, 500, [6], 11], [1, 'Lunch', 12, 22, [2, 4], 13]]
};
function fmtD(ts) {
  const d = new Date(ts), n = new Date();
  if (d.toDateString() === n.toDateString()) return 'Today';
  if (d.toDateString() === new Date(n - DAY).toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-SG', { day: '2-digit', month: 'short' });
}
function buildStatement(pid) {
  const r = ML.rng(pid.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0);
  const p = PERSONAS.find(x => x.id === pid) || PERSONAS[0];
  const out = [], now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const at = (dayOffset, h, m) => { const d = new Date(today - dayOffset * DAY); d.setHours(h, m, 0, 0); return d.getTime(); };
  const amt = (a, b) => Math.round((a + r() * (b - a)) * 20) / 20;
  const add = (ts, what, cat, a) => { if (ts <= Date.now()) out.push({ ts, d: fmtD(ts), what, cat, amt: Math.round(a * 100) / 100 }); };
  const list = MERCH.common.concat(MERCH[pid] || []);
  for (let off = 0; off < 62; off++) {
    const day = new Date(today - off * DAY), dow = day.getDay(), dom = day.getDate();
    list.forEach(([what, cat, a, b, often]) => {
      if (often === 'd' && r() < (pid === 'lim' ? 0.35 : 0.42)) add(at(off, 7 + Math.floor(r() * 12), Math.floor(r() * 60)), what, cat, -amt(a, b));
      else if (often === 'w' && dow === (what.length % 7) && r() < 0.85) add(at(off, 10 + Math.floor(r() * 9), Math.floor(r() * 60)), what, cat, -amt(a, b));
      else if (often === 'r' && r() < 0.06) add(at(off, 11 + Math.floor(r() * 10), Math.floor(r() * 60)), what, cat, -amt(a, b));
      else if (often.startsWith('m:') && dom === Number(often.slice(2))) add(at(off, 6, 5), what, cat, -amt(a, b));
    });
    (INCOME[pid] || []).forEach(([what, a, b, often]) => {
      if (often.startsWith('m:') && dom === Number(often.slice(2))) add(at(off, 8, 30), what, 'income', amt(a, b));
      else if (often === 'w' && dow === 1) add(at(off, 9, 10), what, 'income', amt(a, b));
      else if (often === 'cust') { const n = Math.floor(r() * 4); for (let i = 0; i < n; i++) add(at(off, 9 + Math.floor(r() * 10), Math.floor(r() * 60)), what, 'income', amt(a, b)); }
    });
    (PAYPLAN[pid] || []).forEach(([ci, note, a, b, days, hour]) => {
      const c = p.contacts[ci]; if (!c) return;
      if ((days.includes(dow) && r() < 0.8) || r() < 0.035) add(at(off, hour + Math.floor(r() * 3), Math.floor(r() * 60)), 'PayNow to ' + c.name.split(' (')[0] + ' · ' + note, 'people', -amt(a, b));
    });
  }
  return out.sort((a, b) => b.ts - a.ts);
}

/* ---------- 2. Spending categoriser: Naive Bayes on the description ---------- */
const CAT_ML = (function () {
  // Words plus 4-letter pieces of words, so a new shop like "Koufu food court" still shares pieces with known ones
  const tok = s => { const w = String(s).toLowerCase().replace(/[^a-z0-9&' ]/g, ' ').split(/\s+/).filter(x => x.length > 1 && !/^\d+$/.test(x) && !['card', 'sg', 'singapore', 'apple', 'pay', 'grabpay'].includes(x)); const g = []; w.forEach(x => { const y = '_' + x + '_'; for (let i = 0; i + 4 <= y.length; i++) g.push('#' + y.slice(i, i + 4)); }); return w.concat(g); };
  const rows = [];
  const r = ML.rng(99);
  const all = Object.keys(MERCH).flatMap(k => MERCH[k]).concat([
    ['PayNow to Ah Seng', 'people'], ['PayNow to Mum', 'people'], ['PayNow to Wei Ming', 'people'], ['NETS QR · Mixed rice stall', 'food'], ['NETS QR · Fishball noodles', 'food'], ['Card · Starbucks', 'food'], ['Card · Giant, Tampines', 'groceries'], ['Card · Don Don Donki', 'groceries'],
    ['Card · Unity pharmacy', 'health'], ['Card · Raffles Medical', 'health'], ['Card · Courts', 'shopping'], ['Lazada · Online order', 'shopping'], ['Card · IKEA Tampines', 'shopping'], ['GIRO · M1 mobile', 'bills'], ['GIRO · PUB water', 'bills'], ['Card · Disney+', 'bills'],
    ['Gojek · Ride', 'transport'], ['NETS QR · Chicken rice stall', 'food'], ['Card · Din Tai Fung', 'food'], ['NETS QR · Kopi stall', 'food'], ['Card · Subway', 'food'], ['Card · KFC', 'food'], ['GrabFood · Thai Express', 'food'], ['foodpanda · Order', 'food'], ['Card · Koufu food court', 'food'], ['Card · Bakery Cuisine', 'food'], ['Card · Mr Bean', 'food'],
    ['Card · NTUC FairPrice Finest', 'groceries'], ['Card · Prime Supermarket', 'groceries'], ['Card · Cold Storage', 'groceries'], ['RedMart · Order', 'groceries'], ['Card · Market fruit stall', 'groceries'],
    ['SimplyGo · MRT', 'transport'], ['Card · Taxi fare', 'transport'], ['TADA · Ride', 'transport'], ['Card · EZ-Link top-up', 'transport'], ['Card · Esso petrol', 'transport'], ['Card · Car park charges', 'transport'],
    ['GIRO · Insurance premium', 'bills'], ['GIRO · Internet broadband', 'bills'], ['Card · YouTube Premium', 'bills'], ['GIRO · Gas bill City Energy', 'bills'], ['GIRO · Conservancy charges', 'bills'],
    ['Card · Decathlon', 'shopping'], ['Card · H&M', 'shopping'], ['Card · Daiso', 'shopping'], ['Amazon · Online order', 'shopping'], ['Card · Challenger electronics', 'shopping'], ['Card · Mustafa Centre', 'shopping'],
    ['Card · Clinic consultation', 'health'], ['Card · Dental clinic', 'health'], ['Card · Optical shop', 'health'], ['Card · Pharmacy', 'health'], ['Card · ActiveSG gym', 'health'],
    ['PayNow to Siew Lan', 'people'], ['PayNow to Rahman', 'people'], ['PayNow to Kumar', 'people'], ['Card · Packaging supplies wholesale', 'business'], ['GIRO · Business licence fee', 'business'], ['Card · Bulk flour supplier', 'business'], ['Card · Commercial kitchen equipment', 'business'], ['Card · ComfortDelGro taxi', 'transport'], ['Card · Shell petrol', 'transport'], ['Card · Kaiser supplies wholesale', 'business'], ['GIRO · Shop rent', 'business'], ['Lalamove · Delivery', 'business']
  ]);
  const pre = ['', 'Card · ', 'NETS QR · ', 'GrabPay · ', 'Apple Pay · '], suf = ['', ' SG', ' #01-12', ' Singapore', ' 0045'];
  all.forEach(([d, c]) => { for (let i = 0; i < 8; i++) rows.push([c, pre[Math.floor(r() * pre.length)] + d.replace(/^(Card|NETS QR|GIRO|GrabFood|Grab|Shopee|SimplyGo|Lazada|Gojek|Lalamove|Ninja Van) · /, (m, a) => r() < 0.6 ? m : '') + suf[Math.floor(r() * suf.length)], d]); });
  // Test on merchants the model has never seen (every 5th merchant is held out), so the score shows real generalisation
  const held = new Set(all.filter((_, i) => i % 5 === 2).map(x => x[0]));
  const train = rows.filter(x => !held.has(x[2])), test = rows.filter(x => held.has(x[2]));
  function fit(data) {
    const cnt = {}, tot = {}, nd = {}, V = new Set();
    data.forEach(([c, s]) => { nd[c] = (nd[c] || 0) + 1; cnt[c] = cnt[c] || {}; new Set(tok(s)).forEach(w => { cnt[c][w] = (cnt[c][w] || 0) + 1; tot[c] = (tot[c] || 0) + 1; V.add(w); }); });
    return { cnt, tot, nd, V: V.size, N: data.length };
  }
  function predict(m, s) {
    const ws = [...new Set(tok(s))];
    let best = null, bs = -Infinity; const scores = {};
    Object.keys(m.nd).forEach(c => { let z = Math.log(m.nd[c] / m.N); ws.forEach(w => { z += Math.log(((m.cnt[c][w] || 0) + 1) / ((m.tot[c] || 0) + m.V)); }); scores[c] = z; if (z > bs) { bs = z; best = c; } });
    const mx = Math.max(...Object.values(scores)), sum = Object.values(scores).reduce((a, z) => a + Math.exp(z - mx), 0);
    return { cat: best, p: 1 / sum };
  }
  const m0 = fit(train); let ok = 0;
  test.forEach(([c, s]) => { if (predict(m0, s).cat === c) ok++; });
  const rs = rows.filter((_, i) => i % 5 !== 0), rt = rows.filter((_, i) => i % 5 === 0), m1 = fit(rs); let ok2 = 0; rt.forEach(([c, s2]) => { if (predict(m1, s2).cat === c) ok2++; });
  const model = fit(rows);
  return { accKnown: ok2 / rt.length, predict: s => /^paynow to|^paynow from/i.test(s) ? { cat: 'people', p: 1 } : predict(model, s), acc: ok / test.length, nTrain: train.length, nTest: test.length, nHeld: held.size, cats: Object.keys(model.nd).length };
})();

/* ---------- 3. Money analysis: categories, recurring bills, forecast ---------- */
function moneyNow() {
  const tx = (S.txns || []).map(x => x.ts ? x : Object.assign({}, x, { ts: Date.now() }));
  const now = new Date(), m0 = new Date(now.getFullYear(), now.getMonth(), 1).getTime(), m1 = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  const dayOfMonth = now.getDate(), lastSame = new Date(now.getFullYear(), now.getMonth() - 1, dayOfMonth, 23, 59).getTime();
  const spend = tx.filter(x => x.amt < 0 && !/money lock/i.test(x.what));
  const catOf = x => x.mlcat || (x.mlcat = CAT_ML.predict(x.what).cat);
  const sumBy = arr => { const o = {}; arr.forEach(x => { const c = catOf(x); o[c] = (o[c] || 0) - x.amt; }); return o; };
  const thisM = sumBy(spend.filter(x => x.ts >= m0)), lastM = sumBy(spend.filter(x => x.ts >= m1 && x.ts <= lastSame));
  const totalThis = Object.values(thisM).reduce((a, b) => a + b, 0), totalLast = Object.values(lastM).reduce((a, b) => a + b, 0);
  const inThis = tx.filter(x => x.amt > 0 && x.ts >= m0).reduce((a, b) => a + b.amt, 0);
  // Recurring detection: same description (without amounts) in at least 2 different months, similar day of month
  const groups = {};
  tx.forEach(x => { const k = x.what.replace(/\s·\s(Dinner|Lunch|.*share|Groceries.*|Kopi money|Household|Kuih order|Family expenses)$/, ''); (groups[k] = groups[k] || []).push(x); });
  const recurring = [];
  Object.keys(groups).forEach(k => {
    const g = groups[k].slice().sort((a, b) => a.ts - b.ts), months = new Set(g.map(x => new Date(x.ts).getMonth()));
    if (g.length < 2 || g.length > 3 || months.size < 2) return;
    const doms = g.map(x => new Date(x.ts).getDate()), spread = Math.max(...doms) - Math.min(...doms);
    const am = g.map(x => Math.abs(x.amt));
    if (spread > 3 || Math.min(...am) < 9 || Math.max(...am) / Math.min(...am) > 1.6) return;
    const last = g[g.length - 1], next = new Date(last.ts); next.setMonth(next.getMonth() + 1);
    const avg = g.reduce((a, b) => a + b.amt, 0) / g.length;
    recurring.push({ what: k.replace(/^(GIRO|Card) · /, ''), amt: avg, next: next.getTime(), income: avg > 0, cat: avg > 0 ? 'income' : catOf(last) });
  });
  recurring.sort((a, b) => a.next - b.next);
  const payday = recurring.filter(x => x.income && x.amt > 500).map(x => x.next).sort((a, b) => a - b)[0] || new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
  const bills = recurring.filter(x => !x.income && x.next > Date.now() && x.next <= payday);
  const billsSum = bills.reduce((a, b) => a - b.amt, 0);
  // Forecast: linear regression on cumulative everyday spending over the last 30 days
  const billKeys = new Set(recurring.map(x => x.what));
  const daily = new Array(30).fill(0);
  spend.forEach(x => { const d = Math.floor((Date.now() - x.ts) / DAY); if (d < 30 && !billKeys.has(x.what.replace(/^(GIRO|Card) · /, '')) && !/rent/i.test(x.what)) daily[29 - d] -= x.amt; });
  const cum = []; winsor(daily).reduce((a, v, i) => (cum[i] = a + v), 0);
  const reg = linReg(cum.map((_, i) => i), cum);
  const daysLeft = Math.max(1, Math.ceil((payday - Date.now()) / DAY));
  const forecast = Math.max(0, reg.slope) * daysLeft;
  const safe = S.balance - billsSum - forecast;
  return { thisM, lastM, totalThis, totalLast, inThis, recurring, bills, billsSum, payday, daysLeft, forecast, perDay: reg.slope, safe, safePerDay: safe / daysLeft, reg, catOf };
}
function winsor(arr) { const s2 = arr.slice().sort((a, b) => a - b), cap = s2[Math.floor(s2.length * 0.9)] || 0; return arr.map(v => Math.min(v, cap)); }
function recurringKeys(tx) {
  const g = {}; tx.forEach(x => { const k = x.what.replace(/^PayNow to ([^·]+) · .*/, 'PayNow to $1'); (g[k] = g[k] || []).push(x); });
  return new Set(Object.keys(g).filter(k => { const a = g[k]; if (a.length < 2 || a.length > 3) return false; const d = a.map(x => new Date(x.ts).getDate()), am = a.map(x => Math.abs(x.amt)); return Math.max(...d) - Math.min(...d) <= 3 && Math.min(...am) >= 9 && Math.max(...am) / Math.min(...am) <= 1.6 && new Set(a.map(x => new Date(x.ts).getMonth())).size >= 2; }));
}
function linReg(x, y) {
  const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0; x.forEach((v, i) => { sxy += (v - mx) * (y[i] - my); sxx += (v - mx) ** 2; });
  const slope = sxx ? sxy / sxx : 0, icpt = my - slope * mx;
  const ssr = y.reduce((a, v, i) => a + (v - (icpt + slope * x[i])) ** 2, 0), sst = y.reduce((a, v) => a + (v - my) ** 2, 0);
  return { slope, icpt, r2: sst ? 1 - ssr / sst : 1 };
}
// Backtest for the ML tab: train on 23 days, predict the next 7
function forecastBacktest() {
  const res = [];
  PERSONAS.forEach(p => {
    const all = buildStatement(p.id), rk = recurringKeys(all);
    const tx = all.filter(x => x.amt < 0 && !/GIRO|rent/i.test(x.what) && !rk.has(x.what));
    const daily = new Array(30).fill(0);
    tx.forEach(x => { const d = Math.floor((Date.now() - x.ts) / DAY); if (d < 30) daily[29 - d] -= x.amt; });
    const train = winsor(daily.slice(0, 23)), cum = []; train.reduce((a, v, i) => (cum[i] = a + v), 0);
    const reg = linReg([...Array(23).keys()], cum);
    const pred = reg.slope * 7, actual = daily.slice(23).reduce((a, b) => a + b, 0);
    res.push({ who: p.short, pred, actual, err: Math.abs(pred - actual) / Math.max(1, actual) });
  });
  return res;
}

/* ---------- 4. Next-action predictor: Naive Bayes on when the customer usually does what ---------- */
function ctxOf(ts) { const d = new Date(ts), h = d.getHours(); return { wk: [0, 6].includes(d.getDay()) ? 'weekend' : 'weekday', dow: String(d.getDay()), part: h < 11 ? 'morning' : h < 15 ? 'midday' : h < 19 ? 'afternoon' : 'evening' }; }
function actionOf(x) { return /^PayNow to /.test(x.what) ? 'pay:' + x.what.slice(10).split(' · ')[0] : null; }
function trainNext(tx) {
  const ev = tx.filter(x => x.ts).map(x => { const c = ctxOf(x.ts); return { a: actionOf(x), c: { dow: c.dow, part: c.part }, amt: -x.amt, ts: x.ts }; }).filter(e => e.a).sort((a, b) => a.ts - b.ts);
  const fit = data => {
    const n = {}, f = {}; data.forEach(e => { n[e.a] = (n[e.a] || 0) + 1; f[e.a] = f[e.a] || {}; Object.entries(e.c).forEach(([k, v]) => { f[e.a][k + v] = (f[e.a][k + v] || 0) + 1; }); });
    return { n, f, N: data.length };
  };
  const rank = (m, c) => Object.keys(m.n).map(a => { let z = Math.log(m.n[a] / m.N); Object.entries(c).forEach(([k, v]) => { z += Math.log(((m.f[a][k + v] || 0) + 1) / (m.n[a] + (k === 'dow' ? 7 : 4))); }); return { a, z }; }).sort((x, y) => y.z - x.z);
  const cut = Math.floor(ev.length * 0.75), m0 = fit(ev.slice(0, cut));
  let top1 = 0, base = 0; const test = ev.slice(cut);
  const mostCommon = Object.entries(m0.n).sort((a, b) => b[1] - a[1])[0];
  test.forEach(e => { if (rank(m0, e.c)[0].a === e.a) top1++; if (mostCommon && mostCommon[0] === e.a) base++; });
  const m = fit(ev);
  return { m, rank: c => rank(m, c), acc: test.length ? top1 / test.length : 0, base: test.length ? base / test.length : 0, n: ev.length, ev };
}
const DOWN = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
function nextAction() {
  if (!S.txns || !S.txns.some(x => x.ts)) return null;
  if (!G.nx || G.nx.pid !== S.personaId) G.nx = Object.assign(trainNext(S.txns), { pid: S.personaId });
  if (!G.nx.n) return null;
  const c0 = ctxOf(Date.now()), ranked = G.nx.rank({ dow: c0.dow, part: c0.part }).filter(x => !(G.nxSkip || {})[S.personaId + x.a]);
  const top = ranked[0]; if (!top) return null;
  const past = G.nx.ev.filter(e => e.a === top.a);
  const amts = past.map(e => e.amt).sort((a, b) => a - b), med0 = amts[Math.floor(amts.length / 2)] || 0, median = med0 >= 100 ? Math.round(med0 / 10) * 10 : med0;
  const cnt = k => { const o = {}; past.forEach(e => { o[e.c[k]] = (o[e.c[k]] || 0) + 1; }); return Object.entries(o).sort((a, b) => b[1] - a[1]); };
  const days = cnt('dow').filter(x => x[1] >= 2).map(x => Number(x[0])), part = (cnt('part')[0] || [])[0];
  const today = new Date().getDay(), soon = days.map(d => (d - today + 7) % 7).sort((a, b) => a - b)[0];
  return { a: top.a, part, days, today: soon === 0, inDays: soon, amt: Math.round(median), n: past.length };
}

/* ---------- 5. One voice for the whole app ---------- */
const VOICE = { cache: {}, on: false, text: '' };
function abVoice(lang) {
  if (!('speechSynthesis' in window) || !lang) return null;
  if (VOICE.cache[lang] !== undefined) return VOICE.cache[lang];
  const vs = speechSynthesis.getVoices(); if (!vs.length) return null;
  const base = lang.split('-')[0].toLowerCase();
  const score = v => { const l = (v.lang || '').replace('_', '-').toLowerCase(); let s = 0; if (l === lang.toLowerCase()) s += 50; else if (l.startsWith(base)) s += 30; else return -1; if (/natural|neural|premium|enhanced/i.test(v.name)) s += 20; if (/google|microsoft/i.test(v.name)) s += 10; if (/en-(sg|gb)/.test(l) && base === 'en') s += 5; if (v.localService) s += 2; return s; };
  const best = vs.map(v => ({ v, s: score(v) })).filter(x => x.s >= 0).sort((a, b) => b.s - a.s)[0];
  return (VOICE.cache[lang] = best ? best.v : null);
}
try { speechSynthesis.onvoiceschanged = () => { VOICE.cache = {}; }; } catch (e) { /* no speech */ }
function voicePill() {
  return VOICE.on ? '<div class="vpill" role="status" aria-live="polite"><span class="vbars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="vtxt">' + esc(VOICE.text) + '</span><button class="vstop" data-x="voiceStop" aria-label="Stop reading">' + '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" rx="2" fill="currentColor"/></svg> Stop</button></div>' : '';
}
function paintVoice() {
  const sc = document.querySelector('#cust-phone .screen'); if (!sc) return;
  let el = sc.querySelector('.vpill-host'); if (!el) { el = document.createElement('div'); el.className = 'vpill-host'; sc.appendChild(el); }
  el.innerHTML = voicePill();
}
(function () {
  const _speak = speak;
  speak = function (text, key) {
    const ok = _speak(text, key);
    if (ok) { VOICE.on = true; VOICE.text = String(text).replace(/<[^>]+>/g, '').slice(0, 60) + (String(text).length > 60 ? '…' : ''); paintVoice(); }
    return ok;
  };
  const _stop = stopSpeak;
  stopSpeak = function () { _stop(); if (VOICE.on) { VOICE.on = false; paintVoice(); } };
  setInterval(() => { if (VOICE.on && !(window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending))) { VOICE.on = false; paintVoice(); } }, 500);
})();

/* ---------- 6. Feedback: haptics and a soft chime ---------- */
function feedback(kind) {
  try { if (navigator.vibrate) navigator.vibrate(kind === 'ok' ? [18, 40, 18] : 30); } catch (e) { /* ignore */ }
  if (S.settings.reduceMotion || kind !== 'ok') return;
  try {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    const ac = G.ac || (G.ac = new C()), t0 = ac.currentTime;
    [[880, 0], [1318.5, 0.09]].forEach(([f, d]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(0.06, t0 + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.35); o.connect(g).connect(ac.destination); o.start(t0 + d); o.stop(t0 + d + 0.4); });
  } catch (e) { /* ignore */ }
}

/* ---------- 7. Live exchange rates (Frankfurter, European Central Bank reference rates) ---------- */
G.fx = { live: false, date: '', sample: Object.fromEntries(COUNTRIES.map(c => [c.cur, c.rate])) };
function loadFx() {
  if (!window.fetch) return;
  fetch('https://api.frankfurter.dev/v1/latest?base=SGD&symbols=' + COUNTRIES.map(c => c.cur).join(','))
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(j => { if (!j || !j.rates) return; COUNTRIES.forEach(c => { if (j.rates[c.cur]) c.rate = j.rates[c.cur]; }); G.fx.live = true; G.fx.date = j.date; addLog('Live exchange rates loaded', 'From Frankfurter (European Central Bank reference rates), ' + j.date + '.', 'engine'); render(); })
    .catch(() => { /* offline: keep sample rates */ });
}
function fxNote() {
  // Build 4.2: rates are only fetched when an overseas transfer needs them, so the app makes no network requests until then
  if (!G.fx.tried) { G.fx.tried = true; loadFx(); }
  const c = COUNTRIES.find(x => x.code === (S.flow && S.flow.data.country)) || COUNTRIES[0];
  return '<div class="fx-chip ' + (G.fx.live ? 'live' : '') + '"><span class="dot" aria-hidden="true"></span>' + (G.fx.live ? 'Market reference rate, not OCBC\'s rate · 1 SGD = ' + c.rate.toLocaleString('en-SG', { maximumFractionDigits: 4 }) + ' ' + c.cur + ' · ' + esc(G.fx.date) : 'Sample rate · goes live when you are online') + '</div>';
}

/* ---------- 8. Nearest OCBC ATM (Geolocation + OpenStreetMap Overpass) ---------- */
const ATM_SAMPLE = [
  { name: 'OCBC Centre', addr: '65 Chulia Street', lat: 1.2857, lon: 103.8495 },
  { name: 'OCBC ATM · Toa Payoh Central', addr: 'Toa Payoh HDB Hub', lat: 1.3326, lon: 103.8478 },
  { name: 'OCBC ATM · Bishan', addr: 'Junction 8', lat: 1.3505, lon: 103.8486 },
  { name: 'OCBC ATM · Tampines', addr: 'Tampines Central', lat: 1.3530, lon: 103.9447 },
  { name: 'OCBC ATM · Jurong East', addr: 'Jurong Gateway', lat: 1.3331, lon: 103.7423 }
];
function km(a, b, c, d) { const R = 6371, r = Math.PI / 180, x = (c - a) * r, y = (d - b) * r, h = Math.sin(x / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(y / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); }
function atmFind() {
  G.atm = { state: 'locating', list: null };
  render();
  const done = (lat, lon, live) => { G.atm.here = { lat, lon }; if (live) atmOverpass(lat, lon); else { G.atm.state = 'sample'; G.atm.list = atmSort(ATM_SAMPLE, lat, lon); render(); } };
  if (!navigator.geolocation) return done(1.3326, 103.8478, false);
  navigator.geolocation.getCurrentPosition(p => done(p.coords.latitude, p.coords.longitude, true), () => done(1.3326, 103.8478, false), { timeout: 8000, maximumAge: 300000 });
}
function atmSort(list, lat, lon) { return list.map(a => Object.assign({}, a, { km: km(lat, lon, a.lat, a.lon) })).sort((a, b) => a.km - b.km).slice(0, 5); }
function atmOverpass(lat, lon) {
  G.atm.state = 'searching'; render();
  const a = '(around:2500,' + lat + ',' + lon + ')';
  const q = '[out:json][timeout:15];(nwr["amenity"="atm"]["operator"~"OCBC",i]' + a + ';nwr["amenity"="atm"]["brand"~"OCBC",i]' + a + ';nwr["amenity"="bank"]["name"~"OCBC",i]' + a + ';);out center 30;';
  fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(j => {
      const list = (j.elements || []).map(e => ({ name: (e.tags && (e.tags.name || e.tags.brand)) || 'OCBC ATM', addr: e.tags ? [e.tags['addr:housenumber'], e.tags['addr:street']].filter(Boolean).join(' ') || (e.tags.amenity === 'bank' ? 'Branch' : '') : '', lat: e.lat || (e.center && e.center.lat), lon: e.lon || (e.center && e.center.lon) })).filter(x => x.lat);
      G.atm.state = list.length ? 'live' : 'sample'; G.atm.list = atmSort(list.length ? list : ATM_SAMPLE, lat, lon); render();
    })
    .catch(() => { G.atm.state = 'sample'; G.atm.list = atmSort(ATM_SAMPLE, lat, lon); render(); });
}
function viewAtms() {
  const a = G.atm || { state: 'idle' };
  let h = header(tx(Q('Nearest OCBC ATM', '最近的 OCBC 提款机', 'ATM OCBC terdekat', 'அருகிலுள்ள OCBC ATM'))) + '<div class="pad">';
  if (S.locked) h += '<div class="atm-hero">' + ic('lock', 22) + '<div><b>' + money(S.locked) + '</b> ' + esc(tx(Q('is locked. Unlock it at any OCBC ATM with your card and PIN.', '已锁住。请在任何 OCBC 提款机用卡和密码解锁。', 'dikunci. Buka di mana-mana ATM OCBC dengan kad dan PIN.', 'பூட்டப்பட்டுள்ளது. எந்த OCBC ATM-இலும் அட்டை மற்றும் PIN மூலம் திறக்கலாம்.'))) + '</div></div>';
  if (a.state === 'idle') h += '<button class="btn dark block" data-x="atmFind">' + ic('pin', 18) + ' ' + esc(tx(Q('Use my location', '使用我的位置', 'Guna lokasi saya', 'என் இருப்பிடத்தைப் பயன்படுத்து'))) + '</button>';
  else if (a.state === 'locating' || a.state === 'searching') h += '<div class="skel"></div><div class="skel"></div><div class="skel"></div>';
  else {
    h += '<div class="small muted" style="margin:0 0 8px">' + (a.state === 'live' ? 'From OpenStreetMap, near you. Map data may be incomplete; check ocbc.com for the full list' : 'Sample locations (offline or location off)') + '</div><div class="list">' +
      a.list.map(x => '<a class="atm-row" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + x.lat + ',' + x.lon + '"><span class="ic">' + ic('pin', 20) + '</span><span class="grow"><span class="t1">' + esc(x.name) + '</span><br><span class="t2">' + esc(x.addr) + '</span></span><span class="atm-km">' + (x.km < 1 ? Math.round(x.km * 1000) + ' m' : x.km.toFixed(1) + ' km') + '</span></a>').join('') + '</div>' +
      '<button class="linkbtn" style="margin-top:10px" data-x="atmFind">' + esc(tx(Q('Search again', '再找一次', 'Cari lagi', 'மீண்டும் தேடு'))) + '</button>';
  }
  return h + '</div>';
}

/* ---------- 9. Money insights screen ---------- */
function moneyNum(v) { return S.hideBal ? 'S$ ••••' : money(v); }
function donut(parts, total) {
  const R = 54, C = 2 * Math.PI * R; let off = 0;
  const segs = parts.map(p => { const len = Math.max(0, p.v / total * C - 2); const s = '<circle r="' + R + '" cx="70" cy="70" fill="none" stroke="' + p.color + '" stroke-width="18" stroke-dasharray="' + len + ' ' + (C - len) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 70 70)"><title>' + esc(p.label) + ': ' + money(p.v) + '</title></circle>'; off += p.v / total * C; return s; }).join('');
  return '<svg class="donut" viewBox="0 0 140 140" role="img" aria-label="Spending by category">' + segs + '<text x="70" y="66" text-anchor="middle" class="dn-l">' + esc(tx(Q('This month', '本月', 'Bulan ini', 'இந்த மாதம்'))) + '</text><text x="70" y="86" text-anchor="middle" class="dn-v">' + (S.hideBal ? '••••' : 'S$' + Math.round(total).toLocaleString('en-SG')) + '</text></svg>';
}
function insightLine(M) {
  const lang = S.settings.lang;
  const d = new Date(M.payday).toLocaleDateString('en-SG', { day: 'numeric', month: 'long' });
  const top = CAT_ORDER.filter(c => M.thisM[c]).sort((a, b) => M.thisM[b] - M.thisM[a])[0];
  if (lang === 'zh') return '到' + d + '之前，您可以安心花 ' + money(Math.max(0, M.safe)) + '。本月花最多的是' + tx(CAT[top].label) + '，共 ' + money(M.thisM[top]) + '。';
  if (lang === 'ms') return 'Anda boleh belanja ' + money(Math.max(0, M.safe)) + ' dengan selamat sehingga ' + d + '. Perbelanjaan terbesar bulan ini: ' + tx(CAT[top].label) + ', ' + money(M.thisM[top]) + '.';
  if (lang === 'ta') return d + ' வரை நீங்கள் பாதுகாப்பாகச் செலவிடக்கூடியது ' + money(Math.max(0, M.safe)) + '. இந்த மாதம் அதிகச் செலவு: ' + tx(CAT[top].label) + ', ' + money(M.thisM[top]) + '.';
  return 'You can safely spend ' + money(Math.max(0, M.safe)) + ' until ' + d + ', about ' + money(Math.max(0, M.safePerDay)) + ' a day. Your biggest spend this month is ' + tx(CAT[top].label).toLowerCase() + ', ' + money(M.thisM[top]) + '.';
}
function viewInsights() {
  const M = moneyNow(), simple = S.settings.simple || S.passport.simple;
  const d = new Date(M.payday).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
  const safe = Math.max(0, M.safe), tot = Math.max(1, S.balance);
  const parts = CAT_ORDER.filter(c => M.thisM[c] > 0).map(c => ({ c, v: M.thisM[c], label: tx(CAT[c].label), color: CAT[c].color })).sort((a, b) => b.v - a.v);
  let h = header(tx(Q('Money insights', '理财洞察', 'Wawasan wang', 'பண நுண்ணறிவு')), { right: '<button class="iconbtn" data-a="speakText" data-v="' + esc(insightLine(M)) + '" aria-label="Listen">' + ic('speaker') + '</button>' }) + '<div class="pad">';
  h += '<div class="ins-hero"><div class="ins-k">' + esc(tx(Q('Safe to spend until', '可安心花到', 'Selamat dibelanja sehingga', 'பாதுகாப்பாகச் செலவிடலாம்'))) + ' ' + esc(d) + '</div><div class="ins-v sensitive">' + moneyNum(safe) + '</div>' +
    '<div class="ins-sub">' + (S.hideBal ? '' : '≈ ' + money(Math.max(0, M.safePerDay)) + ' ' + esc(tx(Q('a day', '每天', 'sehari', 'ஒரு நாளைக்கு'))) + ' · ' + M.daysLeft + ' ' + esc(tx(Q('days to payday', '天到发薪日', 'hari ke gaji', 'நாட்கள் சம்பளம் வரை')))) + '</div>' +
    '<div class="ins-bar" aria-hidden="true"><span style="width:' + Math.min(100, M.billsSum / tot * 100) + '%;background:#eda100"></span><span style="width:' + Math.min(100, M.forecast / tot * 100) + '%;background:#b9bcc4"></span><span style="flex:1;background:#1baf7a"></span></div>' +
    '<div class="ins-leg"><span><i style="background:#eda100"></i>' + esc(tx(Q('Bills due', '待付账单', 'Bil perlu dibayar', 'நிலுவைக் கட்டணம்'))) + ' ' + moneyNum(M.billsSum) + '</span><span><i style="background:#b9bcc4"></i>' + esc(tx(Q('Everyday spend', '日常开销', 'Belanja harian', 'தினசரிச் செலவு'))) + ' ' + moneyNum(M.forecast) + '</span><span><i style="background:#1baf7a"></i>' + esc(tx(Q('Free', '可用', 'Bebas', 'மீதி'))) + '</span></div></div>';
  if (M.bills.length) h += '<h2 class="o-h2">' + esc(tx(Q('Coming up', '即将到期', 'Akan datang', 'வரவிருப்பவை'))) + '</h2><div class="list">' + M.bills.slice(0, 4).map(b => '<div class="li ins-bill"><span class="ic" style="color:' + CAT[b.cat === 'business' ? 'business' : 'bills'].color + '">' + ic('bills', 20) + '</span><span class="grow"><span class="t1">' + esc(b.what) + '</span><br><span class="t2">' + new Date(b.next).toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' }) + '</span></span><b class="sensitive">' + moneyNum(-b.amt) + '</b></div>').join('') + '</div>';
  if (!simple && parts.length) {
    h += '<h2 class="o-h2">' + esc(tx(Q('Where it went', '钱花在哪里', 'Ke mana wang pergi', 'பணம் எங்கே போனது'))) + '</h2><div class="card ins-cats">' + donut(parts, M.totalThis) + '<div class="ins-legend">' +
      parts.slice(0, 6).map(p => { const last = M.lastM[p.c] || 0, ch = last ? Math.round((p.v - last) / last * 100) : null; return '<div class="ins-row"><i style="background:' + p.color + '"></i><span class="grow">' + esc(p.label) + '</span><b class="sensitive">' + moneyNum(p.v) + '</b>' + (ch === null || S.hideBal ? '' : '<span class="ins-ch ' + (ch > 15 ? 'up' : ch < -15 ? 'down' : '') + '">' + (ch > 0 ? '↑' : ch < 0 ? '↓' : '') + Math.abs(ch) + '%</span>') + '</div>'; }).join('') + '</div></div>' +
      '<div class="small muted ins-foot">' + esc(tx(Q('Compared with the same days last month. Sorted on your phone by our spending model.', '与上月同期相比。由手机上的模型分类。', 'Berbanding hari yang sama bulan lepas. Diisih di telefon anda.', 'கடந்த மாதத்தின் அதே நாட்களுடன் ஒப்பிடப்பட்டது.'))) + '</div>';
  }
  return h + '</div>';
}
function safeRow() {
  if (!S.txns || !S.txns.some(x => x.ts)) return '';
  const M = moneyNow();
  return '<button class="o-safe" data-a="go" data-v="insights"><span>' + esc(tx(Q('Safe to spend', '可安心花', 'Selamat dibelanja', 'பாதுகாப்பான செலவு'))) + '</span><b class="sensitive">' + moneyNum(Math.max(0, M.safe)) + '</b><span class="o-safe-d">' + esc(tx(Q('until', '到', 'hingga', 'வரை'))) + ' ' + new Date(M.payday).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' }) + '</span>' + ic('chevron', 16) + '</button>';
}

/* ---------- 10. For you now (next-action predictor on Home) ---------- */
function forYou() {
  if (S.settings.calm || G.view !== 'app') return '';
  const n = nextAction(); if (!n || !n.days.length) return '';
  const name = n.a.slice(4), c = S.contacts.find(x => x.name.split(' (')[0] === name); if (!c) return '';
  const when = { morning: 'in the morning', midday: 'around lunch', afternoon: 'in the afternoon', evening: 'in the evening' }[n.part] || '';
  const dayTxt = n.days.slice(0, 2).map(d => DOWN[d]).join(' and ');
  const lead = n.today ? tx(Q('For you today', '今天为您', 'Untuk anda hari ini', 'இன்று உங்களுக்கு')) : n.inDays === 1 ? tx(Q('Coming up tomorrow', '明天', 'Esok', 'நாளை')) : tx(Q('Coming up', '即将', 'Akan datang', 'வரவிருப்பது'));
  const title = tx(Q('Pay ' + name + ' ' + money(n.amt) + '?', '转 ' + money(n.amt) + ' 给' + name + '？', 'Bayar ' + name + ' ' + money(n.amt) + '?', name + '-க்கு ' + money(n.amt) + ' அனுப்பவா?'));
  return '<div class="fy" role="group" aria-label="' + esc(lead) + '">' + avatar(c.name, 40) + '<div class="grow"><div class="fy-k">' + ic('sparkle', 12) + ' ' + esc(lead) + '</div><div class="fy-t">' + esc(title) + '</div><div class="fy-w">You usually pay ' + esc(name) + ' on ' + esc(dayTxt) + ' ' + esc(when) + '</div></div><button class="fy-go" data-a="threadPay" data-v="' + esc(thKey(c.mobile) + '|' + n.amt) + '">' + esc(tx(Q('Pay', '转账', 'Bayar', 'செலுத்து'))) + '</button><button class="fy-x" data-x="fySkip" data-v="' + esc(n.a) + '" aria-label="Not now">×</button></div>';
}

/* ---------- 11. Say it: voice or typed payments ---------- */
const NUMW = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000 };
function wordsToNum(s) {
  let total = 0, cur = 0, hit = false;
  s.split(/[\s-]+/).forEach(w => { const v = NUMW[w]; if (v === undefined) return; hit = true; if (v === 100) cur = (cur || 1) * 100; else if (v === 1000) { total += (cur || 1) * 1000; cur = 0; } else cur += v; });
  return hit ? total + cur : null;
}
function parseSay(raw) {
  const s = ' ' + String(raw || '').toLowerCase().replace(/[,]/g, '') + ' ';
  let amt = null; const m = s.match(/(?:s\$|\$|sgd\s?)?\s*(\d+(?:\.\d{1,2})?)\s*(?:dollars?|bucks|sgd|元|块|ringgit)?/);
  const phone = s.match(/\b([689]\d{3})\s?(\d{4})\b/);
  if (m && (!phone || m[1] !== phone[1])) amt = Number(m[1]);
  if (amt === null) amt = wordsToNum(s);
  let who = null;
  S.contacts.forEach((c, i) => { const nm = c.name.split(' (')[0].toLowerCase(), rel = (c.name.match(/\(([^)]+)\)/) || [])[1]; if (s.includes(' ' + nm.split(' ')[0] + ' ') || s.includes(nm) || (rel && s.includes(' ' + rel.toLowerCase().split(' ')[0]))) who = who || { i, c }; });
  if (!who && / (mum|mom|ma|mother|妈) /.test(s)) { const i = S.contacts.findIndex(c => /mother|mum|daughter|son/.test(c.name)); if (i >= 0) who = { i, c: S.contacts[i] }; }
  const has = re => re.test(s);
  if (has(/balance|how much (do i|money do)|余额|baki|இருப்பு/)) return { kind: 'balance' };
  if (has(/ bills?|due|账单| bil |கட்டண/)) return { kind: 'bills' };
  if (has(/spen[dt]|spending|insight|花了|belanja|செலவ/)) return { kind: 'spend' };
  if (has(/atm|cash|提款机|tunai/)) return { kind: 'atm' };
  if (has(/ lock|money lock|锁|kunci|பூட்டு/)) return { kind: 'lock', amt };
  if (has(/scan|qr|扫码|imbas/)) return { kind: 'scan' };
  if (who || phone || has(/send|pay|transfer|give|paynow|转|给|hantar|bayar|அனுப்பு/)) return { kind: 'pay', amt, who, phone: phone ? phone[1] + phone[2] : null };
  return { kind: 'unknown' };
}
function sayReply(r) {
  const M = r.kind === 'bills' || r.kind === 'spend' ? moneyNow() : null;
  switch (r.kind) {
    case 'balance': return S.hideBal ? 'Your balance is hidden. Tap the eye on Home to show it.' : 'You have ' + money(S.balance) + ' in your 360 Account.';
    case 'bills': return M.bills.length ? 'Next bill: ' + M.bills[0].what + ', about ' + money(-M.bills[0].amt) + ' on ' + new Date(M.bills[0].next).toLocaleDateString('en-SG', { day: 'numeric', month: 'long' }) + '.' : 'No bills due before payday.';
    case 'spend': return insightLine(M);
    case 'atm': return 'Here are the OCBC ATMs nearest to you.';
    case 'scan': return 'Opening the camera to scan.';
    case 'lock': return 'Let us lock ' + (r.amt ? money(r.amt) : 'some savings') + '. You will check it before anything happens.';
    case 'pay': {
      const name = r.who ? r.who.c.name.split(' (')[0] : r.phone ? r.phone.replace(/(\d{4})(\d{4})/, '$1 $2') : null;
      if (!name) return 'Who should I pay? Say a name, like "Send ' + S.contacts[0].name.split(' (')[0] + ' 20 dollars".';
      if (!r.amt) return 'How much should I send to ' + name + '?';
      return 'Pay ' + name + ' ' + money(r.amt) + '. You will see the check screen before anything is sent.';
    }
    default: return 'Try: "Send ' + S.contacts[0].name.split(' (')[0] + ' 20 dollars", "What is my balance?" or "Any bills due?"';
  }
}
function sayRun(raw) {
  const r = parseSay(raw); G.say = Object.assign(G.say || {}, { heard: raw, r, reply: sayReply(r), state: 'done' });
  mlRecord('Say it (intent parser)', raw.slice(0, 60), r.kind === 'unknown' ? 0.2 : 0.95, 'Understood as: ' + r.kind);
  track('say_it', { kind: r.kind });
  render(); speak(sayPrivate(r) || G.say.reply);
}
// Balances are shown on screen but not spoken unless the customer asks, so nobody nearby hears them
function sayPrivate(r) { return r.kind === 'balance' && !S.hideBal ? 'Your balance is on the screen. Tap Read it out if you want to hear it.' : null; }
function sayGo() {
  const r = G.say && G.say.r; if (!r) return;
  G.say = null;
  if (r.kind === 'pay') {
    const k = r.who ? thKey(r.who.c.mobile) : r.phone;
    A.threadPay(k + '|' + (r.amt || ''));
    // Walk forward through the steps already answered, stopping at anything that needs the customer
    for (let i = 0; i < 6; i++) { const f = S.flow; if (!f || f.stage !== 'steps' || S.modal || f.err) break; const st = flowSteps()[f.step]; if (!st || (st.id !== 'to' && st.id !== 'amount' && st.id !== 'ref' && st.id !== 'check')) break; if (st.id === 'amount' && !f.data.amount) break; A.flowNext(); }
    addLog('Payment started by voice', 'You said it, the app filled it in. The check screen still comes before anything is sent.', 'you');
  } else if (r.kind === 'lock') { startFlow('moneylock', false); if (r.amt) S.flow.data.amount = String(r.amt); S.screen = 'flow'; }
  else if (r.kind === 'scan') { startFlow('scan', false); S.screen = 'flow'; }
  else if (r.kind === 'spend' || r.kind === 'bills') { S.flow = null; S.screen = 'insights'; }
  else if (r.kind === 'atm') { S.flow = null; S.screen = 'atms'; }
}
function sayListen() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { G.say.state = 'type'; render(); setTimeout(() => { const el = document.getElementById('say-in'); if (el) el.focus(); }, 30); return; }
  try {
    stopSpeak();
    const rec = new SR(), lang = LANGS.find(l => l.code === S.settings.lang);
    rec.lang = lang ? lang.speech : 'en-SG'; rec.interimResults = true; rec.maxAlternatives = 1;
    G.say.state = 'listening'; G.say.heard = ''; render();
    rec.onresult = e => { const t0 = Array.from(e.results).map(x => x[0].transcript).join(' '); G.say.heard = t0; const el = document.getElementById('say-heard'); if (el) el.textContent = t0; if (e.results[e.results.length - 1].isFinal) sayRun(t0); };
    rec.onerror = () => { G.say.state = 'type'; render(); };
    rec.onend = () => { if (G.say && G.say.state === 'listening') { if (G.say.heard) sayRun(G.say.heard); else { G.say.state = 'idle'; render(); } } };
    rec.start(); G.say.rec = rec;
  } catch (e) { G.say.state = 'type'; render(); }
}
function viewSay() {
  const g = G.say; if (!g) return '';
  const ex = [['Send ' + S.contacts[0].name.split(' (')[0] + ' 20 dollars'], ['What is my balance?'], ['Any bills due?'], ['Nearest ATM']];
  const r = g.r, can = r && ((r.kind === 'pay' && (r.who || r.phone)) || ['lock', 'scan', 'spend', 'bills', 'atm'].includes(r.kind));
  return '<div class="say-wrap" role="dialog" aria-modal="true" aria-label="Say it"><div class="say-sheet">' +
    '<button class="say-x" data-x="sayClose" aria-label="Close">×</button>' +
    '<div class="say-k">' + esc(tx(Q('Say it', '说出来', 'Sebut sahaja', 'சொல்லுங்கள்'))) + '</div>' +
    '<button class="say-mic ' + (g.state === 'listening' ? 'on' : '') + '" data-x="sayListen" aria-label="' + (g.state === 'listening' ? 'Listening' : 'Tap to speak') + '">' + ic('mic', 34) + '</button>' +
    '<div class="say-heard" id="say-heard" aria-live="polite">' + esc(g.heard || (g.state === 'listening' ? '…' : tx(Q('Tap and say what you want to do', '点一下，说出您想做的事', 'Ketik dan sebut apa yang anda mahu', 'தட்டி, என்ன செய்ய வேண்டும் என்று சொல்லுங்கள்')))) + '</div>' +
    (g.reply ? '<div class="say-reply">' + (r && r.kind === 'pay' && r.who ? avatar(r.who.c.name, 34) : '<span class="say-bot">' + ic('sparkle', 18) + '</span>') + '<span>' + esc(g.reply) + '</span></div>' : '') +
    (r && sayPrivate(r) ? '<div class="small muted" style="margin:6px 0 8px">We do not read your balance out loud unless you ask, so people nearby cannot hear it.</div><button class="btn secondary block" data-x="sayReadBal">' + ic('speaker', 18) + ' Read it out</button>' : '') +
    (can ? '<button class="btn dark block" data-x="sayGo">' + esc(tx(Q('Continue', '继续', 'Teruskan', 'தொடரவும்'))) + '</button>' : '') +
    (g.state === 'type' || !g.reply ? '<form class="say-form" data-x-form="1"><input id="say-in" class="input" placeholder="' + esc(tx(Q('Or type it', '或者打字', 'Atau taip', 'அல்லது தட்டச்சு செய்யுங்கள்'))) + '" autocomplete="off"><button class="btn secondary" type="submit">' + ic('arrow', 18) + '</button></form>' : '') +
    (!g.reply ? '<div class="say-ex">' + ex.map(e => '<button class="pill" data-x="sayEx" data-v="' + esc(e[0]) + '">' + esc(e[0]) + '</button>').join('') + '</div>' : '') +
    '</div></div>';
}

/* ---------- 12. Camera QR (BarcodeDetector) ---------- */
function camOpen() {
  const has = 'BarcodeDetector' in window && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  if (!has) { toast('Camera scanning is not available in this browser. Tap Scan to use the demo code.'); return; }
  G.cam = { on: true }; render();
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
    G.cam.stream = stream; const v = document.getElementById('cam-v'); if (!v) return camClose();
    v.srcObject = stream; v.play();
    const det = new window.BarcodeDetector({ formats: ['qr_code'] });
    const tick = () => { if (!G.cam || !G.cam.on) return; det.detect(v).then(c => { if (c && c.length) { const code = c[0].rawValue; camClose(); if (S.flow && S.flow.task === 'scan') { S.flow.data.merchant = MERCHANT.name; S.flow.data.qrRaw = code.slice(0, 80); S.flow.err = null; } feedback('tap'); addLog('Read a QR code with the camera', 'Camera and QR reading happen on the phone. Code: ' + code.slice(0, 40), 'event'); render(); } else requestAnimationFrame(tick); }).catch(() => requestAnimationFrame(tick)); };
    tick();
  }).catch(() => { camClose(); toast('Camera permission was not given. Tap Scan to use the demo code.'); });
}
function camClose() { if (G.cam && G.cam.stream) G.cam.stream.getTracks().forEach(t0 => t0.stop()); G.cam = null; render(); }
function viewCam() { return G.cam ? '<div class="cam-wrap"><video id="cam-v" playsinline muted></video><div class="cam-frame" aria-hidden="true"></div><div class="cam-t">Point at the QR code</div><button class="btn secondary cam-x" data-x="camClose">Cancel</button></div>' : ''; }

/* ---------- 13. Share the receipt ---------- */
function shareReceipt() {
  const f = S.flow; if (!f) return;
  const text = 'OCBC payment receipt\n' + taskName(f.task) + '\nAmount: ' + money(Number(f.data.amount || 0)) + '\nReference: ' + (f.ref || '-') + '\n' + new Date().toLocaleString('en-SG');
  if (navigator.share) navigator.share({ title: 'Payment receipt', text }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast('Receipt copied. Paste it into any chat.'), () => toast(text));
  else toast(text);
}

ICONS.camera = '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>';

/* ---------- Statement rows: icon by category, clean merchant name ---------- */
function txCat(x) { if (x.amt > 0) return 'income'; if (/money lock/i.test(x.what)) return 'lock'; return x.mlcat || (x.mlcat = CAT_ML.predict(x.what).cat); }
function txIcon(x) {
  const c = txCat(x);
  if (c === 'income') return ic('wallet', 18);
  if (c === 'lock') return ic('lock', 18);
  if (c === 'people') { const nm = x.what.replace(/^PayNow to /, '').split(' · ')[0]; return '<span class="tx-init" style="background:' + CAT.people.color + '">' + esc(nm.slice(0, 1)) + '</span>'; }
  return '<span class="tx-cat" style="color:' + (CAT[c] ? CAT[c].color : 'var(--ink-2)') + '">' + ic(CAT[c] ? CAT[c].icon : 'arrow', 18) + '</span>';
}
function txMain(x) { return String(x.what).replace(/^(Card|NETS QR|GIRO|SimplyGo|GrabFood|Grab|Shopee|Ninja Van) · /, (m, a) => /SimplyGo|Grab|Shopee|Ninja/.test(a) ? a + ' ' : '').replace(/^PayNow to ([^·]+) · .*/, 'PayNow to $1').replace(/,.*$/, '').trim(); }
function txSub(x) { const ch = (String(x.what).match(/^(Card|NETS QR|GIRO|PayNow)/) || [])[1]; const note = /^PayNow to .* · (.*)$/.exec(x.what); return [x.d, note ? note[1] : ch === 'NETS QR' ? 'Scan & Pay' : ch].filter(Boolean).join(' · '); }

/* ---------- Plan tab card ---------- */
function planInsights() {
  if (!S.txns || !S.txns.some(x => x.ts)) return '';
  const M = moneyNow(), parts = CAT_ORDER.filter(c => M.thisM[c] > 0).map(c => ({ c, v: M.thisM[c] })).sort((a, b) => b.v - a.v);
  return '<button class="card ins-plan" data-a="go" data-v="insights"><div class="between"><span class="small pl-k">MONEY INSIGHTS</span>' + ic('chevron', 16) + '</div>' +
    '<div class="ins-plan-row"><div><div class="small muted">' + esc(tx(Q('Spent this month', '本月支出', 'Dibelanja bulan ini', 'இந்த மாதச் செலவு'))) + '</div><div class="ins-plan-v sensitive">' + moneyNum(M.totalThis) + '</div></div><div><div class="small muted">' + esc(tx(Q('Money in', '收入', 'Wang masuk', 'வரவு'))) + '</div><div class="ins-plan-v sensitive" style="color:var(--green)">' + moneyNum(M.inThis) + '</div></div></div>' +
    '<div class="ins-stack" aria-hidden="true">' + parts.map(p => '<span style="flex:' + p.v.toFixed(0) + ';background:' + CAT[p.c].color + '"></span>').join('') + '</div>' +
    '<div class="ins-dots">' + parts.slice(0, 4).map(p => '<span><i style="background:' + CAT[p.c].color + '"></i>' + esc(tx(CAT[p.c].label)) + '</span>').join('') + '</div></button>';
}

/* ---------- Machine learning tab: money models and live APIs ---------- */
function mlMoneyView() {
  const bt = forecastBacktest(), nx = PERSONAS.map(p => ({ who: p.short, r: trainNext(buildStatement(p.id)) }));
  const meanErr = bt.reduce((a, b) => a + b.err, 0) / bt.length;
  const api = (n, what, st) => '<tr><td><b>' + n + '</b></td><td class="small">' + what + '</td><td>' + st + '</td></tr>';
  const live = v => v ? '<span class="tag ok">Live</span>' : '<span class="tag">Offline fallback</span>';
  return '<p class="small ml-honest"><b>Proof of concept.</b> These models are trained and tested on synthetic statements that this page generates, so the results show they work as designed, not how they would do with real customers.</p><div class="ml-grid3">' +
    '<div class="dash-card"><h2>Spending categoriser</h2><p class="lead">Naive Bayes on the transaction description ("NETS QR · Ya Kun Kaya Toast" → Food & drinks). Feeds Money insights and the Plan tab.</p>' +
    '<div class="ml-kpis"><div class="ml-kpi"><div class="ml-kpi-l">Known shops</div><div class="ml-kpi-v">' + Math.round(CAT_ML.accKnown * 100) + '%</div><div class="ml-kpi-s">new descriptions of shops it has seen</div></div><div class="ml-kpi"><div class="ml-kpi-l">New shops</div><div class="ml-kpi-v">' + Math.round(CAT_ML.acc * 100) + '%</div><div class="ml-kpi-s">on ' + CAT_ML.nHeld + ' shops it never saw in training</div></div></div><p class="small muted">' + CAT_ML.cats + ' categories. Brand-new shop names are the hard case; with real data the bank would also use the merchant category code that card networks send.</p></div>' +
    '<div class="dash-card"><h2>Safe-to-spend forecast</h2><p class="lead">Linear regression on the last 30 days of everyday spending, minus bills it finds repeating each month, until the next pay day it detects.</p><table class="t"><thead><tr><th>Customer</th><th>Predicted 7 days</th><th>Actual</th></tr></thead><tbody>' +
    bt.map(b => '<tr><td>' + esc(b.who) + '</td><td>' + money(b.pred) + '</td><td>' + money(b.actual) + '</td></tr>').join('') + '</tbody></table><p class="small muted">Average error ' + Math.round(meanErr * 100) + '%. Backtest: trained on days 1 to 23, predicted days 24 to 30. Monthly bills are left out because the app already knows them; one-off big buys are capped so they do not skew the trend.</p></div>' +
    '<div class="dash-card"><h2>Next-payment predictor</h2><p class="lead">Naive Bayes on who each customer usually pays, by day of week and time of day. Powers the suggestion card on Home. It only suggests; one tap still goes through the normal check screen.</p><table class="t"><thead><tr><th>Customer</th><th>Right first guess</th><th>Always guess the most paid person</th></tr></thead><tbody>' +
    nx.map(x => '<tr><td>' + esc(x.who) + '</td><td><b>' + Math.round(x.r.acc * 100) + '%</b></td><td>' + Math.round(x.r.base * 100) + '%</td></tr>').join('') + '</tbody></table><p class="small muted">Tested on the last quarter of each customer\'s history.</p></div></div>' +
    '<div class="dash-card"><h2>APIs in this app</h2><table class="t"><thead><tr><th>API</th><th>Used for</th><th>Now</th></tr></thead><tbody>' +
    api('Frankfurter', 'Live SGD exchange rates for overseas transfers (European Central Bank reference rates)', live(G.fx.live)) +
    api('OpenStreetMap Overpass', 'Nearest OCBC ATMs to unlock Money Lock', live(G.atm && G.atm.state === 'live')) +
    api('Geolocation', 'Where you are, only when you tap "Use my location"', live(!!navigator.geolocation)) +
    api('Web Speech: speech recognition', 'Say it: pay, check balance, bills, ATM by voice', live(!!(window.SpeechRecognition || window.webkitSpeechRecognition))) +
    api('Web Speech: speech synthesis', 'One read-aloud voice for every screen, best voice per language', live('speechSynthesis' in window)) +
    api('BarcodeDetector + camera', 'Scan a real QR code', live('BarcodeDetector' in window)) +
    api('Web Share', 'Share a receipt to any chat app', live(!!navigator.share)) +
    api('Vibration + Web Audio', 'A tap and a soft chime when money is sent', live(!!navigator.vibrate)) +
    '</tbody></table><p class="small muted">Everything works offline too: sample rates, sample ATM list, typing instead of speaking.</p></div>';
}

/* ---------- 14. Hooks ---------- */
(function () {
  // Realistic statements for every customer, replacing the 3 sample rows
  const _load = loadPersona;
  const syncThreads = () => {
    if (!S.threads) return;
    S.contacts.forEach(c => {
      const k = thKey(c.mobile), nm = c.name.split(' (')[0];
      const outs = S.txns.filter(x => x.what.startsWith('PayNow to ' + nm + ' · ')).map((x, j) => ({ id: 'st' + j, ts: x.ts, dir: 'out', amt: -x.amt, note: x.what.split(' · ')[1], status: 'sent' }));
      const ins = (S.threads[k] || []).filter(x => x.dir === 'in');
      if (outs.length) S.threads[k] = outs.concat(ins).sort((a, b) => a.ts - b.ts);
    });
  };
  loadPersona = function (id) { const r = _load(id); S.txns = buildStatement(id); syncThreads(); G.nx = null; G.say = null; G.atm = null; return r; };
  if (S && S.personaId) { S.txns = buildStatement(S.personaId); syncThreads(); }

  const _inner = phoneInner;
  phoneInner = function () { return _inner() + viewSay() + viewCam(); };

  const _render = render;
  render = function () { _render(); if (G.view === 'app') paintVoice(); };

  const _handle = handle;
  handle = function (name, v, el, e) {
    const before = S.flow && S.flow.stage;
    const r = _handle(name, v, el, e);
    if (S.flow && S.flow.stage === 'receipt' && before !== 'receipt') feedback('ok');
    return r;
  };

  Object.assign(A, {
    voiceOpen() { G.say = { state: 'idle', heard: '' }; },
    camScan() { camOpen(); },
    shareReceipt() { shareReceipt(); },
    atmOpen() { S.flow = null; S.screen = 'atms'; }
  });

  // Our own small actions (data-x) so they never touch the app's history or logs
  const X = {
    voiceStop() { stopSpeak(); },
    sayClose() { if (G.say && G.say.rec) try { G.say.rec.stop(); } catch (e) { /* ignore */ } G.say = null; stopSpeak(); render(); },
    sayListen() { sayListen(); },
    sayEx(v) { sayRun(v); },
    sayGo() { sayGo(); render(); },
    sayReadBal() { if (G.say && G.say.reply) speak(G.say.reply); },
    fySkip(v) { (G.nxSkip = G.nxSkip || {})[S.personaId + v] = 1; render(); },
    atmFind() { atmFind(); },
    camClose() { camClose(); }
  };
  document.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b || !X[b.dataset.x]) return; e.preventDefault(); e.stopPropagation(); X[b.dataset.x](b.dataset.v); }, true);
  document.addEventListener('submit', e => { if (!e.target.matches('[data-x-form]')) return; e.preventDefault(); const el = document.getElementById('say-in'); if (el && el.value.trim()) sayRun(el.value.trim()); }, true);

  render();
})();
