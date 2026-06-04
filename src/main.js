document.querySelector("#app").innerHTML = `
  <div style="font-family: sans-serif; padding: 20px;">
    <h1>Weather Dashboard 🌦️</h1>

    <input id="cityInput" placeholder="Enter city" />
    <button id="searchBtn">Search</button>

    <h2 id="cityName"></h2>
    <p id="temperature"></p>
    <p id="description"></p>
    <p id="humidity"></p>
    <p id="wind"></p>
  </div>
`;

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherAiKey =
  "wai_843377.aaa0692f99facc90dafee54eecec3b3ab303c4c72b86c795";

async function getCoordinates(city) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
  );
  const data = await res.json();

  if (!data.length) throw new Error("City not found");

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].display_name
  };
}

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();

  if (!city) {
    alert("Enter a city");
    return;
  }

  try {
    const { lat, lon, name } = await getCoordinates(city);

    const response = await fetch(
      `https://api.weather-ai.co/v1/weather?lat=${lat}&lon=${lon}&days=7`,
      {
        headers: {
          Authorization: `Bearer ${weatherAiKey}`
        }
      }
    );

    const data = await response.json();

    document.getElementById("cityName").textContent = name;
    document.getElementById("temperature").textContent =
      `Temperature: ${data.current.temperature}°C`;
    document.getElementById("description").textContent =
      `Condition: ${data.current.condition}`;
    document.getElementById("humidity").textContent =
      `Humidity: ${data.current.humidity}%`;
    document.getElementById("wind").textContent =
      `Wind Speed: ${data.current.wind_speed} km/h`;

  } catch (err) {
    console.error(err);
    alert("Could not fetch weather data");
  }
});
