# Adaptive Banking prototype (build 4.4)

Student concept prototype for the OCBC Innovation Challenge, Problem Statement 4: *Adaptive Banking: One Experience for Every Customer*. Synthetic data only. Not an OCBC product.

The whole screen is the app. On a phone it fills the screen like a real app; on a tablet or computer the phone sits in the middle, sized to fit. The demo tools (sample customers, demo controls, behind the scenes, and the Adaptive Engine, four experiences, staff hand-off, bank insights and machine learning views) are in a drawer:

- **Computer:** the "Demo tools" button at the top left, or **Shift + D**
- **Phone or tablet:** the small handle on the left edge of the screen
- **Any device:** add `?tools` to the address to open with the drawer showing

In the drawer, tick **Show the panels beside the app** for the presenter layout from earlier builds.

## Run it

You need [Node.js](https://nodejs.org) 18 or newer. The app itself has no dependencies.

```bash
npm start          # serves src/ at http://localhost:3000 (and prints a Wi-Fi address for phones)
```

In VS Code you can also press **F5** and pick "Open the prototype in Chrome", or right-click `src/index.html` > Open with Live Server.

### On a phone or tablet

- Run `npm start` on your computer and open the printed address (for example `http://192.168.1.23:3000`) on a phone on the same Wi-Fi.
- To install it like an app (home-screen icon, full screen, offline), it must be served over **https**, for example GitHub Pages or Netlify Drop with `src/` as the site folder.
- The microphone, camera and location also need https or localhost; otherwise the app falls back to typing, the demo QR code and the sample ATM list.

### One file, no setup (for the pitch laptop)

```bash
npm run build      # writes dist/adaptive-banking-prototype.html
```

Double-click `dist/adaptive-banking-prototype.html`. It is the whole app in one file and works offline in Chrome or Edge. `dist/` is a build output, so git ignores it: rebuild it after pulling changes.

## Test it

```bash
npm install        # once: installs Playwright for the tests
npx playwright install chromium   # once: downloads the test browser
npm test           # builds dist/, then runs the regression and layout checks
```

## Project structure

```
adaptive-banking-prototype/
├── src/                      The app (this folder is what gets served)
│   ├── index.html
│   ├── css/styles.css        All styles
│   ├── js/app.js             Screens, journeys, Adaptive Engine, Live Adaptation, staff hand-off, bank insights
│   ├── js/ml.js              Struggle detector, scam message model, payment risk model, Machine learning view
│   ├── js/features.js        Statements, Money insights, Safe to spend, suggestions, Say it, exchange rates, ATM finder, QR, receipts
│   ├── js/appmode.js         Full-screen app and the demo tools drawer
│   ├── js/spotlight.js       Spotlight mode: labels the features we added
│   ├── manifest.webmanifest  Installable app
│   ├── sw.js                 Offline support (bump CACHE when releasing)
│   └── icons/
├── scripts/build.js          Builds the single offline file into dist/
├── tests/                    Playwright checks (npm test)
├── docs/FEATURES.md          Every feature, where to find it, demo scripts
├── server.js                 Zero-dependency web server (npm start)
├── .vscode/                  Shared editor settings, Run and Debug, start task
├── CHANGELOG.md              What changed in each build
└── package.json
```

The scripts in `src/index.html` share one global scope and must stay in that order: `app.js`, `ml.js`, `features.js`, `appmode.js`, `spotlight.js`.

## Working on it as a team

- Edit files in `src/` only. Never edit `dist/` by hand; run `npm run build`.
- Work on a branch per change, named after the epic, for example `e4/helper-handoff`, and open a pull request into `main`.
- Run `npm test` before you open a pull request.
- Write commit messages in the present tense that say what changed, for example "Move Helper into the screen headers".
- Add a short entry to `CHANGELOG.md` for anything a customer, judge or teammate would notice.
- Data is synthetic. Never commit real customer data, account numbers, passwords or API keys.
# adaptive-banking-prototype
