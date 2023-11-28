import React, { useState, useEffect } from 'react';
import './HotspotsWidget.css';

const api = {
  key: process.env.REACT_APP_GOOGLE_API_KEY
};

const HotspotsWidget = ({ destination , updateLayer, coordinates}) => {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    const fetchHotspots = async () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': api.key,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types' // Adjust fields as necessary
        },
        body: JSON.stringify({
          includedTypes: ["restaurant"], // Specify the types of places you're interested in
          maxResultCount: 10,
          locationRestriction: {
            circle: {
              center: {
                latitude: coordinates[0],
                longitude: coordinates[1]
              },
              radius: 1609 // This is approximately 1 mile
            }
          }
        })
      };

      try {
        const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', requestOptions);
        if (!response.ok) {
          // If the response status code is not in the 200-299 range
          console.error("HTTP Error: " + response.status);
          return () => {};
        }

        const data = await response.json();

        // Check if the response body contains the expected data
        if (data && data.places) {
          setHotspots(data.places);
        } else {
          // Handle the case where the response body does not contain the expected data
          console.error("Response body did not contain expected data");
        }

      } catch (error) {
        // This catch block handles network errors
        console.error("Network error:", error);
      };



  }; // fetchHotspots
    if (destination) {
      fetchHotspots().then();
    }


  }); // useEffect
  return (
    <div className="hotspots-widget">
      <h2>Nearby Hotspots</h2>
      <ul>
        {/*{hotspots.map((hotspot, index) => (*/}
        {/*  <li key={index}>{hotspot.displayName?.text}</li> // Adjust according to the data structure*/}
        {/*))}*/}
      </ul>
    </div>
  );
}
export default HotspotsWidget;
