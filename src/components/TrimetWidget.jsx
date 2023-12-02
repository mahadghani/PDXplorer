import React, { useState, useEffect } from "react";
import { Card, List } from 'semantic-ui-react'
import XMLParser from 'react-xml-parser';
import './TrimetWidget.css'

const api = {
  key: process.env.REACT_APP_TRIMET_API_KEY,
  base: "https://developer.trimet.org/ws/V1/trips/tripplanner",
};

function TrimetWidget({ coordinates, setLayer }) {
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
            fromLat: leg.getElementsByTagName('from')[0].getElementsByTagName('lat')[0].value,
            fromLon: leg.getElementsByTagName('from')[0].getElementsByTagName('lon')[0].value,
            destLat: leg.getElementsByTagName('to')[0].getElementsByTagName('lat')[0].value,
            destLon: leg.getElementsByTagName('to')[0].getElementsByTagName('lon')[0].value,
            direction: leg.getElementsByTagName('direction')[0].value
          };
        });
        setLayer(tripLegs);
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
    <Card className='trimet-container'>
      <Card.Content className='card-header'>
        <Card.Header>Trimet Itinerary</Card.Header>
      </Card.Content>
      {itineraries.length > 0 && (
        <Card.Content className='card-content-area card-description'>
          <List ordered divided>
            {itineraries.map((leg, index) => (
              <List.Item key={index}>
                <p>{leg.mode} {leg.duration} minutes | {leg.distance}mi</p>
              </List.Item>
            ))}
          </List>
        </Card.Content>
      )}
    </Card>
  );
}

export default TrimetWidget;