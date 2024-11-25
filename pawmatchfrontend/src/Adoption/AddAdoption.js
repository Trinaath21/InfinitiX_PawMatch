import React, { useState } from 'react';
import { Layout, Button, Form, Input, InputNumber, Select, Radio, Upload, Typography, Row, Col, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import FooterBar from '../General Components/FooterBar.js';
import Sidebar from '../General Components/SideBar.js';

function AddAdoption() {
    const { TextArea } = Input;
    const { Title } = Typography;
    const { Content, Footer, Sider } = Layout;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

    const [formData, setFormData] = useState({
        name: '',
        species: 'Dog',
        breed: '',
        age: 0,
        ageUnit: 'Months', // for suffixSelectorAge
        gender: 'Male',
        size: 'Small',
        weight: 0,
        behavioralTraits: '',
        vaccinationStatus: 'Vaccinated',
        spayedNeuteredStatus: 'Neutered',
        healthIssues: 'None',
        currentLocation: '',
        adoptionFee: 0,
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEventChange = (event, field) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
    };

    const handleSelectChange = (value, name) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = async ({ fileList: newFileList }) => {
        setFileList(newFileList);

        if (newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            // console.log("check 1", file);
            // const base64 = await convertToBase64(file);
            // console.log("check 2", base64);
            setFormData((prevData) => ({
                ...prevData,
                petImage: file,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                petImage: null,
            }));
        }
    };

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
    // const convertToBase64 = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result);
    //         reader.onerror = (error) => reject(error);
    //     });
    // };
    const onFinish = async () => {
        const combinedAge = `${formData.age} ${formData.ageUnit}`;
        const requestData = new FormData();
        requestData.append('name', formData.name);
        requestData.append('species', formData.species);
        requestData.append('breed', formData.breed);
        requestData.append('age', combinedAge);
        requestData.append('gender', formData.gender);
        requestData.append('size', formData.size);
        requestData.append('weight', formData.weight);
        requestData.append('vaccinationStatus', formData.vaccinationStatus);
        requestData.append('spayedNeuteredStatus', formData.spayedNeuteredStatus);
        requestData.append('healthIssues', formData.healthIssues);
        requestData.append('behavioralTraits', formData.behavioralTraits);
        requestData.append('currentLocation', formData.currentLocation);
        requestData.append('adoptionFee', formData.adoptionFee);
        requestData.append('status', 'available');
        requestData.append('isFromShelter', 'no');
        requestData.append('id', 21); // Add id or any other needed fields

        // Attach the image file

        // console.log("kjkj", formData.image)
        // if (formData.image) {
        //     requestData.append('petImage', formData.image); // Use `originFileObj` for raw file
        // } else {
        //     console.error("Image not available or originFileObj not set");
        // }

        if (fileList[0]) {
            requestData.append('petImage', fileList[0].originFileObj);
            console.log("hi and bye", fileList[0].originFileObj);
        }

        for (let pair of requestData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const response = await axios.post('http://localhost:8000/api/adoption-posts', requestData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            message.success('Adoption post created successfully!');
            console.log('Response:', response.data);
        } catch (error) {
            message.error('Failed to create adoption post');
            console.error('Error:', error);
        }
    };


return (
            <div>
            <Content style={{ margin: '24px 16px 0' }}>
                <div style={{ width: '100%', maxWidth: '1200px', padding: '20px', background: '#fff', borderRadius: '8px', margin: 'auto' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '2em' }}>Add New Adoption Post</Title>
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        {/* Row 1: Name & Species */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name of your pet!' }]}>
                                    <Input placeholder="State the name of your pet" name="name" value={formData.name} onChange={handleChange} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Species" name="species" rules={[{ required: true, message: 'Please select the species of your pet!' }]}>
                                    <Select placeholder="Select the species of your pet" value={formData.species} onChange={(value) => handleSelectChange(value, 'species')}>
                                        <Select.Option value="Dog">Dog</Select.Option>
                                        <Select.Option value="Cat">Cat</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Row 2: Breed & Age */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Breed" name="breed" rules={[{ required: true, message: 'Please input your pet\'s breed!' }]}>
                                    <Input placeholder="State the breed of your pet" name="breed" value={formData.breed} onChange={handleChange} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Age" name="age" rules={[{ required: true, message: 'Please input your pet\'s age!' }]}>
                                    <InputNumber
                                        value={formData.age}
                                        onChange={(value) => handleSelectChange(value, 'age')}
                                        addonAfter={
                                            <Select value={formData.ageUnit} onChange={(value) => handleSelectChange(value, 'ageUnit')}>
                                                <Select.Option value="Months">Months</Select.Option>
                                                <Select.Option value="Years">Years</Select.Option>
                                            </Select>
                                        }
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Row 3: Gender & Size */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select the gender of your pet!' }]}>
                                    <Select placeholder="Select the gender of your pet" value={formData.gender} onChange={(value) => handleSelectChange(value, 'gender')}>
                                        <Select.Option value="Male">Male</Select.Option>
                                        <Select.Option value="Female">Female</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please input the size of your pet!' }]}>
                                    <Radio.Group value={formData.size} onChange={(event) => handleEventChange(event, 'size')}>
                                        <Radio name="size" value="Small">Small</Radio>
                                        <Radio name="size" value="Medium">Medium</Radio>
                                        <Radio name="size" value="Large">Large</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Row 4: Weight & Vaccination Status */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Weight" name="weight" rules={[{ required: true, message: 'Please input your pet\'s weight!' }]}>
                                    <InputNumber value={formData.weight} onChange={(value) => handleSelectChange(value, 'weight')} addonAfter="Kg" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Vaccination Status" name="vaccinationStatus" rules={[{ required: true, message: 'Please select the vaccination status of your pet!' }]}>
                                    <Select placeholder="Select the vaccination status of your pet" value={formData.vaccinationStatus} onChange={(value) => handleSelectChange(value, 'vaccinationStatus')}>
                                        <Select.Option value="Vaccinated">Vaccinated</Select.Option>
                                        <Select.Option value="NotVaccinated">Not Vaccinated</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Single Row Fields */}
                        <Form.Item label="Behavioral Traits" name="behavioralTraits" rules={[{ required: true, message: 'Please input your pet\'s behavioral traits!' }]}>
                            <TextArea name="behavioralTraits" value={formData.behavioralTraits} onChange={handleChange} rows={3} placeholder="e.g: Playful, Protective, Shy, Aggressive" />
                        </Form.Item>

                        <Form.Item label="Health Issues" name="healthIssues" rules={[{ required: true, message: 'Please input your pet\'s health issues! (State none if no health issues)' }]}>
                            <TextArea name="healthIssues" value={formData.healthIssues} onChange={handleChange} rows={3} placeholder="State the health issues of your pet (State none if not applicable)" />
                        </Form.Item>

                        <Form.Item label="Current Location (Address)" name="currentLocation" rules={[{ required: true, message: 'Please input the current location of your pet!' }]}>
                            <TextArea name="currentLocation" value={formData.currentLocation} onChange={handleChange} rows={3} placeholder="State the address of the current location of your pet" />
                        </Form.Item>

                        {/* Upload Image and Submit */}
                        <Form.Item required label="Upload Image" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Please upload an image of your pet!' }]}>
                            <Upload name="petImage" listType="picture-card" fileList={fileList} maxCount={1} accept="image/*" onChange={handleFileChange} onPreview={handlePreview} beforeUpload={() => false}>
                                {fileList.length < 1 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload Image of your pet (only 1)</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 11, span: 15 }}>
                            <Button type="primary" htmlType="submit" style={{ minWidth: 100 }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        <Modal
                visible={previewVisible}
                title="Pet Image Preview"
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="Pet Image" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            </div>
);

}

export default AddAdoption;



