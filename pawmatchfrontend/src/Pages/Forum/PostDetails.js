import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { List, Avatar, notification,Spin,Button,Modal, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';

//import { saveAuthToken, getAuthToken, isAuthenticated } from '../GeneralComponents/localStorage.js';// Import auth helper functions

const { TextArea } = Input;

const PostDetails = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false); // For modal visibility
  const [selectedImage, setSelectedImage] = useState(""); // For the clicked image
  const [newComment, setNewComment] = useState(""); // State for new comment
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
     // Check if user is authenticated
     const token = localStorage.getItem('authToken');
     setIsAuthenticated(!!token); // Set to true if token exists
     const isAuthenticated = localStorage.getItem('authToken') !== null;

    fetchPostAndComments();
  }, [post_id]);

  const fetchPostAndComments = async () => {
    setLoading(true);
    try {
      const postResponse = await axios.get(`http://localhost:8000/posts/${post_id}`);
      setPost(postResponse.data);

      const commentsResponse = await axios.get(`http://localhost:8000/posts/${post_id}/comments`);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Error fetching post or comments:", error);
      notification.error({ message: 'Failed to load post details.' });
    }

    finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the clicked image URL
    setVisible(true); // Open the modal
  };

  const closeModal = () => {
    setVisible(false); // Close the modal
    setSelectedImage(""); // Clear the selected image
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      notification.error({ message: 'Comment cannot be empty.' });
      return;
    }
    try {
      const token = localStorage.getItem('authToken'); // Get the auth token
      const userRole = localStorage.getItem('role'); // Get the user role from local storage
      const memberId = localStorage.getItem('member_id');
      const shelterId = localStorage.getItem('shelter_id');
console.log('Role:', userRole, 'Member ID:', memberId, 'Shelter ID:', shelterId);
     /* const response = await axios.post(
        `http://localhost:8000/api/posts/${post_id}/comments`,
        { comment:newComment,
          role: userRole,
          shelter_id: userRole === 'shelter' ? 1 : null,
          member_id: userRole === 'member' ? memberId : null,
         },
        { headers: { Authorization: `Bearer ${token}` } }
      );*/
      const payload = {
        comment: newComment,
        role: userRole,
        post_id: post_id, // Ensure post_id is part of the payload
      };
  
      if (userRole === "member") {
        payload.member_id = memberId || null;
      } else if (userRole === "shelter") {
        payload.shelter_id = shelterId || null;
      }
  
      const response = await axios.post(
        `http://localhost:8000/api/posts/${post_id}/comments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );


      // Add the new comment to the state
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment(""); // Clear the input
      notification.success({ message: 'Comment added successfully!' });
    } catch (error) {
      console.error("Error adding comment:", error);
      notification.error({ message: 'Failed to add comment.' });
    }
  };

  

  if (loading) {
    return <Spin style={{ display: 'block', margin: '20px auto' }} />;
  }

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
      {/* Back Button */}
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} // Go back to the previous page
        style={{ marginBottom: '10px' }}
      >
        Back
      </Button>
      {post && (
        <>
          
         <div style={{ marginBottom: '16px' }}>
         <Avatar src={post?.user?.avatar || 'https://via.placeholder.com/150'} />
            <span style={{ marginLeft: '8px' }}>{post?.member?.name ||post?.shelter?.shelter_name|| 'Unknown User'}</span>
          </div>
          <h2>{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.images && post.images.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              {/*<h3>Uploaded Images</h3> */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {post.images.map((image, index) => (
                  <img
                    key={index}

                    src={`http://localhost:8000${image}`}
                    alt={`Images ${index + 1}`}
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: "pointer", // Indicate the image is clickable
                    }}
                    onClick={() => handleImageClick(`http://localhost:8000${image}`)} // Open modal with the clicked image
                  />
                ))}
              </div>
            </div>
          )}
          <List

             header={`${comments.length} Comments`}
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={comment => (
              <List.Item key={comment.comment_id}>
                <List.Item.Meta
                 avatar={<Avatar src={comment?.shelter?.profile_picture || comment?.member?.profile_picture || "https://via.placeholder.com/150"} />}
                 title={comment?.member?.name ||comment?.shelter?.shelter_name||'Anonymous' }
                 description={comment?.comment || 'No comment available'}
                />
              </List.Item>
            )}
          />
           <div style={{ marginTop: '16px' }}>
            {localStorage.getItem('authToken') !== null && localStorage.getItem('role') === 'member' || localStorage.getItem('role') === 'shelter'? (
              <>
                <TextArea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                />
                <Button
                  type="primary"
                  onClick={handleAddComment}
                  style={{ marginTop: '8px' }}
                >
                  Comment
                </Button>
              </>
            ) : (
              <p style={{ color: 'red' }}>Only members can comment.</p>
            )}
          </div>
        </>
      )}

      {/* Modal for displaying the full-size image */}
      <Modal
        visible={visible}
        footer={null}
        onCancel={closeModal}
        centered
        bodyStyle={{ padding: 0, margin: 0,backgroundColor: "transparent", display: "flex",justifyContent: "center",alignItems: "center", }}
        //width="auto" // Automatically adjust the modal width to the image
        style={{
          padding: 0,margin: 0,
          backgroundColor: "transparent", // Fully transparent background
         
          //maxWidth: "90vw", // Prevent the image from being too wide
          //maxHeight: "90vh", // Prevent the image from being too tall
          overflow: "hidden", // Prevent scrolling in the modal
          
        }}
        
      >
        <img
          src={selectedImage}
          alt="Full-size view"
          style={{
            width: "100%",
            maxHeight: "100vh", // Prevent overflow of the viewport height
           // borderRadius: "8px",
            display: "block", // Prevent inline padding or margin
          }}
        />
      </Modal>
    </div>
  );
};

export default PostDetails;
