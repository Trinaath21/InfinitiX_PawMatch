import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Row, Col, Input, Select, DatePicker, Pagination, Spin, Tooltip, Empty } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ViewPublicListing = () => {
    const [district, setDistrict] = useState('');
    const [species, setSpecies] = useState('');
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [page, setPage] = useState(1);
    const [postData, setPostData] = useState([]);
    const [appliedPostIds, setAppliedPostIds] = useState([]); // Store IDs of posts the user applied for
    const [districtOptions, setDistrictOptions] = useState([]);
    const [speciesOptions, setSpeciesOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const id = 21; // Replace with the actual user_id
    const itemsPerPage = 6;

    useEffect(() => {
        // Fetch combined data (posts and applications)
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get-posts-and-applications?id=${id}`);
                console.log('Combined Data:', response.data);

                // Extract posts and applications from the response
                const { posts, applications } = response.data;

                // Store post data
                setPostData(posts);

                // Extract adoption_post_id from applications and store
                const appliedIds = applications.map(app => app.adoption_post_id);
                setAppliedPostIds(appliedIds);

                // Extract unique district and species options
                const uniqueDistricts = [...new Set(posts.map(post => post.district))];
                const uniqueSpecies = [...new Set(posts.map(post => post.species))];
                setDistrictOptions(uniqueDistricts);
                setSpeciesOptions(uniqueSpecies);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Filter posts based on conditions
    const filteredPosts = postData.filter(post => {
        const matchesDistrict = district ? post.district === district : true;
        const matchesSpecies = species ? post.species === species : true;
        const matchesKeyword = searchKeyword
            ? post.name.toLowerCase().includes(searchKeyword.toLowerCase()) || post.breed.toLowerCase().includes(searchKeyword.toLowerCase())
            : true;
        const matchesDateRange = dateRange[0] && dateRange[1]
            ? moment(post.created_at).isBetween(dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD'), 'day', '[]')
            : true;
        const notApplied = !appliedPostIds.includes(post.adoption_post_id); // Exclude applied posts
        console.log(`Post ${post.adoption_post_id}: notApplied = ${notApplied}`);

        return matchesDistrict && matchesSpecies && matchesKeyword && matchesDateRange && notApplied;
    });

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

    const handleApply = (adoption_post_id) => {
        console.log("Viewing details for post id:", adoption_post_id);
        navigate('/applyAdoption', { state: { adoption_post_id: adoption_post_id } });
    };

    const handlePageChange = (page) => {
        setPage(page);
    };
    //   const handleCardClick = (adoption_post_id) => {
    //     navigate('/ViewMoreAdoption', {
    //       state: { adoption_post_id: adoption_post_id, page: "/publicLostReportList" },
    //     });
    //   };
    const handleCardClick = (adoption_post_id) => {
        console.log("Viewing details for post id:", adoption_post_id);
        navigate('/ViewMoreAdoption', { state: { adoption_post_id: adoption_post_id, page: "/ViewPublicListing" } });
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
                    <Select
                        placeholder="Select Species"
                        style={{ width: '100%' }}
                        value={species}
                        onChange={(value) => setDistrict(value)}
                    >
                        <Option value="">All Species</Option>
                        {speciesOptions.map((species, index) => (
                            <Option key={index} value={species}>{species}</Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <RangePicker
                        style={{ width: '100%' }}
                        onChange={dates => setDateRange(dates ? [dates[0], dates[1]] : [null, null])}
                    />
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Input
                        placeholder="Search by Name or Breed"
                        value={searchKeyword}
                        onChange={e => setSearchKeyword(e.target.value)}
                    />
                </Col>
            </Row>

            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                </div>
            ) : filteredPosts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Empty description="No results found" />
                </div>
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        {currentPosts.map(post => (
                            <Col xs={24} sm={12} md={8} lg={8} key={post.adoption_post_id}>
                                <Tooltip title="Click to view more">
                                    <Card
                                        cover={
                                            <img
                                                src={post.petImage}
                                                alt="Pet image"
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
                                        onClick={() => handleCardClick(post.adoption_post_id)}
                                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 153, 255, 0.6)')}
                                        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)')}
                                    >
                                        <Card.Meta
                                            title={
                                                <Typography.Text ellipsis={{ tooltip: post.name }}>
                                                    {post.name}
                                                </Typography.Text>
                                            }
                                            description={
                                                <div>
                                                    <Typography.Text ellipsis={{ tooltip: `Breed: ${post.breed}` }}>
                                                        Breed: {post.breed}
                                                    </Typography.Text>
                                                    <div> {/* Block container for each line */}
                                                        <Typography.Text ellipsis style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            Gender: {post.gender}
                                                        </Typography.Text>
                                                    </div>
                                                    <div>
                                                        <Typography.Text ellipsis style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            Age: {post.age}
                                                        </Typography.Text>
                                                    </div>
                                                    <div> {/* New line for additional text */}
                                                        <Typography.Text ellipsis style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            Location: {post.current_location}
                                                        </Typography.Text>
                                                    </div>
                                                    <div> {/* New line for additional text */}
                                                        <Typography.Text ellipsis style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            Status: {post.status}
                                                        </Typography.Text>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        marginTop: '16px',  // Optional: Adjust spacing from other elements
                                                    }}>
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent the click event from propagating to the card
                                                                handleApply(post.adoption_post_id);
                                                            }}
                                                            //navigate('/ViewMoreAdoption', { state: { adoption_post_id: adoption_post_id } });
                                                            type="default"
                                                            style={{
                                                                backgroundColor: post.status === 'available' ? '#ecffe3' : '',
                                                                color: post.status === 'available' ? '#52c41a' : '#d9d9d9',
                                                                borderColor: post.status === 'available' ? '#b7eb8f' : '#d9d9d9',
                                                            }}
                                                            disabled={!(post.status === 'available')}
                                                        >
                                                            Apply to Adopt
                                                        </Button>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Tooltip>
                            </Col>
                        ))}
                    </Row>

                    <Pagination
                        current={page}
                        pageSize={itemsPerPage}
                        total={filteredPosts.length}
                        onChange={handlePageChange}
                        style={{ textAlign: 'center', marginTop: '20px' }}
                    />
                </>
            )}
        </div>
    );
};

export default ViewPublicListing;
