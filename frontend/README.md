# Tinderapp (backend helper)

This folder contains simple Mongoose models and a minimal Express server example for local development.

Quick start

1. Install dependencies (if you haven't already):

```bash
cd Tinderapp
npm install
npm install express mongoose
```

2. (Optional) Set MongoDB URI:

```bash
set MONGO_URI=mongodb://127.0.0.1:27017/tinderapp
```

3. Run the server:

```bash
npm run start:server
```

Endpoints

- `GET /health` — health check
- `GET /users` — list users (limit 50)
- `POST /users` — create user (JSON body)
- `POST /jobs` — create job (JSON body)
- `POST /matches` — create match (JSON body: `{ "userIds": ["id1","id2"] }`)

Notes

- The models are in `models/` and the server is `server/index.js`.
- If you want a dev server restart on changes, install `nodemon` and use a script like `nodemon server/index.js`.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
