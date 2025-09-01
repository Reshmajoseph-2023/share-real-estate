import React from "react";
import "./GetStarted.css";

const GetStarted = () => {
  return (
    <div id="get-started" className="g-wrapper">
      <div className="paddings innerWidth g-container">
        <div className="flexColCenter inner-container">
          <span className="primaryText">Get started with TrueHome</span>
          <span className="secondaryText">
            Subscribe and find super attractive price quotes from us.
            <br />
            Find your property soon
          </span>
          <a href="mailto:rj287@students.waikato.ac.nz" className="button">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;