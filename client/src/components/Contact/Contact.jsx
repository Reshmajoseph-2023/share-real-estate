import React from "react";
import "./Contact.css";
import { MdCall } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";

// Keep numbers/messages in one place
const PHONE_E164 = "+64204737472";           // for tel:
const PHONE_WA = "64204737472";              // for wa.me (no +)
const DEFAULT_MSG = "Hi TrueHome, I'm interested in a property.";

const Contact = () => {
  return (
    <div id="contact-us" className="c-wrapper">
      <div className="paddings innerWidth flexCenter c-container">
        {/* left side */}
        <div className="flexColStart c-left">
          <span className="orangeText">Contact Us</span>
          <span className="primaryText">Easy to contact us</span>
          <span className="secondaryText">
            We believe a good place to live can make your life better.
          </span>

          <div className="flexColStart contactModes">
            {/* first row */}
            <div className="flexStart row">
              {/* Call */}
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <MdCall size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Call</span>
                    <span className="secondaryText">{PHONE_E164}</span>
                  </div>
                </div>
                <a className="flexCenter button" href={`tel:${PHONE_E164}`}>
                  Call now
                </a>
              </div>

              {/* Chat (WhatsApp) */}
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <BsFillChatDotsFill size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Chat</span>
                    <span className="secondaryText">WhatsApp</span>
                  </div>
                </div>
                <a
                  className="flexCenter button"
                  href={`https://wa.me/${PHONE_WA}?text=${encodeURIComponent(DEFAULT_MSG)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat now
                </a>
              </div>
            </div>
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
    </div>
  );
};

export default Contact;
