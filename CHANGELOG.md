# Changelog

Newest first. Each build lists what changed for customers, judges and the team.

## Build 4.4 (19 Nov)
Built on build 4.3. A UX and accessibility pass after a full review of every screen:
- Helper now lives in the header of every screen (help in one place), so it never covers content. The floating button only appears on screens without a header.
- The welcome setup summary only lists the tasks the customer picked. Tasks they did not pick keep the standard look; nothing is assumed.
- Selected choices are filled with a tick, not just a faint border. "Let's start" is the main button; Skip appears once.
- One row of controls above each question: "Show as" stays, and Quick form is a single link beside the step count.
- Voice mode is visibly different: a bar says the question is read out, with Read again.
- "Behind the scenes" now says Scan opens as "Camera, no tips" rather than the contradictory "Step by step".
- Bank insights: draft notes removed; the six KPIs sit in an even 3 x 2 grid.
- Accessibility: every screen passes an automated WCAG 2.2 AA check (axe-core): darker grey text, darker red links, labelled progress bar, and 44 px touch targets for every control.

Repository housekeeping:
- Repository restructured: app source in `src/`, build script in `scripts/` (Node, replacing the Python script), tests in `tests/`, docs in `docs/`. The single file is now built into `dist/`, which git ignores.
- Added `.gitattributes`, `.editorconfig` and a fuller `.gitignore`; `npm run build` and `npm test`.
- Offline cache name bumped to v4.4 so phones pick up the new files.

## Build 4.3 (19 Nov)
Built on build 4.2. A layout fix for the "step simplifies itself" demo:
- After a mistake, the box or buttons to fix scroll into view above the Next button instead of hiding behind it.
- On a simplified step, the "Let's fix this together" note sits right above the box, and the long explanation shortens to one plain line (the note already explains), so the "We made this step simpler" banner stays on screen.
- On flow screens the Next bar sits at the very bottom, so no content shows underneath it or under the "Concept prototype" label.

## Build 4.2 (18 Nov)
Built on build 4.1. Everything in 4.1 still works.

- **Spotlight mode.** Demo controls > "Spotlight: show what we added", or Shift + S. Each feature our team added gets a purple dashed outline and a label such as "New: Undo for transfers to people". It changes nothing else. Turn it off the same way.
- **Family Co-pilot is harder for scammers to misuse.**
  - On real payment screens the family helper can only send preset messages ("Take your time", "Check the name carefully"). Typing is off, so nobody can type "ignore the warning, just send".
  - Their view now pauses on the check screen as well as the safety check. The customer sees "(Name) cannot see this screen. Check the details and confirm on your own."
  - Practice payments use pretend money, so free messages and the full view stay on there.
- **Say it keeps balances private.** "What is my balance?" shows the balance on screen and says "Your balance is on the screen". It is read out only if the customer taps "Read it out".
- **No network requests until needed.** The Google Fonts link is removed (the app uses the system font). Exchange rates are fetched only when an overseas transfer opens.
- **Clearer labels.** Exchange rates say "Market reference rate, not OCBC's rate". The ATM finder says the map data may be incomplete.
- **Restored from build 2.4:**
  - At the largest text sizes, the Visual / Text / Voice / Chat buttons and the Home tabs wrap instead of disappearing off-screen.
  - The Machine learning tab says again that the results come from synthetic data, and each model has a "How we would prove it with real data" plan.
- **One master copy.** Edit the source files, then rebuild the single file. Do not edit the single file by hand.
