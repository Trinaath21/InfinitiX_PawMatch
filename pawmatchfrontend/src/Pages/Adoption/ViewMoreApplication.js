import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Button, Typography, Spin, Image } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewMoreApplication = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { Title, Text } = Typography;
    const [data, setData] = useState({});
    const location = useLocation();
    const { Content } = Layout;
    const adoption_post_id = location.state?.adoption_post_id;

    useEffect(() => {
        const getApplication = async () => {
            try {
                const application_id = location.state?.application_id;
                if (application_id) {
                    const response = await axios.get(`http://localhost:8000/api/get-application-by-applicant?application_id=${application_id}`);
                    setData(response.data);
                    // console.log("resposnse data", response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching specific post data:', error);
            }
        };

        getApplication();
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
                                navigate(page, { state: { adoption_post_id: adoption_post_id }}); // Redirect to the stored page
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
                            <Title level={4} style={{ color: '#fff', margin: 0 }}>Application Information</Title>
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Application ID:</strong> {data[0].application_id}</Text>
                        </Col>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Application Date:</strong> {data[0].application_date}</Text>
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Applicant Name:</strong> {data[0].applicant_name}</Text>
                        </Col>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Applicant Age:</strong> {data[0].applicant_age}</Text>
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Phone Number:</strong> {data[0].phone_number}</Text>
                        </Col>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Detailed Address:</strong> {data[0].detailed_address}</Text>
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>District:</strong> {data[0].district}</Text>
                        </Col>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>State:</strong> {data[0].state}</Text>
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Current Pets Count:</strong> {data[0].current_pets_count}</Text>
                        </Col>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Previous Pet Experience:</strong> {data[0].previous_pet_experience}</Text>
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Living Condition:</strong> {data[0].living_condition}</Text>
                        </Col>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Landlord Requirement:</strong> {data[0].landlord_requirement}</Text>
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Lifestyle:</strong> {data[0].lifestyle}</Text>
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
                            <Text><strong>Status:</strong> {data[0].status}</Text>
                        </Col>
                    </Row>

                </Card>
            </div>
        </div>
        //   </Content>
        // </div>
    );
};

export default ViewMoreApplication;
