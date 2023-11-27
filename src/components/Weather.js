import React, { useState, useEffect } from "react";
import "./Weather.css";

const api = {

  key: process.env.REACT_APP_WEATHER_API_KEY
};

function Weather() {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=${api.key}&q=97201&days=1&aqi=no&alerts=no`
        );
        const result = await response.json();
        setWeather(result);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []); // effect runs only once

  return (
    <div className="weather-app">
      <header className="weather-header">
        {typeof weather.current !== "undefined" ? (
          <div className="weather-container">
            <div className="weather-row">
              <div className="location">
                <p>
                  {weather.location.name}, {weather.location.region},{" "}
                  {weather.location.country}
                </p>
              </div>
              <p className="temperature">{weather.current.temp_f}°F</p>
            </div>
            <div className="weather-row">
              <div className="current-weather">
                <img
                  src={`http:${weather.current.condition.icon}`}
                  alt={weather.current.condition.text}
                  className="weather-icon"
                />
                <p className="condition">{weather.current.condition.text}</p>
              </div>

              <div className="additional-info">
                <p>
                  Wind: {weather.current.wind_kph} km/h,{" "}
                  {weather.current.wind_dir}
                </p>
                <p>Humidity: {weather.current.humidity}%</p>
                <p>Pressure: {weather.current.pressure_mb} mb</p>
              </div>
            </div>
            <div className="weather-row">
              <p className="location">Hourly Forecast</p>
              {weather.forecast.forecastday.map((day) => (
                <div key={day.date_epoch} className="forecast-item">
                  <div className="weather-row">
                    <p>8:00 AM</p>
                    <p>{day.hour[8].temp_f}°F</p>
                    <p>{day.hour[8].condition.text}</p>
                  </div>
                  <div className="weather-row">
                    <p>12:00 PM</p>
                    <p>{day.hour[12].temp_f}°F</p>
                    <p>{day.hour[12].condition.text}</p>
                  </div>
                  <div className="weather-row">
                    <p>4:00 PM</p>
                    <p>{day.hour[16].temp_f}°F</p>
                    <p>{day.hour[16].condition.text}</p>
                  </div>
                  <div className="weather-row">
                    <p>8:00 PM</p>
                    <p>{day.hour[20].temp_f}°F</p>
                    <p>{day.hour[20].condition.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default Weather;
