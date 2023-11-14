import React, { useState } from 'react';
import './App.css';
import LandingCard from './Card';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';

function App() {
  const [showCard, setShowCard] = useState(true);
  const [destination, setDestination] = useState(''); //state to store destination


  const handleGoClick = (inputValue) => {
    setDestination(inputValue); //update state with input value
    setShowCard(false);
  };
  return (

    <Container fluid className="App">
      {showCard ? <LandingCard onGoClick={handleGoClick} /> : <h1>Destination: {destination}</h1>}
      {/*displays destination info when card not shown*/}
    </Container>

  );
}

export default App;
