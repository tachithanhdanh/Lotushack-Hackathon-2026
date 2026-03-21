# Entrypoint Assessment

Board references:
- VETC Home (node 141:2076): screenshot of Tasco VETC app home with service grid
- Tesla-style controls (node 139:1868): dark control UI with car visual

## Proposal (Light mode + Tiếng Việt)
- App entry: Tasco VETC home screen (branding-first). This aligns with user request and the existing VETC service ecosystem.
- Tap on “Điểm dịch vụ” (Service Points): open a Vehicle Controls screen inspired by the Tesla layout to showcase vehicle context and quick actions (flash/honk/lock) and provide a prominent CTA to locate nearby service points.

## Rationale
- Familiarity: The VETC home keeps the current mental model; using a Tesla-like screen only after intent (service/controls) avoids surprising non-car use cases.
- Context-rich: Vehicle-centric view is useful when searching service points (maintenance, charging, wash). It can double as a hub for Live Green Ring & CO₂ Meter shortcuts.
- Demo value: The contrast between home → controls offers a strong visual demo without rewriting the entry paradigm.

## Live Green Ring Placement
- Home widget: a small ring card under the hero banner linking to the full “Impact” screen.
- Controls screen: secondary badge showing today’s % with a link to details.

## Next steps implemented
- Added a basic prototype: Home (VETC), Service Points/Controls (Tesla-inspired), and Live Green Ring screen within the Expo app.
 - Toàn bộ màn hình dùng light mode và copy tiếng Việt.
