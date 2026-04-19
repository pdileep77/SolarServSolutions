# Design System Document: The Solar Chronometry

## 1. Overview & Creative North Star
**The Creative North Star: "Precision Luminescence"**

This design system moves beyond the utility of maintenance software to create a high-end, editorial experience that mirrors the sophistication of renewable energy technology. We avoid the "template" look by treating the interface as an architectural blueprint—clean, structured, and bathed in intentional light.

The system is defined by **Asymmetric Balance** and **Atmospheric Depth**. By utilizing wide margins, varying typographic scales, and overlapping surface layers, we create a sense of "The Digital Curator." We don't just show data; we present it with the authority of a premium technical journal. This approach shifts the brand from a "tool" to a "trusted partner."

---

## 2. Colors & Surface Philosophy
Our palette is anchored in the deep stability of the night sky and the energetic glow of the sun. 

### The Palette
- **Primary Deep Navy (`primary_container`: #0F1F3D):** Used for structural authority and high-contrast moments.
- **Solar Amber (`secondary_container`: #F59E0B):** Used sparingly as a "light source" to guide action and highlight critical status.
- **Surface Foundations:** We utilize a range of tonal whites and cool greys (`surface` to `surface_container_highest`) to build environment depth.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are prohibited for sectioning.** Structural boundaries must be defined exclusively through background color shifts. 
- *Application:* Use a `surface_container_low` section sitting against a `surface` background to define a sidebar or content block. This creates a soft, modern transition that feels integrated rather than boxed-in.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of architectural vellum. 
- **Layer 0 (Base):** `surface` (#f8f9ff)
- **Layer 1 (Card/Section):** `surface_container_low` (#eff4ff)
- **Layer 2 (Inner Detail):** `surface_container` (#e5eeff)
- **Layer 3 (Floating/Active):** `surface_container_highest` (#d3e4fe)

### The "Glass & Gradient" Rule
To escape the "flat" SaaS aesthetic, floating elements (modals, map overlays) should utilize **Glassmorphism**. Use a semi-transparent `surface` color with a `backdrop-blur` (12px–20px). Main CTAs should feature a subtle linear gradient from `primary` to `primary_container` to give buttons a "milled" premium texture.

---

## 3. Typography
We use **Manrope** for its geometric balance and modern legibility.

- **Display (Large/Medium):** 3.5rem / 2.75rem. Use for high-impact hero moments. Set with tight letter-spacing (-0.02em) to feel like a premium magazine header.
- **Headlines (500 Medium):** 2rem to 1.5rem. These provide the authoritative "voice" of the platform.
- **Body (400 Regular):** 1rem (`body-lg`) for primary reading; 0.875rem (`body-md`) for data-heavy sections. 
- **Labels (Medium):** 0.75rem. Used for status badges and technical metadata. Always uppercase with +0.05em letter-spacing for a "technical spec" aesthetic.

---

## 4. Elevation & Depth
Depth in this design system is achieved through **Tonal Layering** rather than drop shadows.

- **The Layering Principle:** Place a `surface_container_lowest` (#ffffff) card on a `surface_container_low` (#eff4ff) background. The contrast in "brightness" creates a natural lift.
- **Ambient Shadows:** Shadows are reserved for high-level floating elements (Modals/Bottom Sheets). Use a multi-layered shadow: 
    - `0 10px 40px rgba(11, 28, 48, 0.06)` (A tinted version of `on_surface`).
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **20% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`). White text. `xl` roundedness (0.75rem).
- **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
- **Ghost:** No background. `on_primary_container` text. High-contrast hover state using `surface_container_low`.

### Status Badges (Luminous Indicators)
- Forgo heavy solid colors. Use a "Glow" style: A `surface_container_highest` background with a 4px circular "dot" of the status color (e.g., `tertiary_fixed` for "Healthy") and `label-md` text.

### Input Fields
- Background: `surface_container_low`.
- Bottom-only indicator: Instead of a full box, use a 2px bottom "track" in `outline_variant`. On focus, the track transforms into `secondary` (Solar Amber).

### Cards & Lists
- **The No-Divider Rule:** Vertical white space (24px/32px) must separate list items. If a separator is needed, use a subtle shift in background color for alternating rows (Zebra striping using `surface_container_lowest` and `surface_container_low`).

### Map Overlays
- These must use the **Glassmorphism** rule. Semi-transparent `surface_container_highest` with a 20px blur. This ensures the solar installation map remains visible "through" the data panels.

### Data Tables
- Header: `on_primary_fixed_variant` text on `surface_container`.
- Data: `body-md` in `on_surface`. 
- Alignment: Numbers must be tabular-lining and right-aligned to emphasize the "precision" of maintenance data.

---

## 6. Do's and Don'ts

### Do:
- **Do** use intentional asymmetry. A wide left margin (64px+) for a title while content stays on a standard grid creates an editorial feel.
- **Do** use "Solar Amber" (`secondary`) for moments of success or energy generation. It is the "hero" of the palette.
- **Do** leverage `surface_container` tiers to create hierarchy. The "brightest" white should always be the most important interaction point.

### Don't:
- **Don't** use 1px solid lines to separate content. Use whitespace or color blocks.
- **Don't** use pure black for text. Use `on_surface` (#0b1c30) to maintain the Deep Navy tonal integrity.
- **Don't** use "Default" shadows. If it looks like a standard box-shadow, the opacity is too high or the blur is too low.
- **Don't** crowd the interface. If a screen feels full, increase the padding to the 24px/32px scale and move secondary info to a "Drawer" or "Bottom Sheet."

---
*This system is designed to be felt as much as it is seen—a calm, authoritative environment for the future of sustainable energy.*