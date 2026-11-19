/* On-device machine learning: struggle detector, scam message model, payment risk (shadow mode). */
/* ==========================================================
   ON-DEVICE MACHINE LEARNING
   Three small models, trained in this page when it opens, on
   synthetic data, with no libraries and no network:
     1. Struggle detector   logistic regression on how this step is going
     2. Scam message model  multinomial Naive Bayes on message text
     3. Payment risk model  logistic regression on the payment, shadow mode
   Inputs are behaviour and payment facts only. Never age, health,
   income, race, gender or language. Models can add help or a check;
   they can never remove a fee, a risk, a safety check or the final
   confirm step.
   ========================================================== */
const ML = (function () {
  /* ---------- small maths helpers ---------- */
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const gauss = r => { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const pois = (r, lam) => { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= r(); } while (p > L); return k - 1; };
  const bern = (r, p) => r() < p ? 1 : 0;
  const sigmoid = z => 1 / (1 + Math.exp(-z));
  function shuffle(arr, r) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

  /* ---------- logistic regression: standardised inputs, L2, full-batch gradient descent ---------- */
  function trainLR(X, y, o) {
    o = Object.assign({ epochs: 400, lr: 0.3, l2: 0.001, posWeight: 1 }, o || {});
    const n = X.length, d = X[0].length;
    const mu = new Array(d).fill(0), sd = new Array(d).fill(0);
    X.forEach(x => x.forEach((v, j) => { mu[j] += v / n; }));
    X.forEach(x => x.forEach((v, j) => { sd[j] += (v - mu[j]) ** 2 / n; }));
    for (let j = 0; j < d; j++) sd[j] = Math.sqrt(sd[j]) || 1;
    const Z = X.map(x => x.map((v, j) => (v - mu[j]) / sd[j]));
    let w = new Array(d).fill(0), b = 0; const loss = [];
    const sw = y.reduce((s, v) => s + (v ? o.posWeight : 1), 0);
    for (let ep = 0; ep < o.epochs; ep++) {
      const gw = new Array(d).fill(0); let gb = 0, L = 0;
      for (let i = 0; i < n; i++) {
        let z = b; for (let j = 0; j < d; j++) z += w[j] * Z[i][j];
        const p = sigmoid(z), wt = y[i] ? o.posWeight : 1, e = (p - y[i]) * wt;
        L -= wt * (y[i] ? Math.log(p + 1e-9) : Math.log(1 - p + 1e-9));
        for (let j = 0; j < d; j++) gw[j] += e * Z[i][j];
        gb += e;
      }
      for (let j = 0; j < d; j++) w[j] -= o.lr * (gw[j] / sw + o.l2 * w[j]);
      b -= o.lr * gb / sw;
      if (ep % 4 === 0 || ep === o.epochs - 1) loss.push(L / sw);
    }
    return { w, b, mu, sd, loss, epochs: o.epochs };
  }
  function contribLR(m, x) { return x.map((v, j) => m.w[j] * (v - m.mu[j]) / m.sd[j]); }
  function predictLR(m, x) { return sigmoid(m.b + contribLR(m, x).reduce((s, v) => s + v, 0)); }

  /* ---------- metrics ---------- */
  function metrics(y, p, thr) {
    let tp = 0, fp = 0, tn = 0, fn = 0;
    y.forEach((v, i) => { const h = p[i] >= thr ? 1 : 0; if (h && v) tp++; else if (h) fp++; else if (v) fn++; else tn++; });
    const prec = tp / Math.max(1, tp + fp), rec = tp / Math.max(1, tp + fn);
    return { tp, fp, tn, fn, acc: (tp + tn) / y.length, prec, rec, f1: 2 * prec * rec / Math.max(1e-9, prec + rec), thr, n: y.length };
  }
  function roc(y, p) {
    const idx = p.map((v, i) => i).sort((a, b) => p[b] - p[a]);
    const P = y.filter(Boolean).length, N = y.length - P;
    let tp = 0, fp = 0, auc = 0, prevF = 0, prevT = 0; const pts = [[0, 0]];
    idx.forEach(i => { if (y[i]) tp++; else fp++; const fpr = fp / N, tpr = tp / P; auc += (fpr - prevF) * (tpr + prevT) / 2; prevF = fpr; prevT = tpr; pts.push([fpr, tpr]); });
    const step = Math.max(1, Math.floor(pts.length / 60));
    return { auc, pts: pts.filter((_, i) => i % step === 0 || i === pts.length - 1) };
  }

  /* ---------- 1. Struggle detector ---------- */
  const SF = [
    { k: 'fails', label: 'Wrong tries on this step', max: 4, step: 1, fmt: v => String(v) },
    { k: 'dwell', label: 'Seconds on this step', max: 90, step: 1, fmt: v => v + 's', tf: v => Math.log1p(v) },
    { k: 'backs', label: 'Back and forth between steps', max: 4, step: 1, fmt: v => String(v) },
    { k: 'taps', label: 'Taps on things that do nothing', max: 6, step: 1, fmt: v => String(v) },
    { k: 'fixes', label: 'Deleting and retyping', max: 8, step: 1, fmt: v => String(v) },
    { k: 'helper', label: 'Opened Helper during this task', max: 1, step: 1, fmt: v => v ? 'Yes' : 'No' },
    { k: 'newtask', label: 'Task set to "New to me"', max: 1, step: 1, fmt: v => v ? 'Yes' : 'No' }
  ];
  const LANG_GROUPS = ['en', 'zh', 'ms', 'ta'];
  function struggleRow(r, s) {
    return s
      ? { fails: pois(r, 1.0), dwell: Math.round(Math.exp(Math.log(22) + 0.65 * gauss(r))), backs: pois(r, 0.7), taps: pois(r, 0.9), fixes: pois(r, 1.7), helper: bern(r, 0.3), newtask: bern(r, 0.5) }
      : { fails: pois(r, 0.2), dwell: Math.round(Math.exp(Math.log(8) + 0.65 * gauss(r))), backs: pois(r, 0.15), taps: pois(r, 0.25), fixes: pois(r, 0.5), helper: bern(r, 0.06), newtask: bern(r, 0.25) };
  }
  function sVec(o) { return SF.map(f => f.tf ? f.tf(o[f.k] || 0) : (o[f.k] || 0)); }
  function makeStruggle(seed) {
    const r = rng(seed), rows = [];
    for (let i = 0; i < 8000; i++) {
      const s = bern(r, 0.3); const o = struggleRow(r, s);
      o.lang = LANG_GROUPS[Math.floor(r() * 4)];
      o.y = r() < 0.04 ? 1 - s : s; // 4% label noise, as in real labels
      rows.push(o);
    }
    const train = rows.slice(0, 6000), test = rows.slice(6000);
    const m = trainLR(train.map(sVec), train.map(o => o.y), { epochs: 300, lr: 0.6 });
    const p = test.map(o => predictLR(m, sVec(o)));
    const y = test.map(o => o.y);
    // Operating bar: the lowest one where at least 9 in 10 alerts are real struggles (precision first)
    let thr = 0.9;
    for (let t = 0.6; t <= 0.9001; t += 0.05) { if (metrics(y, p, t).prec >= 0.9) { thr = Math.round(t * 100) / 100; break; } }
    const slices = LANG_GROUPS.map(g => { const ii = test.map((o, i) => o.lang === g ? i : -1).filter(i => i >= 0); const mm = metrics(ii.map(i => y[i]), ii.map(i => p[i]), thr); return { g, n: ii.length, acc: mm.acc, rec: mm.rec, prec: mm.prec }; });
    return { kind: 'struggle', model: m, feats: SF, thr, test: metrics(y, p, thr), at50: metrics(y, p, 0.5), roc: roc(y, p), slices, nTrain: train.length, nTest: test.length, seed };
  }

  /* ---------- 3. Payment risk (shadow mode) ---------- */
  const RF = [
    { k: 'newPayee', label: 'Paying someone new', fmt: v => v ? 'Yes' : 'No' },
    { k: 'ratio', label: 'Amount compared with usual (times)', fmt: v => v.toFixed(1) + 'x', tf: v => Math.log(Math.max(0.05, v)) },
    { k: 'firstOverseas', label: 'First overseas transfer', fmt: v => v ? 'Yes' : 'No' },
    { k: 'flagged', label: 'Payee reported by other customers', fmt: v => v ? 'Yes' : 'No' },
    { k: 'onCall', label: 'Said a caller is telling them what to do', fmt: v => v ? 'Yes' : 'No' },
    { k: 'night', label: 'Between 11pm and 6am', fmt: v => v ? 'Yes' : 'No' },
    { k: 'recent', label: 'Payments in the last hour', fmt: v => String(v) }
  ];
  function rVec(o) { return RF.map(f => f.tf ? f.tf(o[f.k]) : o[f.k]); }
  function makeRisk(seed) {
    const r = rng(seed), rows = [];
    for (let i = 0; i < 7500; i++) {
      const s = bern(r, 0.05);
      const o = s
        ? { newPayee: bern(r, 0.9), ratio: Math.exp(Math.log(10) + 0.9 * gauss(r)), firstOverseas: bern(r, 0.35), flagged: bern(r, 0.25), onCall: bern(r, 0.5), night: bern(r, 0.3), recent: pois(r, 1.4) }
        : { newPayee: bern(r, 0.2), ratio: Math.exp(0.75 * gauss(r)), firstOverseas: bern(r, 0.03), flagged: bern(r, 0.003), onCall: bern(r, 0.02), night: bern(r, 0.08), recent: pois(r, 0.3) };
      o.y = r() < 0.01 ? 1 - s : s;
      rows.push(o);
    }
    const train = rows.slice(0, 6000), test = rows.slice(6000);
    const m = trainLR(train.map(rVec), train.map(o => o.y), { epochs: 300, lr: 0.6, posWeight: 6 });
    const p = test.map(o => predictLR(m, rVec(o))), y = test.map(o => o.y);
    return { kind: 'risk', model: m, feats: RF, thr: 0.5, test: metrics(y, p, 0.5), roc: roc(y, p), nTrain: train.length, nTest: test.length, base: y.filter(Boolean).length / y.length, seed };
  }

  /* ---------- 2. Scam message model: multinomial Naive Bayes ---------- */
  const CORPUS = [
    // 1 = scam (synthetic examples written in the style of scams reported in Singapore)
    [1, 'URGENT: Your OCBC account has been suspended. Verify your details within 24 hours at http://ocbc-verify-sg.com or it will be closed'],
    [1, 'Your bank account will be frozen today. Click bit.ly/3kSecure to confirm your identity and enter the OTP we send'],
    [1, 'This is Inspector Tan from the police. Your account is linked to money laundering. Transfer your savings to a safe account now'],
    [1, 'Ministry of Health officer here. A warrant is out for your arrest. Do not tell anyone and move your money to the government account'],
    [1, 'Congratulations! You have won S$5,000 in our lucky draw. Pay the S$50 processing fee to claim your prize'],
    [1, 'Your parcel could not be delivered. Pay S$1.99 customs fee at sg-parcel-delivery.top to reschedule'],
    [1, 'Part time job! Earn $300 a day by liking videos. No experience needed. WhatsApp me at 8123 4567'],
    [1, 'Hi dear, earn easy commission from home. Top up S$100 to unlock your first task and get 30% back today'],
    [1, 'Guaranteed returns of 20% monthly with our crypto investment plan. Limited slots, invest now before it is too late'],
    [1, 'Mum, I lost my phone. This is my new number. Can you PayNow me S$800 urgently? I will pay you back tomorrow'],
    [1, 'Dear customer, unusual login detected. Share the 6-digit code we just sent to stop the transaction'],
    [1, 'IRAS: You are entitled to a tax refund of S$612. Click the link to submit your bank details tinyurl.com/refund-sg'],
    [1, 'Your Singpass will expire today. Update now at singpass-renew.xyz to avoid losing access to government services'],
    [1, 'We noticed suspicious activity on your card. Call this number immediately and give the officer your card number and CVV'],
    [1, 'Final notice: your electricity will be cut off in 2 hours unless you pay the outstanding bill through this link'],
    [1, 'Hello, I am a recruiter. Investment mentor will teach you to trade. Join our Telegram group for daily profit signals'],
    [1, 'You have been selected for a government grant. Provide your bank login and password to receive the payment'],
    [1, 'Customs has seized a parcel in your name containing illegal items. Transfer bail money to avoid arrest'],
    [1, 'Act now! Your account is locked. Login here to unlock: http://192.168.4.20/ocbc/login'],
    [1, 'Sweetheart I need help to pay the release fee for my gold shipment. Please send S$2,000 and I will return double'],
    [1, 'DBS OCBC UOB customers: claim your S$300 festive bonus now. Enter your card details at bonus-claim.site'],
    [1, 'Your WhatsApp account will be deleted. Send the verification code to this number to keep it'],
    [1, 'We are from the bank fraud team. To protect your money, move all your funds to this holding account for safekeeping'],
    [1, 'Concert tickets at half price! Pay deposit by PayNow to 9876 5432 first, tickets sent after payment'],
    [1, 'Your loan of S$20,000 is approved with no checks. Pay S$350 admin fee first to release the money'],
    [1, 'Dear valued client, your OneToken has been disabled. Reactivate it by keying in your password at the link below'],
    [1, 'Police warrant officer here. You must not hang up. Download this app so we can check your account remotely'],
    [1, 'Earn passive income daily. Deposit USDT to our platform and withdraw profits anytime. Guaranteed no loss'],
    [1, 'Your account shows a pending refund. Reply with your full card number and expiry date to receive it'],
    [1, 'Last chance to avoid penalty: pay the overdue fine immediately via the link or face legal action'],
    [1, 'Hi, I am from the telco. Your number will be suspended in 2 hours. Press 1 to speak to an officer and verify your NRIC'],
    [1, 'Lucky winner! Click to spin the wheel and claim cash prize. Just enter your bank username and password'],
    [1, 'You have an unpaid parking fine. Settle within today at lta-fine-payment.online to avoid court summons'],
    [1, 'Grandpa please do not tell my parents, I am in trouble and need you to transfer money to my friend now'],
    [1, 'Exclusive investment group: our members made 300% profit last week. Transfer now to join the next round'],
    [1, 'Your account has been temporarily restricted. Confirm your identity now via the secure link to restore access'],
    [1, 'Hi, I saw your resume online. We offer a remote job paying S$150 per hour. Message our HR on Telegram to start'],
    [1, 'You owe outstanding tax. Immediate payment is required to stop legal proceedings. Call our officer now'],
    [1, 'Click here to claim your free iPhone. Only 3 left! Enter your card details to pay shipping'],
    [1, 'Dear user, your mailbox is full. Login with your password at the link to avoid losing emails'],
    [1, 'We detected a virus on your phone. Install our security app from this link so our technician can fix it'],
    [1, 'Your package from overseas is held by customs. A clearance fee is required. Pay via the link within 12 hours'],
    [1, 'Hello, wrong number? Anyway nice to meet you. I invest in gold and made a lot, can teach you'],
    [1, 'Bank security alert: transfer your funds to a new account we created for you to keep them safe'],
    [1, 'Your CPF account is under investigation. Do not tell your family. Follow the officer instructions exactly'],
    [1, 'Win big with our betting tips! Deposit now and get 200% bonus, withdraw anytime'],
    [1, 'Your Netflix payment failed. Update your billing information within 24 hours to avoid suspension'],
    [1, 'Kindly assist to buy Google Play gift cards for the boss and send me the codes urgently'],
    [1, 'This is your son, my phone is broken. Please transfer money to this account for my school fees now'],
    [1, 'Congratulations, your number was chosen for a cash reward. Reply with your bank account to receive it'],
    [1, 'Account verification required. Failure to verify will result in permanent closure. Verify at secure-ocbc-login.com'],
    [1, 'Earn S$800 a week reviewing products on Shopee. Pay a small deposit first to receive the orders'],
    [1, 'Hi auntie, I am from the government CDC voucher team. Give me the code sent to your phone to activate the vouchers'],
    [1, 'Your rental deposit is needed today to secure the room. Transfer first, viewing after payment'],
    [1, 'Officer here. Your identity was used to open a bank account for crime. Keep this call secret and do as told'],
    [1, 'Invest S$500 today and receive S$5,000 in one week. Risk free, many members already rich'],
    [1, 'Your DHL shipment is pending. Pay the remaining fee at dhl-sg-track.site to release it'],
    [1, 'Free money from the government! Click to apply and enter your Singpass ID and password'],
    [1, 'Your bank card has been charged S$1,299. If you did not make this purchase, call this number immediately to cancel'],
    [1, 'Please update your OneToken by downloading the new version from this link and logging in'],
    // 0 = normal
    [0, 'Ma, I am running late, traffic jam on the PIE. Start eating first'],
    [0, 'The Town Council will be washing the corridors on Saturday morning'],
    [0, 'Your appointment at the polyclinic is confirmed for 9.30am on 12 Nov'],
    [0, 'Thanks for coming to our wedding! Here is the link to the photo album we shared in the group'],
    [0, 'Hi, this is the tuition centre. Lesson this week is at the usual time, see you'],
    [0, 'Your OCBC card statement is ready. You can view it in the OCBC app'],
    [0, 'Remember to bring the umbrella, it is going to rain this afternoon'],
    [0, 'The movers will arrive at 8am. Please keep the lift lobby clear'],
    [0, 'Good morning! Wishing you a happy Deepavali with your family'],
    [0, 'Your prescription refill is ready at the pharmacy'],
    [0, 'I transferred the S$25 for the gift we shared. Thanks for buying it'],
    [0, 'Can we meet at the MRT station exit B at 6pm?'],
    [0, 'Your FairPrice online order will be delivered between 2pm and 4pm'],
    [0, 'Reminder: the community centre line dance class starts next week'],
    [0, 'Hi Grandpa, we will visit you on Sunday afternoon with the kids'],
    [0, 'Your water bill for October is S$34.20. It will be deducted by GIRO'],
    [0, 'Please collect your spectacles from the optical shop after 5pm'],
    [0, 'The church choir practice is moved to Thursday evening'],
    [0, 'Your Lazada parcel has been dropped at the parcel locker near your block'],
    [0, 'Happy Hari Raya! Hope to see you at the open house'],
    [0, 'Your car servicing is complete. You can collect it from the workshop'],
    [0, 'Can you call me when you are free? Nothing urgent, just want to chat'],
    [0, 'Your new card has been sent to your mailing address. Activate it in the app when it arrives'],
    [0, 'Mum, I passed my exam! Thank you for everything'],
    [0, 'The neighbourhood clinic will be closed on Sunday'],
    [0, 'Hi Ma, dinner at 7 tonight? I will bring the durians'],
    [0, 'Your OCBC payment of S$45.60 to NTUC FairPrice on 02 Nov was successful. If this was not you, call the number on the back of your card'],
    [0, 'Reminder: your dental appointment is on Thursday at 3pm. Reply Y to confirm'],
    [0, 'Thanks for the angbao Aunty! See you at the reunion dinner'],
    [0, 'Your Grab ride is arriving in 3 minutes. Look for a silver car'],
    [0, 'Can you pick up Ah Boy from school today? I have a meeting until 6'],
    [0, 'Your GIRO deduction for the town council will be on 15 Nov'],
    [0, 'Hey, the badminton court is booked for Saturday 10am. Bring water'],
    [0, 'Your parcel from Shopee was delivered to your door at 2.14pm today'],
    [0, 'Payslip for October is ready. Log in to the HR portal from your work laptop to view it'],
    [0, 'Hi, this is the clinic. Your medicine is ready for collection at the counter'],
    [0, 'Papa, I sent you S$50 for the electricity bill. Let me know when you see it'],
    [0, 'The library book you reserved is ready for pick up at Ang Mo Kio library'],
    [0, 'Meeting moved to 3pm in room 4. See you there'],
    [0, 'Your monthly statement for October is now available in the OCBC app'],
    [0, 'Happy birthday! Hope you have a lovely day with the family'],
    [0, 'Lunch at the hawker centre tomorrow? Chicken rice stall reopened'],
    [0, 'Your OTP is 482913. Do not share this code with anyone, including OCBC staff'],
    [0, 'Reminder from the polyclinic: please bring your NRIC for your appointment on Monday'],
    [0, 'Can you buy eggs and bread on the way home? Thanks'],
    [0, 'Your card ending 4421 was used for S$12.50 at Kopi Corner. Not you? Call the number on the back of your card'],
    [0, 'Class is cancelled today because of the teacher training. Normal lessons resume Friday'],
    [0, 'Your Singtel bill of S$52.30 is ready. Pay through your banking app as usual'],
    [0, 'The plumber will come between 9 and 11am on Wednesday'],
    [0, 'Grandma, the photos from the wedding are in the family group chat'],
    [0, 'Your CPF statement is available. Log in to the CPF website yourself to view it'],
    [0, 'We received your PayNow transfer of S$30. Thank you for paying for the class'],
    [0, 'Do you want to join the hiking trip at MacRitchie on Sunday morning?'],
    [0, 'Your order is confirmed and will be ready for collection at 6pm'],
    [0, 'Hi Uncle, the aircon servicing is done. Total S$80, cash or PayNow is fine'],
    [0, 'Please remember to submit your timesheet by Friday'],
    [0, 'Our shop is closed on Monday for the public holiday'],
    [0, 'Rachel here, I reached home safely. Good night'],
    [0, 'Your hearing aid batteries are in stock. Drop by any time this week'],
    [0, 'The school fees for next term are due on 1 Dec. Payment details are in the parent portal']
  ];
  const STOP = new Set('a an the to of and or in on at for is are be it this that you your i we our me my with by from as was will can do if have has not no yes please hi hello dear'.split(' '));
  function tokens(text) {
    let s = ' ' + String(text || '').toLowerCase() + ' ';
    const extra = [];
    if (/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|sg|xyz|top|site|online|net|org|ly|info)\b)/.test(s)) extra.push('__link');
    if (/\b(bit\.ly|tinyurl|t\.co|goo\.gl|cutt\.ly|rb\.gy)\b/.test(s)) extra.push('__shortlink');
    if (/\b\d{1,3}(\.\d{1,3}){3}\b/.test(s)) extra.push('__iplink');
    if (/(s\$|\$|usd|usdt)\s?\d/.test(s)) extra.push('__money');
    if (/\b[689]\d{3}\s?\d{4}\b/.test(s)) extra.push('__phone');
    if (/\b\d+\s?(hours?|hrs|minutes|mins)\b|today|immediately|now\b/.test(s)) extra.push('__deadline');
    s = s.replace(/https?:\/\/\S+|www\.\S+|\S+\.(com|sg|xyz|top|site|online|net|org|ly|info)\S*/g, ' ');
    const w = (s.match(/[a-z]{2,}/g) || []).filter(x => !STOP.has(x));
    return w.concat(extra);
  }
  function trainNB(docs) {
    const cnt = [{}, {}], tot = [0, 0], nd = [0, 0], V = new Set();
    docs.forEach(([y, txt]) => { nd[y]++; [...new Set(tokens(txt))].forEach(t => { cnt[y][t] = (cnt[y][t] || 0) + 1; tot[y]++; V.add(t); }); });
    return { cnt, tot, nd, V: V.size, vocab: V };
  }
  function nbLogOdds(m, t) { const a = 1; return Math.log(((m.cnt[1][t] || 0) + a) / (m.tot[1] + a * m.V)) - Math.log(((m.cnt[0][t] || 0) + a) / (m.tot[0] + a * m.V)); }
  function predictNB(m, text) {
    const toks = tokens(text);
    let z = Math.log(m.nd[1] / m.nd[0]);
    const seen = {};
    [...new Set(toks)].forEach(t => { if (!m.vocab.has(t)) return; const lo = nbLogOdds(m, t); z += lo; seen[t] = (seen[t] || 0) + lo; });
    const parts = Object.keys(seen).map(t => ({ t, w: seen[t] })).sort((a, b) => Math.abs(b.w) - Math.abs(a.w));
    return { p: sigmoid(z), parts, known: parts.length };
  }
  function makeNB(seed) {
    const r = rng(seed), docs = shuffle(CORPUS.slice(), r), k = 5, y = [], p = [];
    for (let f = 0; f < k; f++) {
      const test = docs.filter((_, i) => i % k === f), train = docs.filter((_, i) => i % k !== f);
      const m = trainNB(train);
      test.forEach(([lab, txt]) => { y.push(lab); p.push(predictNB(m, txt).p); });
    }
    const model = trainNB(CORPUS);
    const top = [...model.vocab].map(t => ({ t, w: nbLogOdds(model, t), n: (model.cnt[0][t] || 0) + (model.cnt[1][t] || 0) })).filter(x => x.n >= 2).sort((a, b) => b.w - a.w);
    return { kind: 'nb', model, test: metrics(y, p, 0.5), roc: roc(y, p), nDocs: CORPUS.length, nScam: CORPUS.filter(d => d[0]).length, vocab: model.V, topScam: top.slice(0, 8), topSafe: top.slice(-6).reverse(), seed };
  }

  const out = { rng, predictLR, contribLR, predictNB, tokens, sVec, rVec, SF, RF, makeStruggle, makeRisk, makeNB, CORPUS };
  out.trainAll = function (seed) {
    const t0 = performance.now();
    out.struggle = makeStruggle(seed || 7);
    out.risk = makeRisk((seed || 7) + 11);
    out.nb = makeNB((seed || 7) + 23);
    out.ms = Math.round(performance.now() - t0);
    out.trainedAt = nowTime();
  };
  out.trainAll(7);
  return out;
})();

/* ---------- session state for the models ---------- */
G.ml = { preds: [], step: null, view: 'struggle', play: { fails: 1, dwell: 12, backs: 0, taps: 0, fixes: 3, helper: 0, newtask: 0 }, msg: '', risk: { newPayee: 1, ratio: 8, firstOverseas: 0, flagged: 0, onCall: 1, night: 0, recent: 0 } };
function mlThr() { return S.mlThr || ML.struggle.thr; }
function mlPct(p) { return Math.min(99, Math.max(1, Math.round(p * 100))); }
function mlRecord(model, input, p, outcome) {
  G.ml.preds.unshift({ t: nowTime(), model, input, p, outcome, who: S.short });
  if (G.ml.preds.length > 30) G.ml.preds.pop();
}

/* ---------- live features for the step on screen ---------- */
function mlStepKey() {
  const f = S.flow; if (!f || f.stage !== 'steps' || S.screen !== 'flow') return null;
  const steps = flowSteps(); const st = steps[f.mode === 'quick' ? 0 : f.step]; if (!st) return null;
  return { f, id: st.id, key: f.task + ':' + st.id + ':' + f.mode };
}
function mlTrack() {
  const k = mlStepKey();
  if (!k) { G.ml.step = null; return null; }
  if (!G.ml.step || G.ml.step.key !== k.key || G.ml.step.flow !== k.f) G.ml.step = { key: k.key, flow: k.f, id: k.id, start: Date.now(), taps: 0, fixes: 0, fired: false };
  return G.ml.step;
}
function mlFeatures() {
  const st = mlTrack(); if (!st) return null;
  const f = st.flow, l = f.live || { fails: {}, backs: 0 };
  return { fails: l.fails[st.id] || 0, dwell: Math.round((Date.now() - st.start) / 1000), backs: l.backs || 0, taps: st.taps, fixes: st.fixes, helper: f.mlHelper ? 1 : 0, newtask: S.confidence[f.task] === 'never' ? 1 : 0 };
}
function mlSignals(x) { return [x.fails >= 1, x.backs >= 1, x.taps >= 2, x.fixes >= 2, x.helper >= 1, x.dwell >= 10].filter(Boolean).length; }
function mlStruggleNow() { const x = mlFeatures(); if (!x) return null; const v = ML.sVec(x); return { x, p: ML.predictLR(ML.struggle.model, v), c: ML.contribLR(ML.struggle.model, v) }; }

/* The model only acts on mixed, weaker signs: the fixed rules still catch clear cases (2 wrong tries, long idle, 2 backs, 4 dead taps).
   It never acts on the quick form, where only repeated errors count. */
function mlCheck() {
  if (G.view !== 'app' || S.modal || S.helper.open || S.thread) return false;
  const st = mlTrack(); if (!st || st.fired) return false;
  const f = st.flow; if (f.mode === 'quick' || liveFor(f, st.id) || (f.live && f.live.off[st.id])) return false;
  const now = mlStruggleNow(); if (!now) return false;
  mlGauge(now);
  if (now.p >= mlThr() && mlSignals(now.x) >= 2) {
    st.fired = true;
    if (liveTrigger('ml', mlPct(now.p))) {
      f.live.on[st.id].ml = { p: now.p, x: now.x, c: now.c };
      mlRecord('Struggle detector', mlSummary(now.x), now.p, 'Made this step simpler');
      return true;
    }
  }
  return false;
}
function mlSummary(x) { return ML.SF.filter(fd => x[fd.k]).map(fd => fd.label + ': ' + fd.fmt(x[fd.k])).join(' · ') || 'No signals'; }
function mlTopReasons(c, x, n) {
  return ML.SF.map((fd, j) => ({ fd, c: c[j], v: x[fd.k] })).filter(o => o.c > 0.05 && o.v).sort((a, b) => b.c - a.c).slice(0, n || 3);
}

/* Live gauge in the judges' panel, updated in place so typing is never interrupted */
function mlLivePanel() {
  return '<h3>Struggle detector (machine learning)</h3><div class="ml-live" id="ml-live">' + mlGaugeInner(mlStruggleNow()) + '</div>';
}
function mlGaugeInner(now) {
  if (!now) return '<div class="small muted">Scores every step of a payment while it is on screen. Start a payment to watch it.</div>';
  const pct = mlPct(now.p), thr = mlPct(mlThr());
  const top = mlTopReasons(now.c, now.x, 3);
  return '<div class="ml-g-row"><span class="ml-g-num">' + pct + '%</span><span class="small muted">chance this step is hard right now · acts at ' + thr + '% with 2+ signs</span></div>' +
    '<div class="ml-g-bar" role="img" aria-label="' + pct + ' percent"><span style="width:' + pct + '%"></span><i style="left:' + thr + '%"></i></div>' +
    '<div class="small muted" style="margin-top:6px">' + (top.length ? 'Raised by: ' + top.map(o => esc(o.fd.label.toLowerCase()) + ' (' + esc(o.fd.fmt(o.v)) + ')').join(', ') : 'No signs of difficulty yet') + '</div>';
}
function mlGauge(now) { const el = document.getElementById('ml-live'); if (el) el.innerHTML = mlGaugeInner(now || mlStruggleNow()); }

/* ---------- Payment risk, shadow mode ---------- */
function mlRiskFeatures(f) {
  const outs = S.txns.filter(x => x.amt < 0).map(x => -x.amt);
  const usual = outs.length ? outs.reduce((a, b) => a + b, 0) / outs.length : 50;
  const amt = Number(f.data.amount || f.data.limit || 0);
  const h = new Date().getHours();
  const hour = Date.now() - 3600000;
  return {
    newPayee: isNewPayee(f) ? 1 : 0, ratio: Math.max(0.05, amt / Math.max(1, usual)),
    firstOverseas: f.task === 'overseas' && !(S.usage.overseas > 0) ? 1 : 0,
    flagged: f.task === 'uen' && UEN_DIR[f.data.uen] && UEN_DIR[f.data.uen].risky ? 1 : 0,
    onCall: f.onPhone === 'yes' ? 1 : 0, night: h >= 23 || h < 6 ? 1 : 0,
    recent: G.events.filter(e => e.persona === S.personaId && e.t > hour && /done|complete/.test(e.type)).length
  };
}
function mlRiskScore(f) {
  const x = mlRiskFeatures(f), v = ML.rVec(x);
  return { x, p: ML.predictLR(ML.risk.model, v), c: ML.contribLR(ML.risk.model, v) };
}
function mlRiskReasons(r) { return ML.RF.map((fd, j) => ({ fd, c: r.c[j], v: r.x[fd.k] })).filter(o => o.c > 0.2).sort((a, b) => b.c - a.c).slice(0, 3); }

/* ---------- Scam message check ---------- */
function mlScam(text) {
  const r = ML.predictNB(ML.nb.model, text);
  const level = r.known < 2 ? 'unsure' : r.p >= 0.8 ? 'scam' : r.p >= 0.4 ? 'careful' : 'ok';
  return Object.assign(r, { level });
}
const MSG_T = {
  en: { title: 'Check a message', lead: 'Paste a message you are not sure about. It is checked on your phone and never sent anywhere.', label: 'The message', ph: 'Paste the message here', check: 'Check this message', samples: 'Or try one', scam: 'Very likely a scam', careful: 'Be careful', ok: 'Looks like a normal message', unsure: 'Not enough to go on', chance: 'chance it is a scam', why: 'Words that raised it', lowered: 'Words that lowered it', adviceScam: 'Do not tap any link, reply or call the number in it. OCBC will never send a link to log in or ask for your OTP. If you already replied, call the number on the back of your card now.', adviceCareful: 'Check with the sender another way, using a number you find yourself. Do not tap links in the message.', adviceOk: 'Nothing scam-like stood out, but a model can be wrong. If it asks for money, a code or a login, stop and check.', adviceUnsure: 'The message is too short to judge. Paste the whole message.', talk: 'Talk to our anti-scam team', model: 'How this works', s1: 'Parcel fee', s2: 'Family dinner', s3: '"Police" call' },
  zh: { title: '检查一条信息', lead: '粘贴您不确定的短信、WhatsApp 或电邮。手机上的模型会阅读内容，寻找诈骗常用的模式。信息不会离开您的手机。', label: '信息内容', ph: '在这里粘贴信息', check: '检查这条信息', samples: '或试试这些', scam: '很可能是诈骗', careful: '请小心', ok: '看起来是普通信息', unsure: '信息太少，无法判断', chance: '是诈骗的可能性', why: '提高风险的字词', lowered: '降低风险的字词', adviceScam: '不要点任何链接、不要回复，也不要拨打里面的号码。OCBC 绝不会发链接让您登录，也不会索取 OTP。如果已经回复，请立刻拨打卡背面的号码。', adviceCareful: '用您自己找到的号码向对方确认。不要点信息里的链接。', adviceOk: '没有明显的诈骗迹象，但模型也可能出错。如果要求转账、验证码或登录，请先停下来确认。', adviceUnsure: '信息太短，请粘贴完整内容。', talk: '联系反诈骗团队', model: '运作方式', s1: '包裹费用', s2: '家庭晚餐', s3: '"警察"来电' },
  ms: { title: 'Semak mesej', lead: 'Tampal SMS, WhatsApp atau e-mel yang anda ragui. Model di telefon anda membaca perkataannya dan mencari corak yang digunakan penipu. Mesej tidak keluar dari telefon anda.', label: 'Mesej', ph: 'Tampal mesej di sini', check: 'Semak mesej ini', samples: 'Atau cuba contoh', scam: 'Besar kemungkinan penipuan', careful: 'Berhati-hati', ok: 'Kelihatan seperti mesej biasa', unsure: 'Tidak cukup untuk menilai', chance: 'kemungkinan penipuan', why: 'Perkataan yang menaikkan risiko', lowered: 'Perkataan yang menurunkan risiko', adviceScam: 'Jangan ketik pautan, balas atau hubungi nombor di dalamnya. OCBC tidak akan menghantar pautan untuk log masuk atau meminta OTP anda. Jika sudah membalas, hubungi nombor di belakang kad anda sekarang.', adviceCareful: 'Semak dengan pengirim melalui nombor yang anda cari sendiri. Jangan ketik pautan dalam mesej.', adviceOk: 'Tiada tanda penipuan yang jelas, tetapi model boleh silap. Jika ia meminta wang, kod atau log masuk, berhenti dan semak.', adviceUnsure: 'Mesej terlalu pendek. Tampal mesej penuh.', talk: 'Hubungi pasukan anti-penipuan', model: 'Cara ia berfungsi', s1: 'Yuran bungkusan', s2: 'Makan malam keluarga', s3: 'Panggilan "polis"' },
  ta: { title: 'செய்தியைச் சரிபார்', lead: 'உங்களுக்குச் சந்தேகமான SMS, WhatsApp அல்லது மின்னஞ்சலை ஒட்டவும். உங்கள் ஃபோனில் உள்ள மாதிரி சொற்களைப் படித்து மோசடிகள் பயன்படுத்தும் முறைகளைத் தேடும். செய்தி உங்கள் ஃபோனை விட்டு வெளியே போகாது.', label: 'செய்தி', ph: 'செய்தியை இங்கே ஒட்டவும்', check: 'இந்தச் செய்தியைச் சரிபார்', samples: 'அல்லது இவற்றை முயற்சிக்கவும்', scam: 'பெரும்பாலும் மோசடி', careful: 'கவனமாக இருங்கள்', ok: 'சாதாரண செய்தி போலத் தெரிகிறது', unsure: 'முடிவு செய்யப் போதவில்லை', chance: 'மோசடியாக இருக்கும் வாய்ப்பு', why: 'ஆபத்தை உயர்த்திய சொற்கள்', lowered: 'ஆபத்தைக் குறைத்த சொற்கள்', adviceScam: 'எந்த இணைப்பையும் தட்ட வேண்டாம், பதில் அனுப்ப வேண்டாம், அதிலுள்ள எண்ணை அழைக்க வேண்டாம். OCBC உள்நுழைய இணைப்பு அனுப்பாது, OTP கேட்காது. ஏற்கனவே பதில் அனுப்பியிருந்தால், உங்கள் அட்டையின் பின்புறமுள்ள எண்ணை இப்போதே அழைக்கவும்.', adviceCareful: 'நீங்களே கண்டுபிடித்த எண் மூலம் அனுப்பியவரிடம் சரிபாருங்கள். செய்தியிலுள்ள இணைப்புகளைத் தட்ட வேண்டாம்.', adviceOk: 'மோசடி அறிகுறி எதுவும் தெரியவில்லை, ஆனால் மாதிரி தவறலாம். பணம், குறியீடு அல்லது உள்நுழைவு கேட்டால், நிறுத்திச் சரிபாருங்கள்.', adviceUnsure: 'செய்தி மிகக் குறுகியது. முழுச் செய்தியையும் ஒட்டவும்.', talk: 'மோசடி எதிர்ப்புக் குழுவிடம் பேசுங்கள்', model: 'இது எப்படி வேலை செய்கிறது', s1: 'பார்சல் கட்டணம்', s2: 'குடும்ப விருந்து', s3: '"காவல்துறை" அழைப்பு' }
};
const MSG_SAMPLES = [
  'Your parcel is on hold at our warehouse. Pay S$2.50 redelivery fee within 24 hours at sg-post-redeliver.top or it will be returned',
  'Hi Ma, I reached the restaurant already. We are at table 12, take your time',
  'This is Inspector Lee from the police. Your bank account is involved in a crime. Do not hang up and transfer your money to a safe account immediately'
];
function tokLabel(t) { return ({ __link: 'a link', __shortlink: 'a short link', __iplink: 'a link made of numbers', __money: 'an amount of money', __phone: 'a phone number', __deadline: 'a deadline' })[t] || t; }
function viewMsgCheck() {
  const T = MSG_T[S.settings.lang] || MSG_T.en, m = G.ml.msgRes;
  let res = '';
  if (m) {
    const cls = m.level === 'scam' ? 'bad' : m.level === 'careful' ? 'warn' : m.level === 'ok' ? 'ok' : 'info';
    const up = m.parts.filter(x => x.w > 0.4).slice(0, 6), down = m.parts.filter(x => x.w < -0.4).slice(0, 4);
    res = '<div class="ml-verdict ' + cls + '" role="status" id="msg-verdict"><div class="ml-v-top"><span class="ml-v-pct">' + mlPct(m.p) + '%</span><div><div class="ml-v-t">' + esc(T[m.level]) + '</div><div class="small">' + esc(T.chance) + '</div></div></div>' +
      '<div class="ml-g-bar"><span style="width:' + mlPct(m.p) + '%"></span></div>' +
      (up.length ? '<div class="small" style="margin-top:10px"><b>' + esc(T.why) + ':</b></div><div class="ml-toks">' + up.map(x => '<span class="ml-tok up">' + esc(tokLabel(x.t)) + '</span>').join('') + '</div>' : '') +
      (down.length ? '<div class="small" style="margin-top:8px"><b>' + esc(T.lowered) + ':</b></div><div class="ml-toks">' + down.map(x => '<span class="ml-tok down">' + esc(tokLabel(x.t)) + '</span>').join('') + '</div>' : '') +
      '<p class="small" style="margin:10px 0 0">' + esc(T['advice' + m.level[0].toUpperCase() + m.level.slice(1)]) + '</p>' +
      (m.level === 'scam' || m.level === 'careful' ? '<button class="btn dark block" style="margin-top:10px" data-a="helperAsk" data-v="__person">' + esc(T.talk) + '</button>' : '') + '</div>';
  }
  return header(T.title) + '<div class="pad">' +
    '<p class="muted" style="margin-top:0">' + esc(T.lead) + '</p>' +
    '<label class="lbl" for="msg-in" style="font-weight:700">' + esc(T.label) + '</label>' +
    '<textarea id="msg-in" class="input ml-ta" rows="5" placeholder="' + esc(T.ph) + '" data-ml="msg">' + esc(G.ml.msg) + '</textarea>' +
    '<div class="small muted" style="margin:10px 0 6px">' + esc(T.samples) + '</div><div class="row" style="flex-wrap:wrap;gap:6px">' +
    [T.s1, T.s2, T.s3].map((s, i) => '<button class="pill" data-a="mlSample" data-v="' + i + '">' + esc(s) + '</button>').join('') + '</div>' +
    '<button class="btn dark block" style="margin-top:14px" data-a="mlCheckMsg">' + ic('shield', 18) + ' ' + esc(T.check) + '</button>' + res +
    '<details class="card ml-how" style="margin-top:14px"><summary>' + esc(T.model) + '</summary><p class="small muted">A Naive Bayes model trained on ' + ML.nb.nDocs + ' example messages (' + ML.nb.nScam + ' scams). On a small set of made-up test messages it was right ' + mlPct(ML.nb.test.acc) + '% of the time. It looks at words, links, amounts, phone numbers and deadlines. It can be wrong, so the advice always tells you what to check.</p></details>' +
    '</div>';
}

/* ---------- Machine learning view (for judges) ---------- */
function svgBars(items, o) {
  o = o || {};
  const W = 560, rowH = 30, padL = 230, padR = 64, H = items.length * rowH + 26;
  const mx = Math.max(0.01, ...items.map(i => Math.abs(i.v)));
  const mid = o.oneSided ? padL : padL + (W - padL - padR) / 2, half = o.oneSided ? (W - padL - padR) : (W - padL - padR) / 2;
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ml-svg" role="img" aria-label="' + esc(o.label || 'Bar chart') + '">';
  s += '<line x1="' + mid + '" y1="4" x2="' + mid + '" y2="' + (H - 18) + '" stroke="#b9bcc4" stroke-width="1"/>';
  items.forEach((it, i) => {
    const y = 6 + i * rowH, len = Math.max(2, Math.abs(it.v) / mx * half), pos = it.v >= 0;
    const x = pos ? mid : mid - len, col = pos ? '#d0342c' : '#3b6fb6';
    s += '<g><title>' + esc(it.label) + ': ' + (it.v >= 0 ? '+' : '') + it.v.toFixed(2) + '</title><rect x="0" y="' + (y - 2) + '" width="' + W + '" height="' + (rowH - 2) + '" fill="transparent"/>' +
      '<text x="' + (padL - 12) + '" y="' + (y + 15) + '" text-anchor="end" class="ml-ax">' + esc(it.label) + '</text>' +
      '<rect x="' + x + '" y="' + (y + 4) + '" width="' + len + '" height="' + (rowH - 14) + '" rx="4" fill="' + col + '"/>' +
      '<text x="' + (pos ? x + len + 6 : x - 6) + '" y="' + (y + 15) + '" text-anchor="' + (pos ? 'start' : 'end') + '" class="ml-val">' + (o.fmt ? o.fmt(it.v) : (it.v >= 0 ? '+' : '') + it.v.toFixed(2)) + '</text></g>';
  });
  if (!o.oneSided) s += '<text x="' + (mid - 8) + '" y="' + (H - 4) + '" text-anchor="end" class="ml-ax">lowers the score</text><text x="' + (mid + 8) + '" y="' + (H - 4) + '" class="ml-ax">raises the score</text>';
  return s + '</svg>';
}
function svgLine(vals, o) {
  const W = 300, H = 150, pl = 40, pr = 10, pt = 10, pb = 26;
  const mx = Math.max(...vals), mn = Math.min(0, ...vals);
  const X = i => pl + i / (vals.length - 1) * (W - pl - pr), Y = v => pt + (1 - (v - mn) / (mx - mn || 1)) * (H - pt - pb);
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ml-svg" role="img" aria-label="' + esc(o.label) + '">';
  [0, 0.5, 1].forEach(f => { const v = mn + f * (mx - mn); s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#e6e7eb"/><text x="' + (pl - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end" class="ml-ax">' + v.toFixed(2) + '</text>'; });
  s += '<polyline fill="none" stroke="#d0342c" stroke-width="2" stroke-linejoin="round" points="' + vals.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ') + '"/>';
  s += '<text x="' + pl + '" y="' + (H - 6) + '" class="ml-ax">' + esc(o.x0) + '</text><text x="' + (W - pr) + '" y="' + (H - 6) + '" text-anchor="end" class="ml-ax">' + esc(o.x1) + '</text>';
  return s + '</svg>';
}
function svgRoc(r) {
  const W = 300, H = 290, p = 34, S2 = 250;
  const X = v => p + v * S2, Y = v => 10 + (1 - v) * S2;
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ml-svg ml-roc" role="img" aria-label="ROC curve, area ' + r.auc.toFixed(2) + '">';
  s += '<rect x="' + p + '" y="10" width="' + S2 + '" height="' + S2 + '" fill="none" stroke="#e6e7eb"/><line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(1) + '" y2="' + Y(1) + '" stroke="#b9bcc4" stroke-dasharray="4 4"/>';
  s += '<polyline fill="none" stroke="#d0342c" stroke-width="2" points="' + r.pts.map(q => X(q[0]).toFixed(1) + ',' + Y(q[1]).toFixed(1)).join(' ') + '"/>';
  s += '<text x="' + (p + S2 / 2) + '" y="' + (H - 4) + '" text-anchor="middle" class="ml-ax">False alarms</text><text x="10" y="' + (10 + S2 / 2) + '" transform="rotate(-90 10 ' + (10 + S2 / 2) + ')" text-anchor="middle" class="ml-ax">Caught</text>';
  return s + '</svg>';
}
function mlKpis(m, auc) {
  const k = (l, v, sub) => '<div class="ml-kpi"><div class="ml-kpi-l">' + l + '</div><div class="ml-kpi-v">' + v + '</div><div class="ml-kpi-s">' + sub + '</div></div>';
  return '<div class="ml-kpis">' + k('Accuracy', mlPct(m.acc) + '%', 'right answers on synthetic test data it never saw') + k('Precision', mlPct(m.prec) + '%', 'of alerts were real') + k('Recall', mlPct(m.rec) + '%', 'of real cases caught') + k('ROC AUC', auc.toFixed(2), '1.00 is perfect, 0.50 is a coin toss') + '</div><p class="small ml-honest"><b>What these numbers mean:</b> they are measured on synthetic data that this page generates, so they show the model works as designed. They do not show how it would do with real customers. That needs the real-data trial below.</p>';
}
function mlConf(m, pos, neg) {
  const tot = m.tp + m.fp + m.tn + m.fn, cell = (v, good) => '<td class="' + (good ? 'g' : 'b') + '" style="--a:' + (0.12 + 0.75 * v / tot).toFixed(2) + '"><b>' + v + '</b><span>' + mlPct(v / tot) + '%</span></td>';
  return '<table class="ml-cm" aria-label="Confusion matrix"><thead><tr><th></th><th>Model said ' + pos + '</th><th>Model said ' + neg + '</th></tr></thead><tbody>' +
    '<tr><th>Really ' + pos + '</th>' + cell(m.tp, 1) + cell(m.fn, 0) + '</tr><tr><th>Really ' + neg + '</th>' + cell(m.fp, 0) + cell(m.tn, 1) + '</tr></tbody></table>';
}
function viewML() {
  const v = G.ml.view, Sx = ML.struggle, R = ML.risk, N = ML.nb;
  const tab = (k, l) => '<button data-a="mlTab" data-v="' + k + '" aria-pressed="' + (v === k) + '">' + l + '</button>';
  let h = '<div class="wide ml-page"><div class="dash-card ml-hero"><div><div class="ml-eyebrow">On-device machine learning</div><h1 class="ml-h1">Three small models that learn from behaviour, never from who you are</h1>' +
    '<p class="lead">All three are trained inside this page when it opens (' + ML.ms + ' ms, no internet, no libraries) on synthetic data, then run on the phone. Inputs are only what the customer does and the payment itself. Age, health, income, race, gender and language are never inputs. A model can <b>add</b> help or a check; it can never remove a fee, a risk warning, the safety check or the final confirm step.</p><p class="lead" style="margin-top:6px"><b>Proof of concept.</b> The data is synthetic, so the scores below show that the models work as designed, not how well they would work for real customers.</p></div>' +
    '<div class="ml-hero-side"><button class="btn dark" data-a="mlRetrain">' + ic('sparkle', 18) + ' Retrain on new synthetic data</button><div class="small muted">Last trained ' + esc(ML.trainedAt) + ' · seed ' + Sx.seed + '</div></div></div>' +
    '<div class="seg ml-tabs" role="group" aria-label="Model">' + tab('struggle', 'Struggle detector') + tab('scam', 'Scam message model') + tab('risk', 'Payment risk (shadow)') + tab('money', 'Money models + APIs') + tab('log', 'Predictions this session') + '</div>';

  if (v === 'struggle') {
    const pl = G.ml.play, x = pl, vec = ML.sVec(x), p = ML.predictLR(Sx.model, vec), c = ML.contribLR(Sx.model, vec);
    h += '<div class="ml-grid"><div class="dash-card"><h2>What it does</h2><p class="lead">Live Adaptation used fixed rules only: 2 wrong tries, 15 seconds idle, 2 trips back, 4 dead taps. Real people show smaller signs together, like one wrong try plus deleting and retyping plus a long pause. This logistic regression adds those up into one probability. At ' + mlPct(Sx.thr) + '% or more, with at least two different signs, the step simplifies itself and says why, with Undo. The fixed rules still run as a safety net.</p>' +
      '<div class="ml-facts"><span><b>Type</b> Logistic regression, 7 inputs</span><span><b>Trained on</b> ' + Sx.nTrain.toLocaleString() + ' synthetic step sessions</span><span><b>Tested on</b> ' + Sx.nTest.toLocaleString() + ' unseen sessions</span><span><b>Runs</b> on the phone, every second during a step</span><span><b>Learns per customer</b> pressing Undo raises that customer\'s bar by 5 points</span></div></div>' +
      '<div class="dash-card"><h2>Try it</h2><p class="lead">Move the sliders to describe a step. The score and its reasons update.</p>' +
      ML.SF.map(fd => '<label class="ml-sl"><span>' + esc(fd.label) + '</span><input type="range" min="0" max="' + fd.max + '" step="' + fd.step + '" value="' + x[fd.k] + '" data-ml="play" data-k="' + fd.k + '" aria-valuetext="' + esc(fd.fmt(x[fd.k])) + '"><b id="mlv-' + fd.k + '">' + esc(fd.fmt(x[fd.k])) + '</b></label>').join('') +
      '<div id="ml-play-out">' + mlPlayOut(p, c, x) + '</div></div></div>' +
      '<div class="ml-grid3"><div class="dash-card"><h2>How it did on unseen data</h2><p class="lead">At the ' + mlPct(Sx.thr) + '% bar the app acts on. We set it high on purpose: changing a screen for someone who is fine is worse than missing a small struggle the rules will catch.</p>' + mlKpis(Sx.test, Sx.roc.auc) + mlConf(Sx.test, 'struggling', 'fine') + '</div>' +
      '<div class="dash-card"><h2>ROC curve</h2><p class="lead">How caught cases trade against false alarms at every possible bar.</p>' + svgRoc(Sx.roc) + '</div>' +
      '<div class="dash-card"><h2>Training loss</h2><p class="lead">Log loss falling as the model learns (' + Sx.model.epochs + ' rounds of gradient descent).</p>' + svgLine(Sx.model.loss, { label: 'Training loss by round', x0: 'round 1', x1: 'round ' + Sx.model.epochs }) + '</div></div>' +
      '<div class="ml-grid"><div class="dash-card"><h2>What the model learned</h2><p class="lead">Weight of each input after scaling. Bigger bars matter more.</p>' + svgBars(ML.SF.map((fd, j) => ({ label: fd.label, v: Sx.model.w[j] })), { label: 'Struggle model weights', oneSided: Sx.model.w.every(v => v >= 0) }) + '</div>' +
      '<div class="dash-card"><h2>Fairness check</h2><p class="lead">Language is never an input, but we still check the model works as well for every language group. In the bank this must be re-run on real data before launch.</p><table class="t"><thead><tr><th>Language group</th><th>Sessions</th><th>Accuracy</th><th>Precision</th><th>Recall</th></tr></thead><tbody>' +
      Sx.slices.map(sl => '<tr><td>' + ({ en: 'English', zh: '中文', ms: 'Bahasa Melayu', ta: 'தமிழ்' })[sl.g] + '</td><td>' + sl.n + '</td><td>' + mlPct(sl.acc) + '%</td><td>' + mlPct(sl.prec) + '%</td><td>' + mlPct(sl.rec) + '%</td></tr>').join('') +
      '</tbody></table><p class="small muted">Biggest gap between groups: ' + Math.round((Math.max(...Sx.slices.map(s => s.acc)) - Math.min(...Sx.slices.map(s => s.acc))) * 100) + ' points in accuracy, ' + Math.round((Math.max(...Sx.slices.map(s => s.rec)) - Math.min(...Sx.slices.map(s => s.rec))) * 100) + ' in recall. These groups were generated the same way, so the gaps here are chance. On real data, gaps this size would have to be investigated before launch.</p>' +
      '<h3 style="font-size:14px;margin:14px 0 6px">This customer</h3><p class="small muted" style="margin:0">' + esc(S.short) + '\'s bar: <b>' + mlPct(mlThr()) + '%</b>' + (S.mlThr ? ' (raised after they pressed Undo)' : ' (default)') + '. Erasing the Confidence Map does not touch it; resetting the persona does.</p></div></div>';
  } else if (v === 'scam') {
    const m = G.ml.labRes;
    h += '<div class="ml-grid"><div class="dash-card"><h2>What it does</h2><p class="lead">Customers can paste a message into <b>Check a message</b> (Plan tab, or Helper). A multinomial Naive Bayes model reads the words and special tokens (a link, a short link, a link made of numbers, an amount, a phone number, a deadline) and gives the chance it is a scam, plus the words that pushed it up or down. Helper also runs it on long messages people paste in.</p>' +
      '<div class="ml-facts"><span><b>Type</b> Multinomial Naive Bayes with Laplace smoothing</span><span><b>Trained on</b> ' + N.nDocs + ' example messages, ' + N.nScam + ' scams, ' + N.vocab + ' distinct words</span><span><b>Tested with</b> 5-fold cross-validation</span><span><b>Privacy</b> runs on the phone; the message is not sent anywhere</span></div>' +
      mlKpis(N.test, N.roc.auc) + mlConf(N.test, 'scam', 'normal') + '</div>' +
      '<div class="dash-card"><h2>Try it</h2><textarea class="input ml-ta" rows="5" data-ml="lab" aria-label="Message to test">' + esc(G.ml.lab || MSG_SAMPLES[0]) + '</textarea><button class="btn dark" style="margin-top:10px" data-a="mlLab">Score this message</button>' +
      (m ? '<div class="ml-verdict ' + (m.level === 'scam' ? 'bad' : m.level === 'careful' ? 'warn' : m.level === 'ok' ? 'ok' : 'info') + '"><div class="ml-v-top"><span class="ml-v-pct">' + mlPct(m.p) + '%</span><div><div class="ml-v-t">' + esc(MSG_T.en[m.level]) + '</div><div class="small">chance it is a scam</div></div></div>' +
        svgBars(m.parts.slice(0, 8).map(q => ({ label: tokLabel(q.t), v: q.w })), { label: 'Word contributions' }) + '</div>' : '') + '</div></div>' +
      '<div class="ml-grid"><div class="dash-card"><h2>Words most linked to scams</h2>' + svgBars(N.topScam.map(q => ({ label: tokLabel(q.t), v: q.w })), { label: 'Words most linked to scams', oneSided: true, fmt: v => '×' + Math.exp(v).toFixed(1) }) + '<p class="small muted">How many times more likely the word is in a scam than in a normal message.</p></div>' +
      '<div class="dash-card"><h2>Limits we are honest about</h2><ul class="small" style="margin:0;padding-left:18px;line-height:1.6"><li>' + N.nDocs + ' synthetic messages is tiny. A real model would train on OCBC and ScamShield reports, re-trained as scams change.</li><li>English only for now; Chinese, Malay and Tamil messages need their own training data.</li><li>It never blocks anything. It explains and points to a person.</li><li>Scammers adapt, so it sits next to the fixed checks, not instead of them.</li></ul></div></div>';
  } else if (v === 'risk') {
    const x = G.ml.risk, vec = ML.rVec(x), p = ML.predictLR(R.model, vec), c = ML.contribLR(R.model, vec);
    h += '<div class="ml-grid"><div class="dash-card"><h2>What it does</h2><p class="lead">Scores every payment at the check screen from the payment itself: new payee, amount compared with this customer\'s usual, first overseas transfer, payee reported by others, a caller giving instructions, time of night and how many payments in the last hour. It runs in <b>shadow mode</b>: the score goes to the log and to staff, but the fixed safety rules still decide when to pause. That is how a bank would test a model before trusting it. Even then, it could only ever <b>add</b> a safety check.</p>' +
      '<div class="ml-facts"><span><b>Type</b> Logistic regression with class weights (fraud is rare)</span><span><b>Trained on</b> ' + R.nTrain.toLocaleString() + ' synthetic payments, ' + (R.base * 100).toFixed(1) + '% fraud</span><span><b>Tested on</b> ' + R.nTest.toLocaleString() + ' unseen payments</span></div>' + mlKpis(R.test, R.roc.auc) + mlConf(R.test, 'fraud', 'genuine') + '</div>' +
      '<div class="dash-card"><h2>Try it</h2>' + ML.RF.map(fd => fd.k === 'ratio' ? '<label class="ml-sl"><span>' + esc(fd.label) + '</span><input type="range" min="0.2" max="40" step="0.2" value="' + x.ratio + '" data-ml="risk" data-k="ratio"><b id="mlr-ratio">' + fd.fmt(x.ratio) + '</b></label>' : fd.k === 'recent' ? '<label class="ml-sl"><span>' + esc(fd.label) + '</span><input type="range" min="0" max="5" step="1" value="' + x.recent + '" data-ml="risk" data-k="recent"><b id="mlr-recent">' + x.recent + '</b></label>' :
        '<label class="ml-chk"><input type="checkbox" data-ml="risk" data-k="' + fd.k + '"' + (x[fd.k] ? ' checked' : '') + '> ' + esc(fd.label) + '</label>').join('') +
      '<div id="ml-risk-out">' + mlRiskOut(p, c, x) + '</div></div></div>' +
      '<div class="ml-grid"><div class="dash-card"><h2>What the model learned</h2>' + svgBars(ML.RF.map((fd, j) => ({ label: fd.label, v: R.model.w[j] })), { label: 'Payment risk weights', oneSided: R.model.w.every(v => v >= 0) }) + '</div><div class="dash-card"><h2>ROC curve</h2>' + svgRoc(R.roc) + '<p class="small muted">With fraud this rare, accuracy alone flatters a model, so we report precision and recall too.</p></div></div>';
  }
  if (v === 'struggle' || v === 'scam' || v === 'risk') h += mlRealData(v);
  if (v === 'money') {
    h += (typeof mlMoneyView === 'function' ? mlMoneyView() : '');
  } else if (v === 'log') {
    h += '<div class="dash-card"><h2>Predictions this session</h2><p class="lead">Every time a model scored something in the customer app. Go back to the Customer app, start a payment and struggle a little, or check a message, then come back.</p>' +
      (G.ml.preds.length ? '<table class="t"><thead><tr><th>Time</th><th>Customer</th><th>Model</th><th>What it saw</th><th>Score</th><th>What happened</th></tr></thead><tbody>' + G.ml.preds.map(q => '<tr><td>' + esc(q.t) + '</td><td>' + esc(q.who) + '</td><td>' + esc(q.model) + '</td><td class="small">' + esc(q.input) + '</td><td><b>' + mlPct(q.p) + '%</b></td><td class="small">' + esc(q.outcome) + '</td></tr>').join('') + '</tbody></table>' : '<div class="empty">Nothing scored yet in this session.</div>') + '</div>';
  }
  return h + '</div>';
}
function mlRealData(v) {
  const steps = {
    struggle: [['Shadow mode, 3 months', 'Score real payment steps on customers\' phones, but change nothing. Only the score is logged.'], ['Label what really happened', 'Did the customer give up, make a mistake, open Helper or call the hotline? Those become the real labels.'], ['Beat the fixed rules', 'Switch it on only if, at the chosen bar, at least 9 in 10 alerts are real and it catches struggles the fixed rules miss.'], ['Fairness audit', 'Compare results across languages and the other customer groups the bank already records. These are used only for the check, never as inputs.'], ['Small rollout', 'Start with 5% of customers. If more than 1 in 5 changed screens are undone, pause and retrain.']],
    scam: [['Real examples', 'Train on scam messages reported to OCBC and ScamShield, and on normal messages customers agree to share, in all four languages.'], ['Test on newer scams', 'Train on older months and test on the latest month, because scams change.'], ['Explain, never block', 'It only gives advice and points to a person, so a mistake cannot stop a real message or payment.'], ['Retrain monthly', 'New scam scripts appear every few weeks.']],
    risk: [['Shadow mode first', 'Score real payments next to the existing fraud rules and log both.'], ['Compare with confirmed fraud', 'After 3 to 6 months, check which payments turned out to be fraud.'], ['Only add checks', 'Even if it works, it can only ask for a safety check. It can never approve a payment the rules would stop.'], ['Model risk review', 'Goes through the bank\'s model risk process under MAS guidance before it affects any customer.']]
  }[v] || [];
  return '<div class="dash-card"><h2>How we would prove it with real data</h2><p class="lead">The prototype shows the idea works. Before launch, a bank would do this:</p><ol class="ml-steps">' + steps.map(x => '<li><b>' + esc(x[0]) + '.</b> ' + esc(x[1]) + '</li>').join('') + '</ol></div>';
}
function mlPlayOut(p, c, x) {
  const act = p >= mlThr() && mlSignals(x) >= 2;
  return '<div class="ml-play"><div class="ml-g-row"><span class="ml-g-num">' + mlPct(p) + '%</span><span class="small muted">' + (act ? 'The app would make this step simpler' : p >= mlThr() ? 'High, but only one kind of sign, so the fixed rules decide' : 'No change to the screen') + '</span></div>' +
    '<div class="ml-g-bar"><span style="width:' + mlPct(p) + '%"></span><i style="left:' + mlPct(mlThr()) + '%"></i></div>' +
    svgBars(ML.SF.map((fd, j) => ({ label: fd.label, v: c[j] })), { label: 'Why: contribution of each input' }) + '</div>';
}
function mlRiskOut(p, c) {
  return '<div class="ml-play"><div class="ml-g-row"><span class="ml-g-num">' + mlPct(p) + '%</span><span class="small muted">' + (p >= 0.5 ? 'Would recommend a safety check (shadow mode: logged, not acted on)' : 'Low risk') + '</span></div><div class="ml-g-bar"><span style="width:' + mlPct(p) + '%"></span><i style="left:50%"></i></div>' +
    svgBars(ML.RF.map((fd, j) => ({ label: fd.label, v: c[j] })), { label: 'Why: contribution of each input' }) + '</div>';
}

/* ---------- actions ---------- */
Object.assign(A, {
  mlTab(v) { G.ml.view = v; },
  mlSim() {
    const st = mlTrack();
    if (!st || G.view !== 'app') { toast('Start a payment first, then press this on any step.'); return; }
    if (st.flow.mode === 'quick') { toast('The model does not act on the quick form. Switch to "Guide me step by step" first.'); return; }
    st.fixes += 4; st.taps += 1; st.start -= 20000;
    addLog('Demo: added small struggle signs', '4 deletions, 1 dead tap and 20 more seconds on this step. No single fixed rule is met.', 'event');
    mlCheck();
  },
  mlRetrain() { ML.trainAll(Math.floor(Math.random() * 100000)); },
  mlLab() { const el = document.querySelector('[data-ml="lab"]'); G.ml.lab = el ? el.value : G.ml.lab; G.ml.labRes = mlScam(G.ml.lab || ''); },
  mlSample(i) { G.ml.msg = MSG_SAMPLES[Number(i)]; G.ml.msgRes = null; },
  mlCheckMsg() {
    const el = document.getElementById('msg-in'); G.ml.msg = el ? el.value : G.ml.msg;
    if (!String(G.ml.msg || '').trim()) { toast('Paste a message first.'); return; }
    const r = mlScam(G.ml.msg); G.ml.msgRes = r;
    mlRecord('Scam message model', String(G.ml.msg).slice(0, 70) + (G.ml.msg.length > 70 ? '…' : ''), r.p, MSG_T.en[r.level]);
    addLog('Checked a message: ' + MSG_T.en[r.level].toLowerCase() + ' (' + mlPct(r.p) + '%)', 'Scored on your phone by the scam message model. The message was not sent anywhere.', 'safety');
    track('ml_msg', { level: r.level });
  }
});

/* ---------- hooks into the app ---------- */
(function () {
  const _handle = handle;
  handle = function (name, v, el, e) {
    const r = _handle(name, v, el, e);
    if (name === 'openHelper' || name === 'helperAsk' || name === 'helperAbout' || name === 'nudgeExplain') { if (S.flow) S.flow.mlHelper = true; }
    if (['flowNext', 'flowBack', 'flowQuickNext'].includes(name) && mlCheck()) render();
    // Staff see both scores on hand-off tickets
    G.tickets.forEach(tk => {
      if (tk.ml || tk.persona !== S.personaId || !Array.isArray(tk.summary)) return;
      tk.ml = true;
      if (S.flow && S.flow.mlRisk) tk.summary.push(['Payment risk model (shadow)', mlPct(S.flow.mlRisk.p) + '% · ' + (mlRiskReasons(S.flow.mlRisk).map(o => o.fd.label.toLowerCase()).join(', ') || 'no strong signs')]);
      const lv = S.flow && S.flow.live && Object.values(S.flow.live.on).find(o => o.ml);
      if (lv) tk.summary.push(['Struggle detector', 'Step simplified at ' + mlPct(lv.ml.p) + '%: ' + mlTopReasons(lv.ml.c, lv.ml.x, 3).map(o => o.fd.label.toLowerCase()).join(', ')]);
    });
    return r;
  };
  // Risk score at the check screen, before the fixed rules decide
  const _reviewYes = A.reviewYes;
  A.reviewYes = function () {
    const f = S.flow;
    if (f && !f.mlRisk) {
      const rs = mlRiskScore(f); f.mlRisk = rs;
      const ruled = needsPause(f), would = rs.p >= ML.risk.thr;
      const why = mlRiskReasons(rs).map(o => o.fd.label.toLowerCase()).join(', ');
      addLog('Payment risk model (shadow mode): ' + mlPct(rs.p) + '%', (why ? 'Raised by: ' + why + '. ' : '') + (would && !ruled ? 'It would have asked for a safety check; the rules did not. Logged for review.' : 'The fixed safety rules decide; the score is only logged.'), 'engine');
      mlRecord('Payment risk (shadow)', taskName(f.task) + ' · ' + money(Number(f.data.amount || f.data.limit || 0)), rs.p, ruled ? 'Rules paused it' : would ? 'Would have paused (logged only)' : 'No pause');
    }
    return _reviewYes.apply(this, arguments);
  };
  // Learning from Undo: this customer's bar goes up
  const _undo = A.liveUndo;
  A.liveUndo = function () {
    const f = S.flow, st = flowSteps()[f.step], on = f && f.live && f.live.on[st.id];
    const r = _undo.apply(this, arguments);
    if (on && on.ml) {
      const before = mlThr(); S.mlThr = Math.min(0.95, before + 0.05);
      addLog('The struggle model learned from your Undo', 'It will wait for clearer signs before changing a screen for you (bar ' + mlPct(before) + '% → ' + mlPct(S.mlThr) + '%). Stored on this phone only.', 'you');
      mlRecord('Struggle detector', 'Customer pressed Undo', on.ml.p, 'Bar raised to ' + mlPct(S.mlThr) + '%');
    }
    return r;
  };
  // Explain model decisions inside the banner
  const _banner = liveBanner;
  liveBanner = function (f, step) {
    let h = _banner(f, step);
    const on = liveFor(f, step.id);
    if (h && on && on.ml && f.live.why) {
      const top = mlTopReasons(on.ml.c, on.ml.x, 3);
      h = h.replace('</ul>', '<li><b>Model:</b> ' + mlPct(on.ml.p) + '% sure, mostly from ' + top.map(o => esc(o.fd.label.toLowerCase()) + ' (' + esc(o.fd.fmt(o.v)) + ')').join(', ') + '.</li></ul>');
    }
    return h;
  };
  // Dead taps and deleting/retyping, counted per step
  document.addEventListener('click', e => {
    if (!e.target.closest('#cust-phone .content') || e.target.closest('[data-a],button,input,select,textarea,label,a')) return;
    const st = mlTrack(); if (st) { st.taps++; if (mlCheck()) render(); }
  });
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.matches('#cust-phone input[data-in]')) {
      const prev = el.__mlPrev != null ? el.__mlPrev : el.defaultValue || '';
      if (el.value.length < prev.length) { const st = mlTrack(); if (st) st.fixes++; }
      el.__mlPrev = el.value;
      mlGauge();
    }
    if (el.matches('[data-ml="msg"]')) G.ml.msg = el.value;
    if (el.matches('[data-ml="lab"]')) G.ml.lab = el.value;
    if (el.matches('[data-ml="play"]')) {
      const k = el.dataset.k; G.ml.play[k] = Number(el.value);
      const fd = ML.SF.find(q => q.k === k), b = document.getElementById('mlv-' + k); if (b) b.textContent = fd.fmt(G.ml.play[k]); el.setAttribute('aria-valuetext', fd.fmt(G.ml.play[k]));
      const vec = ML.sVec(G.ml.play), o = document.getElementById('ml-play-out');
      if (o) o.innerHTML = mlPlayOut(ML.predictLR(ML.struggle.model, vec), ML.contribLR(ML.struggle.model, vec), G.ml.play);
    }
    if (el.matches('[data-ml="risk"]')) mlRiskInput(el);
  });
  document.addEventListener('change', e => { if (e.target.matches('input[type="checkbox"][data-ml="risk"]')) mlRiskInput(e.target); });
  function mlRiskInput(el) {
    const k = el.dataset.k; G.ml.risk[k] = el.type === 'checkbox' ? (el.checked ? 1 : 0) : Number(el.value);
    const b = document.getElementById('mlr-' + k); if (b) b.textContent = ML.RF.find(q => q.k === k).fmt(G.ml.risk[k]);
    const vec = ML.rVec(G.ml.risk), o = document.getElementById('ml-risk-out');
    if (o) o.innerHTML = mlRiskOut(ML.predictLR(ML.risk.model, vec), ML.contribLR(ML.risk.model, vec));
  }
  // Face ID moment on log in (visual only: the screen underneath is already live)
  const _login = A.login;
  A.login = function () {
    const r = _login.apply(this, arguments);
    if (!S.settings.reduceMotion) { G.faceId = true; clearTimeout(G.faceIdT); G.faceIdT = setTimeout(() => { G.faceId = false; render(); }, 1100); }
    return r;
  };
  // Re-score once a second while a step is on screen
  setInterval(() => { if (G.view !== 'app') return; if (mlCheck()) render(); else mlGauge(); }, 1000);
  render();
})();
