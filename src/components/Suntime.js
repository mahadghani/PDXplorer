// Suntime.js

import React, { useState, useEffect } from "react";
import "./Suntime.css";
import dayLogo from "../Pictures/sun.png";
import nightLogo from "../Pictures/night.png";

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
    fetchTime().then();
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      //update every second
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const formattedHours = hours % 12 || 12;
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");
      const AMPM = hours >= 12 ? "PM" : "AM";

      setCurrentTime(
        `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${
          hours >= 12 ? "PM" : "AM"
        }`
      );
      console.log(time.sunrise, time.sunset);
      if (time.sunrise && time.sunset) {
        //conver to 24h format
        const convertTo24h = (timeStr) => {
          const [hour, minute, ,modifier] = timeStr.split(/:| /);
          let convertedHour = parseInt(hour, 10);
          if (modifier === "PM" && convertedHour < 12) {
            convertedHour += 12;
          } else if (modifier === "AM" && convertedHour === 12) {
            convertedHour = 0;
          }
          return convertedHour * 60 + parseInt(minute, 10); //minutes since
          // midnight
        };
        const sunriseMins = convertTo24h(time.sunrise);
        const sunsetMins = convertTo24h(time.sunset);

        const currentMins = hours * 60 + minutes;
        console.log(currentMins, sunriseMins, sunsetMins);
        setIsDaytime(currentMins >= sunriseMins && currentMins < sunsetMins);
      }
    };
    if (time.sunrise && time.sunset) {
      const intervalId = setInterval(updateCurrentTime, 1000);

      return () => clearInterval(intervalId);
    }
  }, [time.sunrise, time.sunset]);

  const logoSrc = isDaytime ? dayLogo : nightLogo;
  const timeClass = isDaytime ? "daytime" : "nighttime";

  return (
    <div className="suntime-container">
      <div className="left-column">
        <img className="weather-logo" src={logoSrc} alt="Weather Logo" />
      </div>
      <div className="right-column">
        <p className={timeClass}>
          {isDaytime ? "It's Day!" : "It's" + " Night!"}
        </p>
        <p className={timeClass}>Current Time: {currentTime}</p>
        <p>Sunrise: {time.sunrise}</p>
        <p>Sunset: {time.sunset}</p>
      </div>
    </div>
  );
}

export default Suntime;
