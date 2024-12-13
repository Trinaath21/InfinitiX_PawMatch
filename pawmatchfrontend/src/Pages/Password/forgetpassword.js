import React, { useState } from "react";
import { Form, Input, Button, message, Alert } from "antd";
import axios from "axios";
import { LockOutlined } from "@ant-design/icons";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:8000/api/forgot-password", {
        email: values.email,
      });
      setSuccess(true);
      message.success("Password reset link sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {error && <Alert type="error" message={error} showIcon />}
      {success ? (
        <Alert
          type="success"
          message="Check your email for the reset link."
          showIcon
        />
      ) : (
        <Form onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input prefix={<LockOutlined />} placeholder="Enter your email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default ForgotPassword;
