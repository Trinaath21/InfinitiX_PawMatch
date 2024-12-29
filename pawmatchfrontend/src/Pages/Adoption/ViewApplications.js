import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Layout, Button, message, Space, Modal, Select, DatePicker, Row, Col } from 'antd';
import { EyeOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from "axios";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Typography from '@mui/material/Typography';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

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

  // Filters state
  const [district, setDistrict] = useState('');
  const [currentPets, setCurrentPets] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);

  const [districtOptions, setDistrictOptions] = useState([]);
  const [currentPetsOptions, setCurrentPetsOptions] = useState([]);

  const refreshTableData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/get-applications?adoption_post_id=${adoption_post_id}`);
      console.log("Fetched data:", response.data);

      // Extract district and currentPets options
      const uniqueDistricts = [...new Set(response.data.map(item => item.district))];
      const uniqueCurrentPets = [...new Set(response.data.map(item => item.current_pets_count))];
      setDistrictOptions(uniqueDistricts);
      setCurrentPetsOptions(uniqueCurrentPets);

      // Apply filters
      const filteredData = response.data.filter(item => {
        const matchesDistrict = district ? item.district === district : true;
        const matchesCurrentPets = currentPets ? item.current_pets_count.toString() === currentPets : true;
        const matchesDateRange = dateRange[0] && dateRange[1]
          ? moment(item.created_at).isBetween(dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD'), 'day', '[]')
          : true;

        return matchesDistrict && matchesCurrentPets && matchesDateRange;
      });

      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (application_id, adoption_post_id) => {
    Modal.confirm({
      title: 'Are you sure you want to accept this application?',
      content: (
        <>
          <p>
            Once you accept this application, <b>all other applications</b> will automatically be <b style={{ color: "red" }}>REJECTED</b>.
          </p>
          <p>This action cannot be undone.</p>
        </>
      ),
      okText: 'Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.post('http://localhost:8000/api/accept-application', { application_id, adoption_post_id });
          message.success('Application accepted successfully. Other applications for this post have been rejected.');
          refreshTableData();
        } catch (error) {
          console.error('Error accepting application:', error);
          message.error('Failed to accept application.');
        }
      },
    });
  };

  const handleReject = async (application_id, adoption_post_id) => {
    Modal.confirm({
      title: 'Are you sure you want to reject this application?',
      content: 'This action cannot be undone.',
      okText: 'Yes, reject it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.post('http://localhost:8000/api/reject-application', { application_id, adoption_post_id });
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
    navigate('/ViewMoreApplication', { state: { adoption_post_id: adoption_post_id, application_id: application_id, page: "/ViewApplications" } });
  };

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
          const isPending = tableMeta.rowData[8] === "pending";
          return (
            <Space style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleAccept(application_id, adoption_post_id)}
                style={{
                  backgroundColor: '#f6ffed',
                  color: isPending ? '#52c41a' : '#d9d9d9',
                  borderColor: isPending ? '#b7eb8f' : '#d9d9d9',
                }}
                disabled={!isPending}
              >
                Accept
              </Button>
              <Button
                type="default"
                icon={<CloseOutlined />}
                onClick={() => handleReject(application_id, adoption_post_id)}
                style={{
                  backgroundColor: '#fff1f0',
                  color: isPending ? '#ff4d4f' : '#d9d9d9',
                  borderColor: isPending ? '#ffa39e' : '#d9d9d9',
                }}
                disabled={!isPending}
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

  useEffect(() => {
    refreshTableData();
  }, [district, currentPets, dateRange]);

  return (
    <div>
      <Content style={{ margin: '24px 16px 0' }}>
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select District"
              style={{ width: '100%' }}
              value={district}
              onChange={setDistrict}
            >
              <Option value="">All Districts</Option>
              {districtOptions.map((dist, index) => (
                <Option key={index} value={dist}>{dist}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select Current Pet Count"
              style={{ width: '100%' }}
              value={currentPets}
              onChange={setCurrentPets}
            >
              <Option value="">All Current Pet Counts</Option>
              {currentPetsOptions.map((count, index) => (
                <Option key={index} value={count.toString()}>{count}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={dates => setDateRange(dates ? [dates[0], dates[1]] : [null, null])}
            />
          </Col>
        </Row>

        {/* Data Table */}
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
      </Content>
    </div>
  );
}

export default ViewApplications;
