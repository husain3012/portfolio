# Next.js + Tailwind CSS Example

This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v3.0)](https://tailwindcss.com/blog/tailwindcss-v3) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-tailwindcss)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example with-tailwindcss with-tailwindcss-app
# or
yarn create next-app --example with-tailwindcss with-tailwindcss-app
# or
pnpm create next-app --example with-tailwindcss with-tailwindcss-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Optional Signals integrations

The Signals page can also show Last.fm and Steam stats.

Required environment variables:

```bash
LASTFM_API_KEY=your_lastfm_api_key
STEAM_API_KEY=your_steam_web_api_key
```

Optional identity variables:

```bash
LASTFM_USERNAME=your_lastfm_username
STEAM_ID=your_steam_profile_id_or_steamid64
```

Notes:

- Last.fm only shows monthly top artists, top tracks, and total scrobbles. It does not show now playing.
- `STEAM_ID` can be either a 17-digit SteamID64 or the vanity profile segment from `steamcommunity.com/id/...`.
- If you already store Last.fm or Steam profile links in Sanity resource links, the app can infer the usernames from those URLs.
