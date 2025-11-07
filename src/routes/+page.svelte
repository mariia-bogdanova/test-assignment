<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface WeatherData {
		city: string;
		temperature: number;
		condition: string;
		description: string;
	}

	let searchInput = $state('');
	let weatherData = $state<WeatherData | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let darkMode = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Load dark mode preference from localStorage
	onMount(() => {
		if (!browser) return;
		
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		
		if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
			darkMode = true;
		}
		
		// Apply initial theme immediately
		applyTheme(darkMode);
	});

	// Apply theme to DOM
	function applyTheme(isDark: boolean) {
		if (!browser) return;
		const html = document.documentElement;
		if (isDark) {
			html.classList.add('dark');
			html.setAttribute('data-theme', 'dark');
			localStorage.setItem('theme', 'dark');
		} else {
			html.classList.remove('dark');
			html.setAttribute('data-theme', 'light');
			localStorage.setItem('theme', 'light');
		}
	}

	// Sync dark mode state with DOM
	$effect(() => {
		if (!browser) return;
		applyTheme(darkMode);
	});

	// Toggle dark mode
	function toggleDarkMode() {
		darkMode = !darkMode;
		// Apply immediately for better UX
		applyTheme(darkMode);
	}

	// Debounced search function
	async function searchWeather(city: string) {
		if (!city.trim()) {
			weatherData = null;
			error = null;
			return;
		}

		loading = true;
		error = null;

		try {
			const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch weather data');
			}

			weatherData = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
			weatherData = null;
		} finally {
			loading = false;
		}
	}

	// Handle input with debounce
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchInput = target.value;

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		debounceTimer = setTimeout(() => {
			searchWeather(searchInput);
		}, 500);
	}

	// Handle search button click
	function handleSearch() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		searchWeather(searchInput);
	}

	// Handle Enter key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
	<div class="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-colors duration-300">
		<!-- Header with Dark Mode Toggle -->
		<div class="flex items-center justify-between mb-4">
			<h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center flex-1">
				Weather Dashboard
			</h1>
			<button
				onclick={toggleDarkMode}
				class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
				aria-label="Toggle dark mode"
			>
				{#if darkMode}
					<svg
						class="w-6 h-6 text-yellow-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					</svg>
				{:else}
					<svg
						class="w-6 h-6 text-gray-700 dark:text-gray-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					</svg>
				{/if}
			</button>
		</div>

		<!-- Search Bar -->
		<div class="flex items-center space-x-2">
			<input
				type="text"
				placeholder="Enter city name..."
				value={searchInput}
				oninput={handleInput}
				onkeydown={handleKeydown}
				class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
			/>
			<button
				onclick={handleSearch}
				disabled={loading}
				class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Search
			</button>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="mt-6 flex justify-center" transition:fade={{ duration: 200 }}>
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		{/if}

		<!-- Error State -->
		{#if error && !loading}
			<div
				class="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-center"
				transition:fly={{ y: -20, duration: 300 }}
			>
				<p class="font-medium">{error}</p>
			</div>
		{/if}

		<!-- Weather Display -->
		{#if weatherData && !loading}
			<div
				class="mt-6 text-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow transition-colors duration-300"
				transition:fly={{ y: 20, duration: 400 }}
			>
				<p class="text-lg font-medium text-gray-700 dark:text-gray-200">
					🌍 City: <span class="font-semibold">{weatherData.city}</span>
				</p>
				<p class="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
					{weatherData.temperature}°C
				</p>
				<p class="text-md text-gray-600 dark:text-gray-300 mt-1 capitalize">
					{weatherData.description}
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(html.dark) {
		color-scheme: dark;
	}
</style>
