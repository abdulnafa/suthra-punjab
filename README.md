# Suthra Punjab Banner Maker

A dependency-free, mobile-friendly static website that creates Suthra Punjab activity banners from six GPS-stamped photos.

## Features

- Area options: UC Khabeki, UC Mardwal, UC Angah, UC Kufri, UC Uchaali, UC Khura, MC Naushera and Tehsil Naushera
- Activity options: Desilting, Door to Door, Manual Sweeping, Heap Collection, Road Washing, School Cleaning, Dustbin Washing, Hospital Cleaning, Awareness, Masjid Cleaning, Graveyard Cleaning, Dust Bin Placement, Equipment Washing, Machinery Washing, Branding Improvement, Tehsil Entry Points Cleaning, Milad un Nabi Day Cleaning and Public Place Cleaning
- Six separate JPG/PNG/WebP upload boxes with replace, remove and drag-and-drop support
- Mobile bulk selection that fills the six empty photo boxes in order
- Mobile-first two-column photo layout with a safe-area-aware download bar
- Live poster preview based on the supplied 535 × 725 reference layout
- Reference-matched colors, unequal photo grid, typography and activity-specific vector icons
- Sharp 1070 × 1450 JPG download
- All processing happens locally in the browser; photos are never uploaded
- No framework, build command, package install or server is required

## Private Google sign-in

- Google Identity Services is configured with a Web OAuth client for the GitHub Pages origin.
- The Google credential is exchanged with Firebase Authentication before access is granted.
- Only the allowlisted Google account can unlock the banner maker through the normal interface.
- Cloud Firestore keeps one short-lived active-browser lease. A second browser is rejected while the first browser is active.
- The active browser renews its lease every 45 seconds. Signing out releases it immediately; otherwise it expires after 3 minutes without a heartbeat.
- Heartbeats pause while the page is in the background. The app verifies the lease again before it becomes usable after returning.
- If a visible browser cannot confirm its lease for 2.5 minutes, the app locks locally before the server lease expires.
- Passwords and OTPs are handled by Google and are never received or stored by this website.
- Firestore stores only a random browser ID, active/inactive state and server timestamp. Photos remain on the device and are never uploaded.
- If the Google Auth app is in Testing, add the allowed account under **Audience → Test users**.
- Never add an OAuth Client Secret to this static repository.
- The browser lease coordinates normal use, but it is not a tamper-proof physical-device identifier. GitHub Pages remains public and cannot hide client-side source code.

### Firebase console setup

1. Register the web app in the existing `shutra-punjab` Firebase project.
2. Under **Authentication → Sign-in method**, enable Google and disable unused providers.
3. Under **Authentication → Settings → Authorized domains**, add `abdulnafa.github.io`.
4. Create the default Cloud Firestore database in Production mode.
5. Open Firestore's **Rules** tab, replace its contents with [`firestore.rules`](./firestore.rules), then publish the rules.
6. Do not manually create the lease document; the first authorized sign-in creates it.

## Run locally

Google sign-in cannot be tested through a `file://` URL. Start a local static server in this folder instead.

For example, if Python is installed:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

To test Google sign-in locally, make sure `localhost` is listed under Firebase Authentication's **Authorized domains**, and add `http://localhost:8000` under the OAuth client's **Authorized JavaScript origins**. The deployed GitHub Pages site only needs `https://abdulnafa.github.io`.

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
