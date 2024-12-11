import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Descriptions, Card, Button, Spin } from "antd";

const ShelterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const authToken = localStorage.getItem("ShelterLoginToken");

  useEffect(() => {
    if (authToken) {
      axios
        .get("http://localhost:8000/api/showShelterProfile", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          setProfile(response.data.profile);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to fetch profile");
          setLoading(false);
        });
    } else {
      setError("No auth token found");
      setLoading(false);
    }
  }, [authToken]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!profile) {
    return <p>No profile found</p>;
  }

  const {
    shelter_name,
    email,
    phone_number,
    state,
    district,
    detailed_address,
    NoOfPets,
    profile_picture,
    website_url,
    description,
  } = profile;

  return (
    <div className="profile-container" style={{ padding: "20px" }}>
      <Card title="Shelter Profile" style={{ width: 600, margin: "auto" }}>
        <div style={{ textAlign: "center" }}>
          {/* Profile image */}
          <img
            src={`http://localhost:8000/storage/${
              profile_picture || "placeholder.jpg"
            }`}
            alt="Profile"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              marginBottom: 16,
            }}
          />
          <h3>{shelter_name}</h3>
        </div>

        <Descriptions title="Shelter Information" bordered column={1}>
          <Descriptions.Item label="shelter_name">
            {shelter_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{email}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            {phone_number}
          </Descriptions.Item>
          <Descriptions.Item label="State">{state}</Descriptions.Item>
          <Descriptions.Item label="District">{district}</Descriptions.Item>
          <Descriptions.Item label="Address">
            {detailed_address}
          </Descriptions.Item>
          <Descriptions.Item label="Number of Pets">
            {NoOfPets}
          </Descriptions.Item>
          <Descriptions.Item label="website">{website_url}</Descriptions.Item>
          <Descriptions.Item label="Description">
            {description}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link to="/main/profiles/shelter/edit">
            <Button type="primary">Edit Your Profile</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ShelterProfile;
