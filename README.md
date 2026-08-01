# Maximus Previews

Hosted mockup previews for Maximus Marketing pitches.

## Live links

Primary (custom domain):

- Hub: https://previews.maximus.baby/
- Greenville Cloud: https://previews.maximus.baby/previews/greenville-tobacco-vape/
- Greenville Industrial: https://previews.maximus.baby/previews/greenville-tobacco-vape/industrial/

Fallback (GitHub Pages, still works):

- https://zacharycaesarr.github.io/maximus-previews/

## Custom domain: `previews.maximus.baby`

We use the **subdomain** `previews.maximus.baby` so bare `maximus.baby` stays free for a future site, landing page, email, etc.

### 1) GitHub (already prepared in this repo)

1. Open https://github.com/zacharycaesarr/maximus-previews/settings/pages
2. Under **Custom domain**, enter: `previews.maximus.baby`
3. Click **Save** (GitHub checks DNS; may take a few minutes)
4. After it verifies, check **Enforce HTTPS**

The repo root already has a `CNAME` file with `previews.maximus.baby`.

### 2) Spaceship DNS (you do this once)

In Spaceship Domain Manager for `maximus.baby`:

1. Open **Advanced DNS** (Launchpad search → Advanced DNS → `maximus.baby`)
2. **Do not** click Connect for a Spaceship product unless you want that product to own DNS
3. Add one record:

| Type  | Host / Name | Value / Points to              | TTL   |
| ----- | ----------- | ------------------------------ | ----- |
| CNAME | `previews`  | `zacharycaesarr.github.io`     | 3600  |

Notes:

- Host is only `previews` (not the full domain)
- Value is your GitHub user Pages host: `zacharycaesarr.github.io` — **no** `/maximus-previews` path
- Leave apex `@` alone so you can use `maximus.baby` for something else later
- Avoid a wildcard `*.maximus.baby` record (security risk)

DNS usually works in minutes; worst case up to ~24 hours.

### 3) Check it

In PowerShell:

```powershell
Resolve-DnsName previews.maximus.baby -Type CNAME
```

You want it to show `zacharycaesarr.github.io`. Then open https://previews.maximus.baby/

### Future mockups

Keep adding folders under `previews/`, link them from the hub `index.html`, push to `main`. They automatically show up under:

`https://previews.maximus.baby/previews/your-new-folder/`

## Optional Netlify publish folders

`sites/greenville-preview1` and `sites/greenville-preview2` are local publish packs if you want separate Netlify URLs. Sync with:

```powershell
.\scripts\sync-preview-sites.ps1
```

With `previews.maximus.baby` live, you usually will not need Netlify for client shares.

## Add a new preview

1. Create a folder under `previews/`
2. Put `index.html` plus any `css/`, `js/`, and `assets/` inside
3. Link it from the hub `index.html`
4. Push to `main`

## Local check

```
npx serve .
```
