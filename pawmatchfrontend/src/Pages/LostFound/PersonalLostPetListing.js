import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Button, Row, Col, Space } from "antd";
import AddNewReport from "./AddNewReport";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import axios from "axios";
import EditReport from "./EditReport";

const PersonalListing = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const userID = parseInt(localStorage.getItem("userID"), 10);

  const refreshTableData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/getAllReportsByUserID",
        {
          userID: userID, //later must use localStorage.
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      title: "Are you sure you want to delete this report?",
      content: "This action is irreversible.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          // Send delete request to the server
          await axios.post("http://localhost:8000/api/deleteLostReport", {
            reportID: reportID,
          });
          message.success("Item deleted successfully");

          refreshTableData(); // Replace with actual refresh function
        } catch (error) {
          console.error("Delete failed:", error);
          message.error("Failed to delete item");
        }
      },
      onCancel() {
        message.info("Delete action cancelled");
      },
    });
  };
  const columns = [
    {
      name: "report_id",
      label: "Report ID",
      options: { filter: true, sort: true },
    },
    {
      name: "pet_name",
      label: "Pet Name",
      options: { filter: true, sort: true },
    },
    {
      name: "date_reported",
      label: "Report Created",
      options: { filter: true, sort: true },
    },
    { name: "status", label: "Status", options: { filter: true, sort: true } },
    {
      name: "species",
      label: "Species",
      options: { filter: true, sort: true },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const isActive = tableMeta.rowData[3] === "active"; // Adjust index 3 to your status column position

          return (
            <Space>
              {/* View More Button */}
              <Button
                onClick={() => handleViewMore(tableMeta.rowData[0])}
                type="primary"
                icon={<EyeOutlined />}
                style={{
                  backgroundColor: "#e6f7ff",
                  color: "#1890ff",
                  borderColor: "#91d5ff",
                }}
              >
                View More
              </Button>

              {/* Edit Button */}
              <Button
                onClick={() => handleEdit(tableMeta.rowData[0])}
                type="default"
                icon={<EditOutlined />}
                style={{
                  color: isActive ? "#fa8c16" : "#d9d9d9",
                  borderColor: isActive ? "#ffd591" : "#d9d9d9",
                }}
                disabled={!isActive}
              >
                Edit
              </Button>

              {/* Delete Button */}
              <Button
                onClick={() => handleDelete(tableMeta.rowData[0])}
                type="default"
                icon={<DeleteOutlined />}
                style={{
                  color: "#ff4d4f",
                  borderColor: "#ffa39e",
                  backgroundColor: "#fff1f0",
                }}
              >
                Delete
              </Button>
            </Space>
          );
        },
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
  };

  const navigate = useNavigate();

  const handleViewMore = (reportID) => {
    console.log("Viewing details for report ID:", reportID);
    navigate("/viewMoreDetails", {
      state: { reportID: reportID, page: "/personalReportlisting" },
    });
  };
  const handleEdit = (reportID) => {
    const reportData = data.find((report) => report.report_id === reportID);
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
      <Row justify="center" style={{ padding: "20px" }}>
        <Col span={24}>
          <Button
            type="primary"
            onClick={handleAddNewReport}
            style={{ marginBottom: "20px" }}
          >
            Add Report
          </Button>
        </Col>
        <Col span={24}>
          <MUIDataTable
            title={"Pet Reports"}
            data={data}
            columns={columns}
            options={options}
          />
        </Col>
      </Row>
      <AddNewReport
        visible={isModalVisible}
        onClose={handleCloseModal}
        refreshTableData={refreshTableData}
      />
      <EditReport
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        reportData={selectedReport}
        refreshTableData={refreshTableData}
      />
    </>
  );
};

export default PersonalListing;
