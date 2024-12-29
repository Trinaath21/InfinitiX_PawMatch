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

const EditStrayReport = ({ visible, onClose, reportData, refreshTableData }) => {
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
                //pet_name: reportData.pet_name,
                species: reportData.species,
                lat: reportData.lat,
                lng: reportData.lng,
                breed: reportData.breed,
                colour: reportData.colour,
                contactPhone: reportData.contactPhone,
                age: reportData.age,
                size: reportData.size,
                description: reportData.description,
                dateSighting: reportData.dateSighting ? moment(reportData.dateSighting) : null,
            });
            console.log(reportData); // Check the formik values
            fetchCoordinates(reportData.location).then(coords => {
                console.log("coords",coords);
                console.log("Coordinates fetched:", location);
                console.log(reportData.lat, reportData.lng);
                if (location) {
                    setLocation({ lat: parseFloat(reportData.lat), lng: parseFloat(reportData.lng) });
                }
            });

            if (reportData.images) {
                setImageFileList([
                    {
                        uid: '-1',
                        name: 'current-image.png',
                        status: 'done',
                        url: `data:image/png;base64,${reportData.images}`,
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
        breed: Yup.string().required('Breed is required'),
        colour: Yup.string().required('Colour is required'),
        dateSighting: Yup.date().required('Date of sighting is required'), // Updated field name and validation message
        description: Yup.string().required('Description is required'),
        species: Yup.string().required('Species type is required'),
        contactPhone: Yup.string().required('Phone number is required'),
    });

    const formik = useFormik({
        initialValues: {
            breed: '',
            colour: '',
            dateSighting: '', // Updated field name
            description: '',
            species: '',
            images: [],
            contactPhone: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                // Prepare the form data for submission
                const formData = new FormData();
                formData.append('id', reportData.report_id); // Assuming the ID is part of values
                formData.append('breed', values.breed);
                formData.append('colour', values.colour);
               // formData.append('status', values.status);
                formData.append('dateSighting', values.dateSighting.format('YYYY-MM-DD')); // Ensure the date is properly formatted
                //formData.append('location', values.location);
                formData.append('location', values.location || reportData.location);
                formData.append('description', values.description);
                formData.append('contactPhone', values.contactPhone);
                formData.append('lat', values.lat);
                formData.append('lng', values.lng);
               //formData.append('district', values.district);
                //formData.append('state', values.state);
                formData.append('species', values.species);
        
                // Append the image file if it exists
                if (imageFileList[0]?.originFileObj) {
                    formData.append('images', imageFileList[0].originFileObj);
                }
                
                // Send the data to the backend
                const response = await axios.post('http://localhost:8000/api/editStrayReport', formData, {
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
                    label="Breed" 
                    required 
                    validateStatus={formik.touched.breed && formik.errors.breed ? 'error' : ''} 
                    help={formik.touched.breed && formik.errors.breed}
                >
                    <Input 
                        name="breed" 
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur} 
                        value={formik.values.breed} 
                        placeholder="Enter 'unknown' if breed is not known"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item 
                    required
                    label="Colour" 
                    validateStatus={formik.touched.colour && formik.errors.colour ? 'error' : ''} 
                    help={formik.touched.colour && formik.errors.colour}
                >
                    <Select 
                        name="colour" 
                        onChange={(value) => formik.setFieldValue('colour', value)} 
                        onBlur={formik.handleBlur} 
                        value={formik.values.colour}
                        placeholder="Select Color"
                    >
                        <Option value="black">Black</Option>
                        <Option value="white">White</Option>
                        <Option value="brown">Brown</Option>
                        <Option value="golden">Golden</Option>
                        <Option value="grey">Grey</Option>
                        <Option value="blue">Blue</Option>
                        <Option value="red">Red</Option>
                        <Option value="green">Green</Option>
                        <Option value="orange">Orange</Option>
                        <Option value="yellow">Yellow</Option>
                        <Option value="purple">Purple</Option>
                        <Option value="pink">Pink</Option>
                        <Option value="cream">Cream</Option>
                        <Option value="tan">Tan</Option>
                        <Option value="silver">Silver</Option>
                        <Option value="beige">Beige</Option>
                        <Option value="brindle">Brindle</Option>
                        <Option value="chocolate">Chocolate</Option>
                        <Option value="fawn">Fawn</Option>
                        <Option value="liver">Liver</Option>
                        <Option value="multi">Multicolor</Option>
                    </Select>
                </Form.Item>
            </Col>
    </Row>

    {/* Row for Breed and Species */}
    <Row gutter={16}>
            <Col xs={24} sm={12}>
                <Form.Item 
                    required 
                    label="Date of sighting" 
                    validateStatus={formik.touched.dateSighting && formik.errors.dateSighting ? 'error' : ''} 
                    help={formik.touched.dateSighting && formik.errors.dateSighting}
                >
                    <DatePicker 
                        name="dateSighting" 
                        onChange={(date) => formik.setFieldValue('dateSighting', date)} 
                        onBlur={formik.handleBlur} 
                        value={formik.values.dateSighting}
                        style={{ width: '100%' }}
                        disabledDate={(current) => current && current > moment().endOf('day')}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item 
                    required 
                    label="Contact Phone" 
                    validateStatus={formik.touched.contactPhone && formik.errors.contactPhone ? 'error' : ''} 
                    help={formik.touched.contactPhone && formik.errors.contactPhone}
                >
                    <Input 
                        name="contactPhone" 
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur} 
                        value={formik.values.contactPhone} 
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
                        formik.setFieldValue('location', loc);
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

export default EditStrayReport;
