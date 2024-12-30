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
  Select,
  Upload,
  Modal,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
 import "./EditShelterProfile.css";

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
const EditShelterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const prefixSelector = (
    <Select defaultValue="60" style={{ width: 70 }}>
      <Select.Option value="60">60</Select.Option>
      <Select.Option value="86">86</Select.Option>
    </Select>
  );

  const authToken = localStorage.getItem("ShelterLoginToken");
  // Fetch shelter profile data
  const [uploadLoading, setUploadLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState(profile?.profile_picture || null);

  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);

  useEffect(() => {
    if (authToken) {
      axios
        .get("http://localhost:8000/api/showShelterProfile", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setProfile(response.data.profile);
          if (response.data.profile.profile_picture) {
            setImageUrl(
              `http://localhost:8000/storage/${response.data.profile.profile_picture}`
            );
          }
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch shelter profile");
          setLoading(false);
        });
    } else {
      setError("No auth token found");
      setLoading(false);
    }
  }, [authToken]);

  // Handle form submission
  const handleSubmit = (values) => {
    setLoading(true);

    const [state, district] = values.state_district || [];
    const updatedValues = {
      ...values,
      state,
      district,
    };
    delete updatedValues.state_district; // Remove temporary field

    axios
      .put("http://localhost:8000/api/updateShelterProfile", updatedValues, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        message.success("Shelter profile updated successfully!");
        navigate("/profiles/shelter");
      })
      .catch((err) => {
        message.error(
          err.response?.data?.message || "Failed to update shelter profile"
        );
        setLoading(false);
      });
  };

  // add change password function
  const handleChangePassword = (values) => {
    axios
      .post("http://localhost:8000/api/shelter/change-password", values, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        message.success("Password changed successfully");
        setIsChangePasswordModalVisible(false);
      })
      .catch((error) => {
        message.error(
          error.response?.data?.message || "Password change failed"
        );
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
    <div className="edit-shelter-container">
      <h2>Edit Shelter Profile</h2>
      <Form
        className="edit-shelter-form"
        layout="vertical"
        initialValues={{
          shelter_name: profile.shelter_name,
          representative_name: profile.representative_name,
          username: profile.username,
          phone_number: profile.phone_number,
          state_district: [profile.state, profile.district],
          detailed_address: profile.detailed_address,
          NoOfPets: profile.NoOfPets,
          website_url: profile.website_url,
          description: profile.description,
          contact_number: profile.contact_number,
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          rules={[{ required: true, message: "Please input shelter name!" }]}
          label="Shelter Name"
          name="shelter_name"
        >
          <Input placeholder="Enter shelter name" />
        </Form.Item>
        <Form.Item
          rules={[
            { required: true, message: "Please input representative name!" },
          ]}
          label="Representative Name"
          name="representative_name"
        >
          <Input placeholder="Enter representative name" />
        </Form.Item>
        {/* 
        <Form.Item label="Username" name="username">
          <Input placeholder="Enter username" />
        </Form.Item>
 */}
        <Form.Item
          label="Shelter Contact Number"
          name="phone_number"
          rules={[
            { required: true, message: "Please input your phone number!" },
            {
              pattern: /^\d{6,}$/,
              message: "Phone number must be at least 6 digits.",
            },
          ]}
        >
          <Input addonBefore={prefixSelector} />
        </Form.Item>
        <Form.Item
          label="Representative Contact Number"
          name="contact_number"
          rules={[
            {
              required: true,
              message: "Please input your Representative contact number!",
            },
            {
              pattern: /^\d{6,}$/,
              message: "Contact number must be at least 6 digits.",
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
              required: true,
              message: "Please select the state and district!",
            },
          ]}
        >
          <Cascader options={stateDistrictData} placeholder="Please select" />
        </Form.Item>

        <Form.Item
          name="detailed_address"
          label="Detailed Address"
          rules={[
            { required: true, message: "Please input detailed address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="NoOfPets"
          label="Number of Pets"
          rules={[{ required: true, message: "Please input number of pets!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="website_url"
          label="Website URL"
          rules={[
            {
              type: "url",
              message: "Please enter a valid URL (e.g., https://example.com).",
            },
            {
              required: true,
              message: "Website URL is required.",
            },
          ]}
        >
          <Input placeholder="Enter your website URL" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <div className="button-group">
          <Button type="primary" htmlType="submit">
            Save Change
          </Button>
          <Button onClick={() => navigate("/profiles/shelter")}>
            Cancel
          </Button>
        </div>
      </Form>

      <div className="change-password-button">
        <Button
          type="primary"
          onClick={() => setIsChangePasswordModalVisible(true)}
        >
          Change Password
        </Button>
      </div>

      <Modal
        title="Change Password"
        open={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="current_password"
            label="Current Password"
            rules={[
              { required: true, message: "Please input current password" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="new_password"
            label="New Password"
            rules={[
              { required: true, message: "Please input new password" },
              { min: 6, message: "Password must be at least 6 characters" },
              {
                pattern:
                  /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
                message:
                  "Password must contain at least one uppercase letter, one symbol, and one number.",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Confirm New Password"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Please confirm new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match."
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Button
              type="default"
              style={{ marginRight: 8 }}
              onClick={() => setIsChangePasswordModalVisible(false)}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <style jsx>{`
        .avatar-uploader > .ant-upload {
          width: 128px;
          height: 128px;
        }
        .ant-upload-select-picture-card i {
          font-size: 32px;
          color: #999;
        }
        .ant-upload-select-picture-card .ant-upload-text {
          margin-top: 8px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default EditShelterProfile;
