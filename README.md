# Suthra Punjab Banner Maker

A dependency-free, mobile-friendly static website that creates Suthra Punjab activity banners from six GPS-stamped photos.

## Features

- UC options: UC Khabeki, UC Mardwal and UC Angah
- Activity options: Desilting, Door to Door, Manual Sweeping and Heap Collection
- Six separate JPG/PNG/WebP upload boxes with replace, remove and drag-and-drop support
- Live poster preview based on the supplied 535 × 725 reference layout
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
