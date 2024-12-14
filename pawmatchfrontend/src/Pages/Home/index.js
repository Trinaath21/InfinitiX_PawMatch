import React from "react";
import { useNavigate } from "react-router-dom";
import dogImage from "../../images/Adoption-dog-01.jpg";
import catImage from "../../images/Adoption-cat-01.jpg";
import catImage2 from "../../images/Adoption-cat-02.JPG";
import dogImage2 from "../../images/Forum-dog.jpg";
import catImage3 from "../../images/Forum-cat.jpg";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate("/main/forum/post-component");
  };
  const handleAdoptNow = () => {
    navigate("/main/Adoption/view-public");
  };

  return (
    <div className="home">
      <section className="banner">
        <div className="banner-content">
        <h2>Discover Our All-in-One Pet Care Platform</h2>
        <p>Join a community devoted to caring and making a difference for animals.</p>

        </div>
      </section>
    </div>
  );
};

export default Home;
