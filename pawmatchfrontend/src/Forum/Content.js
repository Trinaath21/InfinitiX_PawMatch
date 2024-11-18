import React, { useState } from 'react';
import { Breadcrumb, Layout, List, Avatar, Space, FloatButton, Modal, Form, Input, Button, notification, theme, Upload } from 'antd';
import { MessageOutlined, FileOutlined, PlusOutlined, EditOutlined, UpCircleOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const { Content } = Layout;
const { TextArea } = Input;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: 'https://ant.design',
  title: `Forum Post Title ${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description: 'Username',
  content: 'We supply a series of design principles...',
}));

const ContentComponent = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [fileList, setFileList] = useState([]); // State to manage image files

  // Open Modal on Plus Button Click
  const showModal = () => {
    setIsModalVisible(true);
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

      // Send data to the backend
      await axios.post('http://localhost:8000/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      notification.success({
        message: 'Success',
        description: 'Post created successfully!',
      });

      form.resetFields();
      setEditorContent("");
      setFileList([]); // Clear images
      setIsModalVisible(false);
    } catch (error) {
      console.error("There was an error submitting the post:", error);
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

 {/*s // Handle image selection
  const handleImageUpload = (file) => {
    setImageFiles((prevFiles) => [...prevFiles, file]);
    return false; // Prevent automatic upload
  }; */}

   // Handle image selection and file list management
   const handleImageUpload = ({ file, fileList }) => {
    setFileList(fileList); // Update file list state
    return false; // Prevent automatic upload
  };

  // Close Modal
  const handleCancel = () => {
    form.resetFields();
    setEditorContent("");
    setFileList([]);
    setIsModalVisible(false);
  };

  return (
    <Content style={{ margin: '0 16px', position: 'relative' }}>
      {/*<Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>PawMatch</Breadcrumb.Item>
        <Breadcrumb.Item>Forum</Breadcrumb.Item>
      </Breadcrumb> */}
      <Breadcrumb
  style={{ margin: '16px 0' }}
  items={[
    { title: 'PawMatch' },
    { title: 'Forum' }
  ]}
/>

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

      {/* FloatButton Group */}
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
        <FloatButton icon={<PlusOutlined />} onClick={showModal} />
        <FloatButton icon={<EditOutlined />} />
      </FloatButton.Group>

      {/* Modal for Create Forum Post */}
      <Modal
        title="Create Forum Post"
        open={isModalVisible}
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

          {/* TinyMCE Editor for Content */}
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

          {/* Optional Image Upload */}
          <Form.Item name="images" label="Upload Images">
            <Upload
              listType="picture"
              fileList={fileList} // Use 'fileList' instead of 'value'
              beforeUpload={handleImageUpload} // Handle image selection
              onChange={handleImageUpload} // Manage file selection
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

export default ContentComponent;
