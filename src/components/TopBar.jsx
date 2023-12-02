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
        <h1>{truncateAfterPortland(destination)}</h1>
      </div>
      <div className="right-side-widgets">
        <AQ />
        <Umbrella />
      </div>
    </div>
  );
};

export default TopBar;

function truncateAfterPortland(text) {
  const searchTerm = ', Portland';
  const index = text.indexOf(searchTerm);

  if (index !== -1) {
    // Return the substring up to and including ',Portland'
    return text.substring(0, index);
  } else {
    // Return the original text if ',Portland' is not found
    return text;
  }
}
