import React, { useState } from 'react';
import { Layout, Button, Form, Input, InputNumber, Select, Radio, Upload, Typography, Row, Col, Modal, message, Cascader } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

function AddAdoption() {
    const { TextArea } = Input;
    const { Title } = Typography;
    const { Content, Footer, Sider } = Layout;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    // const [isByShelter, setIsByShelter] = useState(false);
    // const [id, setId] = useState(0);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    //const id = 0;
    // if (role === "shelter"){
    //     setIsByShelter(true);
    //     setId(parseInt(localStorage.getItem('shelter_id'), 10));
    // }
    // else{
    //     setIsByShelter(false);
    //     setId(parseInt(localStorage.getItem('user_id'), 10));
    // }
    const id = role === 'member' ? parseInt(localStorage.getItem('user_id'), 10) : parseInt(localStorage.getItem('shelter_id'), 10);
    const isByShelter = role === 'member' ? 0 : 1;
    // const { id } = useParams(); // Extract `id` from the URL (set up routing to include this)
    // const id = id || 1;

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
        state_district: '',
        currentLocation: '',
        extra_info: '',
        adoptionFee: 0,
        isFromShelter: isByShelter,
        image: null,
        id: id,
    });

    const stateDistrictData = [
        {
            value: "Johor",
            label: "Johor",
            children: [
                { value: "Johor Bahru", label: "Johor Bahru" },
                { value: "Batu Pahat", label: "Batu Pahat" },
                { value: "Kluang", label: "Kluang" },
                { value: "Muar", label: "Muar" },
                { value: "Kulai", label: "Kulai" },
                { value: "Mersing", label: "Mersing" },
                { value: "Pontian", label: "Pontian" },
                { value: "Segamat", label: "Segamat" },
                { value: "Tangkak", label: "Tangkak" },
                { value: "Kota Tinggi", label: "Kota Tinggi" },
            ],
        },
        {
            value: "Kedah",
            label: "Kedah",
            children: [
                { value: "Alor Setar", label: "Alor Setar" },
                { value: "Sungai Petani", label: "Sungai Petani" },
                { value: "Kulim", label: "Kulim" },
                { value: "Baling", label: "Baling" },
                { value: "Kubang Pasu", label: "Kubang Pasu" },
                { value: "Pendang", label: "Pendang" },
                { value: "Langkawi", label: "Langkawi" },
                { value: "Yan", label: "Yan" },
            ],
        },
        {
            value: "Kelantan",
            label: "Kelantan",
            children: [
                { value: "Kota Bharu", label: "Kota Bharu" },
                { value: "Pasir Mas", label: "Pasir Mas" },
                { value: "Tumpat", label: "Tumpat" },
                { value: "Machang", label: "Machang" },
                { value: "Pasir Puteh", label: "Pasir Puteh" },
                { value: "Bachok", label: "Bachok" },
                { value: "Gua Musang", label: "Gua Musang" },
                { value: "Jeli", label: "Jeli" },
            ],
        },
        {
            value: "Melaka",
            label: "Melaka",
            children: [
                { value: "Central Melaka", label: "Central Melaka" },
                { value: "Alor Gajah", label: "Alor Gajah" },
                { value: "Jasin", label: "Jasin" },
            ],
        },
        {
            value: "Negeri Sembilan",
            label: "Negeri Sembilan",
            children: [
                { value: "Seremban", label: "Seremban" },
                { value: "Port Dickson", label: "Port Dickson" },
                { value: "Jempol", label: "Jempol" },
                { value: "Kuala Pilah", label: "Kuala Pilah" },
                { value: "Rembau", label: "Rembau" },
                { value: "Tampin", label: "Tampin" },
            ],
        },
        {
            value: "Pahang",
            label: "Pahang",
            children: [
                { value: "Kuantan", label: "Kuantan" },
                { value: "Bentong", label: "Bentong" },
                { value: "Temerloh", label: "Temerloh" },
                { value: "Raub", label: "Raub" },
                { value: "Pekan", label: "Pekan" },
                { value: "Lipis", label: "Lipis" },
                { value: "Jerantut", label: "Jerantut" },
                { value: "Maran", label: "Maran" },
            ],
        },
        {
            value: "Penang",
            label: "Penang",
            children: [
                { value: "George Town", label: "George Town" },
                { value: "Bukit Mertajam", label: "Bukit Mertajam" },
                { value: "Bayan Lepas", label: "Bayan Lepas" },
                { value: "Butterworth", label: "Butterworth" },
                { value: "Nibong Tebal", label: "Nibong Tebal" },
            ],
        },
        {
            value: "Perak",
            label: "Perak",
            children: [
                { value: "Ipoh", label: "Ipoh" },
                { value: "Taiping", label: "Taiping" },
                { value: "Manjung", label: "Manjung" },
                { value: "Kuala Kangsar", label: "Kuala Kangsar" },
                { value: "Teluk Intan", label: "Teluk Intan" },
                { value: "Bagan Datuk", label: "Bagan Datuk" },
                { value: "Batu Gajah", label: "Batu Gajah" },
            ],
        },
        {
            value: "Sabah",
            label: "Sabah",
            children: [
                { value: "Kota Kinabalu", label: "Kota Kinabalu" },
                { value: "Sandakan", label: "Sandakan" },
                { value: "Tawau", label: "Tawau" },
                { value: "Lahad Datu", label: "Lahad Datu" },
                { value: "Keningau", label: "Keningau" },
                { value: "Ranau", label: "Ranau" },
            ],
        },
        {
            value: "Sarawak",
            label: "Sarawak",
            children: [
                { value: "Kuching", label: "Kuching" },
                { value: "Sibu", label: "Sibu" },
                { value: "Miri", label: "Miri" },
                { value: "Bintulu", label: "Bintulu" },
                { value: "Limbang", label: "Limbang" },
                { value: "Sarikei", label: "Sarikei" },
            ],
        },
        {
            value: "Selangor",
            label: "Selangor",
            children: [
                { value: "Shah Alam", label: "Shah Alam" },
                { value: "Petaling Jaya", label: "Petaling Jaya" },
                { value: "Klang", label: "Klang" },
                { value: "Gombak", label: "Gombak" },
                { value: "Sepang", label: "Sepang" },
                { value: "Hulu Langat", label: "Hulu Langat" },
            ],
        },
        {
            value: "Terengganu",
            label: "Terengganu",
            children: [
                { value: "Kuala Terengganu", label: "Kuala Terengganu" },
                { value: "Kemaman", label: "Kemaman" },
                { value: "Dungun", label: "Dungun" },
                { value: "Besut", label: "Besut" },
                { value: "Hulu Terengganu", label: "Hulu Terengganu" },
            ],
        },
        {
            value: "Kuala Lumpur",
            label: "Kuala Lumpur",
            children: [{ value: "City Center", label: "City Center" }],
        },
        {
            value: "Putrajaya",
            label: "Putrajaya",
            children: [{ value: "Federal Territory", label: "Federal Territory" }],
        },
        {
            value: "Labuan",
            label: "Labuan",
            children: [{ value: "Federal Territory", label: "Federal Territory" }],
        },
    ];

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
        const [state, district] = formData.state_district || [];
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
        requestData.append('district', district);
        requestData.append('state', state);
        requestData.append('extra_info', formData.extra_info);
        requestData.append('adoptionFee', formData.adoptionFee);
        requestData.append('status', 'available');
        requestData.append('isFromShelter', formData.isFromShelter);
        //const id = localStorage.getItem('userId') || 21; // Fallback to 21 if no user ID is found
        //requestData.append('id', id);
        requestData.append('id', formData.id);

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
            const response = await axios.post('http://localhost:8000/api/add-adoption-posts', requestData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200 || response.status === 201) {
                navigate(`/viewPersonalListing`); // No userId in the URL
                message.success('Adoption post created successfully!');
                console.log('Response:', response.data);
            }

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
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name of your pet!' }]}>
                                    <Input placeholder="State the name of your pet" name="name" value={formData.name} onChange={handleChange} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Species" name="species" rules={[{ required: true, message: 'Please select the species of your pet!' }]}>
                                    <Select placeholder="Select the species of your pet" value={formData.species} onChange={(value) => handleSelectChange(value, 'species')}>
                                        <Select.Option value="Dog">Dog</Select.Option>
                                        <Select.Option value="Cat">Cat</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item label="Breed" name="breed" rules={[{ required: true, message: 'Please input your pet\'s breed!' }]}>
                                    <Input placeholder="State the breed of your pet" name="breed" value={formData.breed} onChange={handleChange} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Age" name="age" rules={[{ required: true, message: 'Please input your pet\'s age!' }]}>
                                    <InputNumber
                                        placeholder="State the age of your pet"
                                        value={formData.age}
                                        min={1}
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

                            <Col xs={24} sm={12}>
                                <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select the gender of your pet!' }]}>
                                    <Select placeholder="Select the gender of your pet" value={formData.gender} onChange={(value) => handleSelectChange(value, 'gender')}>
                                        <Select.Option value="Male">Male</Select.Option>
                                        <Select.Option value="Female">Female</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please input the size of your pet!' }]}>
                                    <Radio.Group value={formData.size} onChange={(event) => handleEventChange(event, 'size')}>
                                        <Radio name="size" value="Small">Small</Radio>
                                        <Radio name="size" value="Medium">Medium</Radio>
                                        <Radio name="size" value="Large">Large</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item label="Weight" name="weight" rules={[{ required: true, message: 'Please input your pet\'s weight!' }]}>
                                    <InputNumber placeholder="State the weight of your pet" value={formData.weight} min={0.01} onChange={(value) => handleSelectChange(value, 'weight')} addonAfter="Kg" step={0.01} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label={formData.gender === 'Male' ? 'Neuter Status' : 'Spay Status'}
                                    name="spayedNeuteredStatus"
                                    rules={[{ required: true, message: 'Please select the neuter/spay status of your pet!' }]}
                                >
                                    <Select
                                        value={formData.spayedNeuteredStatus}
                                        onChange={(value) => handleSelectChange(value, 'spayedNeuteredStatus')}
                                        placeholder={formData.gender === 'Male' ? 'Select Neuter Status' : 'Select Spay Status'}
                                    >
                                        {formData.gender === 'Male' ? (
                                            <>
                                                <Select.Option value="Neutered">Neutered</Select.Option>
                                                <Select.Option value="Not Neutered">Not Neutered</Select.Option>
                                            </>
                                        ) : (
                                            <>
                                                <Select.Option value="Spayed">Spayed</Select.Option>
                                                <Select.Option value="Not Spayed">Not Spayed</Select.Option>
                                            </>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>


                            <Col xs={24} sm={12}>
                                <Form.Item label="Vaccination Status" name="vaccinationStatus" rules={[{ required: true, message: 'Please select the vaccination status of your pet!' }]}>
                                    <Select placeholder="Select the vaccination status of your pet" value={formData.vaccinationStatus} onChange={(value) => handleSelectChange(value, 'vaccinationStatus')}>
                                        <Select.Option value="Vaccinated">Vaccinated</Select.Option>
                                        <Select.Option value="NotVaccinated">Not Vaccinated</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item label="Adoption Fee (if any)" name="adoptionFee">
                                    <InputNumber placeholder="State the adoption fee (if any)" value={formData.adoptionFee} onChange={(value) => handleSelectChange(value, 'adoptionFee')} addonBefore="RM" min={0} step={0.01} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item label="Behavioral Traits" name="behavioralTraits" rules={[{ required: true, message: 'Please input your pet\'s behavioral traits!' }]}>
                                    <TextArea name="behavioralTraits" value={formData.behavioralTraits} onChange={handleChange} rows={3} placeholder="e.g: Playful, Protective, Shy, Aggressive" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item label="Health Issues" name="healthIssues" rules={[{ required: true, message: 'Please input your pet\'s health issues! (State none if no health issues)' }]}>
                                    <TextArea name="healthIssues" value={formData.healthIssues} onChange={handleChange} rows={3} placeholder="State the health issues of your pet (State none if not applicable)" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    name="state_district"
                                    label="State and District"
                                    rules={[
                                        {
                                            type: "array",
                                            required: true,
                                            message: "Please select your state and district!",
                                        },
                                    ]}
                                >
                                    <Cascader
                                        value={formData.state_district}
                                        options={stateDistrictData}
                                        onChange={(value) => setFormData((prevData) => ({ ...prevData, state_district: value }))}
                                        placeholder="Please select"
                                    />

                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item label="Current Location (Address)" name="currentLocation" rules={[{ required: true, message: 'Please input the current location of your pet!' }]}>
                                    <TextArea name="currentLocation" value={formData.currentLocation} onChange={handleChange} rows={3} placeholder="State the address of the current location of your pet" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item label="Extra Information" name="extra_info" >
                                    <TextArea name="extra_info" value={formData.extra_info} onChange={handleChange} rows={3} placeholder="Please enter any extra information regarding your pet (Appointments, Extra care requirements, etc." />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Upload Image"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    rules={[{ required: true, message: 'Please upload an image of your pet!' }]}
                                >
                                    <Upload
                                        name="petImage"
                                        listType="picture-card"
                                        fileList={fileList}
                                        maxCount={1}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        beforeUpload={() => false}
                                    >
                                        {fileList.length < 1 && (
                                            <div>
                                                <PlusOutlined />
                                                <div style={{ marginTop: 8 }}>Upload Image of your pet (only 1)</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ minWidth: 100 }}>
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
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



