import React, { useState } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Card, Container, List } from "semantic-ui-react";

import LandingCard from "./components/Card";
import MapWidget from "./components/MapWidget";
import TrimetWidget from "./components/TrimetWidget";
import BiketownWidget from "./components/BiketownWidget";
import HotspotsWidget from "./components/HotspotsWidget";
import TopBar from "./components/TopBar";
import Weather from "./components/Weather";

function App() {
  const [showCard, setShowCard] = useState(true);
  const [destination, setDestination] = useState(""); //state to store destination
  const [eventsLayer, setEventsLayer] = useState([]);
  const [trimetLayer, setTrimetLayer] = useState([]);
  const [biketownLayer, setBiketownLayer] = useState([]);
  const [geocodedDestName, setGeocodedDestName] = useState(""); //state to
  // store geocoded destination
  const [geocodedDestCoord, setGeocodedDestCoord] = useState([]);

  const handleGoClick = (inputValue) => {
    setDestination(inputValue); //update state with input value
    setShowCard(false);
    console.log("input value: ", inputValue);
  };
  const updateEventsLayer = (layer) => {
    if (layer) setEventsLayer(layer);
    console.log("eventslayer: ", layer);
  };
  const updateTrimetLayer = (layer) => {
    if (layer) setTrimetLayer(layer);
    console.log("trimetlayer: ", layer);
  };
  const updateBiketownLayer = (layer) => {
    if (layer) setBiketownLayer(layer);
    console.log("biketownlayer: ", layer);
  };

  return (
    <Container fluid className="App">
      <TopBar
        destination={geocodedDestName ? geocodedDestName : destination}
        className="top-bar"
      />
      <div className="widgets-container">
        <HotspotsWidget
          updateLayer={updateEventsLayer}
          destination={geocodedDestName}
          coordinates={geocodedDestCoord}
          className="hotspots-widget"
        />
        <MapWidget
          eventsLayer={eventsLayer}
          trimetLayer={trimetLayer}
          biketownLayer={biketownLayer}
          destination={destination}
          updateDestination={setGeocodedDestName}
          updateGeoCoord={setGeocodedDestCoord}
          className="map-widget"
        />
        <div className="right-column">
          <TrimetWidget
            setLayer={updateTrimetLayer}
            coordinates={geocodedDestCoord}
            className="trimet-widget"
          />
          {/*<BiketownWidget updateLayer={updateBiketownLayer} className='biketown-widget'/>*/}
          {/*<Card className="trimet-widget">*/}
          {/*  <Card.Content>*/}
          {/*    <Card.Header>Trimet Information</Card.Header>*/}
          {/*    <List>/!* Populate with relevant Trimet data *!/</List>*/}
          {/*  </Card.Content>*/}
          {/*</Card>*/}
          {/*<Card className="biketown-widget">*/}
          {/*  <Card.Content>*/}
          {/*    <Card.Header>Biketown Information</Card.Header>*/}
          {/*    <List>/!* Populate with relevant Biketown data *!/</List>*/}
          {/*  </Card.Content>*/}
          {/*</Card>*/}
          <BiketownWidget
            updateLayer={updateBiketownLayer}
            coordinates={geocodedDestCoord}
            className="biketown"
          />
        </div>
      </div>
      <Weather className="weather-widget" />
      {showCard ? (
        <LandingCard onGoClick={handleGoClick} />
      ) : (
        <p className="makewhite">Destination: {destination}</p>
      )}
      {/*displays destination info when card not shown*/}
    </Container>
  );
}

export default App;
