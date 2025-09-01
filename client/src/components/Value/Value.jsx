import React from 'react';
import "./Value.css";

const Value = () => {
  return (
    <section id="value" className="v-wrapper">
      <div className="paddings innerWidth flexCenter v-container">
        {/* left side */}
        <div className="v-left">
          <div className="image-container">
            <img src="./value.png" alt="value" />
          </div>
        </div>

        {/* right side */}
        <div className="flexColStart v-right">
          <span className="orangeText">Finding the perfect home</span>
         
          <span className="secondaryText" style={{ textAlign: "justify" }}>
            Finding the perfect home for sale in New Zealand can be tough – especially if you’re not a property expert. 
            <br />
            At TrueHome, we exist to make the real estate hunt that little bit easier. Begin the search for your dream home today. 
            Whether you’re looking for your first home, something large enough for the whole family, 
            or a lifestyle property to live your dream life, you'll be able to find the perfect property by browsing 
            our extensive list of houses for sale on the NZ housing market.
          </span>
        </div>
      </div>
    </section>
  );
};

export default Value;
