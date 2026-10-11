# Web App

The React web app for the website.

## Development

You should start everything using Docker Compose in the root of the mono repo.

Otherwise just run:

```shell
cp .env.example .env
npm i
npm start
```

## Deployment

Netlify should listen to GitHub pushes and automatically build and deploy.