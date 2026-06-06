# 🚧 mtl**pothole** · mtlpothole.com

Montreal's community pothole map. Report a pothole, vote up the worst ones, and
watch them get filled. Light/minimal theme. Inspired by the legend
[@marquize.7](https://www.instagram.com/marquize.7/).

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000
```

`npm run build` produces a clean production build (deployable to Vercel as-is).

## Pages

- **`/` — landing.** Minimal: centered "Where's the hole?" headline, one line of
  copy, and a search bar. Search/Report route to `/map`.
- **`/map` — the hole map.** Leaflet + OpenStreetMap (CARTO light tiles, no API key).
  Orange Montreal **traffic-cone** markers with vote badges; **hover** for a quick
  card, **click** to vote + comment. Filled holes turn into a green cone. The report
  flow (search an address *or* drop/drag a pin → photo + description → submit) lives here.
  Landing search hands a target to the map via `sessionStorage`; `/map#report` deep-links
  straight into the report modal.
- **`/leaderboard` — the board.** "Most Requested Holes" ranked by votes; tap a row to
  jump to it on the map. Donate ("Fuel the fill") + phase-2 teaser live at the bottom.

A shared `SiteNav` + `SiteFooter` wrap every page.

## How the data works

This is a **local demo**: data is seeded (`lib/seed.ts`) and persisted to the
browser's `localStorage`. Nothing is shared between visitors yet. One vote per
hole per browser; the reporter auto-votes their own.

Everything goes through one interface — `lib/store/PotholeStore.ts`:

```ts
interface PotholeStore {
  list(): Promise<Pothole[]>;
  add(input: NewPotholeInput): Promise<Pothole>;
  vote(id: string, voted: boolean): Promise<Pothole>;
  addComment(id: string, text: string): Promise<Comment>;
}
```

The demo implementation is `lib/store/localStore.ts`. **To make it a real shared
community**, add `lib/store/supabaseStore.ts` implementing the same interface
(a `potholes` table + `comments`, Supabase Storage for photos) and swap the one
line in `lib/store/useStore.ts`:

```ts
const store = useMemo(() => new LocalPotholeStore(), []);
// → new SupabaseStore()
```

No component changes required.

## Project map

```
app/
  layout.tsx        fonts (Anton + Inter), metadata, theme
  page.tsx          / — landing (clean CTA)
  map/page.tsx      /map — the interactive map + report flow
  leaderboard/page.tsx  /leaderboard — the board + donate/phase-2
  globals.css       Tailwind v4 theme tokens + Leaflet/marker restyling
components/
  SiteNav, SiteFooter, Hero, SearchBar, PotholeMap, PotholeCard,
  LocationPicker, ReportModal, RankedList, DonateButton, ConeIcon
lib/
  types.ts          Pothole / Comment / JournalEntry (phase-2 fields scaffolded)
  seed.ts           ~9 Montreal potholes
  geocode.ts        Nominatim address <-> coords
  image.ts          client-side photo downscale -> data URL
  format.ts         time-ago, compact numbers, status metadata
  placeholder.ts    offline-safe SVG pothole "photos"
  coneMarker.ts     the orange MTL traffic-cone marker SVG
  store/            PotholeStore interface + LocalPotholeStore + useStore hook
public/
  marquize.svg      placeholder portrait — drop the real photo at /public/marquize.jpg
                    and point Hero.tsx's <img src> at it
```

## Customize

- **The legend's photo:** replace `public/marquize.svg` reference in `components/Hero.tsx`
  with `/marquize.jpg` after adding that file.
- **Theme colors:** the `@theme` block at the top of `app/globals.css`
  (cone orange accent on a white/light palette: `ink`, `muted`, `line`, `wash`).

## Phase 2 (scaffolded, not wired)

- Filled-hole before/after photos + Marquize's progress journal on hover
  (fields already on the `Pothole` type: `fillPhotoUrl`, `journal`).
- Real donations.
- Notifications when a hole you voted for gets filled.
