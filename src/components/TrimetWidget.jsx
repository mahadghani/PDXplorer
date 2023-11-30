import React, { useState, useEffect } from "react";

const api = {
  key: process.env.REACT_APP_TRIMET_API_KEY,
  base: "https://developer.trimet.org/ws/V1/trips/tripplanner",
};

function TrimetWidget({ coordinates, trimetLayer }) {
  const [itineraries, setItineraries] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://developer.trimet.org/ws/V1/trips/tripplanner/fromCoord/-122.679223,45.518911/toCoord/${coordinates[1]},${coordinates[0]}/appId/${api.key}`
        );
        console.log(
          `https://developer.trimet.org/ws/V1/trips/tripplanner/fromCoord/-122.679223,45.518911/toCoord/${coordinates[1]},${coordinates[0]}/appId/${api.key}`
        );
        const data = await response.text();
        // Parse XML data
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const itinerariesList = xmlDoc.querySelectorAll("itinerary");
        const itinerariesData = Array.from(itinerariesList).map((itinerary) => {
          const id = itinerary.getAttribute("id");
          const viaRoute = itinerary.getAttribute("viaRoute");
          const startTime = itinerary.querySelector("startTime").textContent;
          const endTime = itinerary.querySelector("endTime").textContent;
          const duration = itinerary.querySelector("duration").textContent;

          return {
            id,
            viaRoute,
            startTime,
            endTime,
            duration,
          };
        });
        setItineraries(itinerariesData);
      } catch (error) {
        console.error("Error fetching Trimet data:", error);
      }
    };

    fetchData();
  }, []); // Run once when the component mounts

  return (
    <div>
      <h2>Trimet Itineraries</h2>
      <ul>
        {itineraries.map((itinerary) => (
          <li key={itinerary.id}>
            <p>ID: {itinerary.id}</p>
            <p>Via Route: {itinerary.viaRoute}</p>
            <p>Start Time: {itinerary.startTime}</p>
            <p>End Time: {itinerary.endTime}</p>
            <p>Duration: {itinerary.duration} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrimetWidget;
