# Lippy

A mono-repo for the [Lippy](https://lippystreet.com) project:

| Thing | Purpose |
| --- | --- |
| web-app | The React front-end. |
| shared | Constants and TypeScript types shared between front-end and back-end. |
| unity | The VRChat world. |

The back-end Supabase project (Postgres, Edge functions, storage, etc.) is in another repo.

## Getting started

Note: You should have Docker installed. You can run everything outside of Docker but it's way easier.

### Web app

1. In the root run `docker compose up -d`
2. Visit `http://localhost:3000` in your browser after a few seconds

### Shared

1. Run `npm run build` to build everything into `dist`

The web app (and Edge functions if you are running them) should automatically reload.

### VRChat world

Note: VRChat restricts all web requests to https so to have the world use your local server you must run a proxy that maps https to http.

1. Open Unity project
2. Build and upload like normal