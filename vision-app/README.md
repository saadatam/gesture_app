# Raspberry Pi Dashboard (Frontend)

## Run the Frontend

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app has pages for `/video`, `/monitor`, and `/controller`.

It reads the backend base URL from `NEXT_PUBLIC_API_URL` (default: `http://{IP_Address}:8000`).

## Backend URL Configuration

Create `vision-app/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://<pi-ip>:8000

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Run the Full System (recommended)

From the repo root (`Gesture_app/`):

```bash
./start_system.sh
```

Then open:

- `http://<pi-ip>:3000`

## Backend Endpoints Used by the Frontend

- `GET /status`
- `POST /start-stream` with JSON body: `{ width, height, fps, quality }`
- `POST /stop-stream`
- `GET /stream` (requires `/start-stream` first)
- `GET /capture` (returns `image/jpeg`)

## Troubleshooting

- Backend unreachable: confirm `NEXT_PUBLIC_API_URL` and that the Python backend is running.
- Video fails to load: call `POST /start-stream` first (the stream endpoint returns HTTP 400 otherwise).
- CORS errors: update `python-backend/main.py` `allow_origins` to include your frontend origin (e.g. `http://<pi-ip>:3000`).
