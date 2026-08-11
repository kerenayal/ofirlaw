# Ofir Omer, Adv. — Website

Bilingual (Hebrew/English) marketing website for Adv. Ofir Omer, built with [Eleventy](https://www.11ty.dev/), deployed to GitHub Pages, custom domain registered with GoDaddy.

For editing content (cases, articles, clients, contact details) without touching code, see **[CONTENT-GUIDE.md](./CONTENT-GUIDE.md)**.

## Local development

```bash
npm install
npm start        # dev server with live reload at http://localhost:8080
npm run build    # production build to _site/
```

## Project structure

- `src/` — Hebrew pages live at the root (`/`, `/about/`, ...); English mirrors live under `src/en/`.
- `src/_data/` — site-wide constants (`site.json`) and UI copy (`strings.json`).
- `src/content/` — editable content: practice areas, cases, articles, clients.
- `src/_includes/` — shared layout and partials (header, footer, accessibility widget).
- `src/styles/main.css` — design tokens (light/dark theme, RTL/LTR via CSS logical properties).
- `src/scripts/` — theme toggle, mobile nav, case filters, accessibility widget, contact form.

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In the repo's **Settings → Pages**, set the source to **GitHub Actions** (the included workflow at `.github/workflows/deploy.yml` builds and deploys automatically on every push to `main`).
3. Once the first deploy succeeds, the site is live at `https://<your-username>.github.io/<repo-name>/` — but see the custom domain steps below to serve it from your own domain instead.

## Connecting the GoDaddy domain

1. Update `src/CNAME` with your real domain (currently a placeholder: `example-domain-placeholder.co.il`) — this file is copied to the build output automatically so the setting survives every deploy.
2. Also update `site.url` in `src/_data/site.json` and the `Sitemap:` line in `src/robots.txt` to match — these drive canonical URLs, hreflang tags, and the sitemap.
3. In **GoDaddy → DNS Management** for your domain, add:
   - For the apex domain (`example.co.il`): four `A` records pointing to GitHub Pages' IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - For `www.example.co.il` (optional): a `CNAME` record pointing to `<your-username>.github.io`.
4. Back in **GitHub → Settings → Pages**, enter your custom domain in the "Custom domain" field and save (this also writes the CNAME file remotely — keeping it in `src/CNAME` too ensures it isn't lost on a fresh deploy).
5. Wait for DNS to propagate (can take minutes to a few hours), then check **"Enforce HTTPS"** in the same Pages settings once GitHub shows the certificate as issued.

## Known placeholders to fill in before launch

- `src/_data/site.json` — WhatsApp number (phone/mobile/fax/email/address are already filled in), real domain URL, accessibility coordinator details.
- `src/assets/images/` — portrait photo is in place; still need a JPG/PNG Open Graph share image (1200×630) to replace `og-image-placeholder.svg`.
- `src/content/cases/*.json` and `src/content/articles/*.json` — currently template entries with `[להשלמה]` placeholders; fill in with real case summaries and articles as they're approved for publication (see CONTENT-GUIDE.md).
- `src/content/clients.json` — currently empty; only add client names/logos that are cleared for public use.

## Roadmap

- [x] **Icons for contact details** — done. Small inline SVGs (`src/_includes/partials/icons.njk`) next to phone, mobile, fax, and email in the footer and on the Contact page.
- [ ] **Map on the Contact page** — embed a map showing the office address (Moshe Aviv Tower, Ramat Gan). Needs a decision on approach: a lightweight static map image (no third-party script, simplest, but not interactive) vs. an embedded Google Maps iframe (interactive, but pulls in a third-party service — would also need a mention in the privacy policy's "automatically collected information" section, similar to the existing Google Fonts note).
