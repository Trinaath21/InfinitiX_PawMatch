import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Typography, Spin, Select, Modal, Input,Badge,Image  } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


const ViewMoreDetails = () => {
  const navigate = useNavigate();
  const role = parseInt(localStorage.getItem('role'), 10);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [loading, setLoading] = useState(true);
  const { Title, Text } = Typography;
  const [isModalHistVisible, setIsModalHistVisible] = useState(false);
  const [caseInfo, setCaseInfo] = useState({});
  
  const location = useLocation();

  useEffect(() => {
    const getSpecificReportData = async () => {
      try {
        const reportID = location.state?.reportID; 
        if (reportID) {
          const response = await axios.post('http://localhost:8000/api/getSpecificReport', {
            reportID: reportID,
          });
          setCaseInfo(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching specific report data:', error);
      }
    };

    getSpecificReportData();
  }, [location.state]);

  const showModal = () => {
    setIsModalHistVisible(true);
  };

  const handleCancel = () => {
    setIsModalHistVisible(false);
  };




  const handleOk = () => {
    setIsModalVisible(false); // Close the modal
    navigate("/ViolationManagement");
  };

  const borderStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#f2f9ff',
    borderRight: '1px solid #ccc', // Vertical line between columns
  };
  
  const lastColumnStyle = {
    ...borderStyle,
    borderRight: 'none', // Remove the border from the last column
  };
  
  const headerStyle = {
    backgroundColor: '#004b80',
    color: '#fff',
    textAlign: 'center',
    padding: '10px',
    borderRight: '1px solid #ccc',
  };


  if (loading) {
    return <Spin size="large" />;
  }




  return (
<div>
  <div style={{ backgroundColor: '#fff', minWidth: '50vh', margin: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
      <Button
        type="primary"
        onClick={() => navigate('/PersonalLostFound')}
        style={{ backgroundColor: '#004b80' }}
      >
        Back
      </Button>
    </div>

    <Card bodyStyle={{ padding: 0 }} hoverable style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
      <Row>
        <Col span={24} style={{ backgroundColor: '#004b80', padding: '10px', textAlign: 'center' }}>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>Report Information</Title>
        </Col>
      </Row>

      {/** Report Information Rows */}
      <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
      <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Report ID:</strong> {caseInfo.report_id}</Text>
        </Col>
        
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Report Created Date:</strong> {caseInfo.date_reported}</Text>
        </Col>
      </Row>

      <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Created By:</strong> {caseInfo.user.name}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Creator Email:</strong> {caseInfo.user.email}</Text>
        </Col>
      </Row>

      <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Creator Phone Number:</strong> {caseInfo.user.phoneNumber}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Reply Reports Quantity:</strong> {caseInfo.noOfReplies}</Text>
        </Col>
      </Row>

      <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Last Seen Location:</strong> {caseInfo.last_seen_location}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>District:</strong> {caseInfo.district}</Text>
        </Col>
      </Row>
    </Card>

    <Card bodyStyle={{ padding: 0 }} hoverable style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
      <Row>
        <Col span={24} style={{ backgroundColor: '#004b80', padding: '10px', textAlign: 'center' }}>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>Pet Information</Title>
        </Col>
      </Row>

      {/** Pet Information Rows */}
      <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Pet Name:</strong> {caseInfo.pet.pet_name}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Species:</strong> {caseInfo.pet.species}</Text>
        </Col>
      </Row>

      <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Breed:</strong> {caseInfo.pet.breed}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Color:</strong> {caseInfo.pet.color}</Text>
        </Col>
      </Row>

      <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Age (Years):</strong> {caseInfo.pet.age}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Size (KG):</strong> {caseInfo.pet.size}</Text>
        </Col>
      </Row>

      <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col span={24} style={{ padding: '0 16px' }}>
          <Text><strong>Pet Description:</strong> {caseInfo.pet.description}</Text>
        </Col>
      </Row>

      <Row style={{ padding: '10px 0', alignItems: 'center' }}>
        <Col xs={24} sm={6} style={{ padding: '0 16px', textAlign: 'left' }}>
          <Text><strong>Pet Image:</strong></Text>
        </Col>
        
        <Col xs={24} sm={18} style={{ padding: '0 16px', marginLeft:"-25%", textAlign: 'center' }}>
          <Image.PreviewGroup
            items={[{ src: `data:image/png;base64,${caseInfo.pet.image}`, alt: 'Pet Image' }]}
          >
            <Image
              width={200}
              src={`data:image/png;base64,${caseInfo.pet.image}`}
              alt="Pet Image"
              style={{ borderRadius: '8px', objectFit: 'cover', marginTop: '8px' }}
            />
          </Image.PreviewGroup>
        </Col>
      </Row>
    </Card>
    {caseInfo.status === 'active' && (
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Badge count={caseInfo.noOfReplies} style={{ backgroundColor: '#f5222d' }}>
          <Button 
            type="primary" 
            onClick={() => {/* Handle view replies action */}} 
            style={{ backgroundColor: '#004b80' }}
          >
            View Reply Report
          </Button>
        </Badge>
      </div>
    )}
  </div>
</div>

    
  );
};

export default ViewMoreDetails;
