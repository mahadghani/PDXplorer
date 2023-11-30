import React, { useState, useEffect } from "react";

// Function to calculate the distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance
  return distance;
}

const BiketownWidget = ({ updateLayer, coordinates }) => {
  const userLat = coordinates[0];
  const userLon = coordinates[1];
  const [bikedata, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gbfs.lyft.com/gbfs/2.3/pdx/en/free_bike_status.json"
        );
        const data = await response.json();
        setData(data.data);
      } catch (error) {
        console.error("Error fetching Biketown data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to find the 5 closest bikes to user coordinates
  const findClosestBikes = () => {
    if (!userLat || !userLon || !bikedata.bikes) return [];

    // Sort the bikes based on distance
    const sortedBikes = bikedata.bikes.sort((a, b) => {
      const distanceA = calculateDistance(userLat, userLon, a.lat, a.lon);
      const distanceB = calculateDistance(userLat, userLon, b.lat, b.lon);
      return distanceA - distanceB;
    });

    // Return the first 5 bikes (closest)
    return sortedBikes.slice(0, 5);
  };

  const closestBikes = findClosestBikes();

  return (
    <div className="biketown-widget">
      <p>Biketown Widget</p>
      <ul>
        {closestBikes.map((bike) => (
          <li key={bike.bike_id}>
            Bike ID: {bike.bike_id.slice(-5)}, Distance:{" "}
            {(
              calculateDistance(userLat, userLon, bike.lat, bike.lon) * 0.621371
            ).toFixed(2)}{" "}
            miles
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BiketownWidget;
