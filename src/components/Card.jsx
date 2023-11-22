import React, { useState } from 'react';
//import './Card.css';
import { Modal , Form, Button } from 'semantic-ui-react';
// Look at this for inspiration
// https://github.com/Semantic-Org/Semantic-UI-React/blob/master/docs/src/layouts/LoginLayout.js
const LandingCard = ({ onGoClick }) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(true);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }
  const handleSubmit = () => {
    onGoClick(inputValue);
    setOpen(false); // close modal
  }

  return (
    /* Look into using this as a button to reset the app. */
    <Modal
      trigger={<Button onClick={() => setOpen(true)}>New Destination</Button>}
      open={open}
      onClose={() => setOpen(false)}
      centered
      >
      <Modal.Header>Where are you headed?</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label htmlFor='destination'>Destination</label>
            <input
              id='destination'
              type='text'
              placeholder='Enter your destination'
              value={inputValue}
              onChange={handleInputChange}
              />
          </Form.Field>
          <Button primary fluid onClick={handleSubmit}>Go</Button>
        </Form>
      </Modal.Content>
    </Modal>

  //   <Modal centered>
  //     <Modal.Content>
  //       <Modal.Header>Where are you headed?</Modal.Header>
  //       <Form>
  //         <Form.Field>
  //           <label htmlFor='destination'>Destination</label>
  //           <input id='destination' placeholder="Enter your destination"
  //           value ={inputValue}
  //           onChange={handleInputChange}
  //                  />
  //         </Form.Field>
  //         <Button primary fluid onClick={handleSubmit}>Go</Button>
  //       </Form>
  //     </Modal.Content>
  //   </Modal>
  );
};

export default LandingCard;
