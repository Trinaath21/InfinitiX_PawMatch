import React, { useState } from 'react';
import axios from 'axios';
import { Layout, Form, Input, Button, Upload, Col, Row, Typography, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FooterBar from '../GeneralComponents/FooterBar';
import Sidebar from '../GeneralComponents/SideBar';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

function AddDonation() {
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate hook

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  const onFinish = async (values) => {
    setLoading(true); // Start loading
    const formData = new FormData();
    //formData.append('shelterId', values.shelterId);
    formData.append('accountOwnerName', values.accountOwnerName);
    formData.append('accountNumber', values.accountNumber);
    if (fileList[0]) {
      formData.append('qrImage', fileList[0].originFileObj);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/donations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Donation details submitted successfully');
      navigate('/ViewMyDonation');
    } catch (error) {
      console.error('Submission error:', error);
      message.error('Failed to submit donation details');
    }
      finally {
      setLoading(false); // End loading
    }
  };

  // const handlePreview = async (file) => {
  //   setPreviewImage(file.thumbUrl || file.preview);
  //   setPreviewVisible(true);
  // }
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <>
     {/* <Layout style={{ minHeight: '100vh' }}> */}
      {/* <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} /> */}

      
        <Content style={{ padding: '40px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '1000px', padding: '20px', background: '#fff', borderRadius: '8px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Add Donation Details</Title>
            
            <Form
              form={form}
              name="donationDetails"
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Account Owner Name"
                    name="accountOwnerName"
                    rules={[{ required: true, message: 'Please enter the account owner name', },
                            { pattern: /^[A-Za-z\s]+$/, message: 'Only alphabets are allowed' }
                          ]}
                  >
                    <Input placeholder="Enter account owner name" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Account Number"
                    name="accountNumber"
                    rules={[{ required: true, message: 'Please enter the bank account number' },
                            { pattern: /^\d+$/, message: 'Only numbers are allowed' }
                          ]}
                  >
                    <Input placeholder="Enter bank account number" />
                  </Form.Item>
                </Col>

                <Row justify="center" style={{ width: '100%' }}>
                  <Col xs={24} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form.Item
                      label="Upload QR Code"
                      name="qrImage"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      rules={[{ required: true, message: 'Please upload a QR code image' }]}
                      //style={{ width: '100%', textAlign: 'center' }} //here
                    >
                      
                      <Upload
                        name="qr"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        maxCount={1}
                        beforeUpload={() => false} 
                        accept="image/*"
                      >

                        {fileList.length < 1 && (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload QR Code</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Row>

              <Form.Item style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '10px' }}>
                  Submit
                </Button>
                <Button type="default" onClick={() => navigate('/ViewMyDonation')}>
                  Back
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
        
        {/* <FooterBar /> */}
      

      <Modal
        visible={previewVisible}
        title="QR Code Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="QR Code" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    {/* // </Layout> */}
    </>
  );
}

export default AddDonation