# Photography portfolio

A minimal, dark-themed photography portfolio built with React + Vite,
deployed to GitHub Pages.

## Editing your site

- **Name, tagline, about text, email, socials** → [`src/config.js`](src/config.js)
- **Photos** → drop image files into [`src/photos`](src/photos) — the gallery
  picks them up automatically, sorted by filename.
- **Sections/layout** → [`src/components`](src/components)
- **Colors/fonts/spacing** → [`src/index.css`](src/index.css)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # preview the production build locally
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and deploys it to GitHub Pages automatically.

The first time, enable Pages in the repo: **Settings → Pages → Build and
deployment → Source: GitHub Actions**.

Site: https://reidnitcher.github.io/photography/
