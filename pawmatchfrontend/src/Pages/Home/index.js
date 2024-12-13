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
          <h2>Find Your Perfect Pet Companion</h2>
          <p>Adopt, don’t shop. Give a lovely home to a pet in need.</p>
        </div>
      </section>

      <section className="pet-list">
        <h2>Available for Adoption</h2>
        <div className="pet-cards">
          {[dogImage, catImage, catImage2].map((image, index) => {
            const pet = [
              {
                name: "Buddy",
                species: "Dog",
                age: "2 years",
                image: dogImage,
              },
              {
                name: "Whiskers",
                species: "Cat",
                age: "1 year",
                image: catImage,
              },
              {
                name: "Chirpy",
                species: "Cat",
                age: "6 months",
                image: catImage2,
              },
            ][index];

            return (
              <div key={index} className="pet-card">
                <img src={pet.image} alt={pet.name} />
                <h3>{pet.name}</h3>
                <p>Species: {pet.species}</p>
                <p>Age: {pet.age}</p>
                <button
                  onClick={() => handleAdoptNow(pet.species.toLowerCase())}
                >
                  Adopt Now
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="adoption-articles">
        <div className="adoption-card">
          <img src={dogImage2} alt="Dog Adoption" />
          <div className="card-content">
            <h3>
              {" "}
              <a href="https://www.petfinder.com/dogs-and-puppies/adoption/">
                Dog Adoption Articles
              </a>{" "}
            </h3>
            <p>Join the PawMatch Community and Share the Love!</p>
            <button onClick={handleReadMore}>READ MORE</button>
          </div>
        </div>

        <div className="adoption-card">
          <img src={catImage3} alt="Cat Adoption" />
          <div className="card-content">
            <h3>
              {" "}
              <a href="https://www.petfinder.com/cats-and-kittens/adoption/le.com/dog-adoption">
                Cat Adoption Articles
              </a>{" "}
            </h3>
            <p>Join the PawMatch Community</p>
            <button onClick={handleReadMore}>READ MORE</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
