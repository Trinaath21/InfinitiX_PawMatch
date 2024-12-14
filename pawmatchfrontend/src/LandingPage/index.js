import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import "./Landing.css";
import FooterBar from "../../GeneralComponents/FooterBar";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="header">
        <div className="icons">
          <button className="blue-button" onClick={() => navigate("/login")}>
            <FontAwesomeIcon icon={faSignInAlt} className="icon" /> Login
          </button>
          <button className="blue-button" onClick={() => navigate("/register")}>
            <FontAwesomeIcon icon={faUserPlus} className="icon" /> Register
          </button>
        </div>
      </div>

      <div className="content">
        <h1 className="title">Paw Match</h1>
        <br></br>
        <p className="subtitle">Where Compassion Meets Opportunity.</p>        <br></br>
        <p className="email-text">Discover Companionship, Connection, and Care.</p>

        <br></br>
        <button className="blue-button" onClick={() => navigate("/home")}>
          Continue as Guest
        </button>
      </div>
      <FooterBar />
    </div>
  );
};

export default LandingPage;
