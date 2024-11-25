import React, { useState, useEffect } from 'react';
import { Layout, Button, Form, Input, InputNumber, Select, DatePicker, Typography, Row, Col, message} from 'antd';
import axios from 'axios';

function ApplyAdoption() {
    const { TextArea } = Input;
    const { Title } = Typography;
    const { Content } = Layout;
    const [formData, setFormData] = useState({
        applicant_name: '',
        applicant_age: 0,
        phone_number: '',
        current_pets_count: 0,
        previous_pet_experience: 'Yes',
        //application_date: null,
        //status: 'Pending',
    });

    // useEffect(() => {
    //     const currentDate = new Date().toISOString().split('T')[0];
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         application_date: currentDate,
    //         status: 'Pending',
    //     }));
    // }, []);

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

    // const handleDateChange = (date, dateString) => {
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         application_date: dateString,
    //     }));
    // };

    const onFinish = async () => {
        // const requestData = {
        //     adoption_post_id: 1, // Example: This should be dynamically set based on context
        //     user_id: 1,         // Example: Replace with the logged-in user's ID
        //     ...formData,
        // };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/apply-adoption', formData);
            message.success('Adoption application submitted successfully!');
            console.log('Response:', response.data);
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
                                    <InputNumber name="applicant_age" value={formData.applicant_age} onChange={(value) => handleSelectChange(value, 'applicant_age')} placeholder="Enter your age" style={{ width: '100%' }} />
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
                                    <InputNumber name="current_pets_count" value={formData.current_pets_count} onChange={(value) => handleSelectChange(value, 'current_pets_count')} placeholder="Enter current pets count" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Previous Pet Experience" name="previous_pet_experience" rules={[{ required: true, message: 'Please select your experience!' }]}>                            
                            <TextArea name="previous_pet_experience" value={formData.previous_pet_experience} onChange={handleChange} rows={5} placeholder="Describe your experience with your current and previous pets"/>
                        </Form.Item>

                        {/* <Form.Item label="Application Date" name="application_date" rules={[{ required: true, message: 'Please select the application date!' }]}>                            
                            <DatePicker onChange={handleDateChange} style={{ width: '100%' }} value={formData.application_date ? moment(formData.application_date) : null} />
                        </Form.Item> */}

                        {/* <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select the status of your application!' }]}>                            
                            <Select name="status" value={formData.status} onChange={(value) => handleSelectChange(value, 'status')} placeholder="Select application status">
                                <Select.Option value="Pending">Pending</Select.Option>
                                <Select.Option value="Approved">Approved</Select.Option>
                                <Select.Option value="Rejected">Rejected</Select.Option>
                            </Select>
                        </Form.Item> */}

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
