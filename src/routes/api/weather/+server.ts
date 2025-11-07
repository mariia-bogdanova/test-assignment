import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { VITE_OPENWEATHER_API_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ url }) => {
	const city = url.searchParams.get('city');

	if (!city) {
		return json({ error: 'City parameter is required' }, { status: 400 });
	}

	if (!VITE_OPENWEATHER_API_KEY) {
		return json({ error: 'OpenWeatherMap API key is not configured' }, { status: 500 });
	}

	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${VITE_OPENWEATHER_API_KEY}&units=metric`
		);

		if (!response.ok) {
			if (response.status === 404) {
				return json({ error: 'City not found' }, { status: 404 });
			}
			throw new Error(`OpenWeatherMap API error: ${response.status}`);
		}

		const data = await response.json();

		return json({
			city: data.name,
			temperature: Math.round(data.main.temp),
			condition: data.weather[0].main,
			description: data.weather[0].description
		});
	} catch (error) {
		console.error('Weather API error:', error);
		return json(
			{ error: 'Failed to fetch weather data. Please try again later.' },
			{ status: 500 }
		);
	}
};

