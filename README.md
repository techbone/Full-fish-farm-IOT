# Fish Farming IoT Application

A modern, responsive web application for monitoring fish farming conditions using IoT sensors. Built with React and Tailwind CSS.

## Features

- **Real-time Monitoring**: Live sensor data for temperature, pH, water level, and humidity
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Mobile Navigation**: Hamburger menu for small screens, sidebar for desktop
- **Alert System**: Configurable thresholds and notifications
- **Analytics Dashboard**: Historical data visualization and trends
- **Settings Management**: Configure sensors, thresholds, and system preferences

## Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **HTTP Client**: Axios (for backend integration)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Backend Integration

The application is designed to work with a REST API backend. The API service layer is located in `src/services/api.ts` and provides the following endpoints:

### API Endpoints

#### Sensor Data
- `GET /api/sensors/current` - Get current sensor readings
- `GET /api/sensors/history` - Get historical sensor data

#### Device Management
- `GET /api/device/status` - Get device connection status

#### Settings
- `GET /api/settings` - Get current system settings
- `PUT /api/settings` - Update system settings

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://your-backend-url/api
```

### Data Structures

The application expects the following data structures from the backend:

```typescript
// Sensor Reading
interface SensorReading {
  value: number;
  unit: string;
  timestamp: string;
  status: 'good' | 'warning' | 'critical';
}

// Complete Sensor Data
interface SensorData {
  temperature: SensorReading;
  humidity: SensorReading;
  ph: SensorReading;
  waterLevel: SensorReading;
}
```

## Hardware Integration

This application is designed to work with:

- **Arduino Uno R3** - Main microcontroller
- **ESP8266 (ESP-12E)** - WiFi connectivity
- **Sensors**:
  - DS18B20 - Temperature sensor
  - pH sensor module
  - Ultrasonic sensor - Water level
  - DHT22 - Humidity sensor

### Arduino Code Structure

Your Arduino code should:

1. Read sensor values at configured intervals
2. Send data to the backend API via HTTP POST requests
3. Handle WiFi connectivity and reconnection
4. Implement error handling and retry logic

Example API payload from Arduino:
```json
{
  "deviceId": "FF:A2:B3:C4:D5",
  "timestamp": "2024-01-15T10:30:00Z",
  "sensors": {
    "temperature": { "value": 24.5, "unit": "°C" },
    "ph": { "value": 7.2, "unit": "pH" },
    "waterLevel": { "value": 85, "unit": "%" },
    "humidity": { "value": 68, "unit": "%" }
  }
}
```

## Development

### Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # API services
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use JavaScript for development
- Follow React best practices
- Use Tailwind CSS for styling
- Add comments for complex logic
- Implement proper error handling

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

# Push Notification Setup

## 1. Generate VAPID Keys

Run:

```
npx web-push generate-vapid-keys
```

Copy the public and private keys. Replace `<YOUR_PUBLIC_VAPID_KEY>` and `<YOUR_PRIVATE_VAPID_KEY>` in:
- `src/utils/pushNotifications.js` (public key)
- `backend/server.js` (both keys)

## 2. Start the Backend

```
cd backend
npm install
node server.js
```

## 3. Start the Frontend

```
npm install
npm run dev
```

## 4. Subscribe to Notifications

Call `subscribeUserToPush()` from `src/utils/pushNotifications.js` after user login or on a button click.

## 5. Send a Notification

POST to `/api/notify` on the backend with JSON:

```
{
  "title": "Test Alert",
  "body": "This is a test notification."
}
```

---

Notifications will appear even if the PWA is closed, as long as it is installed and the user has granted permission.