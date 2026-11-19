# Adaptive Banking prototype: feature guide (OCBC Innovation Challenge PS4)

Current build: 4.4. What changed in each build is in [`CHANGELOG.md`](../CHANGELOG.md); setup is in the [`README`](../README.md).

Student concept prototype for FSDP Assignment 1. Synthetic data only. Not an OCBC product.

Build 2 (11 Nov) keeps every feature of the merged build and adds the idea the whole pitch is now built around:
**an Adaptive Engine that builds every step for this customer, at this moment, on this channel**, from four inputs:
1. **Who you are:** Assistance Passport (language, plain words, larger text, read aloud, more time)
2. **What you can do:** the Confidence Map level for that task
3. **How it is going right now:** live struggle signals on this step (Live Adaptation)
4. **Where you are:** app, ATM or hotline

The engine only picks from approved building blocks. It never writes new text, and it never removes fees, risks, the safety check or the final confirm step.

## Build 4.1: works on every device, opens in VS Code (18 Nov)
- **The screen is just the app.** On a phone it fills the screen like a real app (no fake phone frame or status bar, respects the notch and home bar). On a tablet or computer the phone sits in the middle and shrinks to fit the window.
- **Demo tools are hidden in a drawer:** the "Demo tools" button at the top left (a small handle on the left edge on phones), Shift + D, or `?tools` in the address. It holds the sample customers, demo controls, behind the scenes, and the Adaptive Engine, four experiences, staff hand-off, bank insights and machine learning views. Other views have a "Back to the app" bar.
- **Presenter layout:** tick "Show the panels beside the app" in the drawer to get the side-by-side layout from earlier builds (remembered on that computer).
- **VS Code project:** the app in `src/` (`index.html`, `css/styles.css`, `js/app.js`, `js/ml.js`, `js/features.js`, `js/appmode.js`), a zero-dependency `server.js` (`npm start`), and `.vscode` settings so F5 starts the server and opens Chrome. Live Server works too.
- **Installable and offline:** manifest, icons and a service worker, so when it is served over https (for example Netlify Drop or GitHub Pages) phones can "Add to Home Screen" and open it full screen, even offline. The installed name is "Adaptive Banking", not OCBC.
- The single file `dist/adaptive-banking-prototype.html` still works on its own by double-clicking.

## Build 4: a money app that adapts to how you actually use it (18 Nov)
Less reading, more doing. Everything from build 3 still works. New:

### Realistic money
- Every customer now has a **60-day statement** of Singapore spending, dated from today: Kopitiam, Ya Kun, SimplyGo, NTUC FairPrice, Sheng Siong, SP Group, Town Council S&CC, Singtel or StarHub, Netflix, salary or CPF LIFE payouts, and PayNow to their own family. Nurul's shows business income and supplier costs.
- Recent activity looks like a bank statement: shop name, category icon, date, how it was paid.
- PayNow payment history now matches the statement.

### Creative features (each one adapts to the customer)
| Feature | Where | How it adapts |
| --- | --- | --- |
| **Safe to spend** | Home (under the balance), Plan > Money insights | Balance minus bills it finds repeating each month, minus a forecast of everyday spending, until the next pay day it detects. Simple-words customers see only this one number and the bills coming up |
| **Money insights** | Plan, or Home > Money insights | Spending by category with a ring chart and change vs last month; speaker button reads a one-sentence summary in the customer's language |
| **"For you" payment suggestion** | Home | Learns who you pay and when ("You usually pay Priya on Fridays in the evening"). One tap opens PayNow with the person and usual amount filled in; the check screen still comes first. × hides it |
| **Say it** | Microphone on Home, "Say a payment" on Pay & Transfer | Speak or type: "Send Priya 20 dollars", "What is my balance?", "Any bills due?", "Nearest ATM". It answers out loud and fills in the payment up to the check screen |
| **One voice** | Everywhere | Every read-aloud uses the best voice for the language, at the customer's chosen pace, with a "Reading..." bar and Stop at the top of the screen |
| **Nearest OCBC ATM** | Pay & Transfer > Find an OCBC ATM, and Home when money is locked | Uses your location and OpenStreetMap to find OCBC ATMs, with walking directions. Ties back to Money Lock, which only unlocks at an ATM |
| **Real camera QR** | Scan & Pay, camera button | Reads a real QR code with the phone camera |
| **Share receipt, haptics, chime** | Receipt | Share to any chat app; a tap and a soft chime when money is sent (off with Reduce motion) |
| **Live exchange rates** | Overseas transfer, amount step | Real SGD rates with a "Live rate" chip; sample rates offline |

### More machine learning (Machine learning tab > Money models + APIs)
| Model | Type | Result on synthetic data |
| --- | --- | --- |
| Spending categoriser | Naive Bayes on the description (words + 4-letter pieces) | 100% on shops it has seen, about 62% on brand-new shop names (honest limit; a bank would also use card category codes) |
| Safe-to-spend forecast | Linear regression on 30 days of everyday spending, big one-offs capped, monthly bills removed | about 12% average error predicting the next 7 days (backtest) |
| Next-payment predictor | Naive Bayes on day of week and time of day | right first guess 71-100% per customer, against 57-60% for "always guess the person they pay most" |
| Recurring bill detection | Rules on repeats (same payee, similar amount, same day each month) | Feeds Safe to spend and "Coming up" |

Plus the three from build 3 (struggle detector, scam message model, payment risk in shadow mode).

### APIs
Frankfurter (live exchange rates), OpenStreetMap Overpass (ATMs), Geolocation, Web Speech recognition and synthesis, BarcodeDetector with the camera, Web Share, Vibration and Web Audio. The Machine learning tab shows which ones are live on the device you are using. Everything falls back offline: sample rates, a sample ATM list, typing instead of speaking.

### 60-second demo for build 4
1. Arjun, Home: show **Safe to spend** under the balance and the **For you** card. Tap Pay: PayNow opens with Priya and the amount filled in.
2. Tap the **microphone**, then "Send Priya 20 dollars" (or type it). Continue: you land on the check screen.
3. Plan > **Money insights**: tap the speaker to hear the summary.
4. Pay & Transfer > **Find an OCBC ATM** > Use my location.
5. Machine learning tab > **Money models + APIs**.

Notes: microphone, camera and location need Chrome or Edge, and the browser will ask permission. Live rates and the ATM search need the internet.

## Build 3: machine learning and a more realistic app (13 Nov)
Built on the team's latest file, so it includes **PayNow Recent and payment history** (Pay & Transfer > Recent, or the Recent row on the PayNow step: tap a person to see every payment between you, then "Send again"), **Text mode that shows words only**, and **read aloud that reads numbers digit by digit and stops when tapped again**. Those screens now match the new look. Everything from build 2 and 2.1 still works the same way. New:

### Machine learning (new "Machine learning" tab)
Three small models are trained inside the page each time it opens (about 0.3 seconds, no internet, no libraries), on synthetic data, and then run on the phone. Inputs are only what the customer does and the payment itself. Age, health, income, race, gender and language are never inputs. A model can **add** help or a check; it can never remove a fee, a risk warning, the safety check or the final confirm step.

| Model | Type | What it does in the app | Test results (synthetic) |
| --- | --- | --- | --- |
| Struggle detector | Logistic regression, 7 behaviour inputs (wrong tries, seconds on step, back and forth, dead taps, deleting and retyping, opened Helper, task set to "New to me") | Scores every guided step once a second. At the bar (60%, chosen as the lowest bar where 9 in 10 alerts are real) **and** with at least 2 different signs, it triggers Live Adaptation with its own reason. The fixed rules still run. Pressing Undo raises that customer's bar by 5 points (it learns per customer, on the phone) | about 89% accuracy, 91% precision, 72% recall, ROC AUC 0.93 on 2,000 unseen sessions |
| Scam message model | Multinomial Naive Bayes on words plus special tokens (link, short link, numeric link, money, phone number, deadline) | **Plan > Check a message**, or paste a long message into Helper. Gives a percentage, the words that raised or lowered it, and what to do | about 86% accuracy, 97% recall, ROC AUC 0.97 (5-fold cross-validation on 120 messages) |
| Payment risk | Logistic regression with class weights, 7 payment inputs | Scores every payment at the check screen in **shadow mode**: logged and shown to staff on hand-off tickets, but the fixed safety rules still decide | about 98% accuracy, 79% precision, 81% recall, ROC AUC 0.92 (5.6% fraud in test data) |

The tab shows, for each model: what it does, metrics on unseen data, confusion matrix, ROC curve, training loss, learned weights, a "Try it" playground with the reasons for each score, a fairness check by language group, honest limits, and every prediction made in this session. "Retrain on new synthetic data" trains all three again with a new random seed.

In the Customer app, the judges' panel now shows the struggle score live, and a new demo control, "Machine learning: add small struggle signs on this step", makes the model act on a step where no single rule would.

### More realistic app
- Face ID moment when logging in, smooth screen changes, notification-style messages, a red dot on the bell, phone side buttons, buttons that press in.
- Recent activity on Home looks like a bank statement: icon, name, date, amount.
- New **Check a message** screen in Chinese, Malay and Tamil as well as English.

### 30-second ML demo
1. Customer app, Arjun: Pay & Transfer > Local. Press "Machine learning: add small struggle signs on this step". The step simplifies; tap "How was this decided?" to see the model's reasons. Press Undo: the log says the model raised Arjun's bar.
2. Plan > Check a message > "Police" call > Check this message.
3. Machine learning tab: move the sliders, then open Predictions this session.

### Things to say honestly
- The data is synthetic, so the numbers show the method works, not how well it would do at OCBC. Real training data would come from OCBC's own (consented, anonymised) app events and scam reports.
- The scam model only knows English words for now.

## Build 2.1: look and feel (11 Nov)
A visual polish only. Every screen, action, text and translation is unchanged, so the demo script and tests below still apply.
- **Closer to the OCBC app:** raised red Pay & Transfer button in the bottom bar, red-tinted shortcut icons, account card with the balance large, account tabs that scroll sideways instead of wrapping, and a cleaner red More header.
- **Nicer details:** new festive artwork on Home and Pay & Transfer (our own drawings, hidden in Calm mode), a real-looking status bar, softer cards and shadows, a slimmer Helper button that no longer covers the bottom bar, and the Inter typeface (falls back to the system font offline).
- **Task screens:** two-line titles instead of cramped ones, "Show as" and "Layout" options on one scrollable line each, a slimmer progress bar, tips as cards, a smoother slide to pay, and a success tick that pops in.
- **Still accessible:** all 7 text sizes, high contrast, extra spacing and reduce motion still apply to the new styles; the new pictures are hidden from screen readers, so the live accessibility audit in Bank insights still passes.
- No OCBC logo or real OCBC images are used, and the login still has no password fields.

## New in build 2
| What | Where to see it |
| --- | --- |
| OCBC look | Login screen, Home / Plan / Pay & Transfer / Rewards / More tabs, red header, shortcut card, slide to pay. The login has **no password fields**: "Log in (demo)" just enters as the persona chosen on the left |
| Adaptive Engine tab | Change the four inputs and watch the same step rebuild: language, Confidence level, "Struggling", and channel. The right panel lists why, the building blocks used, what is never changed, and the step as data |
| Live Adaptation | Any guided step: type a wrong UEN twice, go back and forth twice, tap empty space quickly 4 times, or wait 15 seconds (30 with "More time"). The step simplifies itself: one question, full explanation, plain words, bigger buttons, promotions hidden, extra options tucked away. "We made this step simpler" with **Undo** and "How was this decided?". On the quick form only repeated errors count, and the customer is moved to one question at a time with everything kept. Demo control: "Live Adaptation: simulate struggling on this step" |
| ATM channel | Adaptive Engine > Where you are > ATM: releasing Money Lock (which OCBC only allows at an ATM) after scanning the QR. Uses the Passport: language, large text, at most two choices, 90-second wait, audio |
| Hotline channel | Adaptive Engine > Hotline: the one-page caller brief for staff, with how to talk to this customer and a first line in their language |
| Check who you're paying | Pay & Transfer > Local. The bank's name for the account is shown masked and compared with what you typed. Demo: 123456789 is Tan Ah Beng (match); 555566667 belongs to someone else (stop warning) |
| Masked PayNow names | Contacts and the review screen show the PayNow name with letters hidden, as banks do since June 2026 |
| Calm mode | More > Calm mode hides promotions, deals and festive banners. Live Adaptation turns it on for a struggling step |
| Fixes | Money Lock is released only at an OCBC ATM (no branch). Undo never applies to paying a business (UEN) |
| Bank insights | New Live Adaptation panel: steps simplified, how often people pressed Undo, by signal |

## Moved in build 2
- Practice Hub and Spot the scam: **Plan** tab (and More > Practice Hub).
- Scan & Pay: Pay & Transfer > Scan, or a Home shortcut.
- Settings, Passport, Confidence Map, Family Co-pilot and all other features: **More**, grouped as in the OCBC app.
- Help code: More > headset icon, or More > Need more help.

## How to open
Double-click `dist/adaptive-banking-prototype.html`. It works offline in Chrome or Edge. For the pitch, use a laptop screen at least 1280 px wide.

The page has five tabs at the top:
- **Customer app:** the phone, with demo users and controls on the left and a live "behind the scenes" log on the right.
- **Adaptive Engine:** the four inputs, the rebuilt step (app, ATM or hotline) and the reasons.
- **One app, four experiences:** the four sample users side by side. "Open in the app" loads each one.
- **Staff hand-off:** the one-page summary an officer reads before one short in-app call, plus help code lookup.
- **Bank insights:** the designer and bank dashboard.

## Demo users (defined by needs, never by age)
| Need | Sample user | What to show |
| --- | --- | --- |
| Prefers to be shown | Mdm Lim | Welcome setup, "Show me how", dialect audio, Family Co-pilot |
| First-time banker | Arjun | Third guided PayNow triggers the quick-version offer; new bank transfer and overseas offer practice first |
| Business owner | Nurul | Quick forms for familiar tasks; cooling time and trusted contact she chose |
| Busy and confident | Daniel | Fewest taps; the safety check still appears on a risky payment; still guided on overseas (never done) |

## Where each feature lives
| Feature | Where to see it | Came from |
| --- | --- | --- |
| Welcome setup and privacy promise | Mdm Lim starts with it. Screen one has the 4 languages, A+ and Read aloud, and "I will never ask your age, health or income". Only 3 questions are needed; the last 2 are optional ("Skip both, go to my app") | Both, plus judge review |
| Confidence Map (3 levels) | "New to me" teaches with full explanations; "With some help" shows a one-line tip with "Tell me more" and "Show full guidance"; "I do this often" opens a quick form with "Guide me this time". "Erase my map" resets it after a confirmation | Base, plus judge review |
| App that learns, "Why am I seeing this?" | Arjun: do PayNow once more. The suggestion explains itself; "Not now" hides it for 30 days; "Don't suggest this again" turns it off | Both |
| Your adaptations (removable list) | More > Your adaptations. Every change, where it came from, and Remove | Team's idea, extended |
| Assistance Passport | Fixed choices only ("Tell us what helps, not why"); shown on the staff hand-off; "Who has seen your Passport" lists every officer view | Both |
| Life Moments | More > Life Moments. Named by banking need, never by condition | Base |
| Guided journeys and mode switching | Show as Visual, Text, Voice or Chat inside any task, without losing anything | Base |
| Ghost hand | "Show me how" on any guided step | Base |
| Teach-back, amount in words, everyday amounts | Full teach-back only on new payees, overseas, S$500 or more, or unfamiliar tasks. Everyday amounts are off by default; the customer picks the unit (food, phone bills, rent, groceries) | Base, plus judge review |
| Quick amounts, over-balance warning, hide balance, Money Lock line | Amount steps and Home | Team |
| Payee photos, "Someone new", verified businesses | More > My payees; businesses show "Registered name, checked with the business registry" on the name check | Base, plus judge review |
| 60-second Undo | Only for transfers to people, never Scan & Pay, businesses or bills. Screen says "Not paid yet" with no reference until the money has gone. Customer picks 10, 30 or 60 seconds | Base, plus judge review |
| Chat banking with voice notes | Home > Chat with your account | Base |
| Practice Hub and Spot the scam | Plan tab, "X of 7 practised" counter | Both |
| Languages, simple wording, read aloud | More. Read aloud never reads balances or account numbers | Base |
| Dialect Mode | More > Dialect audio; record real lines in Bank insights > Dialect studio | Base |
| Text size (7), contrast, extra spacing | More | Base, plus team's extra spacing |
| Safety check: "What is this payment for?" | Only on warning signs (new payee and S$1,000 or more, first overseas transfer, flagged UEN). Warning changes with the answer; "Is anyone on a call telling you what to do?" | Team's design |
| Cooling time, trusted contact, Money Lock | More > Safety. Changing or removing a trusted contact waits 12 hours and the current contact is told ("Skip 12 hours (demo)" for the pitch) | Both, plus judge review |
| OCBC Helper | Explain this screen, glossary, action buttons, hand-off with summary | Both |
| Help code | Helper > "Phoning us? Get a help code". Staff look it up on the Staff hand-off tab | New |
| Family Co-pilot | Only people saved as family for 7+ days; they verify with Singpass or their own OCBC app (simulated); pauses during the safety check | Base, plus judge review |
| Slim staff hand-off | Staff hand-off tab: Passport, where stuck, journey timeline, Helper chat with an English line under each message, one in-app call. Always in English for staff. "Highlight Cancel" only for suspected scams | Team's layout, made working and slimmer |
| Bank insights | Safety check outcomes by answer, top questions by screen, why chats reached a person, hotline screens, SUS (sample), live WCAG audit, no-assumption audit | Both |

## Dialect recordings
Hokkien and Teochew have no standard written form, so the studio shows each line's meaning in Mandarin. Record a native speaker saying it; until then the app plays a clearly labelled Mandarin placeholder. Recordings are saved in the browser you record in, so record on the laptop you will present with.

## 3-minute demo script (build 2)
1. **Adaptive Engine** tab: switch 中文, "New to me", then "Struggling". The same step rebuilds each time and the reason lights up. Switch to ATM, then Hotline.
2. **Customer app**, Arjun: Pay & Transfer > PayNow > business. Type 5331234 twice: the step simplifies itself. Press Undo.
3. **Pay & Transfer > Local:** account 555566667, name Tan Ah Beng. "Check who you're paying" says stop.
4. **Scam scenario** (demo control): "What is this payment for?" > "Government, police or bank told me to" > talk to the anti-scam team.
5. **Bank insights:** Live Adaptation panel and safety check outcomes.

## Earlier 7-step demo (merged build)
1. **One app, four experiences** tab: same features and safety checks, different guidance.
2. **Prefers to be shown (Mdm Lim):** welcome setup in 中文, then "Show me how" and a dialect line on a guided step.
3. **First-time banker (Arjun):** third guided PayNow, tap "Why am I seeing this?", accept the quick version, show it in Your adaptations.
4. **Arjun:** send to a new mobile number. Show "60 seconds to undo", then "Not paid yet", then Undo.
5. **Scam scenario** (demo control): answer "Government, police or bank told me to", then "Talk to our anti-scam team".
6. **Staff hand-off** tab: read the page, highlight Cancel, call back in the app; the code appears on the phone.
7. **Bank insights:** safety check outcomes, top questions by screen, no-assumption audit.

## Tests
- `node test5.js` walks every journey above (35 checks).
- `node test6.js` checks the remaining review fixes and runs every screen and task at the largest text size with high contrast (55 checks).
- `node test7.js` covers the rest: switching mode mid-task keeps your details, the ghost hand, practice then real, Spot the scam, chat banking, Helper, Life Moments, payee photos, Dialect Mode, Malay/Tamil/Chinese, high contrast, Money Lock, 30-day snooze and the live audit (28 checks).
- `node test8.js` covers build 2: login, tabs, Calm mode, the engine deciding layouts, all four Live Adaptation signals, Undo, the quick-form switch, the Chinese banner, "Check who you're paying", masked PayNow names, slide to pay (a short slide does not pay), no Undo for businesses, Money Lock wording, every part of the Adaptive Engine tab, the Bank insights panel, and the new screens at the largest text size with high contrast (71 checks).

All four use Playwright and passed (189 of 189 checks, no errors) on 11 Nov. Older tests for the earlier build are in `tests-legacy/`.

## Before the pitch
- Show build 2 to the tutor and OCBC coach first: lead with the Adaptive Engine tab.
- The Figma file was built from the 6 Nov merged build. Rebuild it from build 2 once the tutor has given feedback.
- Replace the sample numbers in Bank insights with our own usability test results (SUS, task success).
- Get the Malay and Tamil text checked by native speakers.
- Some newer text is still English when the app is in another language (Life Moment names, Your adaptations list, staff-facing notes). The main screens, flows and suggestion card are translated.
- Record the dialect lines.
