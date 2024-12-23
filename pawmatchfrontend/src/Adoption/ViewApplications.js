import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Layout, Button, message, Space, Modal, } from 'antd';
import { EyeOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from "axios";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Typography from '@mui/material/Typography';
import FooterBar from '../General Components/FooterBar.js';
import Sidebar from '../General Components/SideBar.js';
import { useNavigate, useParams, useLocation } from "react-router-dom";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true
});

const theme = createTheme({
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 0",
          gap: "0px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          marginLeft: "0",
          fontSize: "1.4rem",
          fontWeight: "bold",
          "@media (max-width: 599.5px)": {
            textAlign: "center",
          },
        },
      },
    },
  },
});

function ViewApplications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Content } = Layout;
  const navigate = useNavigate();
  const location = useLocation();
  const adoption_post_id = location.state?.adoption_post_id;
  //const adoption_post_id = 19;

  const refreshTableData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/get-applications?adoption_post_id=${adoption_post_id}`);
      console.log("Fetched data:", response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (application_id, adoption_post_id) => {
    try {
      await axios.post('http://localhost:8000/api/accept-application', {
        application_id,
        adoption_post_id,
      });
      message.success('Application accepted. Other applications for this post have been rejected.');
      refreshTableData();
    } catch (error) {
      console.error('Error accepting application:', error);
      message.error('Failed to accept application.');
    }
  };

  const handleReject = async (application_id) => {
    Modal.confirm({
      title: 'Are you sure you want to reject this application?',
      content: 'This action cannot be undone.',
      okText: 'Yes, reject it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.post('http://localhost:8000/api/reject-application', { application_id });
          message.success('Application rejected successfully.');
          refreshTableData();
        } catch (error) {
          console.error('Error rejecting application:', error);
          message.error('Failed to reject application.');
        }
      },
    });
  };

  const handleViewMore = async (application_id, adoption_post_id) => {
    console.log("Viewing details for application id:", application_id);
    navigate('/ViewMoreApplication', { state: { adoption_post_id: adoption_post_id, application_id: application_id, page:"/ViewApplications" } });
  };

  useEffect(() => {
    refreshTableData();
  }, []);

  const columns = [
    { name: "application_id", label: "Application ID" },
    { name: "adoption_post_id", label: "Post ID" },
    // { name: "user_id", label: "User ID" },
    { name: "applicant_name", label: "Applicant Name" },
    { name: "applicant_age", label: "Age" },
    { name: "phone_number", label: "Phone Number" },
    // { name: "current_pets_count", label: "Current Pets" },
    // { name: "detailed_address", label: "Address" },
    { name: "state", label: "State" },
    { name: "district", label: "District" },
    // { name: "previous_pet_experience", label: "Pet Experience" },
    // { name: "living_condition", label: "Living Condition" },
    // { name: "landlord_requirement", label: "Landlord Requirement" },
    // { name: "lifestyle", label: "Lifestyle" },
    { name: "application_date", label: "Application Date" },
    { name: "status", label: "Status" },
    // { name: "created_at", label: "Created At" },
    // { name: "updated_at", label: "Updated At" },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const application_id = tableMeta.rowData[0];
          //console.log('Application_ID:', application_id);
          const adoption_post_id = tableMeta.rowData[1];
          //console.log('Post_ID:', adoption_post_id);
          return (
            <Space style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleAccept(application_id, adoption_post_id)}
                style={{ backgroundColor: '#f6ffed', color: '#52c41a', borderColor: '#b7eb8f' }}
              >
                Accept
              </Button>
              <Button
                type="default"
                icon={<CloseOutlined />}
                onClick={() => handleReject(application_id)}
                style={{ color: '#ff4d4f', borderColor: '#ffa39e', backgroundColor: '#fff1f0' }}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleViewMore(application_id, adoption_post_id)}
                type="primary"
                icon={<EyeOutlined />}
                style={{ backgroundColor: '#e6f7ff', color: '#1890ff', borderColor: '#91d5ff' }}
              >
                View More
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

  return (
    <div>
      <Content style={{ margin: '24px 16px 0' }}>
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0px', background: '#fff', borderRadius: '8px', margin: 'auto' }}>
          <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
              <MUIDataTable
                title={<Typography variant="h6">Adoption Applications</Typography>}
                data={data}
                columns={columns}
                options={options}
              />
            </ThemeProvider>
          </CacheProvider>
        </div>
      </Content>
    </div>
  );
}

export default ViewApplications;
