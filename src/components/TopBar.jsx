import React from "react";
import Suntime from "./Suntime.js";
import "./TopBar.css";
import Umbrella from "./Umbrella.js";
import AQ from "./AQ.js";

const TopBar = ({ destination }) => {
  return (
    <div className="top-bar">
      <Suntime className="suntime-class" />

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
  const searchTerm = ", Portland";
  const index = text.indexOf(searchTerm);

  if (index !== -1) {
    return text.substring(0, index);
  } else {
    return text;
  }
}
