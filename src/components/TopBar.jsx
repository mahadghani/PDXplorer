import React from "react";
import Suntime from "./Suntime.js";
import "./TopBar.css";
import Umbrella from "./Umbrella.js";
import AQ from "./AQ.js";

const TopBar = ({ destination }) => {
  return (
    <div className="top-bar">
      <Suntime className="suntime-class" />
      {/* Additional components or navigation can go here */}
      <div className="header-text">
        <h1>{destination}</h1>
      </div>
      <div className="right-side-widgets">
        <AQ />
        <Umbrella />
      </div>
    </div>
  );
};

export default TopBar;
