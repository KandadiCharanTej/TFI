# DESIGN V2 — Studio Overhaul ("The Wall, Calmer")

## 1. What Was Wrong in V1
1. **Shouting typography:** Compressed all-caps `Anton` headings and `Permanent Marker` tilted stickers made every screen feel loud and crowded, while forcing awkward fallback switches in Telugu mode.
2. **Visual clutter on surfaces:** Double rings (white inner ring + second outer ink ring) and arbitrary card tilts (`-1.5deg` to `2deg`) across grids and lists created visual noise instead of hierarchy.
3. **Color overload:** Multiple accent colors (yellow, magenta, cyan, green) competed on the same screen instead of reserving yellow for the primary action and one hero surface per page.
4. **Slow 5-second comprehension on Landing:** Visitors had to scroll past poster decorations and static mock cards before understanding what the site is, how a round works, and that they can start immediately with no account.

---

## 2. Core Rules (V2)
- **Sentence case everywhere:** Headings (`h1`–`h6`), buttons, badges, and chips use sentence case. Only the brand wordmark and small `12px` labels (`font-weight: 600; letter-spacing: 0.06em`) may use uppercase.
- **No marker or compressed poster fonts:** `Anton` and `Permanent Marker` are removed from the application.
- **Single-border, zero-tilt cards:** Every card uses one `2.5px solid #141313` border, `20px` radius, and one hard shadow (`0 5px 0 #141313`). No card tilt in grids, lists, or rounds. At most **one** tilted decorative element (`rotate(-3deg)` ticket stub on the landing hero) appears on any screen.
- **Calm color discipline:** At most two accent colors visible on any screen (excluding live round Pass/Correct flashes). Yellow is reserved for the primary CTA and one hero block per page; cyan marks online mode; magenta is for live moments and Pass; green is for Correct/success.
- **Concrete dot texture at 5% opacity:** Subtle radial ink dots (`rgba(20, 19, 19, 0.05)`), keeping large areas calm and legible.
- **True claims only:** Every player count, duration, and game count comes directly from `GAME_REGISTRY`.

---

## 3. Typography System & Font Lab Round 2 Decision

### Candidates Compared at `/dev/fonts`
- **P1:** Anek Latin subset (`anek-telugu-latin.woff2`, 42 KB) + Anek Telugu (`anek-telugu.woff2`, 136 KB) + Space Mono (`space-mono-bold-latin.woff2`, 9.3 KB).
- **P2 (Winner):** Bricolage Grotesque (`bricolage-grotesque-latin.woff2`, 30 KB, variable `opsz 12..96`, `wght 500..800`) + Anek Telugu (`anek-telugu.woff2`, 136 KB) + Space Mono (`space-mono-bold-latin.woff2`, 9.3 KB).
- **P3:** Archivo Expanded (`archivo-expanded-latin.woff2`, 31 KB, `wdth 125`, `wght 700..800`) + Anek Telugu + Space Mono.

### 5-Line Reason for Choosing P2 (Bricolage Grotesque + Anek Telugu + Space Mono)
1. **Availability:** Standalone `"Anek Latin"` is not published as a separate Google Fonts family (only bundled inside regional Anek subsets), so per the brief we select **P2 (`Bricolage Grotesque`)**.
2. **Clarity across sizes:** Its `12..96` optical-size axis keeps `14px`–`19px` body copy open and effortless to scan while tightening proportions at `40px`–`72px` display sizes.
3. **Cross-script harmony:** Bricolage Grotesque's warm humanist stroke modulation and ink traps pair seamlessly with Ek Type's `Anek Telugu` at weights `700`–`800`.
4. **Confident character in sentence case:** Delivers unmistakable product-studio personality in sentence case without relying on all-caps or tilts.
5. **Lightweight budgets:** One `30 KB` variable WOFF2 handles Display, H1–H3, Body, and Labels (`39.3 KB` total in English mode with `Space Mono`; `175.7 KB` total in Telugu mode with `Anek Telugu`, well below the `120 KB` / `250 KB` budgets).

### Type Scale (Sentence Case)
| Role | Desktop | Phone | Weight | Line Height | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display (Hero H1)** | `64px` (up to `72px`) | `40px` (`44px` lh) | `800` | `1.05` | `letter-spacing: -0.02em`, `text-wrap: balance` |
| **H1 (Page title)** | `44px` | `32px` | `800` | `1.1` | `text-wrap: balance`, never uppercase |
| **H2 (Section title)** | `36px` | `28px` | `800` | `1.12` | `text-wrap: balance`, never uppercase |
| **H3 (Card title)** | `22px` | `20px` | `700` | `1.25` | Sentence case |
| **Body Large** | `19px` | `17px` | `500` | `1.55` | Max `62ch`, `text-wrap: pretty` |
| **Body** | `16px` | `16px` | `500` | `1.55` | `text-wrap: pretty` |
| **Small** | `14px` | `14px` | `500` | `1.45` | Meta rows and helper text |
| **Label** | `12px` | `12px` | `600` | `1.2` | `uppercase`, `letter-spacing: 0.06em` (labels only) |
| **Numbers (Mono)** | Contextual | Contextual | `700` | `1.0` | `Space Mono`, `font-variant-numeric: tabular-nums` |
| **Telugu Script** | `+10%` vs EN | `+10%` vs EN | `700`–`800` | `>= 1.55` | `Anek Telugu`, `letter-spacing: 0`, never uppercase |

---

## 4. Spacing Scale & Layout Grid
- **Scale:** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`, `128px`.
- **Container:** Max width `1160px`, 12-column desktop grid (`gap: 24px`), `64px` vertical section spacing on phones and `96px`–`128px` on desktop.

---

## 5. Component Specifications
1. **Card (`Sticker` / `WallCard`):** `#FFFFFF` (or `#F4F1EA` quiet surface), `2.5px solid #141313`, `border-radius: 20px`, `box-shadow: 0 5px 0 #141313`. Pointer hover: `translateY(-2px)` and `0 7px 0 #141313`. Active press: `translateY(2px)` and `0 1px 0 #141313`. Zero rotation.
2. **Button (`WallButton` / `WallLinkButton`):** Primary `#F6BE18`, Secondary `#FFFFFF`, `2.5px solid #141313`, `border-radius: 14px`, `box-shadow: 0 4px 0 #141313`, `17px` weight `700`, sentence case, zero letter-spacing.
3. **Film Ticket Stub (`TicketStub`):** White card with side semi-circle notches (`14px` radius cutouts) and a `2px dashed #141313` perforation divider. Used exclusively for:
   - Landing hero `"Admit one gang"` badge (`rotate(-3deg)`)
   - Play home `"Today's pick"` feature card
   - Results & `1080x1350` share poster centerpiece
4. **Segmented Control & Stepper:** Clean `2.5px` bordered pill group for mode filtering (`All` / `One phone` / `Online`) and large `48px+` `- / +` steppers for setup screens.
5. **Illustrations (`WallIcon`):** `96px` container size on game tiles, `2.5px` ink strokes, flat palette fills, zero tilt.
