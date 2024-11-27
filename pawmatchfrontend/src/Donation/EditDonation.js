import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Layout, Form, Input, Button, Upload, Col, Row, Typography, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FooterBar from '../GeneralComponents/FooterBar';
import Sidebar from '../GeneralComponents/SideBar';
import { useParams } from 'react-router-dom';



const { Content } = Layout;
const { Title } = Typography;

function EditDonation() {  //{ shelterId = 4 }
  const { shelterId } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [initialImage, setInitialImage] = useState(null);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (!dataFetchedRef.current && shelterId) {
      fetchDonationDetails(shelterId);
      dataFetchedRef.current = true;
    }
  }, [shelterId]);

  const fetchDonationDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/donations/${id}`);
      const { account_owner_name, account_number, qr_code } = response.data;

      form.setFieldsValue({
        accountOwnerName: account_owner_name,
        accountNumber: account_number,
      });

      if (qr_code) {
        setFileList([
          {
            uid: '-1',
            name: 'qr_code',
            status: 'done',
            url: response.data.qr_code,
          },

        ]);
        setInitialImage(response.data.qr_code);
      }
      console.log("check image: ", response.data.qr_code);
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Failed to fetch donation details');
    }
    finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  const onFinish = async (values) => {
    setLoading(true); // Start loading during form submission
    console.log("Form Values on Submit:", values);
    setLoading(true);
    const formData = new FormData();
    formData.append('accountOwnerName', values.accountOwnerName);
    formData.append('accountNumber', values.accountNumber);

    if (fileList[0].originFileObj && fileList[0].originFileObj instanceof File) {
      // If a new file is uploaded, append the File object directly
      formData.append('qr_code', fileList[0].originFileObj);
    } else if (values.qr_code && typeof values.qr_code === 'string') {
      // If the existing image is a base64 string, convert it to Blob
      const [metadata, base64Data] = values.qr_code.split(',');
      const mimeString = metadata.match(/:(.*?);/)[1];
      const byteString = atob(base64Data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      formData.append('qr_code', blob, 'existing_image.jpg');
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    // if (fileList[0] && fileList[0].originFileObj) {
    //   formData.append('qrImage', fileList[0].originFileObj);
    // }

    try {
      await axios.post(`http://localhost:8000/api/donations/${shelterId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Donation details updated successfully');
      setLoading(true);
    } catch (error) {
      console.error('Update error:', error);
      message.error('Failed to update donation details');
    }
      finally {
        setLoading(false); // Stop loading after submission
    }
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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


    return (
      <>
        {/* <Layout style={{ minHeight: '100vh' }}>
          <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} /> */}
        
        <Content style={{ padding: '40px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '1000px', padding: '20px', background: '#fff', borderRadius: '8px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Edit Donation Details</Title>
    
            <Form
              form={form}
              name="editDonationDetails"
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
              
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Account Owner Name"
                    name="accountOwnerName"
                    rules={[{ required: true, message: 'Please enter the account owner name' },
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
                      name="qr_code"
                      initialValue={initialImage}
                    >
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        maxCount={1}
                        beforeUpload={(file) => {
                          setFile([file]);
                          return false;
                        }}
                        style={{ width: '600px', height: '600px' }}
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
                <Button type="primary" htmlType="submit" loading={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
    
        {/* <FooterBar /> */}
        {/* </Layout> */}
    
        <Modal
          visible={previewVisible}
          title="QR Code Preview"
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="QR Code" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        
      </>
    );
    
  
}

export default EditDonation;
