import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Descriptions, Card, Button, Spin, Tag } from "antd";
import {
  UserOutlined,
  ManOutlined,
  WomanOutlined,
  FireOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
// Gender icons for different gender options
const genderIcons = {
  Male: <ManOutlined style={{ fontSize: 40, color: "blue" }} />,
  Female: <WomanOutlined style={{ fontSize: 40, color: "pink" }} />,
  "Attack Helicopter": <FireOutlined style={{ fontSize: 40, color: "red" }} />,
  "Walmart Bag": <ShoppingOutlined style={{ fontSize: 40, color: "green" }} />,
  Others: <UserOutlined style={{ fontSize: 40, color: "gray" }} />,
};

const MemberProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch Token from local storage
  const authToken = localStorage.getItem("login-token");

  // fetch profile data from backend
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
    name,
    email,
    phone_number,
    state,
    district,
    detailed_address,
    NoOfPets,
    profile_picture,
    username,
    Age,
    bio,
  } = profile;
  return (
    <div className="profile-container" style={{ padding: "20px" }}>
      <Card
        title={`Member Name: ${name}`}
        style={{ width: 600, margin: "auto" }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={`http://localhost:8000${
              profile_picture || "profile-cover.jpg"
            }`}
            alt="Profile"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              marginBottom: 16,
            }}
          />
          <h3>{/*shelter_name*/}Member Information</h3>
        </div>

        <Descriptions title="Member Information" bordered column={1}>
          <Descriptions.Item label="Username">
            {username ? username : <Tag color="warning">Null</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            <div style={{ display: "flex", alignItems: "center" }}>
              {genderIcons[bio] || (
                <UserOutlined
                  style={{ fontSize: 10, color: "bule", marginRight: 2 }}
                />
              )}
              {bio || "Not provided"}
            </div>
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
        </Descriptions>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link to="/profiles/member/edit">
            <Button type="primary">Edit Profile</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default MemberProfile;
