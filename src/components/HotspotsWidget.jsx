import React, { useState, useEffect } from 'react'
import './HotspotsWidget.css';
import { Button, Card } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';


const api = {
  key: process.env.REACT_APP_GOOGLE_API_KEY
};

const HotspotsWidget = ({ destination , updateLayer, coordinates}) => {
  const [hotspots, setHotspots] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  /* Fetch hotspots useEffect() */
  useEffect(() => {
    const fetchHotspots = async () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': api.key,
          // 'X-Goog-FieldMask': 'places.displayName,places.shortFormattedAddress,places.types' // Adjust fields as necessary
          'X-Goog-FieldMask': '*' // Adjust fields as necessary
          //fields shortFormattedAddress, displayName, editorialSummary,
          // location, rating, websiteUri
        },
        body: JSON.stringify({
          includedTypes: ["restaurant"], // Specify the types of places you're interested in
          maxResultCount: 5,
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
      }



  }; // fetchHotspots
    if (destination) {
      fetchHotspots().then();
    }


  },[destination,coordinates]); // useEffect

  /*hotspots useeffect() */
  useEffect(() => {
    if (hotspots && hotspots.length > 0) {
      //prepare data for sending back to App state
      const updatedHotspots = hotspots.map(hotspot => ([
        hotspot.displayName?.text, parseFloat(hotspot.location.latitude), parseFloat(hotspot.location.longitude)

      ]));
      updateLayer(updatedHotspots);
    }
  },[hotspots]);



  const toggleCardExpansion = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null); // Collapse the card if it's already expanded
    } else {
      setExpandedCard(index); // Expand the selected card
    }
  };

  return (
    <div className="hotspots-widget">
      {/* ... other content ... */}
      <Card.Group className="card-group">
        {hotspots.map((hotspot, index) => (
          <Card key={index} className="small-card" >
            <Card.Content className="card-header-content" >
              <Card.Header className='card-title' onClick={() => toggleCardExpansion(index)}>{hotspot.displayName?.text}</Card.Header>
              <div className="card-link">
                <Button as='a' href={hotspot.websiteUri} className='fixed-width-button' target="_blank" rel="noopener noreferrer" size='small' color='blue'>Visit Website</Button>
              </div>
            </Card.Content>
            {/* Other card content */}
            {expandedCard === index && (
              <div className="card-description">
                {hotspot.editorialSummary?.text}
              </div>
            )}
          </Card>
        ))}
      </Card.Group>
    </div>
  );
};

export default HotspotsWidget;