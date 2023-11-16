import React, { useState } from 'react';
//import './Card.css';
import { Card, Form, Button } from 'semantic-ui-react';
//todo: Look at this for inspiration https://github.com/Semantic-Org/Semantic-UI-React/blob/master/docs/src/layouts/LoginLayout.js
const LandingCard = ({ onGoClick }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }
  const handleSubmit = () => {
    onGoClick(inputValue);
  }
  return (
    <Card centered>
      <Card.Content>
        <Card.Header>Where are you headed?</Card.Header>
        <Form>
          <Form.Field>
            <label>Destination</label>
            <input placeholder="Enter your destination"
            value ={inputValue}
            onChange={handleInputChange}
                   />
          </Form.Field>
          <Button primary fluid onClick={handleSubmit}>Go</Button>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default LandingCard;
