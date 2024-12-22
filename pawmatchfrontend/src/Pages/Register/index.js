import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Cascader,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./register.css";
import axios from "axios";

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 24 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 24 } },
};

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
const { Option } = Select;
const Register = () => {
  const [form] = Form.useForm();
  const [role, setRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const onRoleChange = (value) => {
    setRole(value);
    setShowForm(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    return false;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const [state, district] = values.state_district || [];
      const formattedValues = {
        ...values,
        state,
        district,
      };
      delete formattedValues.state_district;

      const formData = new FormData();
      Object.keys(formattedValues).forEach((key) => {
        if (key !== "profile_picture") {
          formData.append(key, formattedValues[key]);
        }
      });

      if (fileList[0]) {
        formData.append("profile_picture", fileList[0].originFileObj);
      }
      console.log("updated values", formData);
      const endpoint =
        role === "Shelter" ? "/shelter/register" : "/member/register";
      const response = await axios.post(
        `http://localhost:8000/api${endpoint}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      message.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
      message.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const prefixSelector = (
    <Form.Item
      name="prefix"
      noStyle
      rules={[
        {
          required: true,
          message: "Please select a prefix!",
        },
      ]}
    >
      <Select style={{ width: 70 }} placeholder="Code">
        <Option value="60">+60</Option>
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="register-container">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        layout="vertical"
      >
        {!showForm ? (
          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: "Please select the type of your account !",
              },
            ]}
          >
            <Select
              placeholder="Please select the type of your account !"
              onChange={onRoleChange}
            >
              <Option value="Shelter">Shelter Reprensentative</Option>
              <Option value="member">Normal Member </Option>
            </Select>
          </Form.Item>
        ) : (
          <>
            {role === "Shelter" && (
              <Form.Item
                name="shelter_name"
                label="Shelter Name"
                rules={[
                  { required: true, message: "Please input Shelter Name!" },
                ]}
              >
                <Input />
              </Form.Item>
            )}

            {role === "member" && (
              <Form.Item
                name="name"
                label="Username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>
            )}

            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                { type: "email", message: "The input is not valid E-mail!" },
                { required: true, message: "Please input your E-mail!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
              {
                pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
                message: "Password must contain at least one uppercase letter, one symbol, and one number.",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>


            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
              ]}
            >
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="state_district"
              label="State and District"
              rules={[
                {
                  type: "array",
                  required: true,
                  message: "Please select your state and district!",
                },
              ]}
            >
              <Cascader
                options={stateDistrictData}
                placeholder="Please select"
              />
            </Form.Item>

            <Form.Item
              name="detailed_address"
              label="Detailed Address"
              rules={[
                {
                  required: true,
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
                  required: true,
                },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="profile_picture" label="Profile Picture">
              <Upload
                name="profile_picture"
                listType="picture"
                fileList={fileList}
                showUploadList={true}
                maxCount={1}
                onChange={handleChange}
                beforeUpload={beforeUpload}
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>

            {role === "Shelter" && (
              <>
                <Form.Item
                  name="website_url"
                  label="Website"
                  rules={[
                    { type: "url", message: "Please enter a valid URL!" },
                  ]}
                >
                  <Input placeholder="Enter your website if available" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                  <Input.TextArea />
                </Form.Item>
              </>
            )}


            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Register
              </Button>
            </Form.Item>

            <Form.Item>
              <span>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1a73e8" }}>
                  Log in
                </Link>
              </span>
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default Register;
