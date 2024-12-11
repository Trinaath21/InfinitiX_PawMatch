import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Button, Typography, Spin, Image } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewMoreAdoption = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { Title, Text } = Typography;
  const [data, setData] = useState({});
  const location = useLocation();
  const { Content } = Layout;

  useEffect(() => {
    const getAdoptionPost = async () => {
      try {
        const adoption_post_id = location.state?.adoption_post_id;
        if (adoption_post_id) {
          const response = await axios.get(`http://localhost:8000/api/adoption-posts/${adoption_post_id}`);
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching specific post data:', error);
      }
    };

    getAdoptionPost();
  }, [location.state]);

  const page = location.state?.page; 

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      {/* <Content style={{ margin: '24px 16px 0' }}>
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0px', background: '#fff', borderRadius: '8px', margin: 'auto' }}> */}
        <div style={{ backgroundColor: '#fff', minWidth: '50vh', margin: 'auto' }}>
          {/* Back Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <Button
              type="primary"
              onClick={() => {
                if (page) {
                  navigate(page); // Redirect to the stored page
                } 
              }}
              style={{ backgroundColor: '#004b80' }}
            >
              Back
            </Button>
          </div>

          {/* Post Information */}
          <Card bodyStyle={{ padding: 0 }} hoverable style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
            <Row>
              <Col span={24} style={{ backgroundColor: '#004b80', padding: '10px', textAlign: 'center' }}>
                <Title level={4} style={{ color: '#fff', margin: 0 }}>Post Information</Title>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Post ID:</strong> {data.adoption_post_id}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Created At:</strong> {data.created_at}</Text>
              </Col>
            </Row>
          </Card>

          {/* Pet Information */}
          <Card bodyStyle={{ padding: 0 }} hoverable style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
            <Row>
              <Col span={24} style={{ backgroundColor: '#004b80', padding: '10px', textAlign: 'center' }}>
                <Title level={4} style={{ color: '#fff', margin: 0 }}>Pet Information</Title>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Pet Name:</strong> {data.name}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Species:</strong> {data.species}</Text>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Breed:</strong> {data.breed}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Gender:</strong> {data.gender}</Text>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Age:</strong> {data.age}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Size:</strong> {data.size}</Text>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Weight:</strong> {data.weight}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Vaccination Status:</strong> {data.vaccination_status}</Text>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Spayed/Neutered Status:</strong> {data.spayed_neutered_status}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Health Issues:</strong> {data.health_issues}</Text>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Behavioral Traits:</strong> {data.behavioral_traits}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px', textAlign: 'left' }}>
                <Text><strong>Pet Image:</strong></Text>
                <div style={{ marginTop: '8px' }}>
                  {data.petImage && (
                    <Image
                      src={data.petImage}
                      alt="Pet image"
                      style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  )}
                </div>
              </Col>
            </Row>

          </Card>

          {/* Adoption Information */}
          <Card bodyStyle={{ padding: 0 }} hoverable style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
            <Row>
              <Col span={24} style={{ backgroundColor: '#004b80', padding: '10px', textAlign: 'center' }}>
                <Title level={4} style={{ color: '#fff', margin: 0 }}>Adoption Information</Title>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Current Location:</strong> {data.current_location}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>District:</strong> {data.district}</Text>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>State:</strong> {data.state}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Additional Info:</strong> {data.extra_info}</Text>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ padding: '10px 0' }}>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Adoption Fee:</strong> {data.adoption_fee}</Text>
              </Col>
              <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                <Text><strong>Status:</strong> {data.status}</Text>
              </Col>
            </Row>
          </Card>
        </div>
        </div>
    //   </Content>
    // </div>
  );
};

export default ViewMoreAdoption;
