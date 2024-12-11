import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Descriptions, Card, Button, Spin } from "antd";

const MemberProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const authToken = localStorage.getItem("login-token");

  useEffect(() => {
    if (authToken) {
      axios
        .get("http://localhost:8000/api/show", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setProfile(response.data.profile);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch profile");
          setLoading(false);
        });
    } else {
      setError("No auth token found");
      setLoading(false);
    }
  }, [authToken]);

  return (
    <div className="profile-container" style={{ padding: "20px" }}>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <Spin size="large" />
      ) : profile ? (
        <Card title="Member Profile" style={{ width: 600, margin: "auto" }}>
          <div style={{ textAlign: "center" }}>
            <img
              src={`http://localhost:8000/storage/profile_pictures${
                profile.profile_picture || "placeholder.jpg"
              }`}
              alt="Profile"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                marginBottom: 16,
              }}
            />
            <h3>{profile.name}</h3>
          </div>

          <Descriptions title="User Information" bordered column={1}>
            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {profile.phone_number}
            </Descriptions.Item>
            <Descriptions.Item label="State">{profile.state}</Descriptions.Item>
            <Descriptions.Item label="District">
              {profile.district}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {profile.detailed_address}
            </Descriptions.Item>
            <Descriptions.Item label="Number of Pets">
              {profile.NoOfPets}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Link to="/main/profiles/member/edit">
              <Button type="primary">Edit Your Profile</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <p>No profile found</p>
      )}
    </div>
  );
};

export default MemberProfile;
