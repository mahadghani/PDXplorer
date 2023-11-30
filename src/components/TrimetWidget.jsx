import React, { useState, useEffect } from "react";
import { Header, List } from 'semantic-ui-react'
import XMLParser from 'react-xml-parser';
import './TrimetWidget.css'

const api = {
  key: process.env.REACT_APP_TRIMET_API_KEY,
  base: "https://developer.trimet.org/ws/V1/trips/tripplanner",
};

function TrimetWidget({ coordinates }) {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${api.base}/fromCoord/-122.679223,45.518911/toCoord/${coordinates[1]},${coordinates[0]}/MaxItineraries/1/appId/${api.key}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text();
        let xml = new XMLParser().parseFromString(data);

        const itinerariesList = xml.getElementsByTagName('itinerary');
        console.log('mode' , itinerariesList[0].children.slice(2)[0].attributes.mode);
        let tripLegs = itinerariesList[0].children.slice(2).map(leg => {
          return {
            mode: leg.attributes.mode,
            duration: leg.getElementsByTagName('duration')[0].value,
            distance: leg.getElementsByTagName('distance')[0].value,
            // Other fields can be included as necessary
          };
        });

        setItineraries(tripLegs);
      } catch (error) {
        console.error("Error fetching Trimet data:", error);
      }
    };

    // Check if coordinates are available before making the API call
    if (coordinates && coordinates.length === 2) {
      fetchData();
    }
  }, [coordinates]);

  return (
    <div>
      <Header as='h2'>Trimet Itinerary</Header>
      {itineraries.length > 0 && (
        <List>
          {itineraries.map((leg, index) => (
            <List.Item key={index}>
              <p>{leg.mode} {leg.duration} minutes | {leg.distance}mi</p>
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );
}

export default TrimetWidget;
