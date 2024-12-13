import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Spin,
  Select,
  Modal,
  Input,
  Badge,
  Image,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewMoreStrayDetails = () => {
  const navigate = useNavigate();
  const role = parseInt(localStorage.getItem("role"), 10);
  const [loading, setLoading] = useState(true);
  const { Title, Text } = Typography;
  const [caseInfo, setCaseInfo] = useState({});
  const [data, setData] = useState({});

  const location = useLocation();

  useEffect(() => {
    const getSpecificReportData = async () => {
      try {
        const reportID = location.state?.reportID;
        if (reportID) {
          const response = await axios.post(
            "http://localhost:8000/api/getSpecificStrayReport",
            {
              reportID: reportID,
            }
          );
          console.log("hi", response.data.data);
          setCaseInfo(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching specific report data:", error);
      }
    };

    getSpecificReportData();
  }, [location.state]);

  const borderStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f2f9ff",
    borderRight: "1px solid #ccc", // Vertical line between columns
  };

  // const lastColumnStyle = {
  //   ...borderStyle,
  //   borderRight: 'none', // Remove the border from the last column
  // };

  // const headerStyle = {
  //   backgroundColor: '#004b80',
  //   color: '#fff',
  //   textAlign: 'center',
  //   padding: '10px',
  //   borderRight: '1px solid #ccc',
  // };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <div
        style={{ backgroundColor: "#fff", minWidth: "50vh", margin: "auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Button
            type="primary"
            onClick={() => navigate("/PersonalStrayListings")}
            style={{ backgroundColor: "#004b80" }}
          >
            Back
          </Button>
        </div>

        <Card
          bodyStyle={{ padding: 0 }}
          hoverable
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <Row>
            <Col
              span={24}
              style={{
                backgroundColor: "#004b80",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <Title level={4} style={{ color: "#fff", margin: 0 }}>
                Report Information
              </Title>
            </Col>
          </Row>

          {/** Report Information Rows */}
          <Row
            gutter={[0, 16]}
            style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
          >
            <Col xs={24} sm={12} style={{ padding: "0 16px" }}>
              <Text>
                <strong>Report ID:</strong> {caseInfo.report_id}
              </Text>
            </Col>

            <Col xs={24} sm={12} style={{ padding: "0 16px" }}>
              <Text>
                <strong>Report Created Date:</strong> {caseInfo.created_at}
              </Text>
            </Col>
          </Row>

          {/* <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Created By:</strong> {caseInfo.user.name}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Creator Email:</strong> {caseInfo.user.email}</Text>
        </Col>
      </Row> */}

          {/* <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Creator Phone Number:</strong> {caseInfo.user.phoneNumber}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Reply Reports Quantity:</strong> {caseInfo.noOfReplies}</Text>
        </Col>
      </Row> */}

          {/* <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Location of Stray:</strong> {caseInfo.location}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>District:</strong> {caseInfo.district}</Text>
        </Col>
      </Row> */}
        </Card>

        <Card
          styles={{
            body: { padding: 0 },
          }}
          hoverable
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          {/* <Row>
        <Col span={24} style={{ backgroundColor: '#004b80', padding: '10px', textAlign: 'center' }}>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>Pet Information</Title>
        </Col>
      </Row>

      {/** Pet Information Rows */}
          {/* <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Pet Name:</strong> {caseInfo.pet.breed}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Species:</strong> {caseInfo.pet.colour}</Text>
        </Col>
      </Row> */}

          {/* <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Breed:</strong> {caseInfo.pet.species}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Color:</strong> {caseInfo.pet.color}</Text>
        </Col>
      </Row> */}

          {/* <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Age (Years):</strong> {caseInfo.pet.age}</Text>
        </Col>
        <Col xs={24} sm={12} style={{ padding: '0 16px' }}>
          <Text><strong>Size (KG):</strong> {caseInfo.pet.size}</Text>
        </Col>
      </Row> */}

          {/* <Row gutter={[0, 16]} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <Col span={24} style={{ padding: '0 16px' }}>
          <Text><strong>Stray Description:</strong> {caseInfo.pet.description}</Text>
        </Col>
      </Row> */}

          {/* <Row style={{ padding: '10px 0', alignItems: 'center' }}>
        <Col xs={24} sm={6} style={{ padding: '0 16px', textAlign: 'left' }}>
          <Text><strong>Stray Image:</strong></Text>
        </Col>
        
        <Col xs={24} sm={18} style={{ padding: '0 16px', marginLeft:"-25%", textAlign: 'center' }}>
          <Image.PreviewGroup
            items={[{ src: `data:image/png;base64,${caseInfo.pet.image}`, alt: 'Pet Image' }]}
          >
            <Image
              width={200}
              src={`data:image/png;base64,${caseInfo.pet.images}`}
              alt="Pet Image"
              style={{ borderRadius: '8px', objectFit: 'cover', marginTop: '8px' }}
            />
          </Image.PreviewGroup>
        </Col>
      </Row>  */}
        </Card>
      </div>
    </div>
  );
};

export default ViewMoreStrayDetails;
