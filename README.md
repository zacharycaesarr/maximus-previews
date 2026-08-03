# Maximus Previews

Private client mockup hub for Maximus Marketing.

- Live: https://mockups.maxmarket.live/
- Repo: https://github.com/zacharycaesarr/maximus-previews
- Agency: https://maxmarket.live/ · hello@maxmarket.live · 540-416-2983

## How this studio works

Each client gets a one-page concept under `previews/[client-slug]/`.

```
previews/[client-slug]/
  index.html    # empty shell + noindex
  style.css
  script.js     # injects markup + soft protect
```

Shared helpers: `shared/preview-lock.js`  
Cursor memory bank: `.cursor/rules/preview-studio.mdc` (`alwaysApply: true`)

**Design rule:** every mockup is a clean slate. Pull look from that client only. Do not reuse a house theme across clients.

**Access:** no password gates. These are cold-call previews. Open link = see the page.

## Client protection (soft)

1. Unlisted URL
2. `noindex` + root `robots.txt`
3. Maximus badge + footer credit (no diagonal preview watermark overlay)
4. Soft DevTools / select deterrents
5. Empty `index.html` shell with JS-injected markup

These are deterrents, not real locks.

## Add a new preview

1. Research the client's live site and assets.
2. Create `previews/[slug]/` with the three files. Never overwrite an existing folder.
3. Link it from hub `index.html`.
4. Push to `main`.
5. Share the live link as `https://mockups.maxmarket.live/previews/[slug]/`

## Live links

| Preview | URL |
| --- | --- |
| Hub | https://mockups.maxmarket.live/ |
| Decipher Brewing | https://mockups.maxmarket.live/previews/decipher-brewing/ |
| Greenville Cloud (legacy link already sent) | https://previews.maximus.baby/previews/greenville-tobacco-vape/ |
| Greenville Retail (legacy link already sent) | https://previews.maximus.baby/previews/greenville-tobacco-vape/industrial/ |

Greenville pages still live in this same repo. New share links should use `mockups.maxmarket.live`. The old `previews.maximus.baby` Greenville URLs stay listed above only because that link was already sent to the client.

## Local check

```powershell
npx serve .
```
