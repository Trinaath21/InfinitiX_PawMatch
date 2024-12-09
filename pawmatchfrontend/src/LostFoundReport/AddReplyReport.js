import React, { useState, useRef, useMemo, useCallback,useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, Row, Col, Image,InputNumber, message  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import axios from 'axios';
import moment from 'moment';
const { Option } = Select;

async function fetchAddressFromCoordinates(lat, lng) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    if (!response.ok) {
        throw new Error('Error fetching address');
    }
    const data = await response.json();
    
    // Extract district and state from the address components
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
const LocationPicker = ({ onLocationChange, formik }) => {
    const [position, setPosition] = useState(null);
    const [draggable, setDraggable] = useState(true);
    const markerRef = useRef(null);
    const mapRef = useRef(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newLatLng = marker.getLatLng();
                    setPosition(newLatLng);
                    onLocationChange({ lat: newLatLng.lat, lng: newLatLng.lng });

                    fetchAddressFromCoordinates(newLatLng.lat, newLatLng.lng).then(({ fullAddress, district, state,lat,lng }) => {
                        if (fullAddress) {
                            formik.setFieldValue('location', fullAddress);
                        }
                        console.log("district", district);
                        console.log("state", state);
                        formik.setFieldValue('district', district);
                        formik.setFieldValue('state', state);
                        formik.setFieldValue('lat', lat);
                        formik.setFieldValue('lng', lng);
                    });
                }
            },
        }),
        [onLocationChange, formik]
    );

    function LocationMarker() {
        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d);
        }, []);
        
        const map = useMapEvents({
            click() {
                map.locate();
            },
            locationfound(e) {
                setPosition(e.latlng);
                onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });

                fetchAddressFromCoordinates(e.latlng.lat, e.latlng.lng).then((address) => {
                    if (address) {
                        formik.setFieldValue('location', address);
                    }
                });

                map.flyTo(e.latlng, map.getZoom());
            },
        });

        if (!mapRef.current) {
            mapRef.current = map;
            setTimeout(() => map.invalidateSize(), 0);
        }

        return position === null ? null : (
            <Marker
                draggable={draggable}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}
            >
                <Popup minWidth={90}>
                    <span onClick={toggleDraggable}>
                        {draggable ? 'Marker is draggable' : 'Click here to make marker draggable'}
                    </span>
                </Popup>
            </Marker>
        );
    }

    return (
        <MapContainer
            center={{ lat: 51.505, lng: -0.09 }}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "50vh", width: "100%" }}
            whenCreated={(map) => (mapRef.current = map)}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    );
};
const AddReplyReport = ({ visible, onClose,report_id }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [location, setLocation] = useState(null);
    const userID = 3; // Check for userID in localStorage

    useEffect(() => {
        const fetchUserData = async () => {
            if (userID) {
                try {
                    const response = await axios.post(`http://localhost:8000/api/getSpecificUser`,{
                        user_id: userID,
                    });
                    console.log(response.data);
                    setUserData(response.data.data); // Prefill data from API
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    message.error('Failed to fetch user data.');
                }
            }
        };
        fetchUserData();
    }, [userID]);

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const formik = useFormik({
        enableReinitialize: true, // Ensure form values reinitialize with fetched data
        initialValues: {
            name: userData?.name || '',
            phoneNumber: userData?.phoneNumber || '',
            email: userData?.email || '',
            detailed_address: userData?.detailed_address || '',
            location: '',
            description: '',
            image: [],
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phoneNumber: Yup.string().required('Contact Number is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            detailed_address: Yup.string().required('Current Address is required'),
            location: Yup.string().required('Location is required'),
            description: Yup.string().required('Description is required'),
            image: Yup.array()
                .required('Image is required')
                .min(1, 'Please upload one image')
                .max(1, 'Only one image is allowed')
                .test(
                    'fileType',
                    'Only JPG, PNG, or GIF formats are allowed',
                    (image) => {
                        if (!image || image.length === 0) return false;
                        const acceptedFormats = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'];
                        return acceptedFormats.includes(image[0].type);
                    }
                ),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('user_id', userID);
            formData.append('name', values.name);
            formData.append('report_id', report_id);
            const todayDate = moment().format('YYYY-MM-DD');
            formData.append('reportedDate', todayDate);
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('email', values.email);
            formData.append('detailed_address', values.detailed_address);
            formData.append('location', values.location);
            formData.append('district', values.district);
            formData.append('state', values.state);
            formData.append('lat', values.lat);
            formData.append('lng', values.lng);
            formData.append('description', values.description);
            if (fileList.length > 0) {
                console.log("fileList: " + JSON.stringify(fileList));
                formData.append('images', fileList[0].originFileObj); // Append the image file
            }
            

            try {
                const todayDate = moment().format('YYYY-MM-DD');
                console.log("FormData:");
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }
                
                const response = await axios.post('http://localhost:8000/api/addReplyReport', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                message.success('Reply report submitted successfully!');
                await axios.post('http://localhost:8000/api/notify-reportOwner', {
                    reportID: report_id,
                    founderName:values.name,
                    dateReplied:todayDate,
                });
                formik.resetForm({
                    name: '',
                    phoneNumber:  '',
                    email: '',
                    detailed_address: '',
                    location: '',
                    description: '',
                    image: [],
                });
                onClose(false);
                //navigate to PublicLostPetListingPage
            } catch (error) {
                console.error('There was an error!', error);
                message.error('Failed to submit reply report.');
            }
        },
    });
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => setPreviewImage(reader.result);
        } else {
            setPreviewImage(file.url || file.preview);
        }
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => {
        const latestFileList = newFileList.slice(-1); // Keep only the latest file
        setFileList(latestFileList);
        console.log("file "+latestFileList);
        formik.setFieldValue('image', latestFileList); // Update formik with the latest image
    };

    return (
        <Modal
            title="Add Reply Report"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width="50%"
        >
            <Form onFinish={formik.handleSubmit} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Name"
                            required
                            validateStatus={formik.touched.name && formik.errors.name ? 'error' : ''}
                            help={formik.touched.name && formik.errors.name}
                        >
                            <Input
                                name="name"
                                disabled={!!userData?.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Contact Number"
                            required
                            validateStatus={formik.touched.phoneNumber && formik.errors.phoneNumber ? 'error' : ''}
                            help={formik.touched.phoneNumber && formik.errors.phoneNumber}
                        >
                            <Input
                                name="phoneNumber"
                                disabled={!!userData?.phoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phoneNumber}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Email"
                            required
                            validateStatus={formik.touched.email && formik.errors.email ? 'error' : ''}
                            help={formik.touched.email && formik.errors.email}
                        >
                            <Input
                                name="email"
                                disabled={!!userData?.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Current Address"
                            required
                            validateStatus={formik.touched.detailed_address && formik.errors.detailed_address ? 'error' : ''}
                            help={formik.touched.detailed_address && formik.errors.detailed_address}
                        >
                            <Input
                                name="detailed_address"
                                disabled={!!userData?.detailed_address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.detailed_address}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item required label="Location" style={{ width: '100%' }} validateStatus={formik.touched.location && formik.errors.location ? 'error' : ''} help={formik.touched.location && formik.errors.location}>
                    <div style={{ width: '100%' }}>
                        <LocationPicker onLocationChange={setLocation} formik={formik} />
                    </div>
                </Form.Item>

                <Form.Item label="Address">
                    <Input.TextArea
                        value={formik.values.location}
                        disabled
                        placeholder="Selected address will appear here"
                    />
                </Form.Item>
                <Form.Item
                    required
                    label="Description"
                    validateStatus={formik.touched.description && formik.errors.description ? 'error' : ''}
                    help={formik.touched.description && formik.errors.description}
                >
                    <Input.TextArea
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        placeholder="Enter additional description"
                    />
                </Form.Item>
                <Form.Item
            required
            label="Images"
            validateStatus={formik.touched.image && formik.errors.image ? 'error' : ''}
            help={formik.touched.image && formik.errors.image}
        >
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                maxCount={1}
                beforeUpload={(file) => {
                    const isJpgOrGif = file.type === 'image/jpeg' || file.type === 'image/gif'|| file.type === 'image/png';
                    if (!isJpgOrGif) {
                        message.error('You can only upload JPG or GIF files!');
                    }
                    return isJpgOrGif;
                }}
            >
                {fileList.length >= 1 ? null : (
                    <Button icon={<PlusOutlined />}>Upload</Button>
                )}
            </Upload>
            <Image
                preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                src={previewImage}
                style={{ display: 'none' }}
            />
        </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default AddReplyReport;