import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Layout, Button, Space, Modal, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Typography from '@mui/material/Typography';
//import Button from '@mui/material/Button';
import { CardMedia } from "@mui/material";
import { styled } from '@mui/material/styles';
import FooterBar from '../General Components/FooterBar.js';
import Sidebar from '../General Components/SideBar.js';



const muiCache = createCache({
  key: "mui-datatables",
  prepend: true
});

// const CustomButton = styled(Button)({
//   fontSize: '0.75rem',
//   padding: '4px 12px',
//   minWidth: '80px',
//   borderRadius: '8px',
//   marginRight: '8px',
//   margin: '5px',
// });

const theme = createTheme({
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          flexDirection: "row", // Stack title and icons vertically
          justifyContent: "center",
          alignItems: "center", // Center-align toolbar items
          padding: "8px 0",
          gap: "0px", // Add space between title and icons
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          marginLeft: "0",
          //textAlign: "center",
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

function ViewPersonalListing({ id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  //const { Title } = Typography;
  const { Content, Footer, Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const refreshTableData = async () => {
    setLoading(true); // Show loading indicator
    try {
      const response = await axios.get(`http://localhost:8000/api/adoption-posts?id=${id}`);
      const adoptionData = response.data.map(post => ({
        name: post.name,
        species: post.species,
        breed: post.breed,
        age: post.age,
        gender: post.gender,
        size: post.size,
        weight: post.weight,
        vaccination_status: post.vaccination_status,
        spayed_neutered_status: post.spayed_neutered_status,
        health_issues: post.health_issues,
        current_location: post.current_location,
        behavioral_traits: post.behavioral_traits,
        adoption_fee: post.adoption_fee,
        status: post.status,
        petImage: post.petImage,
        adoption_post_id: post.adoption_post_id, // Assume each post has an ID
      }));
      setData(adoptionData); // Update table data state
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const handleDelete = (adoption_post_id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this post?',
      content: 'This action is irreversible.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // Send delete request to the server
          await axios.post('http://localhost:8000/api/deleteAdoptionPost', {
            adoption_post_id: adoption_post_id
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


  useEffect(() => {
    refreshTableData();
  }, [id]); // Dependency array to re-fetch data when `id` changes

  const columns = [
    { name: "adoption_post_id", label: "Post ID", options: { filter: false, sort: false } },
    { name: "name", label: "Name" },
    { name: "species", label: "Species" },
    { name: "breed", label: "Breed" },
    { name: "age", label: "Age" },
    { name: "gender", label: "Gender" },
    //{ name: "size", label: "SIZE" },
    //{ name: "weight", label: "WEIGHT" },
    { name: "vaccination_status", label: "Vaccination Status" },
    { name: "spayed_neutered_status", label: "Spay/Neuter Status" },
    //{ name: "health_issues", label: "HEALTH ISSUES" },
    //{ name: "current_location", label: "CURRENT LOCATION" },
    //{ name: "behavioral_traits", label: "BEHAVIORAL TRAITS" },
    //{ name: "adoption_fee", label: "ADOPTION FEE" },
    { name: "status", label: "Status" },
    {
      name: "petImage",
      label: "Pet Image",
      options: {
        customBodyRender: (value) => (
          value ? (
            <CardMedia
              component="img"
              image={value}
              alt="Pet Image"
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            "No Image"
          )
        ),
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const isAvailable = tableMeta.rowData[8] === "available"; // Adjust index 3 to your status column position

          return (
            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              {/* Left Column: View Applications and View More */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* View Applications Button */}
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  style={{ backgroundColor: '#f6ffed', color: '#52c41a', borderColor: '#b7eb8f' }}
                >
                  View Applications
                </Button>

                {/* View More Button */}
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  style={{ backgroundColor: '#e6f7ff', color: '#1890ff', borderColor: '#91d5ff' }}
                >
                  View More
                </Button>
              </div>

              {/* Right Column: Edit and Delete */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Edit Button */}
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  style={{
                    color: isAvailable ? '#fa8c16' : '#d9d9d9',
                    borderColor: isAvailable ? '#ffd591' : '#d9d9d9',
                  }}
                  disabled={!isAvailable}
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
              </div>
            </Space>


          );
        },
      },
    },
    // {
    //   name: "Actions",
    //   label: "Actions",
    //   options: {
    //     customBodyRender: (value, tableMeta) => {
    //       const postId = tableMeta.rowData[tableMeta.columnIndex - 1]; // Assuming the ID column is before Actions
    //       return (
    //         <div>
    //           <CustomButton
    //             variant="contained"
    //             style={{ backgroundColor: '#007BFF', color: '#fff' }}
    //             onClick={() => handleEdit(postId)}
    //           >
    //             Edit
    //           </CustomButton>
    //           <CustomButton
    //             variant="contained"
    //             style={{ backgroundColor: '#FF4D4D', color: '#fff' }}
    //             onClick={() => handleDelete(postId)}
    //           >
    //             Delete
    //           </CustomButton>
    //         </div>
    //       );
    //     },
    //   },
    // },
  ];

  // const options = {
  //   //customToolbar: () => <CustomToolbar />,
  //   responsive: "scroll", // Deprecated, as requested
  //   tableBodyHeight: "500px", // Adjust height as needed
  //   selectableRows: "none", // Disable row selection
  // };

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    selectableRows: "none",
    print: false,
    download: false,
    viewColumns: true,
    search: true,
  };

  const handleEdit = (postId) => {
    console.log(`Editing post with ID: ${postId}`);
    // Implement edit functionality
  };

  // const handleDelete = (postId) => {
  //   console.log(`Deleting post with ID: ${postId}`);
  //   // Implement delete functionality, such as sending a request to the backend
  // };

  return (
    <div>
      <Content style={{ margin: '24px 16px 0' }}>
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0px', background: '#fff', borderRadius: '8px', margin: 'auto' }}>

          <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
              <MUIDataTable
                title={<Typography variant="h6">Your Adoption Posts</Typography>}
                data={data}
                columns={columns}
                options={options}
              //title={"Your Adoption Posts"}

              />
            </ThemeProvider>
          </CacheProvider>
        </div>
      </Content>

      {/* <Modal
        visible={previewVisible}
        title="Pet Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Pet Image" style={{ width: '100%' }} src={previewImage} />
      </Modal> */}
    </div>
  );
}

//ReactDOM.render(<ViewPersonalListing id={1} />, document.getElementById("root"));
export default ViewPersonalListing;
