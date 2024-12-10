
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
  Spin,
  FloatButton,
  ExclamationCircleOutlined
} from 'antd';
import { MessageOutlined, FileOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import MyPostsComponent from './MyPostsComponent';


//const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const { Content } = Layout;
const { confirm } = Modal;

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
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [allPosts, setAllPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('general');
  const [isMyPostListVisible, setIsMyPostListVisible] = useState(false);



// Fetch all posts on component mount
useEffect(() => {
  fetchAllPosts(); // Load all posts on mount
}, []);

  // Fetch post basd on category general or my posts
  useEffect(() => {

  if (currentCategory === 'general') {
    setData(allPosts); // Show all posts
  } else if (currentCategory === 'myPosts') {
    setData(myPosts); // Show user-specific posts
  }
}, [currentCategory, allPosts, myPosts]);

  // Fetch all posts from the API
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/posts');
      const postsData = response.data.map(post => ({
        ...post,
        images: Array.isArray(post.images) ? post.images : JSON.parse(post.images || "[]")
    }));
      setData(response.data);
      setAllPosts(postsData);
      setIsMyPostListVisible(false); // Hide "My Posts" section
    } catch (error) {
      console.error("Error fetching posts:", error);
      notification.error({ message: 'Failed to fetch posts.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const userId = 1;
      const response = await axios.get('http://localhost:8000/user/posts/1'); // Replace with your actual API endpoint
      const postsData = response.data.map(post => ({
        ...post,
        images: Array.isArray(post.images) ? post.images : JSON.parse(post.images || "[]")
    }));
    console.log('Formatted Posts:', postsData);

       // Filter posts by user ID
   // const userPosts = postsData.filter(post => post.user_id === userId);
    setData(response.data);
    setMyPosts(postsData);
    setIsMyPostListVisible(true);
    } catch (error) {
      console.error('Error fetching user posts:', error);
     // return [];
    } finally {
      setLoading(false);
    }
};

  

  const MAX_LENGTH = 100; // Maximum length for truncated content
  const showDeleteConfirm = (postId) => {
    confirm({
      title: "Are you sure you want to delete this post?",
      content: "Once deleted, this action cannot be undone.",
      okText: "Confirm",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(postId).then(() => {
          window.location.reload(); // Refresh the page
        
      });
    },
      onCancel() {
        console.log("Deletion canceled.");
      },
    });
  };
const UserPostModal = ({
  isEditListVisible,
  handleCancel,
  userPosts,
  showEditModal,
  handleDelete,
}) => {
  const [expandedPosts, setExpandedPosts] = useState({}); // Track which posts are expanded

  const toggleExpand = (postId) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Toggle expanded state
    }));
  };

  return (
    <Modal
      title="Select a Post to Edit"
      open={isEditListVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <List
        itemLayout="horizontal"
        dataSource={userPosts}
        renderItem={(item) => {
          const isExpanded = expandedPosts[item.post_id] || false;
          const contentToShow = isExpanded
            ? item.content
            : item.content.length > MAX_LENGTH
            ? `${item.content.slice(0, MAX_LENGTH)}...`
            : item.content;

          return (
            <List.Item
              key={item.post_id}
              actions={[
                <Button
                  icon={<EditOutlined />}
                  onClick={() => showEditModal(item.post_id)}
                  style={{ marginRight: '1px' }}
                >
                  Edit
                </Button>,
                <Button
                  icon={<DeleteOutlined />}
                  danger
                 // onClick={() => handleDelete(item.post_id)}
                 onClick={() => showDeleteConfirm(item.post_id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={
                  <>
                    <span>{contentToShow}</span>
                    {item.content.length > MAX_LENGTH && (
                      <Button
                        type="link"
                        onClick={() => toggleExpand(item.post_id)}
                        style={{ paddingLeft: '5px' }}
                      >
                        {isExpanded ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
    </Modal>
  );
};


  // Fetch user's posts from the API
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user/posts/1"); // Temporary user_id: 1
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

  // Utility function to strip HTML tags
  const stripHTMLTags = (text) => text.replace(/<[^>]*>/g, '');

  // Utility function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) {
      return {truncated: false, content: text };
    }
    return { truncated: true, content: text.substring(0, maxLength) + "..." };
  };

  // Toggle description view
  const toggleExpanded = (postId) => {
    setExpanded((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
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

      {/* Category Buttons */}
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <Button
          type={currentCategory === 'general' ? 'primary' : 'default'}
          
          onClick={() => {
            setCurrentCategory('general'); // Update category
            fetchAllPosts();               // Fetch all posts
            setData(allPosts); // Show all posts
          }}
          style={{ marginRight: 8 }}
        >
          General Posts
        </Button>
        <Button
          type={currentCategory === 'myPosts' ? 'primary' : 'default'}
          
          onClick={async() => {
            setCurrentCategory('myPosts'); // Update category
            await fetchMyPosts(); // Fetch user-specific posts
            setData(myPosts); // Show user-specific posts
            setIsMyPostListVisible(true)
           
          }}
        >
          My Posts
        </Button>
      </div>

      {/* Post List */}
      <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
      {loading ? (
          <Spin />
        ) : isMyPostListVisible ? (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{ pageSize: 3 }}
            dataSource={myPosts}
            renderItem={(item) => {
              const truncatedText = truncateText(stripHTMLTags(item.content), 100);
              return (
                <List.Item
                  key={item.title}
                  actions={[
                    <Link to={`/post/${item.post_id}`} key="list-vertical-message">
                      <IconText icon={MessageOutlined} text={item.comments_count} />
                    </Link>,
                  ]}
                  extra={
                    Array.isArray(item.images) && item.images.length > 0 ? (
                      <Link to={`/post/${item.post_id}`}>
                        <img width={272} alt={"Post Image"} src={`http://localhost:8000${item.images[0]}`} />
                      </Link>
                    ) : (
                      <Link to={`/post/${item.post_id}`}>
                        <img
                          width={272}
                          alt="Default Image"
                          src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        />
                      </Link>
                    )
                  }
                >
                  <List.Item.Meta
                    title={<Link to={`/post/${item.post_id}`}>{item.title}</Link>}
                    description={`Created: ${new Date(item.created_at).toLocaleDateString()} | Updated: ${new Date(item.updated_at).toLocaleDateString()}`}
                  />
                  <div>
                    {expanded[item.post_id] ? stripHTMLTags(item.content) : truncatedText.content}
                    {truncatedText.truncated && (
                      <span
                        style={{
                          color: '#1890ff',
                          cursor: 'pointer',
                          marginLeft: '8px',
                        }}
                        onClick={() => toggleExpanded(item.post_id)}
                      >
                        {expanded[item.post_id] ? 'Show Less' : 'Show More'}
                      </span>
                    )}
                  </div>
                </List.Item>
              );
            }}
          />
        ) :(
        <List
          itemLayout="vertical"
          size="large"
          pagination={{ pageSize: 3 }}
          dataSource={data}
          renderItem={(item) => {
            const truncatedText = truncateText(stripHTMLTags(item.content), 100);
            return (
            <List.Item
            
              key={item.title}
              actions={[
                <Link to={`/post/${item.post_id}`} key="list-vertical-message" >
              <IconText icon={MessageOutlined} text={item.comments_count} />
              </Link>
              ]}

              extra={
                
                Array.isArray(item.images) && item.images.length > 0 ? (
                   
                        <Link to={`/post/${item.post_id}`}>
                        <img width={272} alt={"Post Image"} src={`http://localhost:8000${item.images[0]}`} />
                        </Link>
                    //))
                ) : (
                    <Link to={`/post/${item.post_id}`}>
                    <img width={272} alt="Default Image" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />
                    </Link>
                )
            }

            >
              <List.Item.Meta
              
                title={
                    <Link to={`/post/${item.post_id}`}>{item.title}</Link>
                  }
                description={`Created: ${new Date(item.created_at).toLocaleDateString()} | Updated: ${new Date(item.updated_at).toLocaleDateString()}`}
              />
              <div>
                  {expanded[item.post_id] ? stripHTMLTags(item.content) : truncatedText.content}
                  {truncatedText.truncated && (
                  <span
                    style={{
                      color: '#1890ff',
                      cursor: 'pointer',
                      marginLeft: '8px',
                    }}
                    onClick={() => toggleExpanded(item.post_id)}
                  >
                    {expanded[item.post_id] ? 'Show Less' : 'Show More'}
                  </span>
                  )}
                </div>
            </List.Item>
          )}
        }
        />
      )}
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
      <UserPostModal
  isEditListVisible={isEditListVisible}
  handleCancel={handleCancel}
  userPosts={userPosts}
  showEditModal={showEditModal}
  handleDelete={handleDelete}
/>


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
                  "advlist", "autolink", "link", "image", "lists", "charmap", "preview","anchor", "pagebreak",
                  "searchreplace","wordcount","visualblocks", "code", "fullscreen",
                  "insertdatetime","media", "table", "emoticons", "help",
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



