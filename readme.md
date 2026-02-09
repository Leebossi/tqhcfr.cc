# TQHCFR.cc

Static website for the Turku fixed gear community with bilingual (FI/EN) support.

## Tech Stack

- HTML5 (multi-page static site)
- CSS3 (custom neobrutalist design system)
- JavaScript (vanilla)
- Nginx (static hosting + extensionless routes)


## Key Features

- Extensionless routes via Nginx (`/calculator`, `/events`, `/stickers`)
- Bilingual content (FI/EN) loaded from JSON
- Custom UI components: dropdown select, mobile hamburger nav
- Fixed-gear calculator with dynamic SVG

## Localization

Translations live in `src/i18n/translations.json` and are loaded by `src/js/i18n.js`. The default language is Finnish, and users can toggle languages from the nav.


## Deployment

Automated deployment using GitHub Actions. The site is served by Nginx with extensionless routing and a custom 404 page.