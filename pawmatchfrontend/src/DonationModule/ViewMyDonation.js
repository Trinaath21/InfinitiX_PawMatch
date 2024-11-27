import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Form, Input, Button, Col, Row, Typography, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';  // Removed useNavigate
import FooterBar from '../GeneralComponents/FooterBar';
import Sidebar from '../GeneralComponents/SideBar';

const { Content } = Layout;
const { Title } = Typography;

function ViewMyDonation() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { shelterId } = useParams(); // Get shelterId from URL params
  const navigate = useNavigate(); // Initialize useNavigate hook

  const defaultShelterId = shelterId || 7; // Use shelterId from URL or default to 4

  useEffect(() => {
    fetchDonationDetails(defaultShelterId);
  }, [defaultShelterId]);

  const fetchDonationDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/donations/${id}`);
      const { account_owner_name, account_number, qr_code } = response.data;

      form.setFieldsValue({
        accountOwnerName: account_owner_name,
        accountNumber: account_number,
        qr_code: qr_code, // Set QR code data if available
      });
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Failed to fetch donation details');
    } finally {
      setLoading(false);
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleEditClick = () => {
    navigate(`/edit-donation/${defaultShelterId}`); // Navigate to EditDonation.js with shelterId
  };

  return (
    <>
    {/* // <Layout style={{ minHeight: '100vh' }}>
      // <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} /> */}

      
        <Content style={{ padding: '40px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '1000px', padding: '20px', background: '#fff', borderRadius: '8px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>
              My Shelter
            </Title>

            <Form form={form} layout="vertical" autoComplete="off">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Account Owner Name" name="accountOwnerName" >
                    <Input placeholder="Account owner name" disabled />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label="Account Number" name="accountNumber">
                    <Input placeholder="Bank account number" disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="center" style={{ marginTop: '20px' }}>
                <Col>
                  <Form.Item label="QR Code">
                    <div style={{ textAlign: 'center' }}>
                      <img
                        src={form.getFieldValue('qr_code')}
                        alt="QR Code"
                        style={{ width: '250px', height: '280px' }} // Increase size
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button type="primary" onClick={handleEditClick}>
                  Edit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>

        {/* // <FooterBar /> */}
      
    {/* // </Layout> */}
    </>
  );
}

export default ViewMyDonation;

