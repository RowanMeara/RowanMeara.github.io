# 2048 Improvement Task List

Use this as a working checklist for modernizing the 2048 game at `/app/2048/page.tsx`.

## P0 - Critical

- [x] Add test coverage for core rules (all directions, merge edge cases, score, no-op moves, spawn-after-move, game-over detection).
- [x] Refactor move engine so all directions share one canonical transform path.
- [x] Fix tile identity mapping so merge/move animations always track correct source tiles.

## P1 - High Impact

- [x] Add touch/swipe controls for mobile/tablet.
- [x] Add win-state flow when reaching 2048 (Win UI with Continue/New Game).
- [x] Add end-state overlays and restart UX polish (game-over modal/banner + clear CTA).
- [x] Make board sizing responsive instead of fixed `72px` tiles and `8px` gaps.
- [x] Persist best score immediately when surpassed (not only on game-over).

## P2 - Quality and Polish

- [x] Accessibility pass (ARIA semantics, keyboard/focus polish, live announcements for score/state).
- [x] Respect `prefers-reduced-motion` and reduce/disable tile animations accordingly.
- [x] Remove dead code and cleanup unused symbols/comments.
- [x] Improve high-value tile visual design and readability beyond 2048.

## Notes

- Main file scope: `/app/2048/page.tsx`
- Optional follow-up: split game logic into a separate module for easier unit testing.
