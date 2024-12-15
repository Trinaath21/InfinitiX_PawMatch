import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import { Button, Row, Col, Space,Card,Typography,Image } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import axios from 'axios';

const ViewReplyReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { reportID } = location.state || {};
    const { Title, Text } = Typography;
    const navigate = useNavigate();

    useEffect(() => {
        if (reportID) {
            fetchReplyReports();
        }
    }, [reportID]);

    const fetchReplyReports = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/getReplyReportsByReportID', {
                reportID: reportID,
            });
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching reply reports:', error);
            message.error('Failed to fetch reply reports');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (replyReportID) => {
        Modal.confirm({
            title: 'Are you sure you want to approve this reply report?',
            content: (
                <>
                    <p>
                        Once you approve this reply report, <b>all other reports</b> will automatically be <b style={{color:"red"}}>REJECTED</b>.
                    </p>
                    <p>This action cannot be undone.</p>
                </>
            ),
            okText: 'Approve',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Send approval request to the server
                    await axios.post('http://localhost:8000/api/approveReplyReport', { replyReportID,reportID });
                    message.success('Reply report approved successfully');
                    navigate("/personalReportlisting"); 
                } catch (error) {
                    console.error('Error approving reply report:', error);
                    message.error('Failed to approve reply report');
                }
            },
            onCancel() {
                message.info('Approval action cancelled');
            },
        });
    };
    

    const handleReject = async (replyReportID) => {
        Modal.confirm({
            title: 'Are you sure you want to reject this reply report?',
            okText: 'Yes, reject it',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axios.post('http://localhost:8000/api/rejectReplyReport', { replyReportID });
                    message.success('Reply report rejected successfully');
                    fetchReplyReports(); // Refresh data
                } catch (error) {
                    console.error('Error rejecting reply report:', error);
                    message.error('Failed to reject reply report');
                }
            },
        });
    };

    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleViewMore = (replyReportID) => {
        console.log("haha");
        const report = data.find((item) => item.id === replyReportID);
        setSelectedReport(report);
        setIsModalVisible(true);
    };
    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedReport(null);
    };

    const columns = [
        { 
            name: "id", 
            label: "ID", 
            options: { 
                display: false, // Hide the column from display
                filter: false,  // Disable filtering for this column
                sort: false     // Disable sorting for this column
            } 
        },
        { name: "name", label: "Founder Name", options: { filter: true, sort: true } },
        { name: "email", label: "Email", options: { filter: true, sort: true } },
        { name: "last_seen_location", label: "Found Location", options: { filter: true, sort: true } },
        { name: "reportedDate", label: "Date Founded", options: { filter: true, sort: true } },
        {
            name: "actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => (
                    <Space>
                        {/* Approve Button */}
                        <Button
                            onClick={() => handleApprove(tableMeta.rowData[0])}
                            type="default"
                            icon={<CheckOutlined />}
                            style={{ color: '#52c41a', borderColor: '#b7eb8f', backgroundColor: '#f6ffed' }}
                        >
                            Approve
                        </Button>

                        {/* Reject Button */}
                        <Button
                            onClick={() => handleReject(tableMeta.rowData[0])}
                            type="default"
                            icon={<CloseOutlined />}
                            style={{ color: '#ff4d4f', borderColor: '#ffa39e', backgroundColor: '#fff1f0' }}
                        >
                            Reject
                        </Button>

                        {/* View More Button */}
                        <Button
                            onClick={() => handleViewMore(tableMeta.rowData[0])}
                            type="primary"
                            icon={<EyeOutlined />}
                            style={{ backgroundColor: '#e6f7ff', color: '#1890ff', borderColor: '#91d5ff' }}
                        >
                            View More
                        </Button>
                    </Space>
                ),
            },
        },
    ];

    const options = {
        filterType: "dropdown",
        responsive: "standard",
        selectableRows: "none",
        print: false,
        download: false,
        viewColumns: true,
        search: true,
        isLoading: loading,
    };

    const handleBack = () => {
        navigate('/viewMoreDetails', { state: { reportID } });
    };

    return (
        <>
            <Row justify="end" style={{ marginBottom: '20px' }}>
                <Col>
                <Button
                        type="primary"
                        onClick={handleBack}
                        style={{
                            backgroundColor: '#004b80',
                            color: 'white',
                            fontSize: '20px',
                            height: '30px',
                            width: '10vw',
                        }}
                    >
                        Back
                    </Button>
                </Col>
            </Row>
            <Row justify="center" style={{ padding: '20px' }}>
                <Col span={24}>
                    <MUIDataTable
                        title={`Reply Reports`}
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </Col>
            </Row>



            {selectedReport && (
                <Modal
                    visible={isModalVisible}
                    onCancel={handleClose}
                    footer={null}
                    width={800}
                    centered
                >
<Card
    bodyStyle={{ padding: 0 }}
    hoverable
    style={{
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // Enhanced shadow
        marginBottom: '20px',
        borderRadius: '8px', // Rounded corners
        border: '1px solid #ddd', // Subtle border to define the card edges
        overflow: 'hidden', // Prevent content overflow
    }}
>
    <Row>
        <Col
            span={24}
            style={{
                backgroundColor: '#004b80',
                padding: '15px',
                textAlign: 'center',
                borderBottom: '1px solid #ccc', // Separator for header
            }}
        >
            <Title
                level={4}
                style={{
                    color: '#fff',
                    margin: 0,
                }}
            >
                Reply Report Information
            </Title>
        </Col>
    </Row>

    {/* Report Information */}
    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #e6e6e6', padding: '12px 0', background: '#fafafa' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
            <Text>
                <strong>Founder Name:</strong> {selectedReport.name}
            </Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
            <Text>
                <strong>Founder Email:</strong> {selectedReport.email}
            </Text>
        </Col>
    </Row>
    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #e6e6e6', padding: '12px 0', background: '#ffffff' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
            <Text>
                <strong>Founder Phone Number:</strong> {selectedReport.phoneNumber}
            </Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
            <Text>
                <strong>Founder Address:</strong> {selectedReport.detailed_address}
            </Text>
        </Col>
    </Row>
    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #e6e6e6', padding: '12px 0', background: '#fafafa' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
            <Text>
                <strong>Reported Date:</strong> {selectedReport.reportedDate}
            </Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
            <Text>
                <strong>Found Address:</strong> {selectedReport.last_seen_location}
            </Text>
        </Col>
    </Row>
    <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #e6e6e6', padding: '12px 0', background: '#ffffff' }}>
        <Col span={24} style={{ padding: '0 16px' }}>
            <Text>
                <strong>Additional Description:</strong> {selectedReport.description}
            </Text>
        </Col>
    </Row>
    <Row style={{ padding: '12px 0', background: '#fafafa', alignItems: 'center' }}>
        <Col xs={24} sm={6} style={{ padding: '0 16px', textAlign: 'left' }}>
            <Text>
                <strong>Pet Image:</strong>
            </Text>
        </Col>
        <Col xs={24} sm={18} style={{ padding: '0 16px', textAlign: 'center' }}>
            <Image.PreviewGroup
                items={[
                    {
                        src: `data:image/png;base64,${selectedReport.image}`,
                        alt: 'Pet Image',
                    },
                ]}
            >
                <Image
                    width={200}
                    src={`data:image/png;base64,${selectedReport.image}`}
                    alt="Pet Image"
                    style={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        marginTop: '8px',
                        border: '1px solid #ddd', // Frame around the image
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
                    }}
                />
            </Image.PreviewGroup>
        </Col>
    </Row>
</Card>


                    {/* Close Button */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button type="primary" onClick={handleClose} style={{ width: '100px',background:"red" }}>
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default ViewReplyReport;
