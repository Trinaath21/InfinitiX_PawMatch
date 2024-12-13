import React, { useState, useEffect,useRef,useMemo,useCallback } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Upload, InputNumber,Row, Col } from 'antd';
import 'leaflet/dist/leaflet.css';
import { UploadOutlined } from '@ant-design/icons';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import axios from 'axios';
import { message } from 'antd'; 

const { Option } = Select;

const EditReport = ({ visible, onClose, reportData, refreshTableData }) => {
    const [location, setLocation] = useState({ lat: 3.139, lng: 101.6869 }); // Default to Kuala Lumpur coordinates
    const [loading, setLoading] = useState(false);
    const [imageFileList, setImageFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const fetchCoordinates = async (address) => {
        console.log("address", address);    
        try {
            setLoading(true);
                console.log("val",reportData.lat, reportData.lng);
                setLocation({ lat: parseFloat(reportData.lat), lng: parseFloat(reportData.lng) });
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reportData) {
            formik.setValues({
                pet_name: reportData.pet_name,
                species: reportData.species,
                lat: reportData.lat,
                lng: reportData.lng,
                breed: reportData.breed,
                color: reportData.color,
                age: reportData.age,
                size: reportData.size,
                description: reportData.description,
                dateLost: reportData.dateLost ? moment(reportData.dateLost) : null,
            });
            fetchCoordinates(reportData.last_seen_location).then(coords => {
                console.log("coords",coords);
                console.log("Coordinates fetched:", location);
                console.log(reportData.lat, reportData.lng);
                if (location) {
                    setLocation({ lat: parseFloat(reportData.lat), lng: parseFloat(reportData.lng) });
                }
            });

            if (reportData.image) {
                setImageFileList([
                    {
                        uid: '-1',
                        name: 'current-image.png',
                        status: 'done',
                        url: `data:image/png;base64,${reportData.image}`,
                    },
                ]);
            }
        }
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 1000);
    }, [reportData]);

    async function fetchAddressFromCoordinates(lat, lng) {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        if (!response.ok) {
            throw new Error('Error fetching address');
        }
        const data = await response.json();
        
        const addressComponents = data.address || {};
        const district = addressComponents.district || addressComponents.suburb || addressComponents.town; // Adjust as needed
        const state = addressComponents.state || addressComponents.region; // Adjust as needed
        
        return { 
            fullAddress: data.display_name, 
            district, 
            state,
            lat,
            lng
        };
    }

    const LocationPicker = ({ location, onLocationChange }) => {
        const markerRef = useRef(null);

        const eventHandlers = useMemo(() => ({
            dragend() {
                const marker = markerRef.current;
                if (marker) {
                    const newLatLng = marker.getLatLng();
                    onLocationChange({ lat: newLatLng.lat, lng: newLatLng.lng });
                    fetchAddressFromCoordinates(newLatLng.lat, newLatLng.lng).then(({ fullAddress, district, state, lat, lng }) => {
                        formik.setFieldValue('location', fullAddress);
                        formik.setFieldValue('district', district);
                        formik.setFieldValue('state', state);
                        formik.setFieldValue('lat', lat);
                        formik.setFieldValue('lng', lng);
                    });
                }
            },
        }), [onLocationChange]);

        function LocationMarker() {
            useMapEvents({
                click(e) {
                    onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
                },
            });

            return location ? (
                <Marker
                    draggable
                    eventHandlers={eventHandlers}
                    position={location}
                    ref={markerRef}
                >
                    <Popup minWidth={90}>
                        <span>Drag to update location</span>
                    </Popup>
                </Marker>
            ) : null;
        }

        return (
            <MapContainer center={location} zoom={13} scrollWheelZoom={false} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
            </MapContainer>
        );
    };
    const validationSchema = Yup.object().shape({
        pet_name: Yup.string().required('Pet Name is required'),
        species: Yup.string().required('Species is required'),
        breed: Yup.string().required('Breed is required'),
        color: Yup.string().required('Color is required'),
        age: Yup.number().required('Age is required').positive('Age must be positive').integer('Age must be an integer'),
        size: Yup.string().required('Size is required'),
        description: Yup.string().required('Description is required'),
        dateLost: Yup.date().required('Date Lost is required'),
    });

    const formik = useFormik({
        initialValues: {
            pet_name: '',
            species: '',
            breed: '',
            color: '',
            age: '',
            size: '',
            description: '',
            dateLost: null,
            image: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                // Prepare the form data for submission
                const formData = new FormData();
                formData.append('id', reportData.report_id); // Assuming the ID is part of values
                formData.append('pet_name', values.pet_name);
                formData.append('species', values.species);
                formData.append('last_seen_location', values.location || reportData.last_seen_location);
                formData.append('lat', values.lat || reportData.lat);
                formData.append('lng', values.lng || reportData.lng);
                formData.append('breed', values.breed || '');
                formData.append('color', values.color || '');
                formData.append('age', values.age || '');
                formData.append('size', values.size || '');
                formData.append('description', values.description || '');
                formData.append('dateLost', values.dateLost ? values.dateLost.format('YYYY-MM-DD') : '');
        
                // Append the image file if it exists
                if (imageFileList[0]?.originFileObj) {
                    formData.append('image', imageFileList[0].originFileObj);
                }
        
                // Send the data to the backend
                const response = await axios.post('http://localhost:8000/api/editLostReport', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
        
                // Display success message and reset form
                if (response.status === 200) {
                    message.success('Report updated successfully!');
                    refreshTableData();
                    onClose(); // Close the modal
                    formik.resetForm();
                }
            } catch (error) {
                console.error('Error updating report:', error);
                message.error('Failed to update report. Please try again.');
            }
        },
    });
    const handleUploadChange = ({ fileList }) => {
        console.log("upload",fileList);
        setImageFileList(fileList);
    };
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleCancel = () => setPreviewVisible(false);

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    return (
        <>
        <Modal
            title="Edit Report"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width="50%"
        >

<Form layout="vertical" onFinish={formik.handleSubmit} style={{ maxWidth: '800px', margin: 'auto' }}>
    {/* Row for Pet Name and Color */}
    <Row gutter={16}>
        <Col xs={24} sm={12}>
            <Form.Item 
                required 
                label="Pet Name" 
                validateStatus={formik.touched.pet_name && formik.errors.pet_name ? 'error' : ''} 
                help={formik.touched.pet_name && formik.errors.pet_name}
            >
                <Input name="pet_name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pet_name} />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
            <Form.Item 
                required 
                label="Color" 
                validateStatus={formik.touched.color && formik.errors.color ? 'error' : ''} 
                help={formik.touched.color && formik.errors.color}
            >
                <Select 
                    name="color" 
                    onChange={(value) => formik.setFieldValue('color', value)} 
                    onBlur={formik.handleBlur} 
                    value={formik.values.color}
                    placeholder="Select Color"
                >
                    <Option value="black">Black</Option>
                    <Option value="white">White</Option>
                    {/* Other color options */}
                </Select>
            </Form.Item>
        </Col>
    </Row>

    {/* Row for Breed and Species */}
    <Row gutter={16}>
        <Col xs={24} sm={12}>
            <Form.Item 
                required 
                label="Breed" 
                validateStatus={formik.touched.breed && formik.errors.breed ? 'error' : ''} 
                help={formik.touched.breed && formik.errors.breed}
            >
                <Input name="breed" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.breed} />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
            <Form.Item 
                required 
                label="Species" 
                validateStatus={formik.touched.species && formik.errors.species ? 'error' : ''} 
                help={formik.touched.species && formik.errors.species}
            >
                <Select 
                    name="species" 
                    onChange={(value) => formik.setFieldValue('species', value)} 
                    onBlur={formik.handleBlur} 
                    value={formik.values.species}
                    placeholder="Select species type"
                >
                    <Option value="dog">Dog</Option>
                    <Option value="cat">Cat</Option>
                </Select>
            </Form.Item>
        </Col>
    </Row>
    <Row gutter={16}>
        <Col xs={24} sm={12}>
            <Form.Item 
                required 
                label="Age" 
                validateStatus={formik.touched.age && formik.errors.age ? 'error' : ''} 
                help={formik.touched.age && formik.errors.age}
            >
                <Input name="age" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.age} />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
            <Form.Item 
                required 
                label="Size (kg)" 
                validateStatus={formik.touched.size && formik.errors.size ? 'error' : ''} 
                help={formik.touched.size && formik.errors.size}
            >
                <InputNumber 
                    name="size" 
                    min={0} 
                    onChange={(value) => formik.setFieldValue('size', value)} 
                    onBlur={formik.handleBlur} 
                    value={formik.values.size}
                    addonAfter="KG"
                    placeholder="Enter size"
                    style={{ width: '100%' }}
                />
            </Form.Item>
        </Col>
    </Row>

    {/* Row for Description */}
    <Row gutter={16}>
        <Col span={24}>
            <Form.Item 
                required 
                label="Description" 
                validateStatus={formik.touched.description && formik.errors.description ? 'error' : ''} 
                help={formik.touched.description && formik.errors.description}
            >
                <Input.TextArea name="description" rows={4} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.description} />
            </Form.Item>
        </Col>
    </Row>

    {/* Row for Date Lost and Image */}
    <Row gutter={16}>
        <Col xs={24} sm={12}>
            <Form.Item 
                required 
                label="Date Lost" 
                validateStatus={formik.touched.dateLost && formik.errors.dateLost ? 'error' : ''} 
                help={formik.touched.dateLost && formik.errors.dateLost}
            >
                <DatePicker 
                    style={{ width: '100%' }} 
                    onChange={(date) => formik.setFieldValue('dateLost', date)} 
                    onBlur={formik.handleBlur} 
                    value={formik.values.dateLost} 
                    disabledDate={(current) => current && current > moment().endOf('day')}
                />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
            <Form.Item required label="Image">
                <Upload
                    listType="picture-card"
                    fileList={imageFileList}
                    onChange={handleUploadChange}
                    onPreview={handlePreview} // Enable preview on click
                    maxCount={1}
                    beforeUpload={() => false} // Prevent upload, only for display
                >
                    {imageFileList.length === 0 && <Button icon={<UploadOutlined />}>Upload</Button>}
                </Upload>
            </Form.Item>
        </Col>
    </Row>

    {/* Row for Location Picker */}
    <Row gutter={16}>
        <Col span={24}>
            <Form.Item required label="Location">
                <LocationPicker
                    location={location}
                    onLocationChange={(loc) => {
                        setLocation(loc);
                        formik.setFieldValue('last_seen_location', loc);
                    }}
                />
            </Form.Item>
        </Col>
    </Row>
    {formik.values.location && (
    <Row gutter={16}>
        <Col span={24}>
            <Form.Item label="Address">
                <Input.TextArea
                    value={formik.values.location}
                    disabled
                    placeholder="Selected address will appear here"
                />
            </Form.Item>

        </Col>
    </Row>
            )}
    <Row>
        <Col span={24}>
            <Form.Item>
                <Button type="primary" htmlType="submit" disabled={loading} style={{ width: '100%' }}>
                    {loading ? "Loading..." : "Save Changes"}
                </Button>
            </Form.Item>
        </Col>
    </Row>
</Form>

        </Modal>  
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                    <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
                    <p style={{ textAlign: 'center', marginTop: '8px' }}>{previewTitle}</p>
        </Modal>      
        </>


    );
};

export default EditReport;
