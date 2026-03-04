# Single Page React Workspace

This workspace is set up with:

- React + Vite
- Tailwind CSS
- Framer Motion
- GitHub Pages deployment support

## Local development

```bash
npm install
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

You can deploy in two ways:

1. Automatic deploy from GitHub Actions on every push to `main` (see `.github/workflows/deploy.yml`).
2. Manual deploy from your machine:

```bash
npm run deploy
```

### One-time GitHub Pages setting (important)

In your GitHub repo settings, set **Pages source** to one of these:

- **GitHub Actions** (recommended, uses `.github/workflows/deploy.yml`), or
- **Deploy from a branch** -> `gh-pages` / `/ (root)` (works with `npm run deploy`).

If Pages is set to `main` root, it will serve `/src/main.jsx` directly and break with a MIME error (`text/jsx`).

## Single-page app entry

The one-page UI lives in:

- `src/App.jsx`
