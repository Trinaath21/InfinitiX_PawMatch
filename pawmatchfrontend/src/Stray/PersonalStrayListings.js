import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import { Button, Row, Col, Space } from 'antd';
import AddStrayReport from './AddStrayReport'; 
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'; 
import { Modal, message } from 'antd';
import axios from 'axios';
import EditReport from './EditStrayReport';
import ViewMoreStrayDetails from './ViewMoreStrayDetails';

const PersonalStrayListings = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const userID = parseInt(localStorage.getItem('user_id'), 10);
    console.log("User ID from localStorage:", userID);

    const refreshTableData = async () => {
        setLoading(true); 
        try {
            const response = await axios.post('http://localhost:8000/api/getAllStrayReportsByUserID', {
                userID: userID //later must use localStorage.
            });
            setData(response.data.data); 
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        refreshTableData();
    }, []);

    const handleDelete = (reportID) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this report?',
            content: 'This action is irreversible.',
            okText: 'Yes, delete it',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Send delete request to the server
                    await axios.post('http://localhost:8000/api/deleteStrayReport', {
                        reportID: reportID
                    });
                    message.success('Item deleted successfully');
                    
                    refreshTableData(); // Replace with actual refresh function
                } catch (error) {
                    console.error('Delete failed:', error);
                    message.error('Failed to delete item');
                }
            },
            onCancel() {
                message.info('Delete action cancelled');
            },
        });
    };
    const columns = [
        { name: "report_id", label: "Report ID", options: { filter: true, sort: true } },
        { name: "breed", label: "Breed", options: { filter: true, sort: true } },
        { name: "colour", label: "Colour", options: { filter: true, sort: true } },
        { name: "dateSighting", label: "Date of Sighting", options: { filter: true, sort: true } },
        //{ name: "status", label: "Status", options: { filter: true, sort: true } },
        {
            name: "actions",
            label: "ACTIONS",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    //const isActive = tableMeta.rowData[4] === "active"; // Adjust index 3 to your status column position
                    console.log("Row Data Report ID:", tableMeta.rowData[0]);
        
                    return (
                        <Space>
                            
                            {/* View More Button */}
                            <Button 
                            
                                onClick={() => handleViewMore(tableMeta.rowData[0])}
                                type="primary"
                                icon={<EyeOutlined />}
                                style={{ backgroundColor: '#e6f7ff', color: '#1890ff', borderColor: '#91d5ff' }}
                            >
                                View More
                            </Button>
                            
                            {/* Edit Button */}
                            <Button 
                                onClick={() => handleEdit(tableMeta.rowData[0])}
                                type="default"
                                icon={<EditOutlined />}
                                style={{ color: '#fa8c16' , borderColor:  '#ffd591'  }}
                                //disabled={!isActive}
                            >
                                Edit
                            </Button>
        
                            {/* Delete Button */}
                            <Button 
                                onClick={() => handleDelete(tableMeta.rowData[0])}
                                type="default"
                                icon={<DeleteOutlined />}
                                style={{ color: '#ff4d4f', borderColor: '#ffa39e', backgroundColor: '#fff1f0' }}
                            >
                                Delete
                            </Button>
                        </Space>
                    );
                },
            },
        }
        
        
    ];

    const options = {
        filterType: "dropdown",
        responsive: "standard",
        selectableRows: "none",
        print: false,
        download: false,
        viewColumns: true,
        search: true,
    };

    const navigate = useNavigate();
    
    const handleViewMore = (reportID) => {
        console.log("Viewing details for report ID:", reportID);
        navigate('/ViewMoreStrayDetails', { state: { reportID: reportID } });
    };
    const handleEdit = (reportID) => {
        const reportData = data.find((report) => report.report_id === reportID);
        console.log(reportData);
        setSelectedReport(reportData);
        setEditModalVisible(true);
    };
    const handleAddNewReport = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <>
        <Row justify="center" style={{ padding: '20px' }}>
            <Col span={24}>
                <Button 
                    type="primary" 
                    onClick={handleAddNewReport} 
                    style={{ marginBottom: '20px' }}
                >
                    Add New Report
                </Button>
            </Col>
            <Col span={24}>
                <MUIDataTable
                    title={"Stray Reports"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </Col>
        </Row>
        <AddStrayReport visible={isModalVisible} onClose={handleCloseModal} refreshTableData={refreshTableData} />
        <EditReport
            visible={editModalVisible}
            onClose={() => setEditModalVisible(false)}
            reportData={selectedReport}
            refreshTableData = {refreshTableData}
        />
        </>

    );
};

export default PersonalStrayListings;
