# haleematallat.github.io

Personal site of Haleema Tallat. Plain HTML, CSS and a little JavaScript, with no build step.

## Publish on GitHub Pages (about 5 minutes)

1. Sign in to GitHub and create a **new public repository** named exactly `haleematallat.github.io`. Leave it empty (no README, no licence).
2. On the new repo page, click **uploading an existing file**.
3. Drag in **everything inside this folder**: `index.html`, `styles.css`, `main.js`, `favicon.svg`, `og.png`, `haleema-tallat-resume.pdf`, `README.md` and the whole `fonts` folder. `index.html` must sit at the top level of the repo, not inside a subfolder.
4. Click **Commit changes**.
5. Go to **Settings → Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, Branch to **main**, and folder to **/ (root)**, then click **Save**.
6. Wait a minute or two, then open **https://haleematallat.github.io**.

## Making changes later

- **Text:** edit `index.html` directly on GitHub (click the file, then the pencil icon) and commit. The site updates within a minute or two.
- **Résumé:** upload a new PDF with the same name, `haleema-tallat-resume.pdf`, and it replaces the old one.
- **Colours:** every colour is defined once at the top of `styles.css`, in the `:root` block and the two dark-mode blocks under it.

## Custom domain (optional)

Buy a domain such as `haleematallat.com` from any registrar. Then in **Settings → Pages → Custom domain**, enter the domain and follow GitHub's DNS instructions. Tick **Enforce HTTPS** once it's available. After that, update the `canonical`, `og:url` and `og:image` addresses at the top of `index.html`.

## Checking the link preview

After publishing, paste the URL into the LinkedIn Post Inspector (linkedin.com/post-inspector) to check the preview card.

## Credits

Fonts are self-hosted and licensed under the SIL Open Font License: Newsreader (Production Type), Hanken Grotesk (Hanken Design Co.) and IBM Plex Mono (IBM).
