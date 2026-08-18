# Suthra Punjab Banner Maker

A dependency-free, mobile-friendly static website that creates Suthra Punjab activity banners from six GPS-stamped photos.

## Features

- Area options: UC Khabeki, UC Mardwal, UC Angah, UC Kufri, UC Uchaali, UC Khura and MC Naushera
- Activity options: Desilting, Door to Door, Manual Sweeping, Heap Collection and Road Washing
- Six separate JPG/PNG/WebP upload boxes with replace, remove and drag-and-drop support
- Mobile bulk selection that fills the six empty photo boxes in order
- Mobile-first two-column photo layout with a safe-area-aware download bar
- Live poster preview based on the supplied 535 × 725 reference layout
- Reference-matched colors, unequal photo grid, typography and activity-specific vector icons
- Sharp 1070 × 1450 JPG download
- All processing happens locally in the browser; photos are never uploaded
- No framework, build command, package install or server is required

## Run locally

Open `index.html` directly in a modern browser, or start any static file server in this folder.

For example, if Python is installed:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish on GitHub Pages

From this folder, run:

```powershell
git init -b main
git add .
git commit -m "Build Suthra Punjab banner maker"
git remote add origin https://github.com/abdulnafa/suthra-punjab.git
git push -u origin main
```

Then open the repository on GitHub and go to **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose **main** and **/(root)**, then save.

The repository URL shown in the supplied screenshot is:

```text
https://github.com/abdulnafa/suthra-punjab.git
```

The published site will normally be available at:

```text
https://abdulnafa.github.io/suthra-punjab/
```

## Font license

The poster uses the bundled Roboto Condensed variable font. It is distributed under the SIL Open Font License; the license text is included at `assets/RobotoCondensed-OFL.txt`.
