# Portfolio

A modern, animated portfolio site built with Next.js, Tailwind CSS, and Sanity CMS. Features GitHub, LeetCode, Last.fm, and Steam integrations on a dedicated Signals page.

## Tech Stack

- **Framework**: Next.js 16 (Pages Router)
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion 11
- **Content Management**: Sanity CMS
- **Language**: TypeScript 5
- **Deployment**: Vercel

## Project Structure

```
├── components/
│   ├── site/              # Layout and site components
│   ├── Navbar/            # Navigation bar
│   ├── SplashScreen/      # Entry animation
│   └── HomeSections/      # Home page section variants
├── pages/
│   ├── index.tsx          # Home/overview page
│   ├── signals.tsx        # GitHub, LeetCode, Last.fm, Steam stats
│   ├── splash.tsx         # Splash screen page
│   └── api/
├── lib/                   # Data fetchers and utilities
│   ├── github.ts          # GitHub API integration
│   ├── leetcode.ts        # LeetCode GraphQL integration
│   ├── lastfm.ts          # Last.fm API integration
│   ├── steam.ts           # Steam Web API integration
│   └── ...
├── sanity/
│   ├── env.ts             # Centralized environment configuration
│   ├── lib/
│   │   ├── types.ts       # All TypeScript interfaces
│   │   ├── fetch.ts       # Sanity CMS fetch utility
│   │   └── queries.ts     # GROQ queries
│   └── studio/            # Sanity Studio config
├── styles/
│   └── globals.css        # Global styles and animations
├── public/                # Static assets
├── .env.example           # Environment template
└── tsconfig.json          # TypeScript configuration
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd portfolio
npm install
```

### 2. Environment Configuration

Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys and IDs (see [Environment Variables](#environment-variables) section below).

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Launch Sanity Studio (Optional)

To edit content in the CMS:

```bash
npm run sanity:studio
```

Sanity Studio will open at [http://localhost:3333](http://localhost:3333).

## Environment Variables

All environment variables are centralized in `sanity/env.ts` for type safety and consistency.

### Required for Sanity CMS

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=your_sanity_dataset
SANITY_API_TOKEN=your_sanity_api_token_with_write_access
```

Get these from your [Sanity project dashboard](https://sanity.io/manage).

### Optional Signals Page Integrations

#### GitHub (optional)
```bash
GITHUB_TOKEN=your_github_personal_access_token
```

If not provided, the page uses public GitHub REST API with rate limiting (~60 requests/hour).

#### LeetCode
```bash
LEETCODE_USERNAME=your_leetcode_username
```

Public GraphQL endpoint—no API key needed. Username extracted from Sanity resource links or env var.

#### Last.fm
```bash
LASTFM_API_KEY=your_lastfm_api_key
LASTFM_USERNAME=your_last_fm_username (optional)
```

Get an API key from [Last.fm](https://www.last.fm/api/account/create). If not provided in env, username is extracted from Sanity resource links.

#### Steam
```bash
STEAM_API_KEY=your_steam_web_api_key
STEAM_ID=your_steam_profile_id_or_steamid64 (optional)
```

Get an API key from [Steam Community](https://steamcommunity.com/dev/apikey). `STEAM_ID` can be:
- A 17-digit SteamID64
- Your vanity URL segment (e.g., `your-vanity-name` from `steamcommunity.com/id/your-vanity-name`)

If not provided in env, ID is extracted from Sanity resource links.

## Pages Overview

### Home (`/`)
Main portfolio landing page. Displays featured projects, research papers, and resource links managed in Sanity CMS.

**Key files:**
- `pages/index.tsx` – Page component
- `components/HomeSections/` – Section variants
- `sanity/lib/queries.ts` – GROQ queries for home content

**To update:** Edit content in Sanity Studio, or modify queries in `sanity/lib/queries.ts`.

### Signals (`/signals`)
Dashboard aggregating GitHub, LeetCode, Last.fm, and Steam stats.

**Features:**
- **GitHub**: Recent repositories, contribution heatmap, follower stats
- **LeetCode**: Problem-solving stats, difficulty breakdown, global rank
- **Last.fm**: Top monthly artists and tracks, total scrobbles
- **Steam**: Library size, total play hours, top games, recent games

**Key files:**
- `pages/signals.tsx` – Page component
- `lib/github.ts`, `lib/leetcode.ts`, `lib/lastfm.ts`, `lib/steam.ts` – Fetchers
- `sanity/lib/types.ts` – Type definitions

**To update:** Each stat fetcher is independent. Modify the corresponding `lib/<service>.ts` to change what data is fetched or displayed.

### Splash (`/splash`)
Animated entry screen displayed when the site first loads.

**Key files:**
- `pages/splash.tsx` – Page component
- `components/SplashScreen/` – Splash components
- `styles/globals.css` – Animations

## Updating Content

### Via Sanity Studio
1. Run `npm run sanity:studio`
2. Browse to Studio and edit:
   - Featured projects
   - Research papers
   - Resource links (profile URLs for social/external links)
   - Site settings

### Via Code
- **Home page content**: `sanity/lib/queries.ts` (GROQ queries)
- **Signals integrations**: Update environment variables in `.env.local` or modify fetchers in `lib/`
- **Styling**: `styles/globals.css` (Tailwind, custom animations)
- **Layout**: `components/site/SiteLayout.tsx`
- **Animations**: `components/site/motion.ts` (Framer Motion configs)

## Build and Deployment

### Build
```bash
npm run build
```

Runs TypeScript type checking and Next.js build. Output in `.next/`.

### Type Check Only
```bash
npx tsc --noEmit
```

### Deploy to Vercel

Vercel is pre-configured and deploys on every push to `main`:

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel project settings
3. Push to `main` to deploy

Deployment docs: [Vercel Next.js deployment](https://nextjs.org/docs/deployment)

## Common Customizations

### Update Solar System Background
Modify orbit speeds in `styles/globals.css`:
- `.solar-system` – Container animation duration
- `.orbit-*` – Individual orbit timings
- `components/site/SiteLayout.tsx` – Motion parameters

### Update Colors
Edit `tailwind.config.js` or override in `styles/globals.css`.

### Change Signals Integrations
1. Update `.env.local` with new keys
2. Modify fetchers in `lib/`
3. Update types in `sanity/lib/types.ts`
4. Rewire component in `pages/signals.tsx`

## Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run type-check       # Run TypeScript checks
npm run sanity:studio    # Launch Sanity Studio
```

## Troubleshooting

### Type errors on build
Run `npx tsc --noEmit` locally to debug before pushing.

### Signals page doesn't load stats
- Check `.env.local` has required keys
- Check `sanity/env.ts` for env var names
- Check browser console for fetch errors
- Verify API keys are valid and not rate-limited

### Sanity content not updating
- Ensure `SANITY_API_TOKEN` has write permissions
- Rebuild or redeploy after content changes in Studio

## License

MIT
