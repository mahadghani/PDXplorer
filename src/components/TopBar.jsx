import React from 'react';
import Suntime from './Suntime.js'

const TopBar = () => {
  return (
    <div className="top-bar">
      <Suntime />
      {/* Additional components or navigation can go here */}
      <p>Top Bar</p>
    </div>
  );
};

export default TopBar;
