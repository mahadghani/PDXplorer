import React from 'react';
import Suntime from './Suntime.js'
import './TopBar.css'

const TopBar = ({destination}) => {
  return (
    <div className="top-bar">
      <Suntime className='suntime-class' />
      {/* Additional components or navigation can go here */}
      <div className='header-text'>
     <h1>{destination}</h1>
      </div>
      <div className='placeholder'>
        <h2>Placeholder</h2>
      </div>
    </div>
  );
};

export default TopBar;
