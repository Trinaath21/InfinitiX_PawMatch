import React, { useState } from "react";
import { Form, Input, Button, message, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:8000/api/reset-password", {
        token,
        email: values.email,
        password: values.password,
        password_confirmation: values.confirmPassword,
      });
      setSuccess(true);
      message.success("Password reset successful. You can now log in.");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <Alert type="error" message={error} showIcon />}
      {success ? (
        <Alert
          type="success"
          message="Password reset successful. Proceed to login."
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
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your new password!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New password"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("The two passwords do not match!");
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm new password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;
