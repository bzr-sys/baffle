# Baffle

Puzzle games on Bazaar, and the example of **an app that sells content from its own app DB**.

- **Codebreak**, the free daily: crack a 4-color code in 8 guesses. One code a day, from a yearly schedule built into the site.
- **8 games**, each with 3 free puzzles built into the site. The rest of every game is in **one $5 pack** (one-time):

| Game | Rules | Free | In the pack |
|---|---|---|---|
| Crownwork | One crown per row, column and color; crowns never touch | 3 | 37 |
| Gridpaint | Fill cells from row and column clues to reveal a picture | 3 | 30 |
| Sun & Moon | Half suns, half moons per line; never three alike in a row | 3 | 27 |
| Path | One line through every cell, numbers in order | 3 | 27 |
| Make the number | Reach the target with + − × ÷, in exactly four steps | 3 | 27 |
| Sum pyramid | Every block is the sum of the two below | 3 | 27 |
| Hue line | Swap tiles into a smooth color gradient | 3 | 27 |
| Word ladder | Change one letter per step to reach the end word | 3 | 27 |

## How it uses Bazaar

There is no backend. Free puzzles and the daily schedule are part of the static site. The pack lives in the **app DB**, owned by Baffle's own app team; each player's progress lives in their own DB.

| Data | Where | Who can do what |
|---|---|---|
| `pack` (product), `games` (pack size per game) | App DB | App team writes, anyone reads |
| `levels` | App DB | App team writes. Readable after buying: `{ products: { $containsAny: '$purchases' } }` |
| `solves` | Player's DB | Only the player |

- `bzr.appContext()` opens the app DB. Players can only read it; Bazaar refuses any grant that would let them write.
- The pack is a one-time product created on first publish (`bzr.monetization.products.create`). The seller gets paid: the org in `VITE_SELLER_ID` (an org the admin administers), else the publishing admin. Admin finds the pack again through the product ID and seller in the `pack` doc. The seller's plan (Creator, or Business for an org) must allow monetization; app DB storage counts against the app owner's app storage pool.
- Buying the pack changes nothing in Baffle's data: the `$purchases` filter makes the pack levels readable.

The Bazaar setup is in `src/bazaar.ts`, data and publishing in `src/lib/data.ts`, the game list in `src/games.ts`.

Limits, honestly: the game engines are public JavaScript, only the level data is gated. The daily code is in the site, and streaks are kept in the player's own DB, so both are on the honor system.

## Levels

The level generators and the pack live in the private org repo (`org/baffle/`), not here: this repo is open source, and anything in it is public. The generator writes the 3 free puzzles per game and the Codebreak schedule into `src/levels/`, and Word ladder's word list into `src/lib/words.ts`; the pack levels stay in the org repo and reach players only through the app DB.

## Run locally

Needs the SDK from the sibling `bazaar/` monorepo, built once (Baffle uses `bzr.appContext()`, not yet in a published SDK). Rebuild the frontend after Bazaar frontend changes: the mock serves its popups from `frontend/dist`.

```sh
cd ../bazaar && pnpm --filter @bzr/bazaar-types --filter @bzr/bazaar run build
pnpm --filter @bzr/bazaar-frontend run build
node mock/src/mock.ts -i baffle -n Baffle -u http://localhost:5173
```

```sh
npm install
npm run dev
```

Other ports: `-p 3390 -u http://localhost:5190` on the mock, `VITE_BAZAAR_URI=http://localhost:3390 npx vite --port 5190 --strictPort` here. The mock keeps everything in memory: after a restart, set up and publish again.

1. **Play with Bazaar**, log in with `owner@example.com` (the app's owner in the mock).
2. Account menu → **Admin** → **Set up monetization**: **Get Subscription** → Creator **Select** → **Continue** → **Setup monetization** (mock: completes at once) → **Back to app**.
3. Under **Publish**, choose each game's pack file from `org/baffle/levels/`, then **Publish**.
4. Log in with any other email in another browser profile (new users pick a handle and name). **Get the pack · $5** → **Buy** (no card in mock mode) → **Back to Baffle**: the pack unlocks.
5. Admin shows **Packs sold**.

## Deploy

GitHub Pages via `.github/workflows/deploy.yml`. Set the repository variables `BAFFLE_APP_ID` and `BAFFLE_SELLER_ID` (org ID, optional) and register `https://<owner>.github.io/<repo>` as a redirect URI.

Game names were checked against app stores and the web (not a formal trademark search). Run a USPTO/EUIPO check before launch.
