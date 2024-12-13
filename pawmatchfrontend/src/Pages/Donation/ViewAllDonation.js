import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { Modal, Typography, CardMedia, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Layout, Select } from "antd";
import { EyeOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const { Option } = Select;

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
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
          fontSize: "1.8rem",
          fontWeight: "bold",
          "@media (max-width: 599.5px)": {
            textAlign: "center",
          },
        },
      },
    },
  },
});

function ViewAllDonation() {
  const { Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const [shelter, setShelter] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [donationDetails, setDonationDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch shelters
    axios
      .get("http://localhost:8000/api/shelter")
      .then((response) => {
        const updatedShelters = response.data.map((shelter) => ({
          ...shelter,
          location: `${shelter.address}, ${shelter.district}, ${shelter.state}`,
        }));
        setShelter(updatedShelters);

        const uniqueDistricts = [
          ...new Set(updatedShelters.map((shelter) => shelter.district)),
        ];
        setDistricts(uniqueDistricts);
        console.log(updatedShelters);
      })
      .catch((error) => {
        console.error("Error fetching shelters:", error);
      });
  }, []);

  const handleViewMore = (shelter_id) => {
    // Fetch shelter donation details
    axios
      .get(`http://localhost:8000/api/shelter/${shelter_id}/donations`)
      .then((response) => {
        console.log("Donation details:", response.data);
        setDonationDetails(response.data);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching donation details:", error);
        setDonationDetails(null);
      })
      .finally(() => {
        setIsModalOpen(true); // Ensure modal opens even if details are unavailable
      });
  };

  const filteredShelters = shelter.filter((item) =>
    selectedDistrict ? item.district === selectedDistrict : true
  );

  const columns = [
    { name: "shelter_id", label: "Shelter ID" },
    { name: "shelter_name", label: "Shelter Name" },
    { name: "phone_number", label: "Phone Number" },
    { name: "description", label: "Description" },
    { name: "location", label: "Location" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const shelter_id = tableMeta.rowData[0];
          return (
            <button
              onClick={() => handleViewMore(shelter_id)}
              style={{
                backgroundColor: "#e6f7ff",
                color: "#1890ff",
                borderColor: "#91d5ff",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <EyeOutlined style={{ color: "#1890ff" }} />
              View More
            </button>
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
    customToolbar: () => (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Toolbar Icons (Search, View Columns) */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", flexGrow: 1 }}
        >
          {/* This part is handled by MUI, no need to define custom icons */}
        </div>

        {/* District Dropdown placed near the icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
            marginTop: "5px",
          }}
        >
          <Select
            placeholder="Select District"
            style={{
              width: "150px", // Adjust the width for responsiveness
              maxWidth: "100%",
              textAlign: "center",
            }}
            value={selectedDistrict}
            onChange={(value) => setSelectedDistrict(value)}
          >
            <Option value="">All Districts</Option>
            {districts.map((district, index) => (
              <Option key={index} value={district}>
                {district}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    ),
  };

  return (
    <>
      {/* <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} /> */}

      <Content style={{ margin: "24px 16px 0" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "0px",
            background: "#transparent",
            borderRadius: "8px",
            margin: "auto",
          }}
        >
          <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
              <MUIDataTable
                title={<Typography variant="h6">Shelters</Typography>}
                data={filteredShelters}
                columns={columns}
                options={options}
              />
            </ThemeProvider>
          </CacheProvider>
        </div>
      </Content>
      {/* <FooterBar /> */}

      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "white",
              margin: "100px auto",
              width: "400px",
              maxHeight: "80vh", // Limit the height to 80% of the viewport height
              overflow: "auto", // Enable scrolling if content exceeds the height
              position: "relative",
              borderRadius: "8px",
            }}
          >
            {/* Close button */}
            <IconButton
              aria-label="close"
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            >
              <CloseIcon />
            </IconButton>

            {donationDetails && Object.keys(donationDetails).length > 0 ? (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  Donation Details
                </Typography>
                <p>
                  Account Owner Name:{" "}
                  {donationDetails.account_owner_name || "N/A"}
                </p>
                <p>Account Number: {donationDetails.account_number || "N/A"}</p>
                {donationDetails.qr_code ? (
                  <CardMedia
                    component="img"
                    image={donationDetails.qr_code}
                    alt="QR Code"
                    style={{ width: "100%", height: "auto", marginTop: "10px" }}
                  />
                ) : (
                  <p>No QR Code available</p>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", marginTop: "80px" }}>
                <ExclamationCircleOutlined
                  style={{
                    fontSize: "48px",
                    color: "#ff4d4f", // Eye-catching red color for the icon
                    marginBottom: "20px",
                  }}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  No donation details available for this shelter.
                </Typography>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* </Layout> */}
    </>
  );
}

export default ViewAllDonation;
