import React, { useState, useRef, useMemo, useCallback } from 'react';
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

const AddNewReport = ({ visible, onClose,refreshTableData }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
    const [location, setLocation] = useState(null);
    const formik = useFormik({
        initialValues: {
            name: '',
            breed: '',
            colour: '',
            dateLost: null,
            location: '',
            description: '',
            species: '',  // New field for species
            age: null,    // New field for age
            size: null,   // New field for size in kg
            images: [],
            contactEmail: '',
            contactPhone: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Pet Name is required'),
            breed: Yup.string().required('Breed is required'),
            colour: Yup.string().required('Colour is required'),
            dateLost: Yup.date().required('Date lost is required'),
            location: Yup.string().required('Location is required'),
            description: Yup.string().required('Description is required'),
            species: Yup.string().required('Species type is required'),  // Validation for species
            age: Yup.number().required('Age is required').min(0, 'Age must be a positive number'), // Validation for age
            size: Yup.number().required('Size is required').min(0, 'Size must be a positive number'), // Validation for size
            contactEmail: Yup.string().email('Invalid email format').required('Email is required'),
            contactPhone: Yup.string().required('Phone number is required'),
    
            // Validation for a single image file in acceptable formats
            images: Yup.array()
                .required('Image is required')
                .min(1, 'Please upload one image')
                .max(1, 'Only one image is allowed')
                .test(
                    'fileType',
                    'Only JPG, PNG, or GIF formats are allowed',
                    (images) => {
                        if (!images || images.length === 0) return false;
                        const acceptedFormats = ['image/jpg','image/png','image/jpeg', 'image/gif'];
                        return acceptedFormats.includes(images[0].type);
                    }
                ),
        }),
        onSubmit: async (values) => {
            const userID = parseInt(localStorage.getItem('user_id'), 10);
            const formData = new FormData();
            formData.append('user_id', userID); // Assuming you have user_id, replace with actual value
            formData.append('name', values.name);
            formData.append('breed', values.breed);
            formData.append('colour', values.colour);
            formData.append('dateLost', values.dateLost.format('YYYY-MM-DD')); // Format date
            formData.append('location', values.location);
            formData.append('description', values.description);
            formData.append('species', values.species);
            formData.append('age', values.age);
            formData.append('size', values.size);
            formData.append('contactEmail', values.contactEmail);
            formData.append('contactPhone', values.contactPhone);
            formData.append('district', values.district);
            formData.append('state', values.state);
            formData.append('lat', values.lat);
            formData.append('lng', values.lng);
            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj); // Append the image file
                console.log(fileList[0].originFileObj);
            }
            console.log(formData);
            try {
                console.log(formData);
                const response = await axios.post('http://localhost:8000/api/addlost-pets', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response.data.lostPetId);
                await axios.post('http://localhost:8000/api/notify-users', {
                    reportID: response.data.lostPetId,
                });
                message.success('Lost pet report submitted successfully!');
                formik.resetForm(); 
                onClose(false);
                refreshTableData(); 
            } catch (error) {
                console.error('There was an error!', error);
                message.error('Failed to submit report.');
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
        formik.setFieldValue('images', latestFileList); // Update formik with the latest image
    };
    return (
<Modal
    title="Add New Report"
    visible={visible}
    onCancel={onClose}
    footer={null}
    centered
    width="50%"  // Adjust width for responsiveness
>
    <Form onFinish={formik.handleSubmit} layout="vertical">
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
                <Form.Item label="Pet Name" required validateStatus={formik.touched.name && formik.errors.name ? 'error' : ''} help={formik.touched.name && formik.errors.name}>
                    <Input name="name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item label="Breed" required validateStatus={formik.touched.breed && formik.errors.breed ? 'error' : ''} help={formik.touched.breed && formik.errors.breed}>
                    <Input name="breed" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.breed} />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
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
            <Col xs={24} sm={12}>
            <Form.Item
            required 
            label="Date Lost" 
            validateStatus={formik.touched.dateLost && formik.errors.dateLost ? 'error' : ''} 
            help={formik.touched.dateLost && formik.errors.dateLost}
        >
            <DatePicker 
                name="dateLost" 
                onChange={(date) => formik.setFieldValue('dateLost', date)} 
                onBlur={formik.handleBlur} 
                value={formik.values.dateLost}
                style={{ width: '100%' }}
                disabledDate={(current) => current && current > moment().endOf('day')}
            />
        </Form.Item>
            </Col>
        </Row>


        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
                <Form.Item required label="Contact Email" validateStatus={formik.touched.contactEmail && formik.errors.contactEmail ? 'error' : ''} help={formik.touched.contactEmail && formik.errors.contactEmail}>
                    <Input name="contactEmail" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.contactEmail} />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item required label="Contact Phone" validateStatus={formik.touched.contactPhone && formik.errors.contactPhone ? 'error' : ''} help={formik.touched.contactPhone && formik.errors.contactPhone}>
                    <Input name="contactPhone" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.contactPhone} />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
    <Col xs={24}>
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
                placeholder="Enter description here"
            />
        </Form.Item>
    </Col>
    
    <Col xs={24}>
        <Form.Item
            required 
            label="Species Type" 
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
                <Select.Option value="dog">Dog</Select.Option>
                <Select.Option value="cat">Cat</Select.Option>
            </Select>
        </Form.Item>
    </Col>
</Row>

        <Row gutter={16}>
        <Col span={12}>
            <Form.Item 
                required
                label="Age" 
                validateStatus={formik.touched.age && formik.errors.age ? 'error' : ''} 
                help={formik.touched.age && formik.errors.age}
            >
                <Input 
                    name="age" 
                    type="number" 
                    min={0} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                    value={formik.values.age}
                    placeholder="Enter age in years"
                />
            </Form.Item>
        </Col>
        
        <Col span={12}>
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
    <Row gutter={[16, 16]}>
    <Col xs={24}>
        <Form.Item
            required
            label="Images"
            validateStatus={formik.touched.images && formik.errors.images ? 'error' : ''}
            help={formik.touched.images && formik.errors.images}
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
        <Form.Item>
            <Button type="primary" htmlType="submit" block>
                Submit
            </Button>
        </Form.Item>
    </Form>
</Modal>

    );
};

export default AddNewReport;
