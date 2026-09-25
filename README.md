# Sparking Stars ✦

A monochrome time-trial game starring your Rare Friend, built by **lebucheron**
with FriendSDK v0.1.2 and AI-assisted development.

Six islands follow the selected Friend’s official GEN. Practice unlimited laps,
race for simulated coins, equip rollers or a kart, and personalize your pilot
with hats and trails. The Chronos panel compares session times to the leader.

## Play
Public preview: https://lebucheron.github.io/sparking-stars/

Requires a browser wallet on Robinhood mainnet (chain 4663) holding a hardwired
Generations NFT (GEN 1–6). The official SDK checks ownership. No purchase, private
key entry or signing transaction is required to play this simulated preview.
Mobile controls are supported; use a browser where your wallet is available.

## Run locally
Node.js 22+, npm and Git:
```sh
npm ci
npm run dev:game -- games/sparking-stars --port 4174
```
Open http://localhost:4174/.

## Build the public preview
```sh
npm ci
npm run build
npx friendsdk check games/sparking-stars
npx friendsdk build games/sparking-stars --outdir site
```
Publish all contents of `site/` over HTTPS, preserving relative paths and CSP.
The published preview retains real ownership checks and the simulated economy.

## Controls
Arrow keys / WASD / ZQSD, click or touch to walk. Collect the numbered stars in
order and return to the start. Space activates an equipped free-race consumable.
Modes, Boutique and Chronos are available between races. Reduced motion supported.

## Current scope
- Training: unlimited starts, no energy cost, no reward or tier advantage.
- Free races: simulated coins, tier benefits and limited vehicle energy.
- Cosmetics: free preview collection; no performance advantage.
- Leaderboard: session only, not a verified global competition. Reloading clears
  records, purchases, equipment and looks. No server or prize payouts yet.
- Economy remains simulated; coins have no RF value or redemption promise.
- Companion website, persistent rankings, ghosts and seasonal pass are planned,
  not delivered features. No official Rare Friends production affiliation implied.

Full rules and exact simulated costs: [game guide](games/sparking-stars/README.md).

## Checks
```sh
npm run build
npx friendsdk check games/sparking-stars
node games/sparking-stars/test-economy.mjs
node games/sparking-stars/test-leaderboard.mjs
npx playwright install chromium
node games/sparking-stars/test-profile.mjs
node games/sparking-stars/test-training.mjs
node games/sparking-stars/test-cosmetics.mjs
node games/sparking-stars/test-sparkle.mjs
node games/sparking-stars/test-leaderboard-browser.mjs
```
Browser fixtures are for automated tests only, never the public preview.

## Credits
Game design and direction: lebucheron. FriendSDK and canonical artwork:
[spokesz/friendsdk](https://github.com/spokesz/friendsdk), version 0.1.2.
The included SDK source is Apache-2.0; see [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md)
for artwork permissions and attribution. Original SDK docs: [README](FRIENDSDK_README.md).
