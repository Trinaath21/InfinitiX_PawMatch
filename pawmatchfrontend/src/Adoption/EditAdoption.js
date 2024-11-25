import React, { useEffect, useState } from 'react';
import { Layout, Button, Form, Input, InputNumber, Select, Radio, Upload, message, Typography, Row, Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import FooterBar from '../General Components/FooterBar.js';
import Sidebar from '../General Components/SideBar.js';

const { Option } = Select;

const EditAdoption = ({ postId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null); // Store the selected file
    const { Title } = Typography;
    const { Content, Footer, Sider } = Layout;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    // const [fileList, setFileList] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [initialImage, setInitialImage] = useState(null);
    const [initialAge, setInitialAge] = useState({ value: null, suffix: 'years' });
    const [initialSpayedNeuteredStatus, setInitialSpayedNeuteredStatus] = useState('');


    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        // Fetch existing adoption post data to put into form
        console.log("Fetching data for postId:", postId);
        axios.get(`http://localhost:8000/api/adoption-posts/${postId}`)
            .then(response => {
                const data = response.data;
                form.setFieldsValue(response.data);
                //setFormData({ gender: data.gender, vaccinationStatus: data.vaccinationStatus, spayedNeuteredStatus: data.spayedNeuteredStatus });
                if (data.age) {
                    const [value, suffix] = data.age.split(' ');
                    setInitialAge({ value: parseInt(value), suffix });
                }

                form.setFieldsValue({
                    ageValue: data.age ? parseInt(data.age.split(' ')[0]) : undefined,
                    ageSuffix: data.age ? data.age.split(' ')[1] : undefined,
                });

                if (data.spayedNeuteredStatus) {
                    setInitialSpayedNeuteredStatus(data.spayedNeuteredStatus);
                }

                if (response.data.petImage) {
                    setFileList([{
                        uid: '-1',
                        name: 'petImage',
                        status: 'done',
                        url: response.data.petImage, // base64 image from backend
                    }]);
                    setInitialImage(response.data.petImage); // Store base64 image
                }
                console.log("check image", response.data.petImage);
            })
            .catch(error => {
                message.error('Failed to load adoption post data');
            });
    }, [postId]);

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList); // Update fileList state
    };

    // const handleSelectChange = (value, name) => {
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // };

    const gender = Form.useWatch('gender', form); // Monitor gender field

    // Dynamically update the label and options for spayedNeuteredStatus based on gender
    const spayedNeuteredOptions = gender === 'Female'
        ? ['Spayed', 'Not Spayed']
        : ['Neutered', 'Not Neutered'];

    const spayedNeuteredLabel = gender === 'Female'
        ? 'Spay Status'
        : 'Neuter Status';

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

    const onFinish = (values) => {
        console.log("Form Values on Submit:", values);
        setLoading(true);
        const formData = new FormData();

        console.log('Form values before appending to formData:', values);

        // Append form values to FormData
        Object.keys(values).forEach(key => {
            if (key !== 'petImage') {
                formData.append(key, values[key] || ''); // Default to empty string if value is null/undefined
            }
        });

        const combinedAge = `${values.ageValue} ${values.ageSuffix}`;
        formData.append('age', combinedAge);

        if (fileList[0].originFileObj && fileList[0].originFileObj instanceof File) {
            // If a new file is uploaded, append the File object directly
            formData.append('petImage', fileList[0].originFileObj);
        } else if (values.petImage && typeof values.petImage === 'string') {
            // If the existing image is a base64 string, convert it to Blob
            const byteString = atob(values.petImage.split(',')[1]); // Decode base64
            const mimeString = values.petImage.split(',')[0].split(':')[1].split(';')[0]; // Extract MIME type
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            formData.append('petImage', blob, 'existing_image.jpg'); // Provide a filename
        }


        // if (fileList[0]) {
        //     formData.append('petImage', fileList[0].originFileObj);
        //     console.log("hi and bye", fileList[0].originFileObj);
        // }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Send the FormData to the backend
        axios.post(`http://localhost:8000/api/adoption-posts/${postId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                message.success('Adoption post updated successfully!');
                setLoading(false);
            })
            .catch(error => {
                if (error.response && error.response.status === 422) {
                    console.log("Validation Errors:", error.response.data.errors); // Log validation errors
                    message.error('Validation failed. Please check your input.');
                } else {
                    message.error('Failed to update adoption post');
                }
            });
    };

    return (
        <Layout style={{ minHeight: '100vh', overflow: 'hidden'}}>
            <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} />
            <Layout>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ width: '100%', maxWidth: '1200px', padding: '20px', background: '#fff', borderRadius: '8px', margin: 'auto' }}>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: '2em' }}>Edit Adoption Post</Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name of your pet!' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="species" label="Species" rules={[{ required: true, message: 'Please select the species of your pet!' }]}>
                                        <Select>
                                            <Option value="Dog">Dog</Option>
                                            <Option value="Cat">Cat</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="breed" label="Breed">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="age" label="Age" rules={[{ required: true, message: 'Please input your pet\'s breed!' }]}>
                                        <Input.Group compact>
                                            <Form.Item
                                                name="ageValue"
                                                noStyle
                                                rules={[{ required: true, message: 'Please input your pet\'s age!' }]}
                                                initialValue={initialAge.value}
                                            >
                                                <InputNumber min={0} style={{ width: '70%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name="ageSuffix"
                                                noStyle
                                                initialValue={initialAge.suffix}
                                            >
                                                <Select style={{ width: '30%' }}>
                                                    <Option value="months">Months</Option>
                                                    <Option value="years">Years</Option>
                                                </Select>
                                            </Form.Item>
                                        </Input.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select the gender of your pet!' }]}>
                                        <Select>
                                            <Option value="Male">Male</Option>
                                            <Option value="Female">Female</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="size" label="Size" rules={[{ required: true, message: 'Please input the size of your pet!' }]}>
                                        <Radio.Group>
                                            <Radio value="Small">Small</Radio>
                                            <Radio value="Medium">Medium</Radio>
                                            <Radio value="Large">Large</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="weight" label="Weight" rules={[{ required: true, message: 'Please input your pet\'s weight!' }]}>
                                        <InputNumber min={0} max={100} step={0.1} addonAfter="Kg" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="vaccination_status" label="Vaccination Status" rules={[{ required: true, message: 'Please select the vaccination status of your pet!' }]}>
                                        <Select>
                                            <Select.Option value="Vaccinated">Vaccinated</Select.Option>
                                            <Select.Option value="Not Vaccinated">Not Vaccinated</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="behavioral_traits" label="Behavioral Traits" rules={[{ required: true, message: 'Please input your pet\'s behavioral traits!' }]}>
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label={spayedNeuteredLabel}
                                        name="spayed_neutered_status"
                                        initialValue={initialSpayedNeuteredStatus}
                                        rules={[{ required: true, message: 'Please select the neuter/spay status of your pet!' }]}
                                    >
                                        <Select>
                                            {spayedNeuteredOptions.map(option => (
                                                <Option key={option} value={option}>{option}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="adoption_fee" label="Adoption Fee">
                                        <InputNumber min={0} max={10000} step={0.01} addonBefore="RM" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="health_issues" label="Health Issues" rules={[{ required: true, message: 'Please input your pet\'s health issues! (State none if no health issues)' }]}>
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item name="current_location" label="Current Location" rules={[{ required: true, message: 'Please input the current location of your pet!' }]}>
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="status" label="Status">
                                        <Radio.Group>
                                            <Radio value="available">Available</Radio>
                                            <Radio value="adopted">Adopted</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="petImage" label="Pet Image" rules={[{ required: true, message: 'Please upload an image of your pet!' }]}>
                                        <Upload
                                            listType="picture-card"
                                            maxCount={1}
                                            fileList={fileList}
                                            beforeUpload={(file) => {
                                                setFile([file]);
                                                return false;
                                            }}
                                            onChange={handleChange}
                                            onPreview={handlePreview}
                                            accept="image/*"
                                        >
                                            {fileList.length < 1 && (
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 0 }}>Upload New Image</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
                <FooterBar />
            </Layout>
            <Modal
                visible={previewVisible}
                title="Pet Image Preview"
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="Pet Image" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Layout>
    );

}

export default EditAdoption;

