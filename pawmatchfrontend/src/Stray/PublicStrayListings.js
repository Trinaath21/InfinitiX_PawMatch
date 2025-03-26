import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Input, Select, DatePicker, Pagination, Spin, Tooltip, Empty } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PublicStrayListings = () => {
  const [district, setDistrict] = useState('');
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [page, setPage] = useState(1);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const[reportData,setReportData] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const role = parseInt(localStorage.getItem('role'), 10);
  const userID =
    role === "guest" ? 9999999 : parseInt(localStorage.getItem("user_id"), 10);
  const itemsPerPage = 6;
  useEffect(() => {
    // Define the function to fetch data
    const fetchReportData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/getAllStrayReports',{
          userID: userID //later must use localStorage.
      }); 
        console.log("report_data",response.data);
        setReportData(response.data.data);
        const uniqueDistricts = [...new Set(response.data.data.map((report) => report.district))];
        setDistrictOptions(uniqueDistricts);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching report data:", error); 
      }
    };

    fetchReportData(); 
  }, []); 

  // useEffect(() => {
  //   const fetchPetImages = async () => {
  //     const petsWithImages = await Promise.all(
  //       petData.map(async (pet) => {
  //         const response = await axios.get('https://dog.ceo/api/breeds/image/random');
  //         return { ...pet, image: response.data.message };
  //       })
  //     );
  //     setPets(petsWithImages);
  //     setLoading(false);
  //   };

  //   fetchPetImages();
  // }, []);

  const filteredReports = reportData.filter((report) => {
  const matchesDistrict = district ? report.district === district : true;
  const matchesSpecies = searchKeyword ? report.species === searchKeyword : true; // Assuming "species" is a field in the report data
    
    const matchesDateRange = dateRange[0] && dateRange[1]
      ? moment(report.dateSighting).isBetween(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD"), 'day', '[]')
      : true;
  
    return matchesDistrict && matchesSpecies && matchesDateRange;
  });
  

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setPage(page);
  };
  const handleCardClick = (reportID) => {
    navigate('/viewMoreStrayDetails', {
      state: { reportID: reportID, page: "/ViewMoreStrayDetails" },
    });

 // Pass the report_id in the state
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Select
          placeholder="Select District"
          style={{ width: '100%' }}
          value={district}
          onChange={(value) => setDistrict(value)}
        >
          <Option value="">All Districts</Option>
          {districtOptions.map((district, index) => (
            <Option key={index} value={district}>{district}</Option>
          ))}
        </Select>
      </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={(dates) => setDateRange(dates ? [dates[0], dates[1]] : [null, null])}
          />
        </Col>

        {/* <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Search by Breed"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </Col> */}
        <Col xs={24} sm={12} md={8} lg={6}>
      <Select
        placeholder="Search by Species"
        style={{ width: '100%' }}
        value={searchKeyword}
        onChange={(value) => setSearchKeyword(value)}
      >
        <Option value="">All Species</Option>
        <Option value="cat">Cat</Option>
        <Option value="dog">Dog</Option>
      </Select>
  </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Empty description="No results found" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {currentReports.map((report) => (
              <Col xs={24} sm={12} md={8} lg={8} key={report.report_id}>
                <Tooltip title="Click to view more">
                <Card
                  cover={
                    <img 
                      alt={report.breed} 
                      src={`data:image/jpeg;base64,${report.images}`} 
                      style={{ objectFit: 'cover', height: 300, width: '100%' }} 
                    />
                  }
                  style={{
                    height: 'auto',
                    width: '100%',
                    maxWidth: '550px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'box-shadow 0.3s ease',
                    cursor: 'pointer',
                  }}
                  hoverable
                  onClick={() => handleCardClick(report.report_id)}  // Pass the specific report_id
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 153, 255, 0.6)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)')}
                >
                  <Card.Meta 
                    description={
                      <Typography.Text ellipsis={{ tooltip: `Breed: ${report.breed}` }}>
                        Breed: {report.breed}
                      </Typography.Text>
                    }
                  />
                  <div>
                    <Typography.Text ellipsis style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Colour: {report.colour}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text ellipsis style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Date of Sighting: {report.dateSighting}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text ellipsis style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Location: {report.location}
                    </Typography.Text>
                  </div>
                </Card>

                </Tooltip>
              </Col>
            ))}
          </Row>

          <Pagination
            current={page}
            pageSize={itemsPerPage}
            total={filteredReports.length}
            onChange={handlePageChange}
            style={{ textAlign: 'center', marginTop: '20px' }}
          />
        </>
      )}
    </div>
  );
};

export default PublicStrayListings;
