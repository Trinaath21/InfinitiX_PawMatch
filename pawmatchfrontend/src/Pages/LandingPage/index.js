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

      <div className="container">
      <div className="card">
        <h1 className="title">PawMatch</h1>
        <p className="subtitle">Where Compassion Meets Opportunity.</p>
        <p className="email-text">Discover Companionship, Connection, and Care.</p>
        <button
          className="blue-button"
          onClick={() => {
            localStorage.setItem("role", "guest"); // Set role first
            navigate("/home"); // Then navigate
          }}
        >
          Continue as Guest
        </button>
      </div>
    </div>
<FooterBar />
    </div>
  );
};

export default LandingPage;
