import React, { useState, useEffect } from 'react';
import { Layout, Button, Form, Input, InputNumber, Select, Typography, Row, Col, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ApplyAdoption() {
    const { TextArea } = Input;
    const { Title } = Typography;
    const { Content } = Layout;
    const location = useLocation();
    const navigate = useNavigate();
    const userID = 21; // Replace with actual user ID logic
    const postID = location.state?.adoption_post_id;

    const [formData, setFormData] = useState({
        applicant_name: '',
        applicant_age: 0,
        phone_number: '',
        current_pets_count: 0,
        previous_pet_experience: 'None',
        detailed_address: '',
        district: '',
        state: '',
        living_condition: '',
        landlord_requirement: '',
        lifestyle: '',
        user_id: userID,
        adoption_post_id: postID,
    });

    useEffect(() => {
        // Fetch user address details
        const fetchUserAddress = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/member-address?id=${userID}`);
                const { detailed_address, district, state } = response.data;
                setFormData((prevData) => ({
                    ...prevData,
                    detailed_address,
                    district,
                    state,
                }));
            } catch (error) {
                console.error('Error fetching user address:', error);
                message.error('Failed to fetch user address');
            }
        };

        fetchUserAddress();
    }, [userID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (value, name) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onFinish = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/apply-adoption', formData);
            message.success('Adoption application submitted successfully!');
            console.log('Response:', response.data);
            navigate('/ViewPublicListing');
        } catch (error) {
            message.error('Failed to submit adoption application');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Content style={{ margin: '24px 16px 0' }}>
                <div style={{ width: '100%', maxWidth: '800px', padding: '20px', background: '#fff', borderRadius: '8px', margin: 'auto' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '2em' }}>Apply for Adoption</Title>
                    <Form
                        name="applyForAdoption"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Applicant Name" name="applicant_name" rules={[{ required: true, message: 'Please input your name!' }]}>
                                    <Input name="applicant_name" value={formData.applicant_name} onChange={handleChange} placeholder="Enter your full name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Applicant Age" name="applicant_age" rules={[{ required: true, message: 'Please input your age!' }]}>
                                    <InputNumber name="applicant_age" value={formData.applicant_age} min={1} onChange={(value) => handleSelectChange(value, 'applicant_age')} placeholder="Enter your age" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Phone Number" name="phone_number" rules={[{ required: true, message: 'Please input your phone number!' }]}>
                                    <Input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Enter your phone number" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Current Pets Count" name="current_pets_count" rules={[{ required: true, message: 'Please input your current pets count!' }]}>
                                    <InputNumber name="current_pets_count" value={formData.current_pets_count} min={0} onChange={(value) => handleSelectChange(value, 'current_pets_count')} placeholder="Enter current pets count (0 if none)" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Pet Experience" name="previous_pet_experience" rules={[{ required: true, message: 'Please describe your experience!' }]}>
                            <TextArea name="previous_pet_experience" value={formData.previous_pet_experience} onChange={handleChange} rows={3} placeholder="Describe your experience with your current and previous pets (Enter None if not applicable)" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Detailed Address">
                                    <Input value={formData.detailed_address} readOnly />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="District">
                                    <Input value={formData.district} readOnly />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="State">
                                    <Input value={formData.state} readOnly />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Living Condition" name="living_condition" rules={[{ required: true, message: 'Please describe your living condition!' }]}>
                                    <TextArea name="living_condition" value={formData.living_condition} onChange={handleChange} rows={3} placeholder="Describe your living condition (e.g., landed house, apartment)" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Landlord Requirement" name="landlord_requirement">
                                    <TextArea name="landlord_requirement" value={formData.landlord_requirement} onChange={handleChange} rows={3} placeholder="Specify landlord requirements regarding pets (if any)" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Lifestyle" name="lifestyle" rules={[{ required: true, message: 'Please describe your lifestyle!' }]}>
                                    <TextArea name="lifestyle" value={formData.lifestyle} onChange={handleChange} rows={3} placeholder="Describe your lifestyle and current commitments" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                            <Button type="primary" htmlType="submit" style={{ minWidth: 100 }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </div>
    );
}

export default ApplyAdoption;
