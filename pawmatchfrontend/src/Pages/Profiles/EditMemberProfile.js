import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Button,
  Spin,
  message,
  Upload,
  Select,
} from "antd";

const stateDistrictData = [
  {
    value: "Johor",
    label: "Johor",
    children: [
      { value: "Johor Bahru", label: "Johor Bahru" },
      { value: "Batu Pahat", label: "Batu Pahat" },
      { value: "Kluang", label: "Kluang" },
      { value: "Muar", label: "Muar" },
      { value: "Kulai", label: "Kulai" },
      { value: "Mersing", label: "Mersing" },
      { value: "Pontian", label: "Pontian" },
      { value: "Segamat", label: "Segamat" },
      { value: "Tangkak", label: "Tangkak" },
      { value: "Kota Tinggi", label: "Kota Tinggi" },
    ],
  },
  {
    value: "Kedah",
    label: "Kedah",
    children: [
      { value: "Alor Setar", label: "Alor Setar" },
      { value: "Sungai Petani", label: "Sungai Petani" },
      { value: "Kulim", label: "Kulim" },
      { value: "Baling", label: "Baling" },
      { value: "Kubang Pasu", label: "Kubang Pasu" },
      { value: "Pendang", label: "Pendang" },
      { value: "Langkawi", label: "Langkawi" },
      { value: "Yan", label: "Yan" },
    ],
  },
  {
    value: "Kelantan",
    label: "Kelantan",
    children: [
      { value: "Kota Bharu", label: "Kota Bharu" },
      { value: "Pasir Mas", label: "Pasir Mas" },
      { value: "Tumpat", label: "Tumpat" },
      { value: "Machang", label: "Machang" },
      { value: "Pasir Puteh", label: "Pasir Puteh" },
      { value: "Bachok", label: "Bachok" },
      { value: "Gua Musang", label: "Gua Musang" },
      { value: "Jeli", label: "Jeli" },
    ],
  },
  {
    value: "Melaka",
    label: "Melaka",
    children: [
      { value: "Central Melaka", label: "Central Melaka" },
      { value: "Alor Gajah", label: "Alor Gajah" },
      { value: "Jasin", label: "Jasin" },
    ],
  },
  {
    value: "Negeri Sembilan",
    label: "Negeri Sembilan",
    children: [
      { value: "Seremban", label: "Seremban" },
      { value: "Port Dickson", label: "Port Dickson" },
      { value: "Jempol", label: "Jempol" },
      { value: "Kuala Pilah", label: "Kuala Pilah" },
      { value: "Rembau", label: "Rembau" },
      { value: "Tampin", label: "Tampin" },
    ],
  },
  {
    value: "Pahang",
    label: "Pahang",
    children: [
      { value: "Kuantan", label: "Kuantan" },
      { value: "Bentong", label: "Bentong" },
      { value: "Temerloh", label: "Temerloh" },
      { value: "Raub", label: "Raub" },
      { value: "Pekan", label: "Pekan" },
      { value: "Lipis", label: "Lipis" },
      { value: "Jerantut", label: "Jerantut" },
      { value: "Maran", label: "Maran" },
    ],
  },
  {
    value: "Penang",
    label: "Penang",
    children: [
      { value: "George Town", label: "George Town" },
      { value: "Bukit Mertajam", label: "Bukit Mertajam" },
      { value: "Bayan Lepas", label: "Bayan Lepas" },
      { value: "Butterworth", label: "Butterworth" },
      { value: "Nibong Tebal", label: "Nibong Tebal" },
    ],
  },
  {
    value: "Perak",
    label: "Perak",
    children: [
      { value: "Ipoh", label: "Ipoh" },
      { value: "Taiping", label: "Taiping" },
      { value: "Manjung", label: "Manjung" },
      { value: "Kuala Kangsar", label: "Kuala Kangsar" },
      { value: "Teluk Intan", label: "Teluk Intan" },
      { value: "Bagan Datuk", label: "Bagan Datuk" },
      { value: "Batu Gajah", label: "Batu Gajah" },
    ],
  },
  {
    value: "Sabah",
    label: "Sabah",
    children: [
      { value: "Kota Kinabalu", label: "Kota Kinabalu" },
      { value: "Sandakan", label: "Sandakan" },
      { value: "Tawau", label: "Tawau" },
      { value: "Lahad Datu", label: "Lahad Datu" },
      { value: "Keningau", label: "Keningau" },
      { value: "Ranau", label: "Ranau" },
    ],
  },
  {
    value: "Sarawak",
    label: "Sarawak",
    children: [
      { value: "Kuching", label: "Kuching" },
      { value: "Sibu", label: "Sibu" },
      { value: "Miri", label: "Miri" },
      { value: "Bintulu", label: "Bintulu" },
      { value: "Limbang", label: "Limbang" },
      { value: "Sarikei", label: "Sarikei" },
    ],
  },
  {
    value: "Selangor",
    label: "Selangor",
    children: [
      { value: "Shah Alam", label: "Shah Alam" },
      { value: "Petaling Jaya", label: "Petaling Jaya" },
      { value: "Klang", label: "Klang" },
      { value: "Gombak", label: "Gombak" },
      { value: "Sepang", label: "Sepang" },
      { value: "Hulu Langat", label: "Hulu Langat" },
    ],
  },
  {
    value: "Terengganu",
    label: "Terengganu",
    children: [
      { value: "Kuala Terengganu", label: "Kuala Terengganu" },
      { value: "Kemaman", label: "Kemaman" },
      { value: "Dungun", label: "Dungun" },
      { value: "Besut", label: "Besut" },
      { value: "Hulu Terengganu", label: "Hulu Terengganu" },
    ],
  },
  {
    value: "Kuala Lumpur",
    label: "Kuala Lumpur",
    children: [{ value: "City Center", label: "City Center" }],
  },
  {
    value: "Putrajaya",
    label: "Putrajaya",
    children: [{ value: "Federal Territory", label: "Federal Territory" }],
  },
  {
    value: "Labuan",
    label: "Labuan",
    children: [{ value: "Federal Territory", label: "Federal Territory" }],
  },
];

const EditMemberProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const prefixSelector = (
    <Select defaultValue="06" style={{ width: 70 }}>
      <Select.Option value="06">06</Select.Option>
      <Select.Option value="86">86</Select.Option>
    </Select>
  );

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

  const handleSubmit = (values) => {
    setLoading(true);
    const [state, district] = values.state_district || [];

    const updatedValues = {
      ...values,
      state,
      district,
    };
    delete updatedValues.state_district;
    axios
      .put("http://localhost:8000/api/updateProfile", updatedValues, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        message.success("Member Profile updated successfully!");
        //setProfile(response.data.profile);
        navigate("/main/profiles/member");
      })
      .catch((err) => {
        message.error(
          err.response?.data?.message || "Failed to update member profile"
        );
        setLoading(false);
      });
  };
  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }
  // Error state
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p className="error">{error}</p>
        <Button type="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: 800, margin: "auto" }}>
      <Form
        layout="vertical"
        initialValues={{
          username: profile.username,
          Age: profile.Age,
          bio: profile.bio,
          phone_number: profile.phone_number,
          state_district: [profile.state, profile.district],
          //district: profile.district,
          detailed_address: profile.detailed_address,
          NoOfPets: profile.NoOfPets,
          //  bio: profile.bio || "",
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="User Name"
          name="username"
          rules={[{ required: false, message: "Please input new username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[
            { required: false, message: "Please input your phone number!" },
            {
              pattern: /^\d{6,}$/,
              message: "Phone number must be at least 6 digits.",
            },
          ]}
        >
          <Input addonBefore={prefixSelector} />
        </Form.Item>

        <Form.Item
          name="state_district"
          label="State and District"
          rules={[
            {
              required: false,
              message: "Please select your state and district!",
            },
          ]}
        >
          <Cascader options={stateDistrictData} placeholder="Please select" />
        </Form.Item>
        <Form.Item
          name="detailed_address"
          label="Detailed Address"
          rules={[
            {
              required: false,
              message: "Please input your detailed address!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="NoOfPets"
          label="Number of Pets"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="Age"
          label="Age"
          rules={[{ required: false, message: "Please input your age!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="bio"
          label="Gender"
          rules={[{ required: false, message: "Please select your gender!" }]}
        >
          <Select placeholder="Select your gender">
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
            <Select.Option value="Attack Helicopter">
              Attack Helicopter
            </Select.Option>
            <Select.Option value="Walmart Bag">Walmart Bag</Select.Option>
            <Select.Option value="Others">Others</Select.Option>
            <Select.Option value="Prefer not to say">
              Prefer not to say
            </Select.Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </div>
      </Form>
      {/* ) : (<p>No profile found</p>
      ) */}
    </div>
  );
};

export default EditMemberProfile;
