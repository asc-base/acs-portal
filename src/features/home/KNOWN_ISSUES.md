# Home known issues

Observed while adding ticket 11 tests; production behavior remains unchanged.

- `ReviewCarousel` has no callers under `src`, so it is excluded from active-home coverage. Its desktop rendering dereferences reviews 1 and 2 even for incomplete groups: nonempty lists whose length is not divisible by three crash. Its two autoplay effects advance the same index against different item/group bounds, potentially skipping slides or moving outside the desktop group range. Both desktop and mobile indicator lists also share that index.
- News-carousel previous/next buttons have no accessible names; indicators are clickable `div` elements without keyboard operation. Tests scope arrows by category and button order because production accessibility changes are outside this ticket.
- At width 1280 and above, a three-item news list advances by three, leaving its index unchanged while navigation arrows remain displayed. The responsive step uses 1/2/3 at 768/1280 boundaries, while card visibility uses Tailwind `md`/`lg` to show 1/3/4 cards. DOM unit tests verify JavaScript steps, not CSS layout.
- Passing an empty announcement array renders the announcement section and a default image linking to hardcoded `/news/51`; omitting the prop hides the section. This is existing behavior, explicitly preserved by tests.
- The announcement carousel does not reset/clamp its index when items shrink. After selecting a later slide, replacing items with a shorter or empty list can translate past its available slide, including the default fallback. Current home props are initial server data; the ticket does not change this behavior.
- Highlight image validation rejects any URL containing `null` or `undefined`, including potentially legitimate filenames; a selected but invalid nested thumbnail does not fall through to the top-level thumbnail before considering the highlight/default. Tests cover the current image-source rules without rewriting them.
- The home route catches individual data request failures but propagates service-factory failures. Route tests preserve that boundary rather than treating all errors as empty data.
