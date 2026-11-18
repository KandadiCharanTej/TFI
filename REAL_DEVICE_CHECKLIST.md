# Real Device Testing Checklist (Phase 5c)

Use this checklist to verify **TFI & Pitch** on real phones over your home/office Wi-Fi before moving on.

## How to open the app on your phone over Wi-Fi

1. Make sure your laptop and phone are on the **same Wi-Fi network**.
2. On your Mac, start the Next.js server bound to all network interfaces so your phone can reach it:
   ```bash
   cd apps/web && npx next dev --hostname 0.0.0.0 --port 3000
   ```
   *(Or run the production build faster via `npx next start --hostname 0.0.0.0 --port 3000` after `pnpm --filter @tfi/web build`.)*
3. Find your Mac's local IP address by running:
   ```bash
   ipconfig getifaddr en0
   ```
   (Usually looks like `192.168.1.42` or `10.0.0.15`.)
4. Open **http://\<your-ip\>:3000** in Safari on iPhone or Chrome on Android.

---

## Phone Model Notes

- **Tested Device 1 (iOS Safari):** *(Model & iOS version, e.g. iPhone 13 · iOS 17.5 — fill in when tested)*
- **Tested Device 2 (Android Chrome):** *(Model & Android version, e.g. Pixel 7 / OnePlus 11 · Android 14 — fill in when tested)*

---

## 25-Point Verification Checklist (iPhone Safari + Android Chrome)

### Hero & Navigation
- [ ] **1. 5-Second Test:** Within 5 seconds of opening `/`, the yellow headline plate, "Play now" button, and live phone demo make it obvious this is a free Telugu cinema party game.
- [ ] **2. Clean Above the Fold:** On portrait phones, `"Play now →"` is completely visible without scrolling.
- [ ] **3. Smart Top Header:** Header stays slim (`56 px`), never wraps navbar links, and hides header `"Play now"` while the big hero CTA is visible (reappearing smoothly once you scroll past the hero).
- [ ] **4. Doodle Hygiene:** Stars, lightning bolt, dot column, scribble oval, and X marks stay in empty margins and never cover headline letters, trust pills, or the demo phone.
- [ ] **5. Scribble Oval & Tilt:** Magenta scribble oval draws cleanly around `"favourite films"` (EN) / `"ఫేవరెట్ సినిమాలను"` (TE) without touching neighboring text.

### Language & Typography
- [ ] **6. Instant TE Switch:** Tapping `తె / EN` in the top-right immediately flips the UI to crisp bold `Anek Telugu` with zero half-rendered English labels (outside explicit EN card subtitles).
- [ ] **7. Minimum Sizes:** Body copy looks legible (`>= 16 px`) without pinch-zooming; no pill or badge looks microscopic (`>= 12 px`).
- [ ] **8. Text Scaling / Accessibility Size:** Turning OS Display/Text Size up to Large / 130% in Settings introduces zero horizontal scrolling or clipped buttons.

### Touch, Keyboard & Safe Areas
- [ ] **9. Zero Horizontal Drag:** Swiping sideways on any screen (`/`, `/play`, setup, results, `/join`) never scrolls horizontally.
- [ ] **10. Thumb-Friendly Controls:** Steppers (`-`/`+`), language pills, game tiles, remove buttons, and bottom tabs register accurately on the first tap without double-tapping (`>= 44x44 px`).
- [ ] **11. Keyboard Opening Doesn't Hide Inputs:** Tapping Player name inputs on setup pages or `/join` code boxes scrolls the input cleanly above the on-screen keyboard without overlapping sticky nav.
- [ ] **12. No Accidental Auto-Zoom on iOS Safari:** Tapping any text input (`>= 16 px` font size) in Safari does NOT trigger iOS auto-zoom.
- [ ] **13. Safe Area Respect:** Top notch / Dynamic Island and bottom Home Indicator bar never clip header items, fixed bottom navigation (`Play | Join | Me`), or active round tap buttons.

### Active Rounds & Gestures
- [ ] **14. Portrait Prompt on Head Set Go:** Opening Head Set Go round in portrait clearly asks you to rotate sideways; rotating to landscape opens the full-bleed card immediately.
- [ ] **15. Landscape Cards Fit (TE & EN):** Long Telugu movie titles fit cleanly on `667x375` (SE) and `844x390` landscape screens without horizontal cutoff.
- [ ] **16. Giant Tap Zones (HSG):** Left **PASS** (magenta) and right **CORRECT** (green) bottom zones (`>= 96 px` tall) are impossible to miss when held against your forehead.
- [ ] **17. No Rubber-Band Scroll During Taps:** Fast tapping in Head Set Go, Transify, Dumb Charades, and Most Likely rounds does not pull-to-refresh or scroll the whole screen (`overscroll-behavior: none`).
- [ ] **18. Judge Action Bar Reach (Transify/Rapid Fire):** Skip & Correct buttons (`>= 64 px` tall) sit in natural thumb reach at the bottom of portrait screens.
- [ ] **19. Sound & Vibration:** On user tap ("Correct!" / "Pass"), subtle audio and Android vibration work crisp; toggling mute silences round audio immediately.

### Results, Offline, Calm Mode & Rooms
- [ ] **20. Results Ticket & Share:** Results score ticket renders clearly with zero clipping; tapping Share / Save creates or shares the score summary cleanly without colliding with bottom nav.
- [ ] **21. Offline Mode After First Visit:** Turning on Airplane Mode (after loading `/play` once) still lets you open and finish an entire round of Head Set Go or Transify offline.
- [ ] **22. Calm Mode Works Everywhere:** Toggling **Calm mode** ON in `/me` (or OS Reduce Motion ON) stops marquee movement, hero demo auto-advance, confetti, sounds, and doodle idle animations cleanly.
- [ ] **23. Online Rooms Lobby (`ENABLE_ROOMS=true`):** Creating a room and joining on a second phone via the 4-letter code boxes or `/r/[code]` link shows both connected players live in the lobby.
- [ ] **24. Scrolling 6+ Players in Room Lobby:** With many guests in a room, the player list scrolls neatly inside its container while Host controls remain easy to tap.
- [ ] **25. Battery / Temperature on Old Devices:** Swiping/playing 3 rounds on an older 2 GB phone feels smooth with zero stutters and zero console crashes.
