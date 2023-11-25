// Suntime.js

import React, { useState, useEffect } from "react";
import "./Suntime.css";
import dayLogo from "../Pictures/sun.png";
import nightLogo from "../Pictures/night.png";
import "./Suntime.css";

function Suntime() {
  const [time, setTime] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(
          `https://api.sunrisesunset.io/json?lat=45.52345&lng=-122.67621`
        );
        const result = await response.json();
        setTime(result.results);
        console.log(result);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const formattedHours = hours % 12 || 12;
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");
      const AMPM = hours >= 12 ? "PM" : "AM";

      setCurrentTime(
        `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${AMPM}`
      );

      const sunriseString = time.sunrise;
      const riseComponents = sunriseString.split(/:| /);
      const riseHours = parseInt(riseComponents[0], 10);
      const riseMinutes = parseInt(riseComponents[1], 10);

      const sunsetString = time.sunset;
      const setComponents = sunsetString.split(/:| /);
      const setHours = parseInt(setComponents[0], 10);
      const setMinutes = parseInt(setComponents[1], 10);

      if (AMPM == "AM") {
        if (formattedHours < riseHours) {
          setIsDaytime(false);
        } else if (formattedHours > riseHours) {
          setIsDaytime(true);
        } else if (formattedMinutes < riseMinutes) {
          setIsDaytime(false);
        } else {
          setIsDaytime(true);
        }
      } else {
        if (formattedHours > setHours) {
          setIsDaytime(false);
        } else if (formattedHours < setHours) {
          setIsDaytime(true);
        } else if (formattedMinutes > setMinutes) {
          setIsDaytime(false);
        } else {
          setIsDaytime(true);
        }
      }
    };

    fetchTime();
    updateCurrentTime();

    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  const logoSrc = isDaytime ? dayLogo : nightLogo;
  const timeClass = isDaytime ? "daytime" : "nighttime";

  return (
    <div className="suntime-container">
      <img className="weather-logo" src={logoSrc} alt="Weather Logo" />
      <p className={timeClass}>{isDaytime ? "It's Day!" : "It's Night!"}</p>
      <p className={timeClass}>Current Time: {currentTime}</p>
      <p>Sunrise: {time.sunrise}</p>
      <p>Sunset: {time.sunset}</p>
    </div>
  );
}

export default Suntime;
