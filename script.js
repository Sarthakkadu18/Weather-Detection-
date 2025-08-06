const apiKey = "4c10f4c54ed2daf03663b2f6acc3d9c0"; 
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const errorMsg = document.getElementById('error-message');
const cityNameElem = document.getElementById('city-name');
const weatherConditionElem = document.getElementById('weather-condition');
const weatherIconElem = document.getElementById('weather-icon');
const temperatureElem = document.getElementById('temperature');
const humidityElem = document.getElementById('humidity');
const windSpeedElem = document.getElementById('wind-speed');
const backgroundAnimation = document.querySelector('.background-animation');
const themeSwitch = document.getElementById('theme-switch');

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherData(city);
    }
});

// Event listener for pressing 'Enter' in the input field
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Event listener for the theme toggle
themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('light-theme');
});

// Function to fetch weather data from the API
async function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        showError(error.message);
    }
}

// Function to update the user interface with weather data
function updateUI(data) {
    // Hide error and show weather info
    errorMsg.classList.add('hidden');
    weatherInfo.classList.remove('hidden');

    // Update text content
    cityNameElem.textContent = data.name;
    weatherConditionElem.textContent = data.weather[0].description;
    temperatureElem.textContent = `${Math.round(data.main.temp)}°C`;
    humidityElem.textContent = `${data.main.humidity}%`;
    windSpeedElem.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h

    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIconElem.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Update background animation
    updateBackground(iconCode);
}

// Function to show the error message
function showError(message) {
    weatherInfo.classList.add('hidden');
    errorMsg.classList.remove('hidden');
    errorMsg.querySelector('p').textContent = message;
    
    // Reset background to default
    backgroundAnimation.className = 'background-animation';
}

// Function to update the background animation based on weather icon code
function updateBackground(iconCode) {
    // Remove previous weather classes
    backgroundAnimation.className = 'background-animation';
    
    if (iconCode.includes('01')) { // Clear sky
        backgroundAnimation.classList.add(iconCode.includes('d') ? 'clear-sky' : 'clear-sky-night');
    } else if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) { // Clouds
        backgroundAnimation.classList.add('clouds');
    } else if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) { // Rain, Drizzle, Thunderstorm
        backgroundAnimation.classList.add('rain');
    }
    // Add more conditions as needed for snow, mist, etc.
}

// Optional: Fetch weather for current location on page load
// This uses the browser's Geolocation API
// Uncomment the following block to enable this feature
/*
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                updateUI(data);
            } catch (error) {
                console.error("Could not fetch weather for current location:", error);
            }
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});
*/