# Weather Dashboard

A beautiful, responsive weather dashboard built with SvelteKit and TailwindCSS. Search for weather information by city name with real-time data from OpenWeatherMap API.

## Features

- 🌍 **City Search**: Search for weather by city name
- ⚡ **Debounced Input**: Automatic search with 500ms debounce to avoid unnecessary API calls
- 🌙 **Dark Mode**: Toggle between light and dark themes with persistent preference
- ⏳ **Loading States**: Beautiful spinner animation while fetching data
- ❌ **Error Handling**: User-friendly error messages for failed requests
- ✨ **Smooth Animations**: Transitions for weather data updates
- 📱 **Responsive Design**: Works perfectly on all device sizes

## Setup

### 1. Install Dependencies

```sh
npm install
```

### 2. Configure OpenWeatherMap API Key

1. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Create a `.env` file in the root directory:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

### 3. Start Development Server

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

## Project Structure

```
src/
├── routes/
│   ├── +page.svelte          # Main weather dashboard page
│   ├── +layout.svelte        # App layout
│   └── api/
│       └── weather/
│           └── +server.ts    # Weather API endpoint
└── app.css                   # Global styles with TailwindCSS
```

## API Endpoint

The weather API endpoint is available at `/api/weather?city={cityName}` and returns:

```json
{
  "city": "Berlin",
  "temperature": 15,
  "condition": "Clouds",
  "description": "scattered clouds"
}
```

## Technologies Used

- **SvelteKit** - Full-stack framework
- **Svelte 5** - Modern reactive framework with runes
- **TailwindCSS v4** - Utility-first CSS framework
- **TypeScript** - Type safety
- **OpenWeatherMap API** - Weather data provider
