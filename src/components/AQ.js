// AQ.js

import React, { useState, useEffect } from "react";
import "./AQ.css";

const api = {
  key: process.env.REACT_APP_AQ_API_KEY,
};

function AQ() {
  const [airPollutionData, setAirPollutionData] = useState(null);

  useEffect(() => {
    if(!api.key) return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://api.airvisual.com/v2/nearest_city?lat=45.523064&lon=-122.67648&key=${api.key}`
        );
        const data = await response.json();
        setAirPollutionData(data);
      } catch (error) {
        console.error("Error fetching air pollution data:", error);
      }
    };

    fetchData();
  }, []);

  if (!airPollutionData) {
    return <div className='air-quality-widget'>Loading...</div>;
  }

  const { current } = airPollutionData.data;
  const { pollution } = current;

  // Determine pollution level based on AQI
  let pollutionLevel = "good";
  let pollutionDescription = "Good";

  if (pollution.aqius > 50 && pollution.aqius <= 100) {
    pollutionLevel = "moderate";
    pollutionDescription = "Moderate";
  } else if (pollution.aqius > 100 && pollution.aqius <= 150) {
    pollutionLevel = "unhealthy-sensitive";
    pollutionDescription = "Unhealthy for Sensitive Groups";
  } else if (pollution.aqius > 150) {
    pollutionLevel = "unhealthy";
    pollutionDescription = "Unhealthy";
  }

  return (
    <div className={`air-quality-widget `}>
      <div className="current-air-quality">
        <p>{`AQI (US): ${pollution.aqius}`}</p>
        <p>{`Main Pollutant (US): ${pollution.mainus}`}</p>
        <strong>
          <p
            className={pollutionLevel}
          >{`Overall Quality: ${pollutionDescription}!`}</p>
        </strong>
      </div>
    </div>
  );
}

export default AQ;
