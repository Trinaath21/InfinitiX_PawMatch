import React, { useState } from "react";
import { Radio, Form, Input, Button, message, Alert, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./login.css";
import bgImage1 from "../../images/bg-01.jpg";

const slogans = {
  member: [
    "Let’s have an adventure together with your pets.",
    "Your journey starts here!",
    "Enjoy the love and joy with your furry friends.",
  ],
  shelter: [
    "We love, we care!",
    "Together, we can make a difference.",
    "Sheltering dreams, one paw at a time.",
  ],
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("member"); // 默认角色为 "member"
  const navigate = useNavigate();

  const getRandomSlogan = (role) => {
    const slogansList = slogans[role];
    return slogansList[Math.floor(Math.random() * slogansList.length)];
  };

  /* const onFinish = async (values) => {
    setLoading(true);
    try {
      const endpoint =
        role === "member"
          ? `http://localhost:8000/api/member/login`
          : `http://localhost:8000/api/shelter/login`;

      const response = await axios.post(endpoint, values);
      console.log(response.data);

      if (response.status === 200) {
        message.success("Login successful!");
        localStorage.setItem("authToken", response.data.token);
        console.log("Stored Token:", localStorage.getItem("authToken"));
        localStorage.setItem("role", role); // 设置角色

        navigate("/home");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Invalid email or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };*/
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const endpoint =
        role === "member"
          ? `http://localhost:8000/api/member/login`
          : `http://localhost:8000/api/shelter/login`;

      const response = await axios.post(endpoint, values);
      console.log(response.data);

      if (response.status === 200) {
        message.success("Login successful!");

        // Extract the token from the response
        const tokenKey =
          role === "member" ? "login-token" : "ShelterLoginToken";
        const token = response.data.data.token; // Access token from data -> token

        // Store the token in localStorage
        localStorage.setItem(tokenKey, token); // Store only the token value
        console.log("Stored Token:", localStorage.getItem(tokenKey));
        //Store the shelter_id (note the correct field name `shelter_id`)
        if (role === "shelter") {
          const shelterId = response.data.data.shelter_id; // 获取 shelter_id
          localStorage.setItem("shelter_id", shelterId); // 存储 shelter_id
          console.log("Stored Shelter ID:", localStorage.getItem("shelter_id"));
        }
        // Store the user_id (for members)
        if (role === "member") {
          const userId = response.data.data.user_id; // 获取 user_id
          localStorage.setItem("user_id", userId); // 存储 user_id
          console.log("Stored User ID:", localStorage.getItem("user_id"));
        }
        // Store the role in localStorage
        localStorage.setItem("role", role);
        // Store the role

        navigate("/main/home");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Invalid email or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignUpRedirect = () => {
    navigate("/register");
  };

  const handleBackToLanding = () => {
    navigate("/landing");
  };

  return (
    <div className="login-container">
      <div className="back-to-landing-icon" onClick={handleBackToLanding}>
        <HomeOutlined />
      </div>

      <div
        className="left-side"
        style={{ backgroundImage: `url(${bgImage1})` }}
      ></div>
      <div className="right-side">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="form"
        >
          <div className="user-type-box">
            <h2 className="welcome-title">Welcome</h2>
            <p className="login-type">
              {role === "member" ? (
                <i>Login to your account</i>
              ) : (
                <i>Login as Shelter</i>
              )}
            </p>
            <p className="user-type-slogan animated-slogan">
              {getRandomSlogan(role)}
            </p>
            <Radio.Group
              value={role}
              onChange={(e) => setRole(e.target.value)} // 确保 role 更新
              className="user-type-radio"
            >
              <Radio value="member">Member</Radio>
              <Radio value="shelter">Shelter</Radio>
            </Radio.Group>
          </div>

          {error && <Alert type="error" message={error} showIcon />}

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "The input is not a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              addonAfter={
                showPassword ? (
                  <EyeOutlined onClick={togglePasswordVisibility} />
                ) : (
                  <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
                )
              }
            />
          </Form.Item>
          <Form.Item>
            <div className="form-footer">
              <Checkbox>Remember me</Checkbox>
              <a
                className="forget-password"
                onClick={() => navigate("/forget-password")}
                style={{ cursor: "pointer", color: "#1890ff" }}
              >
                Forgot password?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Log In
            </Button>
            <div className="sign-up-prompt">
              Don't have an account?{" "}
              <a onClick={handleSignUpRedirect} className="sign-up-link">
                Sign up now!
              </a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
