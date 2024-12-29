import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Form,
  Input,
  Button,
  Col,
  Row,
  Typography,
  message,
  Empty,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

function ViewMyDonation() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [donationDetailsExist, setDonationDetailsExist] = useState(false);
  //const { shelterId } = useParams();
  const navigate = useNavigate();

  // Retrieve shelter_id from local storage
  const shelterId = parseInt(localStorage.getItem("shelter_id"), 10);

  useEffect(() => {
    console.log("useEffect triggered with shelterId:", shelterId);
    fetchDonationDetails(shelterId);
  }, [shelterId]);

  const fetchDonationDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/donations/${id}`
      );
      const { account_owner_name, account_number, qr_code, bank } = response.data;

      if (account_owner_name || account_number || qr_code || bank) {
        setDonationDetailsExist(true);
        form.setFieldsValue({
          accountOwnerName: account_owner_name,
          accountNumber: account_number,
          qr_code: qr_code,
          bank: bank,
        });
      } else {
        setDonationDetailsExist(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setDonationDetailsExist(false); // Donation not found
      } else {
        console.error("Fetch error:", error);
        message.error("Failed to fetch donation details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    navigate(`/edit-donation/${shelterId}`); // Navigate to EditDonation.js with shelterId
  };

  const handleAddDonationClick = () => {
    navigate("/AddDonation", { state: { shelterId } });
 // Navigate to AddDonation.js
  };

  return (
    <Content
      style={{
        padding: "40px 50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
        }}
      >
        <Title level={2} style={{ textAlign: "center" }}>
          My Shelter
        </Title>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Typography.Text>Loading...</Typography.Text>
          </div>
        ) : donationDetailsExist ? (
          <Form form={form} layout="vertical" autoComplete="off">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item label="Account Owner Name" name="accountOwnerName">
                  <Input placeholder="Account owner name" disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label="Account Number" name="accountNumber">
                  <Input placeholder="Bank account number" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={12}>
                <Form.Item label="Bank" name="bank">
                  <Input placeholder="Bank" disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} style={{ paddingLeft: "10px" }}>
                <Form.Item label="QR Code">
                  <div >
                    <img
                      src={form.getFieldValue("qr_code")}
                      alt="QR Code"
                      style={{ width: "250px", height: "280px" }}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                type="primary"
                onClick={handleEditClick}
                style={{ marginRight: "10px" }}
              >
                Edit
              </Button>
              <Button type="default" disabled>
                Add Donation Details
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Empty description="No donation details found" />
            <Button
              type="primary"
              onClick={handleAddDonationClick}
              style={{ marginTop: "20px" }}
            >
              Add Donation Details
            </Button>
          </div>
        )}
      </div>
    </Content>
  );
}

export default ViewMyDonation;
