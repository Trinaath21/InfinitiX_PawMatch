
import React, { useState, useEffect } from 'react';
import IconText from './IconText'; 
import {
  Breadcrumb,
  Layout,
  List,
  Avatar,
  Modal,
  Form,
  Input,
  Button,
  notification,
  theme,
  Upload,
  FloatButton,
} from 'antd';
import { MessageOutlined, FileOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



//const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const { Content } = Layout;

const ContentComponent = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditListVisible, setIsEditListVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [data, setData] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  //const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // Fetch all posts on component mount
  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Fetch all posts from the API
  const fetchAllPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/posts');
      const postsData = response.data.map(post => ({
        ...post,
        images: Array.isArray(post.images) ? post.images : JSON.parse(post.images || "[]")
    }));
      setData(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      notification.error({ message: 'Failed to fetch posts.' });
    }
  };

  // Fetch user's posts from the API
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user/posts/1'); // Temporary user_id: 1
      setUserPosts(response.data);
      setIsEditListVisible(true);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      notification.error({ message: 'Failed to fetch user posts.' });
    }
  };

  // Show modal to create a new post
  const showModal = () => {
   form.resetFields();
    setEditorContent("");
    setFileList([]);
    setIsEditing(false);
    setIsModalVisible(true);
  };

  // Show modal to edit an existing post
  const showEditModal = async (post_id) => {
    try {

      setIsEditListVisible(false);

       // Fetch post data
      const response = await axios.get(`http://localhost:8000/posts/${post_id}`);
      const postData = response.data;

      // Ensure imagesArray is correctly parsed as an array
      let imagesArray = Array.isArray(postData.images) ? postData.images : JSON.parse(postData.images || "[]");

      // Prefill form fields
      form.setFieldsValue({ title: postData.title });
      setEditorContent(postData.content);  

       
    /*    // Ensure imagesArray is an array
        if (!Array.isArray(imagesArray)) {
            imagesArray = JSON.parse(imagesArray) || [];
        }
*/
     //   setFileList(imagesArray.map(image => image.url)); // or however you are handling image URLs
     //const imagesArray = Array.isArray(postData.images) ? postData.images : JSON.parse(postData.images); 
     //const imagesArray = Array.isArray(postData.images) ? postData.images : (postData.images);                                                  
  
      // Map over the images to create the file list, dynamically setting the file name
     setFileList(
        imagesArray.map((image, index) => ({
        uid: index.toString(),
        name: `image-${index}.${image.split('.').pop()}`,
        status: 'done',
        url: `http://localhost:8000${image}`,
       })) 
      );
      
      setCurrentPostId(post_id); // Add this line
      setIsEditing(true);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching post data:", error);
      notification.error({ message: 'Failed to fetch post data.' });
    }
  };

 const handleDelete = async (post_id) => {
    try {
        const response = await axios.delete(`http://localhost:8000/posts/${post_id}`);
        
        if (response.status === 200) {
            console.log("Post deleted successfully");
            // Refresh the userPosts list to reflect deletion
            setUserPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== post_id));
            notification.success({ message: 'Post deleted successfully!' });
        } else {
            console.error("Failed to delete post");
            notification.error({ message: 'Failed to delete post.' });
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        notification.error({ message: 'Error occurred while deleting post.' });
    }
};



  // Handle form submission for creating or updating a post
const handleSubmit = async () => {
    try {
        const values = await form.validateFields();
        const formData = new FormData();
        
        formData.append("title", values.title);
        formData.append("content", editorContent);

     
       if (Array.isArray(fileList) && fileList.length > 0) {
            fileList.forEach((file) => {
                if (file.originFileObj){
                formData.append("images[]", file.originFileObj);
            } else if (file.url) {
                formData.append("existingImages[]", file.url); // Existing image URL
             }
       });
        
       } else {
            console.warn("File list is empty or not an array", fileList);
        }

        // Log each FormData entry (files might not show directly in the console)
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }  

        const url = isEditing ? `http://localhost:8000/posts/${currentPostId}` : 'http://localhost:8000/posts';
        const method = isEditing ? 'post' : 'post';
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
       /* await axios[method](url, formData, {
            headers: { 'X-CSRF-TOKEN': csrfToken, // Include CSRF token
                        'Content-Type': 'multipart/form-data' },
        }); */

        await axios({
            method,
            url,
            data: formData,
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,  // Ensures cookies are sent with cross-origin requests
        });

        notification.success({ message: isEditing ? 'Post updated successfully!' : 'Post created successfully!' });

        // Reset fields and update the UI after successful submission
        form.resetFields();
        setEditorContent("");
        setFileList([]);
        setIsModalVisible(false);
        setIsEditListVisible(false);
        fetchAllPosts(); // Refresh the post list

    } catch (error) {
        console.error("Error submitting the post:", error);
        notification.error({ message: 'Failed to submit the post.' });
    }
};
  

  // Handle content change in TinyMCE editor
  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  // Handle image upload
  const handleImageUpload = ({ fileList }) => {
    //setFileList(fileList);
    const updatedFileList = fileList.map((file, index) => ({
        ...file,
        uid: file.uid || `file-${index}-${Date.now()}`, // Add a unique uid if missing
    }));
    
    setFileList(updatedFileList);
    return false;
  };

  // Handle modal cancel action
  const handleCancel = () => {
    form.resetFields();
    setEditorContent("");
    setFileList([]);
    setIsModalVisible(false);
    setIsEditListVisible(false);
  };

  return (
    <Content style={{ margin: '0 16px', position: 'relative' }}>
        <Breadcrumb
  style={{ margin: '16px 0' }}
  items={[
    { title: 'PawMatch' },
    { title: 'Forum' },
  ]}
/>
       {/*<Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>PawMatch</Breadcrumb.Item>
        <Breadcrumb.Item>Forum</Breadcrumb.Item>
      </Breadcrumb>  */}

      <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{ pageSize: 3 }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={[<IconText icon={MessageOutlined} text="2" key="list-vertical-message" />]}
              //extra={<img width={272} alt="Post Image" src={item.images && item.images[0] ? item.images[0] : 'default-image-url'} />}
              extra={
                Array.isArray(item.images) && item.images.length > 0 ? (
                    item.images.map((image, index) => (
                        <img key={index} width={272} alt={`Post Image ${index}`} src={`http://localhost:8000${image}`} />
                    ))
                ) : (
                    <img width={272} alt="Default Image" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />
                )
            }

            >
              <List.Item.Meta
                //avatar={<Avatar src={item.avatar} />}
                //title={<a href={item.href}>{item.title}</a>}
                //description={item.description}
                //title={item.title}
                title={
                    <Link to={`/post/${item.post_id}`}>{item.title}</Link>
                  }
                description={`Created: ${new Date(item.created_at).toLocaleDateString()} | Updated: ${new Date(item.updated_at).toLocaleDateString()}`}
              />
              {item.content}
            </List.Item>
          )}
        />
      </div>

      {/* Floating Button Group */}
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ position: 'fixed', right: 24, bottom: 24 }}
        icon={<FileOutlined />}
      >
        <FloatButton icon={<PlusOutlined />} onClick={showModal} />
        <FloatButton icon={<EditOutlined />} onClick={fetchUserPosts} />
      </FloatButton.Group>

      {/* Modal for listing user's posts */}
      <Modal
        title="Select a Post to Edit"
        open={isEditListVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={userPosts}
          renderItem={(item) => (
            <List.Item
              key={item.post_id}
              actions={[
                <>
                <Button icon={<EditOutlined />} onClick={() => showEditModal(item.post_id)}
                style={{ marginRight: '8px' }}>Edit</Button>

                <Button icon={<DeleteOutlined/>} onClick={() => handleDelete(item.post_id)}>Delete</Button>
                </>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.title}
                description={item.content}
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal for Create or Edit Forum Post */}
      <Modal
        title={isEditing ? "Edit Forum Post" : "Create Forum Post"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={isEditing ? "Update" : "Submit"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter post title" />
          </Form.Item>

          {/* TinyMCE Editor for Content */}
          <Form.Item label="Content" required
          rules={[{ required: true, message: 'Please enter content' }]}>
            <Editor
              apiKey='h9e9s3voc97017ejamk2taurl6qsi1d0y7n2pwz0vbh1mbyr'
              value={editorContent}
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  'advlist autolink link image lists charmap preview anchor pagebreak',
                  'searchreplace wordcount visualblocks code fullscreen',
                  'insertdatetime media table emoticons help'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | removeformat | help',
              }}
              onEditorChange={handleEditorChange}
            />
          </Form.Item>

          {/* Image Upload */}
          <Form.Item name="images" label="Upload Images">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleImageUpload}
              beforeUpload={() => false} // Prevent automatic upload
              //onChange={({ fileList: newFileList }) => setFileList(newFileList)} // Update fileList on change
              
              onRemove={(file) => setFileList(fileList.filter((item) => item.uid !== file.uid))}
            >
              <Button icon={<PlusOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default ContentComponent;



/*import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Layout,
  List,
  Avatar,
  Space,
  FloatButton,
  Modal,
  Form,
  Input,
  Button,
  notification,
  theme,
  Upload
} from 'antd';
import { MessageOutlined, FileOutlined, PlusOutlined, EditOutlined, UpCircleOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const { Content } = Layout;

const ContentComponent = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditSelectModalVisible, setIsEditSelectModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Open Modal for Creating Post
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  // Open Modal to Select Post for Editing
  const showEditSelectModal = async () => {
    try {
      const response = await axios.get('http://localhost:8000/posts/user/1'); // Adjust URL as needed
      setUserPosts(response.data);
      setIsEditSelectModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      notification.error({
        message: 'Error',
        description: 'Failed to load user posts. Please try again.',
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", editorContent);

      // Append images to formData
      fileList.forEach((file) => {
        formData.append("images[]", file.originFileObj);
      });

      await axios.post('http://localhost:8000/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      notification.success({
        message: 'Success',
        description: 'Post created successfully!',
      });

      form.resetFields();
      setEditorContent("");
      setFileList([]);
      setIsCreateModalVisible(false);
    } catch (error) {
      console.error("Error creating post:", error);
      notification.error({
        message: 'Error',
        description: 'Failed to create the post. Please try again.',
      });
    }
  };

  // Handle editor content change
  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  // Handle image selection and file list management
  const handleImageUpload = ({ fileList }) => {
    setFileList(fileList);
    return false;
  };

  // Close Create Modal
  const handleCancel = () => {
    form.resetFields();
    setEditorContent("");
    setFileList([]);
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
  };

  // Select post to edit
  const handleEditSelect = async (post) => {
    setSelectedPost(post);
    setIsEditSelectModalVisible(false);

    form.setFieldsValue({ title: post.title });
    setEditorContent(post.content); 
    setIsEditModalVisible(true);
  };

  // Update Post
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", editorContent);

      await axios.put(`http://localhost:8000/posts/${selectedPost.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      notification.success({
        message: 'Success',
        description: 'Post updated successfully!',
      });

      setIsEditModalVisible(false);
      setSelectedPost(null);
      form.resetFields();
    } catch (error) {
      console.error("Error updating post:", error);
      notification.error({
        message: 'Error',
        description: 'Failed to update the post. Please try again.',
      });
    }
  };

  return (
    <Content style={{ margin: '0 16px', position: 'relative' }}>
      <Breadcrumb
        style={{ margin: '16px 0' }}
        items={[
          { title: 'PawMatch' },
          { title: 'Forum' }
        ]}
      />

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
        <FloatButton icon={<PlusOutlined />} onClick={showCreateModal} />
        <FloatButton icon={<EditOutlined />} onClick={showEditSelectModal} />
      </FloatButton.Group>

      {/* Modal for Creating Forum Post */
 /*     <Modal
        title="Create Forum Post"
        open={isCreateModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter post title" />
          </Form.Item>

          <Form.Item label="Content">
            <Editor
              apiKey="h9e9s3voc97017ejamk2taurl6qsi1d0y7n2pwz0vbh1mbyr"
              value={editorContent}
              init={{ 
                height: 300,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                    'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
                    'table', 'emoticons', 'help'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | removeformat | help',
                }}
              onEditorChange={handleEditorChange}
            />
          </Form.Item>

          <Form.Item name="images" label="Upload Images">
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleImageUpload}
              multiple
            >
              <Button icon={<UpCircleOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Selecting Post to Edit */
 /*     <Modal
        title="Select Post to Edit"
        open={isEditSelectModalVisible}
        onCancel={() => setIsEditSelectModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={userPosts}
          renderItem={(item) => (
            <List.Item
              actions={[<Button onClick={() => handleEditSelect(item)}>Edit</Button>]}
            >
              {item.title}
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal for Editing Forum Post */
 /*     <Modal
        title="Edit Forum Post"
        open={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter post title" />
          </Form.Item>

          <Form.Item label="Content">
            <Editor
              apiKey="h9e9s3voc97017ejamk2taurl6qsi1d0y7n2pwz0vbh1mbyr"
              value={editorContent}
              init={{ 
                height: 300,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                    'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
                    'table', 'emoticons', 'help'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | removeformat | help',
                }}
              onEditorChange={handleEditorChange}
            />
          </Form.Item>

          <Form.Item name="images" label="Upload Images">
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleImageUpload}
              multiple
            >
              <Button icon={<UpCircleOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default ContentComponent; */


{/*import React, { useState, useEffect } from 'react';
import IconText from './IconText'; // Assuming you have a component for icons
import {
  Breadcrumb,
  Layout,
  List,
  Avatar,
  Modal,
  Form,
  Input,
  Button,
  notification,
  theme,
  Upload,
  FloatButton,
} from 'antd';
import { MessageOutlined, FileOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const { Content } = Layout;

const ContentComponent = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditListVisible, setIsEditListVisible] = useState(false); // Modal to list user's posts
  const [isEditing, setIsEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [data, setData] = useState([]); // All posts
  const [userPosts, setUserPosts] = useState([]); // User's posts

  // Fetch all posts on component mount
  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/posts');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      notification.error({ message: 'Failed to fetch posts.' });
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/posts');
      setUserPosts(response.data);
      setIsEditListVisible(true);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      notification.error({ message: 'Failed to fetch user posts.' });
    }
  };

  const showModal = () => {
    form.resetFields();
    setEditorContent("");
    setFileList([]);
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const showEditModal = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/posts/${postId}`);
      const postData = response.data;

      form.setFieldsValue({ title: postData.title });
      setEditorContent(postData.content);
      setFileList(
        postData.images.map((image, index) => ({
          uid: index,
          name: `image-${index}.png`,
          status: 'done',
          url: image,
        }))
      );
      
      setCurrentPostId(postId);
      setIsEditing(true);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching post data:", error);
      notification.error({ message: 'Failed to fetch post data.' });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", editorContent);
      fileList.forEach((file) => formData.append("images[]", file.originFileObj || file.url));

      if (isEditing) {
        await axios.put(`http://localhost:8000/api/posts/${currentPostId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        notification.success({ message: 'Post updated successfully!' });
      } else {
        await axios.post('http://localhost:8000/api/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        notification.success({ message: 'Post created successfully!' });
      }

      form.resetFields();
      setEditorContent("");
      setFileList([]);
      setIsModalVisible(false);
      setIsEditListVisible(false);
      fetchAllPosts(); // Refresh the post list
    } catch (error) {
      console.error("Error submitting the post:", error);
      notification.error({ message: 'Failed to submit the post.' });
    }
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleImageUpload = ({ fileList }) => {
    setFileList(fileList);
    return false;
  };

  const handleCancel = () => {
    form.resetFields();
    setEditorContent("");
    setFileList([]);
    setIsModalVisible(false);
    setIsEditListVisible(false);
  };

  return (
    <Content style={{ margin: '0 16px', position: 'relative' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>PawMatch</Breadcrumb.Item>
        <Breadcrumb.Item>Forum</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{ pageSize: 3 }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={[<IconText icon={MessageOutlined} text="2" key="list-vertical-message" />]}
              extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.title}</a>}
                description={item.description}
              />
              {item.content}
            </List.Item>
          )}
        />
      </div>

      {/* FloatButton Group*/}
  {/*    <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ position: 'fixed', right: 24, bottom: 24 }}
        icon={<FileOutlined />}
      >
        <FloatButton icon={<PlusOutlined />} onClick={showModal} />
        <FloatButton icon={<EditOutlined />} onClick={fetchUserPosts} />
      </FloatButton.Group>

      {/* Modal for listing user's posts */}
 {/*     <Modal
        title="Select a Post to Edit"
        open={isEditListVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={userPosts}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button icon={<EditOutlined />} onClick={() => showEditModal(item.id)}>Edit</Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.title}
                description={item.content}
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal for Create or Edit Forum Post */}
{/*      <Modal
        title={isEditing ? "Edit Forum Post" : "Create Forum Post"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={isEditing ? "Update" : "Submit"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter post title" />
          </Form.Item>

          {/* TinyMCE Editor for Content */}
 {/*         <Form.Item label="Content">
            <Editor
              apiKey="h9e9s3voc97017ejamk2taurl6qsi1d0y7n2pwz0vbh1mbyr"
              value={editorContent}
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                  'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
                  'table', 'emoticons', 'help'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | removeformat | help',
              }}
              onEditorChange={handleEditorChange}
            />
          </Form.Item>

          {/* Image Upload */}
{/*          <Form.Item name="images" label="Upload Images">
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={handleImageUpload}
              onRemove={(file) => setFileList(fileList.filter((item) => item.uid !== file.uid))}
            >
              <Button icon={<PlusOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default ContentComponent;*/}

