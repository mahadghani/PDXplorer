import React, { useState } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';

import LandingCard from './components/Card';
import MapWidget from './components/MapWidget';
import TrimetWidget from './components/TrimetWidget';
import BiketownWidget from './components/BiketownWidget';
import HotspotWidget from './components/HotspotsWidget';
import TopBar from './components/TopBar';

function App() {
  const [showCard, setShowCard] = useState(true);
  const [destination, setDestination] = useState(''); //state to store destination


  const handleGoClick = (inputValue) => {
    setDestination(inputValue); //update state with input value
    setShowCard(false);
    console.log('input value: ', inputValue);
  };
  return (

    <Container fluid className="App">
      <TopBar />
      <div className='widgets-container'>
        <HotspotWidget />
        <MapWidget />
        <TrimetWidget />
        <BiketownWidget />
      </div>
      <div className='weather-widget'>{/*Weather widget goes here*/}Weather widget</div>
      {showCard ? <LandingCard onGoClick={handleGoClick} /> : <h1>Destination: {destination}</h1>}
      {/*displays destination info when card not shown*/}
    </Container>

  );
}

export default App;
