# React Portfolio Site

A small personal portfolio built with **React + Vite** in plain JavaScript (no
TypeScript). Six pages, client-side routing, a contact form, and a Netlify
deploy workflow.

This README is written for people new to React — if a step feels obvious,
skip it.

---

## What's in the box

- **React 18** — the UI library
- **Vite 5** — the dev server + build tool (super fast)
- **react-router-dom 6** — client-side routing between pages
- No Redux, no TypeScript, no CSS framework — just CSS files per component
- GitHub Actions workflow that builds and deploys to Netlify

---

## Prerequisites

You need:

1. **Node.js** — the runtime that runs Vite and installs packages
   - The project pins **Node 24** via `.nvmrc` / `package.json` `engines`
   - Node 22 (current LTS) also works fine; anything below 18 will not
2. **npm** — bundled with Node
3. A terminal and a code editor (VS Code is great)

Check what's installed:

```bash
node --version   # want v22 or v24
npm --version
```

If you don't have Node, install it from <https://nodejs.org> (pick the LTS
build), or via Homebrew on macOS:

```bash
brew install node@24
```

---

## First-time setup

From the project folder:

```bash
npm install
```

This reads `package.json`, downloads every dependency into `node_modules/`,
and creates/updates `package-lock.json`. Takes ~30 seconds the first time.

You only need to run `npm install` again when someone changes `package.json`.

---

## Running the site locally

```bash
npm run dev
```

You'll see something like:

```
  VITE v5.4.21  ready in 86 ms
  ➜  Local:   http://localhost:5173/
```

Open <http://localhost:5173> in your browser. Edits to `.jsx`/`.css` files
hot-reload automatically — you almost never need to refresh manually.

Stop the server with `Ctrl+C`.

---

## Building for production

```bash
npm run build
```

This creates a `dist/` folder containing static HTML, CSS, and JS. That
folder is what actually gets deployed to Netlify. You can preview the
production build locally with:

```bash
npm run preview
```

---

## Project structure

```
react_portfolio_site/
├── index.html               # Vite entry (the <div id="root"> lives here)
├── package.json             # Dependencies and npm scripts
├── vite.config.js           # Vite plugin config
├── netlify.toml             # SPA redirects for Netlify deploys
├── public/                  # Files served as-is at the site root
│   ├── logo.svg             #   → /logo.svg   (favicon)
│   └── resume.pdf           #   → /resume.pdf (About page link)
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions: build + deploy to Netlify
└── src/
    ├── main.jsx             # Mounts <App /> into #root, wires BrowserRouter
    ├── App.jsx              # Route table + Navbar/Footer shell
    ├── components/
    │   ├── Logo.jsx         # Inline-SVG hexagon logo with "AB" initials
    │   ├── Navbar.jsx       # Sticky top nav, mobile hamburger
    │   └── Footer.jsx
    ├── pages/
    │   ├── Home.jsx         # Welcome + mission + confirmation banner
    │   ├── About.jsx        # Bio, headshot, resume link
    │   ├── Projects.jsx     # 3 project cards
    │   ├── Education.jsx    # Timeline of qualifications
    │   ├── Services.jsx     # Programming / Web / Mobile
    │   └── Contact.jsx      # Form → captures state → redirects to /
    ├── assets/              # SVG images imported by pages
    └── styles/
        ├── index.css        # Global reset + CSS variables (colors, spacing)
        └── App.css          # Layout utilities (.card, .grid, .btn, …)
```

### The mental model

- Each **page** is a plain React component that returns JSX. A page owns
  its own `.css` file, imported at the top.
- **Routing** is defined in `App.jsx` with `<Routes>` and `<Route>`. Adding
  a page = create the component, add one `<Route>` entry, add one
  `NAV_LINKS` entry in `Navbar.jsx`.
- **Static data** (project list, services, qualifications) is an array of
  plain objects at the top of each page component and rendered with
  `.map(...)`. No CMS, no fetch.
- **Global state** — none. The only stateful piece is the Contact form
  (`useState`) and a one-shot banner on Home read from `location.state`.

---

## Common tasks

### Change your name, photo, or bio

- Bio + name → `src/pages/About.jsx`
- Headshot → replace `src/assets/headshot.svg` with any image (keep the
  filename or update the import)
- Site title / meta description → `index.html`
- Brand name in nav → `src/components/Navbar.jsx` (`<span className="brand-name">`)
- Footer copyright name → `src/components/Footer.jsx`

### Add a new project

Open `src/pages/Projects.jsx` and add an entry to the `PROJECTS` array:

```jsx
{
  id: 'my-new-project',        // any unique string
  title: 'My New Project',
  image: myProjectImage,       // import it at the top of the file
  imageAlt: 'Screenshot of…',
  role: 'What I did',
  outcome: 'What the work produced.'
}
```

Same shape works for `SERVICES` in `Services.jsx` and `QUALIFICATIONS` in
`Education.jsx`.

### Add a new page

1. Create `src/pages/MyPage.jsx` (copy an existing page as a template).
2. In `src/App.jsx`, import it and add:

   ```jsx
   <Route path="/mypage" element={<MyPage />} />
   ```

3. In `src/components/Navbar.jsx`, add to `NAV_LINKS`:

   ```jsx
   { to: '/mypage', label: 'My Page' }
   ```

### Change the color scheme

All colors live as CSS variables in `src/styles/index.css` under `:root`.
Change `--color-accent`, `--color-bg`, etc., and every component picks up
the new value.

### Replace the résumé PDF

Drop your real résumé at `public/resume.pdf` (same filename). The link on
About will just work.

---

## Deploying to Netlify

Two setup steps done in the web UIs (once), then every push to `main`
auto-deploys.

1. **On Netlify** — create an empty site and copy its **Site ID**
   (Site configuration → General → Site details → API ID).
2. **On Netlify** — create a personal access token
   (User settings → Applications → Personal access tokens).
3. **On GitHub** — add both as repository secrets
   (Settings → Secrets and variables → Actions):
   - `NETLIFY_SITE_ID`
   - `NETLIFY_AUTH_TOKEN`
4. **Push to `main`** — the workflow in `.github/workflows/deploy.yml`
   installs deps, builds, and uploads `dist/` to Netlify.
   Pull requests get a preview URL commented back on the PR.

The `netlify.toml` at the repo root includes a `/* → /index.html` redirect
so react-router deep links (e.g. `/about`) still work after a hard refresh.

---

## Troubleshooting

- **`npm install` fails with `EBADENGINE`** — your Node version doesn't
  satisfy `engines` in `package.json`. Either install Node 24, or drop the
  `engines` field. (There's no `.npmrc` `engine-strict=true` in this repo,
  so it should only warn, not fail.)
- **Blank page in production but works in dev** — usually a routing issue.
  Make sure `netlify.toml` (or your host's equivalent) has the SPA
  fallback to `index.html`.
- **`npm run dev` says port 5173 is in use** — kill the other process
  (`pkill -f vite`) or run `npm run dev -- --port 5174`.
- **Import path errors after adding a file** — Vite is case-sensitive on
  Linux/CI even if your local macOS filesystem isn't. Match filenames
  exactly.

---

## Scripts reference

| Command           | What it does                                       |
| ----------------- | -------------------------------------------------- |
| `npm install`     | Install dependencies from `package.json`           |
| `npm run dev`     | Start the Vite dev server with hot reload          |
| `npm run build`   | Produce a static production build in `dist/`       |
| `npm run preview` | Serve the built `dist/` locally (production check) |

---

## License

Personal project — use the code as a reference for your own portfolio.
