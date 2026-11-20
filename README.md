# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/jztjxxxx/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/jztjxxxx/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

GTA 6 Trophy Guide &amp; Tracker: a fully offline web app covering all 55 official GTA 6 trophies on PlayStation 5. Tick trophies off as you earn them, watch your overall and platinum progress, and follow a six-step roadmap from the opening mission to the platinum.

Every trophy shows its official name, description and grade — reproduced verbatim from the official list — plus an original guide written from that description alone, with sources listed for each fact. Where a description gives no location or exact trigger, the guide says so plainly instead of inventing one. Story trophies are marked missable, with the warning derived from their descriptions: they can only be earned while playing that chapter or mission, and the official descriptions give no replay information.

## Features

- **Checklist of all 55 trophies** — name, official description and grade for each one, grouped by grade and type.
- **Progress tracking** — tick a trophy off and it stays ticked (localStorage), with an overall percentage and a platinum progress line.
- **Export / import** — download your progress as JSON and restore it on another browser.
- **Search &amp; filters** — search by name or description; filter by grade (platinum, gold, silver, bronze) and by type (story, missable, collectibles, activities, general); hide earned trophies.
- **Spoiler toggle** — hides the names and descriptions of story trophies until you earn them.
- **Trophy detail pages** — official description, guide and sources for each trophy, including counts where the kit's starter guide states one (42 Shooting Range challenges, 14 drone race locations, 18 meditation spots, 52 areas of Leonida, 9 gangs, 8 garage properties, 9 activity types, a count to 500).
- **Roadmap** — story order (Chapters 1–4 and the final mission first), then side content, activities, collectibles, cleanup, and platinum last, with missable reminders.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Or try it live: `node serve.ts`, then open http://localhost:8080.

## How to use it

1. **Checklist** — click a trophy's checkbox to mark it earned; the progress bar and platinum line update immediately.
2. **Filters** — use the search box, grade and type filters to find the trophy you need; turn on "Hide earned" to see only what's left.
3. **Spoilers** — turn on "Hide story spoilers" before you start the story; story names and descriptions stay hidden until you earn them.
4. **Guide** — click "Guide &amp; sources" (or "Details") on any trophy for its full guide and the sources behind every fact.
5. **Roadmap** — open the Roadmap tab for the six-step route to platinum, in the order the game is best played.
6. **Export / import** — "Export progress" downloads your ticks as JSON; "Import progress" restores them. "Reset progress" clears everything.

It all runs locally: the page loads only its own files and makes no network requests. Progress is stored in your browser's local storage only — nothing is uploaded anywhere.

---

<sub>Entered on [make.fun](https://make.fun/?ref=7t04rwmb&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
