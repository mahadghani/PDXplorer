import React, { useState } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';

import LandingCard from './components/Card';
import MapWidget from './components/MapWidget';
import TrimetWidget from './components/TrimetWidget';
import BiketownWidget from './components/BiketownWidget';
import HotspotsWidget from './components/HotspotsWidget';
import TopBar from './components/TopBar';
import Weather from'./components/Weather';

function App() {
  const [showCard, setShowCard] = useState(true);
  const [destination, setDestination] = useState(''); //state to store destination
  const [eventsLayer, setEventsLayer] = useState([]);
  const [trimetLayer, setTrimetLayer] = useState([]);
  const [biketownLayer, setBiketownLayer] = useState([]);

  const handleGoClick = (inputValue) => {
    setDestination(inputValue); //update state with input value
    setShowCard(false);
    console.log('input value: ', inputValue);
  };
  const updateEventsLayer = (layer) => {
    if(layer) setEventsLayer(layer);
  };
  const updateTrimetLayer = (layer) => {
    if (layer)setTrimetLayer(layer);
  };
  const updateBiketownLayer = (layer) => {
    if(layer)setBiketownLayer(layer);
  };


return(
    <Container fluid className="App">
      <TopBar destination={destination} className='top-bar'/>
      <div className='widgets-container'>
        <HotspotsWidget updateLayer={updateEventsLayer} className='hotspots-widget'/>
        <MapWidget eventsLayer={eventsLayer} trimetLayer={trimetLayer} biketownLayer={biketownLayer} className='map-widget'/>
        <div className='right-column'>
          <TrimetWidget updateLayer={updateTrimetLayer} className='trimet-widget'/>
          <BiketownWidget updateLayer={updateBiketownLayer} className='biketown-widget'/>
        </div>
      </div>
      <Weather className='weather-widget'/>
      {showCard ? <LandingCard onGoClick={handleGoClick} /> : <p>Destination: {destination}</p>}
      {/*displays destination info when card not shown*/}
    </Container>

  );
}

export default App;
