# Full Fish Farm IoT

A modern, responsive web application for monitoring and controlling fish ponds using IoT sensors. Built with React (Vite), Tailwind CSS, Socket.IO, and a simple REST API layer. Supports JWT-based auth, real-time updates, alerts, historical charts, admin controls, and push notifications.

## Features

- **Authentication**: Login and registration with JWT, role awareness stored in `localStorage`.
- **Dashboard**: Overview of all ponds with health indicators and last-updated times.
- **Real-time data**: Live updates via WebSocket (`sensorData`, `alert` events).
- **Historical data**: Fetch sensor history per pond for charts (via REST API.
- **Alerts**: Realtime alert toasts with dismiss capability.
- **Admin controls**: Trigger operational commands (pump, aerator, chemicals, system check) and emergency actions.
- **Responsive UI**: Mobile-first design using Tailwind CSS and `lucide-react` icons.
- **PWA Push notifications**: Optional web push subscription and backend notify endpoint.
- **Web3-ready**: Ethers/Web3 dependencies available; Solidity contract scaffold present (`src/contracts/FishFarmRegistry.sol`).

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Styling**: Tailwind CSS
- **Realtime**: Socket.IO client
- **Charts**: Chart.js + react-chartjs-2
- **HTTP**: Axios
- **Auth**: Custom JWT handling (stored in `localStorage`)
- **Optional**: Firebase (installed), Ethers/Web3 (installed)

## Project Structure

```
src/
  components/
    AdminControls.jsx
    PondCard.jsx
    LoadingScreen.jsx
    ...
  contexts/
    AuthContext.jsx
    PondContext.jsx
  pages/
    Dashboard.jsx
    Login.jsx
    Register.jsx
    PondDetail.jsx
  services/
    api.js
    websocket.js
  utils/
    jwt.js
    pushNotifications.js
  contracts/
    FishFarmRegistry.sol
  App.jsx
  main.jsx
  index.css
```

## Environment Variables

Create a `.env` file in the project root. All variables are prefixed for Vite.

```
VITE_API_BASE_URL=http://localhost:3000      # Base URL for REST API
VITE_WS_URL=http://localhost:3001            # Socket.IO server URL
```

Notes:
- `VITE_API_BASE_URL` is used by `src/services/api.js`. If not provided it defaults to `http://localhost:5173/api`.
- `VITE_WS_URL` is used by `src/services/websocket.js` for real-time updates.

## Local Development

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
# App: http://localhost:5173
```

### Available Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Backend Expectations

The app expects a backend that exposes REST endpoints and a Socket.IO server.

### REST API (from `src/services/api.js`)
- `POST  /api/auth/login` → returns `{ token, role }`
- `POST  /api/auth/register` → creates user
- `POST  /api/ponds/:pondId/command` → send control command (requires `Authorization: Bearer <token>`)
- `GET   /api/sensors/:sensorId/data?limit=100` → list of historical data points
- `GET   /api/sensors/:sensorId/thresholds` → current thresholds
- `POST  /api/sensors/:sensorId/thresholds` → update thresholds
- `POST  /api/subscribe` → subscribe Web Push (requires auth)

Auth token is stored in `localStorage` under `token` (contexts) and `jwt_token` (api.js helpers). Ensure your backend accepts the `Authorization` header.

### WebSocket Events (from `src/services/websocket.js`)
- Connects to `VITE_WS_URL` (default `http://localhost:3001`).
- Listens for:
  - `sensorData` — payload is latest pond reading; updates UI via `PondContext`.
  - `alert` — payload contains `{ sensorId, alerts, timestamp }`; shows alert toast.
- Optional methods:
  - `joinSensor(sensorId)`
  - `leaveSensor(sensorId)`

## Using the App

1. Start your backend (REST + Socket.IO) with the routes/events above.
2. Configure `.env` with your API and WS URLs.
3. Run the frontend: `npm run dev` and open `http://localhost:5173`.
4. Register or login. After login:
   - Dashboard shows ponds. Default sensor IDs used by the app: `fish_tank_1`, `fish_tank_2`.
   - Click a pond card to open detailed view (`/pond/:sensorId`).
   - If your user has admin role, use `AdminControls` to send commands.

## Data Model (expected shapes)

Example single reading used by UI components:

```json
{
  "sensorId": "fish_tank_1",
  "name": "Pond A",
  "temperature": 26.4,
  "ph": 7.4,
  "turbidity": 8,
  "waterLevel": 1.3,
  "salinity": 500,
  "verified": true,
  "lastUpdated": "2024-11-02T10:15:00Z"
}
```

Historical endpoint typically returns an array of readings; the app uses the latest item.

## Push Notifications (optional)

1. Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```
2. Configure:
   - Frontend: put the public key in `src/utils/pushNotifications.js`.
   - Backend: set both public/private keys (often in env).
3. Start backend server that supports `/api/subscribe` and `/api/notify`.
4. From the app, trigger `subscribeUserToPush()` after login or via a UI action.
5. To send a test notification (backend):
```json
{
  "title": "Test Alert",
  "body": "This is a test notification."
}
```

## Security & Auth Notes

- `AuthContext` persists `token`, `userRole`, and `userUsername` in `localStorage` and auto-logs out when token is expired (via `utils/jwt.js`).
- API helpers also read `jwt_token`; align token storage in your backend or adjust `api.js` for a single key.
- Always send `Authorization: Bearer <token>` for authorized endpoints.

## Troubleshooting

- **No data on dashboard**: Verify backend endpoints and that your user is authenticated. Check `.env` values.
- **WebSocket disconnected**: Ensure Socket.IO server is reachable at `VITE_WS_URL` and CORS is configured.
- **401/403 errors**: Confirm token is valid and header is present. Check token key mismatches between `AuthContext` and `api.js`.
- **CORS issues**: Add proper CORS config on backend for both REST and WebSocket origins.
- **Build issues**: Clear lockfile/node_modules and reinstall.
  ```bash
  rm -rf node_modules package-lock.json && npm install
  ```

## Deployment

1. Build the app:
```bash
npm run build
```
2. Serve the `dist/` directory with any static host. Ensure env variables are baked at build time and backend URLs are reachable from the deployed origin.

## License

MIT License.
