# Known issues

- `documentURL` uses generic `z.url()` validation, which accepts parseable non-HTTP schemes such as `javascript:`, `data:`, `mailto:`, and `ftp:`. Decide the allowed document-link schemes and restrict validation (at least to HTTP(S)) before relying on this as a safe link boundary.
