---
name: Kabadiwala Trust Framework
colors:
  surface: '#f8faf6'
  surface-dim: '#d9dad7'
  surface-bright: '#f8faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f0'
  surface-container: '#edeeeb'
  surface-container-high: '#e7e9e5'
  surface-container-highest: '#e1e3df'
  on-surface: '#191c1a'
  on-surface-variant: '#404941'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#f0f1ed'
  outline: '#707a71'
  outline-variant: '#bfc9bf'
  surface-tint: '#246b42'
  primary: '#004e2a'
  on-primary: '#ffffff'
  primary-container: '#20673f'
  on-primary-container: '#9be3b0'
  inverse-primary: '#8fd6a5'
  secondary: '#8a5100'
  on-secondary: '#ffffff'
  secondary-container: '#ffa02c'
  on-secondary-container: '#693d00'
  tertiary: '#8c000e'
  on-tertiary: '#ffffff'
  tertiary-container: '#b4151d'
  on-tertiary-container: '#ffc5bf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aaf3bf'
  primary-fixed-dim: '#8fd6a5'
  on-primary-fixed: '#00210f'
  on-primary-fixed-variant: '#00522c'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#ffb86e'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#693c00'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb3ac'
  on-tertiary-fixed: '#410003'
  on-tertiary-fixed-variant: '#930010'
  background: '#f8faf6'
  on-background: '#191c1a'
  surface-variant: '#e1e3df'
typography:
  headline-xl:
    fontFamily: Noto Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Noto Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Noto Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Noto Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  body-xl:
    fontFamily: Noto Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-bold:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  currency-xl:
    fontFamily: Noto Sans
    fontSize: 36px
    fontWeight: '900'
    lineHeight: 40px
    letterSpacing: -0.5px
  currency-lg:
    fontFamily: Noto Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
  label-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  label-md:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style
The brand voice is reliable, protective, dignified, and immediately legible. Tailored specifically for informal sector waste entrepreneurs, scrap collectors (kabadiwalas), aggregators, and material recovery operators across Indian urban centers, the interface eliminates cognitive barriers caused by text-dense interfaces, complex bureaucratic forms, and subtle visual cues.

The design movement is **High-Contrast Utilitarian Tactility**:
- High-visibility structural containment: Surfaces rely on distinct boundaries, high-contrast borders (minimum 1.5px to 2px solid), and crisp physical separation to prevent visual bleeding in bright outdoor daylight (up to 10,000+ lux).
- Direct audiovisual reinforcement: Text is never the sole carrier of meaning. Every core card, rate update, status notification, and hazard alert is accompanied by an omnipresent audio readout trigger (prominent speaker button) and standardized visual pictograms.
- Dignified and institutional reassurance: The visual language avoids childish illustrations, instead employing bold, industrial-grade icons and verified badges that honor the collector's critical municipal and economic contribution.
- Ergonomic resilience: Massive physical touch surfaces (minimum 56dp) accommodate single-handed thumb operation on low-cost Android hardware, often operated while wearing work gloves or in physically demanding environments.

## Colors
The color architecture relies on functional semantics engineered for direct outdoor sun readability and strict WCAG AAA color contrast ratios across all critical indicators.

- **Primary (`#20673F` - Verified Emerald):** Denotes legitimacy, official authorization, completed collections, compliant e-waste handling, and secure handshakes. Paired with pure white text or high-contrast container fills (`#E7F3EB`).
- **Secondary / Monetary Accent (`#D98200` - Industrial Gold):** Shifted to an accessible high-contrast deep amber (`#D98200` against white meets 4.5:1; against dark surfaces, use `#F5A623`). Strictly reserved for cash, rates per kilogram (₹/kg), instant payouts, weight settlements, and financial ledger figures.
- **Alert / Hazard (`#D32F2F` - Warning Vermilion):** High-urgency warning color representing hazardous battery leaks, contaminated loads, forbidden materials, live electrical risks, or critical system disconnects.
- **Surfaces & Grounds:**
  - Base canvas: Pure daylight white (`#FFFFFF`).
  - Surface Container Low: `#F8FAF8` for nested cards and secondary buckets.
  - Surface Container High: `#F0F4F1` for tap target containers, icon pads, and disabled states.
  - Outline & Borders: `#B2C1B7` for resting boundaries, scaling to `#191C1A` for selected or interactive boundaries.
- **Typography & Neutral Tokens:** Primary ink is `#191C1A` (deepest charcoal-green, avoiding pitch black harshness while retaining maximum contrast), secondary helper text is `#3E4A42`.

## Typography
`Noto Sans` is the designated universal type system, selected for its comprehensive native script support across Indian languages (Hindi, Tamil, Marathi, Telugu, Bengali, Kannada, and Gujarati) with uniform glyph metrics and vertical metrics.

### Typography Rules
- **No Sub-16px Typography:** The absolute minimum text size on screen is `16px` (for secondary labels only). The primary default readable body size is `18px`.
- **Weight and Currency Stacking:** Financial figures, scrap weights (kg/quintal), and payout sums must use `currency-xl` or `currency-lg` at 800-900 weights. Pair the currency symbol (`₹`) directly in the same font bounding box to avoid clipped characters.
- **Zero Ambiguity Glyphs:** Digits must be rendered in open, tabular figures (`tnum`) so that weight readouts and tally columns do not shift horizontally during live scale syncs.
- **Dual Script Coexistence:** Where regional language translations sit alongside English nomenclature (e.g., "तांबा / Copper"), the native regional text always takes top visual billing with 1.2x proportional sizing to account for complex conjuncts and diacritics.

## Layout & Spacing
The layout operates on a 4-column fluid mobile grid scaling to an 8-column layout on warehouse/weighbridge tablet stations.

### Form Factors & Adaptations
- **Mobile Handheld (360px - 480px):** Single-column vertical stack with a strict fixed bottom docking tray for primary actions. Lateral margins are locked to `1rem` (16px) to maximize the active screen canvas for massive card surfaces and high-yield touch targets.
- **Tablet / Weighbridge Terminals (600px - 1024px):** Split-view architecture with an 8-column grid. Left 5 columns anchor the material categorizer and live gross/tare weight dials; right 3 columns anchor the ledger manifest, total cash calculation, and thumbprint/voice confirmation drawer.
- **Vertical Spacing Rhythm:** Space is calibrated generously around touchpoints. Minimum distance between distinct interactive objects is `0.75rem` (12px) to prevent mis-taps. Dense tables are strictly prohibited; information is divided into chunked, card-based sequences.

## Elevation & Depth
In high-glare outdoor scrap yards, subtle drop shadows disappear completely. Depth is communicated through structural layering, border weight differentiation, and solid tactical offset:

- **Level 0 (Floor):** Canvas background (`#F8FAF8`).
- **Level 1 (Resting Cards & Containers):** White surface (`#FFFFFF`) framed with a crisp `2px solid #E1E8E2` perimeter. No diffuse blur.
- **Level 2 (Interactive Modules & Rate Cards):** White surface framed with `2px solid #20673F` (or `#D98200` for monetary cards), elevated with a subtle directional hard-edge shadow: `0px 4px 0px 0px rgba(25, 28, 26, 0.12)`. This mimics a durable, physical push-tile.
- **Level 3 (Modals, Slide-up Sheets, Payout Confirms):** White surface with `3px solid #191C1A`, backed by a dark 65% opacity high-contrast scrim (`#0D120F`) to cleanly isolate decisions.

## Shapes
Shapes are grounded, soft-chunky, and protective. 

- Primary cards, material selector tiles, and modal sheets utilize generous radiuses between `1rem` (16px) and `1.5rem` (24px) to clearly define visual safe zones and avoid needle-sharp corners that feel intimidating or overly technical.
- Badges, status markers, and audio action capsules use full pill radii (`9999px`) to immediately signal interactive non-text widgets.
- Critical warnings or "Do Not Mix / Hazardous" tiles retain a firmer `0.75rem` (12px) radius accompanied by a deliberate diagonal striped safety band along the upper edge.

## Components

### 1. Audio Readout Button (Core System Pillar)
- **Geometry & Target:** Minimum `56dp × 56dp` circular or pill-shaped container, anchored prominently in the top-right corner of every functional card, rates tile, or warning banner.
- **Styling:** Primary green fill (`#20673F`) or high-contrast amber (`#D98200`) with a bold white animated soundwave/speaker icon (`28px`).
- **State Feedback:** When pressed, triggers an immediate ripple wave, pulses visually with a 3px accent boundary, and plays a clean, localized audio translation of the card's contents (e.g., *"Copper wire. Grade A. 480 rupees per kilo."*).

### 2. Large Touch-Action Buttons
- **Height & Layout:** Strict minimum height of `60px` with edge-to-edge width minus standard layout margins.
- **Variants:**
  - *Affirmative / Save / Collect:* Solid `#20673F` background, white 20px bold typography, leading tactile checkmark or scale icon (`28px`).
  - *Cash / Settle / Payout:* Solid `#D98200` background, rich black or white text, leading `₹` glyph inside a contrasting pill.
  - *Hazard / Cancel / Stop:* `#D32F2F` background, white text, bold exclamation icon.
- **Feedback:** Tactile CSS push-down state (`transform: translateY(2px)`) accompanied by system haptic buzz.

### 3. High-Visibility Status Chips
- **Dimensions:** Minimum height `38px`, padding `0.5rem 1rem`.
- **States:**
  - *Authorized / Verified:* Solid `#20673F` container, white text, lock or verified shield badge.
  - *Syncing / Pending:* Light amber container (`#FEF3D6`) with a `2px solid #D98200` border, rotating sync arrow pictogram.
  - *Online / GPS Locked:* Vibrant signal-green circular beacon with a pulsing live ring and "Online" in 16px bold.

### 4. Interactive Material & Scrap Price Cards
- **Structure:** `1.25rem` (20px) rounded containers with a clear 3-part layout:
  1. *Left:* Bold material pictogram (`48px × 48px`, e.g., copper wire coil, printed circuit board, iron rod) rendered in clear silhouette style.
  2. *Center:* High-contrast material name in regional script + English (`20px Noto Sans Bold`), directly above real-time rate readout (`₹42 / kg` in `28px` amber bold).
  3. *Right:* Independent `56dp` audio speaker button for instantaneous verbal pricing feedback.

### 5. Numerical Steppers & Weighbridge Counter
- **Display:** Big-type weight displays (`36px` to `44px`) centered on an ivory/cream high-readability dial surface (`#FBFDFB`) bordered in `2px solid #191C1A`.
- **Buttons:** Giant decrement (`-`) and increment (`+`) flank buttons at `64dp × 64dp` minimum with `32px` bold glyphs, preventing calibration errors.

### 6. Hazard & Safety Guidance Banners
- **Styling:** Bright warning vermilion borders (`3px solid #D32F2F`) against an alert ground (`#FFF5F5`).
- **Layout:** Displays an explicit universal pictographic slash icon (e.g., battery fire danger, glass cut risk) at `40px × 40px`, supported by large `body-bold` instructional text and a red audio button delivering explicit verbal safety instructions.