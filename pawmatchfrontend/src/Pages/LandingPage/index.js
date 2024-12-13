import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import "./Landing.css";
import FooterBar from "../../GeneralComponents/FooterBar";

const LandingPage = () => {
  const navigate = useNavigate();
  const handleContinueAsGuest = () => {
    // Store 'role' as 'guest' in localStorage
    localStorage.setItem("role", "guest");
    console.log("Stored Role as Guest:", localStorage.getItem("role"));

    // Navigate to the guest home page or wherever you'd like
    navigate("/main/home");
  };

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
        <p className="subtitle">From Stray to Stay: Your Companion Awaits.</p>
        <br></br>
        <p className="email-text">Find Your Perfect Match, One Paw at a Time</p>
        <br></br>
        <button
          className="blue-button"
          onClick={() => {
            localStorage.setItem("role", "guest"); // Set role first
            navigate("/main/home"); // Then navigate
          }}
        >
          Continue as Guest
        </button>
      </div>

      <FooterBar />
    </div>
  );
};

export default LandingPage;
