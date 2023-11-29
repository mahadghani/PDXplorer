import React, { useState, useEffect } from "react";
import "./Umbrella.css";
import clearLogo from "../Pictures/cloudy.png";
import RainLogo from "../Pictures/umbrella.png";

const api = {
  key: process.env.REACT_APP_WEATHER_API_KEY,
};

function Umbrella() {
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

  // Check if it's currently raining
  const isRaining =
    weather.current &&
    weather.current.condition &&
    weather.current.condition.text.toLowerCase().includes("rain");

  const logoSrc = isRaining ? RainLogo : clearLogo;

  return (
    <div className={`umbrella-app ${isRaining ? "rainy" : "sunny"}`}>
      {isRaining ? (
        <div>
          <img src={logoSrc} alt="Umbrella" />
          <p>It's raining. Don't forget your umbrella!</p>
        </div>
      ) : (
        <div>
          <img src={logoSrc} alt="Sky" />
          <p>No rain. No need for an umbrella!</p>
        </div>
      )}
    </div>
  );
}

export default Umbrella;
