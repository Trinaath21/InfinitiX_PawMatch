import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { List, Avatar, notification } from 'antd';
import axios from 'axios';

const PostDetails = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchPostAndComments();
  }, [post_id]);

  const fetchPostAndComments = async () => {
    try {
      const postResponse = await axios.get(`http://localhost:8000/posts/${post_id}`);
      setPost(postResponse.data);

      const commentsResponse = await axios.get(`http://localhost:8000/posts/${post_id}/comments`);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Error fetching post or comments:", error);
      notification.error({ message: 'Failed to load post details.' });
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
      {post && (
        <>
          <h2>{post.title}</h2>
         <div style={{ marginBottom: '16px' }}>
       {/*      <Avatar src={post.user.avatar} /> */}
            <span style={{ marginLeft: '8px' }}>Posted by:  {post?.user?.name || 'Unknown User'}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.images && post.images.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h3>Uploaded Images</h3>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
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
              <List.Item key={comment.id}>
                <List.Item.Meta
                 avatar={<Avatar src={comment?.user?.avatar || "https://via.placeholder.com/150"} />}
                 title={comment?.user?.name || 'Anonymous'}
                 description={comment?.content || 'No comment available'}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );
};

export default PostDetails;
