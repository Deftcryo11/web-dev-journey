const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const forecast = document.getElementById('forecast');

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    
    if (city !== '') {
        fetchWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

function getWeatherDescription(code) {
    if (code === 0) {
        return 'Clear sky';
    } else if (code === 1 || code === 2 || code === 3) {
        return 'Partly cloudy';
    } else if (code === 45 || code === 48) {
        return 'Foggy';
    } else if (code >= 51 && code <= 67) {
        return 'Rainy';
    } else if (code >= 71 && code <= 77) {
        return 'Snowy';
    } else if (code >= 80 && code <= 82) {
        return 'Rain showers';
    } else if (code >= 95) {
        return 'Thunderstorm';
    } else {
        return 'Unknown weather';
    }
}

async function fetchWeather(city) {
    try{
        const geoUrl =`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const response = await fetch(geoUrl);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            alert('City not found. Please try again.');
            return;
        }

        const location = data.results[0];

        const lat = location.latitude;
        const lon = location.longitude;

        const weatherUrl =`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        weatherData.current
        weatherData.daily

        console.log('Full weather response:', weatherData);
        console.log('Current weather:', weatherData.current);

        const current = weatherData.current;
        cityName.textContent = location.name;
        temperature.textContent = `Temperature: ${current.temperature_2m}°C`;
        description.textContent = `Weather: ${getWeatherDescription(current.weather_code)}`;
        humidity.textContent = `Humidity: ${current.relative_humidity_2m}%`;
        windSpeed.textContent = `Wind Speed: ${current.wind_speed_10m} km/h`;

        displayForecast(weatherData.daily);

        cityInput.value = '';
        cityInput.focus();

        console.log('Weather API response:', weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayForecast(daily) {
    forecast.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const card = document.createElement('div');
        card.classList.add('forecast-card');

        const date = new Date(daily.time[i]);

        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        card.innerHTML = `
            <h3>${formattedDate}</h3>
            <p>${getWeatherDescription(daily.weather_code[i])}</p>
            <p>High: ${daily.temperature_2m_max[i]}°C</p>
            <p>Low: ${daily.temperature_2m_min[i]}°C</p>
        `;

        forecast.appendChild(card);
    }
}