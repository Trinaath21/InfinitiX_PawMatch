import React, { useState, useEffect } from 'react';
import { Layout, List, Avatar, Modal, Form, Input, Button, notification, Space, FloatButton } from 'antd';
import { EditOutlined, FileOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { TextArea } = Input;

const UserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [form] = Form.useForm();

  // Fetch user posts when the component mounts or when modal opens
  useEffect(() => {
    if (isModalVisible) {
      // Fetch the user's posts from your backend
      axios.get('http://localhost:8000/user/posts')
        .then((response) => {
          setUserPosts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user posts:', error);
        });
    }
  }, [isModalVisible]);

  // Show the modal with the user's posts
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Close the modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
    form.resetFields();
  };

  // Handle post edit
  const handleEdit = (post) => {
    setSelectedPost(post);
    // Pre-fill the form with the selected post's data
    form.setFieldsValue({
      title: post.title,
      content: post.content,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Update the post content in the backend
      await axios.put(`http://localhost:8000/posts/${selectedPost.id}`, values);

      notification.success({
        message: 'Success',
        description: 'Post updated successfully!',
      });

      // Update the local post data
      setUserPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === selectedPost.id ? { ...post, ...values } : post))
      );

      handleCancel();
    } catch (error) {
      console.error('Error updating the post:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update the post. Please try again.',
      });
    }
  };

  return (
    <Content style={{ margin: '16px' }}>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
        }}
        icon={<FileOutlined />}
      >
        <FloatButton icon={<EditOutlined />} onClick={showModal} />
      </FloatButton.Group>

      <Modal
        title="Your Posts"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          itemLayout="vertical"
          dataSource={userPosts}
          renderItem={(post) => (
            <List.Item
              key={post.id}
              actions={[
                <Button type="link" onClick={() => handleEdit(post)}>Edit</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={post.avatar} />}
                title={post.title}
                description={post.description}
              />
              {post.content}
            </List.Item>
          )}
        />

        {selectedPost && (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: 'Please enter content' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form>
        )}
      </Modal>
    </Content>
  );
};

export default UserPosts;
