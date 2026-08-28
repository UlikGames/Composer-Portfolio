# Composer Portfolio source ledger

This file distinguishes installed source components from general inspiration. A source is only listed as installed when its official registry URL, CLI command, or supplied Copy Prompt code was used.

## Installed and used

| Source | Official installation or prompt | Used in | Local compatibility changes |
| --- | --- | --- | --- |
| React Bits ScrollStack | `npx shadcn@latest add https://reactbits.dev/r/ScrollStack-TS-CSS.json` | Retained source, no longer rendered | Removed from the home page after runtime scroll jitter. The source remains available but is not part of the active UI. |
| React Bits SplitText | `npx shadcn@latest add https://reactbits.dev/r/SplitText-TS-CSS.json` | Home page hero title | Added `use client`, React 19 font-state handling, strict catch syntax, and a typed dynamic tag render. Animation API and GSAP behavior remain intact. |
| Aceternity Focus Cards | `npx shadcn@latest add @aceternity/focus-cards` | Home page Latest Works | Replaced `any` with a card type and native `img` with Next Image. The desktop grid is four columns; responsive hover focus behavior remains intact. |
| Animate UI ThemeToggler | `npx shadcn@latest add https://animate-ui.com/r/primitives-effects-theme-toggler.json` | Header theme button | Deferred one effect update for React 19 lint. A wrapper synchronizes its preview with the project's `data-theme` attribute. |
| Skiper UI Scroll progress 001 | `npx shadcn@latest add @skiper-ui/skiper89` | Navbar-underlay scroll progress | The Motion scroll calculation and NumberFlow percentage remain. The circular demo indicator was adapted into a thin navbar progress line. |
| 21st.dev Spline Scene Copy Prompt | User-supplied prompt from `serafimcloud/splite` | Hero 3D spotlight | The prompt's real Spotlight component is used over the existing Three.js scene. Its parent-position mutation was guarded so it cannot overwrite an already positioned stage. |
| User Stitch player concept | User-supplied screenshot, 2026-08-28 | Full-screen and compact audio player | Used as the authoritative composition for the large artwork, tabbed Movements, Queue, Explore, and persistent Favorites browser, plus the bottom transport dock. Back to archive now minimizes playback into a persistent compact dock that can reopen the full player without interrupting audio or its queue. Artwork uses a sharp contained cover over a dark blurred backdrop so portrait and landscape covers keep their proportions. Existing random, shuffle, repeat, seek, and volume logic was preserved; manual queueing supports individual movements or an entire work. |

## Preserved portfolio easter eggs

- Typing `HANDE` outside form fields opens the hidden dedication page.
- Rapidly clicking the artwork three times on Three Nocturnes, L'Inconnue, or Images d'elle opens the original private message.
- On August 25, those three work titles display the original illuminated star.
- The special-work console inscriptions from the previous portfolio remain available.

## Security-driven exclusion from the supplied 21st prompt

The SplineScene component and its exact demo scene were integrated and tested. The Spline runtime required JavaScript evaluation blocked by the project's Content Security Policy. Enabling `unsafe-eval` would weaken the launch security baseline, so the Spline runtime, temporary scene asset, and Spline packages were removed. The prompt's Spotlight component remains in active use with the existing Three.js scene.

## Consulted but not installed

- 21st.dev Spline layout informed the split copy and 3D stage composition. The unsafe runtime was not shipped.
- Origin UI and Uiverse were not needed because the current controls already have project-specific states and accessible labels.
- Bklit was not needed because the portfolio has no chart or data-visualization requirement.
- Unlumen Hover Image List is license-gated and was not copied.
- Lenis is present only because the official React Bits ScrollStack registry component depends on it.

## Verification

- `npm run check-types`
- `npm run lint`
- `npm run build`
- Desktop browser check at `http://localhost:3001/`
- Mobile checks at 390 by 844 for Home and Works
- Theme changed from dark to light through the Animate UI component
- Works rendered 6 FocusCards images and 63 catalog cards with no horizontal overflow
- ScrollStack rendered 5 cards and preserved full card content after wrapper overrides
