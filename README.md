# Sahaara

React (Vite) + FastAPI demo with mock data.

## Project layout

From the **project root** (the folder that contains this `README.md`):

```
Sahaara/                 ← project root
├── README.md
├── backend/             ← FastAPI
└── frontend/            ← React + Vite
```

## Requirements

- **Python 3.10+** (with `pip`)
- **Node.js 18+** (with `npm`)

## Run locally

Use **two terminals**. From the **project root** (this folder), `cd` into `backend` or `frontend` as below. If you cloned a monorepo, open the directory that contains this `README.md` first.

### Terminal 1 — API (port 8000)

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Health: http://127.0.0.1:8000/health  
- API docs: http://127.0.0.1:8000/docs  

### Terminal 2 — Web app (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The dev server proxies `/api` and `/health` to port **8000**, so keep **both** processes running.

On Windows, the same commands work in **PowerShell** or **Command Prompt** if `python` and `npm` are on your `PATH`.

## Sanity check

1. http://127.0.0.1:8000/health returns JSON with `"status": "ok"`.  
2. http://localhost:5173 → landing → demo login → pulse → dashboard.

## Frontend production build

```bash
cd frontend
npm run build
npm run preview
```

For deployment, point the app at your hosted API (adjust the proxy in `vite.config.ts` or use an environment-based API base URL).
