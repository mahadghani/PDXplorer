// AQ.js

import React, { useState, useEffect } from "react";
import "./AQ.css";

function AQ() {
  const [airPollutionData, setAirPollutionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const apikey = "1c8d1755-dd1f-4178-9061-156bc45489e8";

      try {
        const response = await fetch(
          `http://api.airvisual.com/v2/nearest_city?lat=45.523064&lon=-122.67648&key=${apikey}`
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
    return <div>Loading...</div>;
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
    <div className={`air-quality-widget ${pollutionLevel}`}>
      <h2>Air Quality in Portland</h2>

      <div className="current-air-quality">
        <p>{`AQI (US): ${pollution.aqius}`}</p>
        <p>{`Main Pollutant (US): ${pollution.mainus}`}</p>
        <strong>
          <p
            className={`${pollutionLevel}`}
          >{`Overall Quality: ${pollutionDescription}!`}</p>
        </strong>
      </div>
    </div>
  );
}

export default AQ;
