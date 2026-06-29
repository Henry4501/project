# Link Vault — Frontend

React single-page app for Link Vault. Built with Vite, React Router, shadcn/ui, and Clerk. Talks to the Express backend over HTTP.

## Prerequisites

- Node.js 22+
- A [Clerk](https://clerk.com) account (the same application you set up for the backend).
- The backend running. By default this app expects it at `http://localhost:3000`.

## Setup

Install dependencies first. (If you've used a Node project before, you know the command.)

Create a `.env` file in this folder. Use `.env.example` for the variable names. Vite only exposes variables that start with `VITE_`, so the names matter:

- `VITE_CLERK_PUBLISHABLE_KEY` — your Clerk **publishable** key (Clerk Dashboard → API keys). This one is safe in the browser; never put the secret key here.
- `VITE_API_URL` — the backend base URL, e.g. `http://localhost:3000`.

Start the dev server:

```bash
npm run dev
```

Open the URL it prints, sign in through Clerk, and you're in.

## How it fits together

- `src/main.jsx` wraps the app in `ClerkProvider` (auth), `BrowserRouter` (routing), and `TooltipProvider` (shadcn).
- `src/App.jsx` holds the route table. Protected pages sit behind `ProtectedRoute`.
- `src/lib/api.js` is a small fetch wrapper that attaches the Clerk token to every request.
- Pages live in `src/pages/`, shared UI in `src/components/`, and shadcn primitives in `src/components/ui/`.

## Your task

`src/pages/Tags.jsx` is a placeholder. Build it to list the user's tags and let them delete (and ideally rename) one. It pairs with the tags routes you implement on the backend. The file has hints pointing to the existing pages whose patterns you can copy.

## Useful docs

- **React Router (declarative):** https://reactrouter.com/start/declarative/routing
- **Clerk React quickstart:** https://clerk.com/docs/quickstarts/react
- **shadcn/ui components:** https://ui.shadcn.com/docs/components
- **Phosphor icons:** https://phosphoricons.com
- **Vite env variables:** https://vite.dev/guide/env-and-mode
- **useReducer:** https://react.dev/reference/react/useReducer

## Notes

- Keep `.env` out of version control. Only `.env.example` should be committed.
- If requests fail with 401, check that the backend is running and `VITE_API_URL` points at it.
