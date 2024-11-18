import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Upload } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { UpCircleOutlined } from '@ant-design/icons';

const CreatePostModal = ({ isModalVisible, handleCancel, handleCreate, initialData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // State for managing uploaded files

  useEffect(() => {
    // Prefill form if editing an existing post
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title,
        content: initialData.content,
        images: initialData.images || [], // Set initial images if editing
      });
      setFileList(initialData.images ? initialData.images.map((url, index) => ({
        uid: index,
        name: `Image-${index + 1}`,
        status: 'done',
        url,
      })) : []);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialData, form]);

  const onFinish = (values) => {
    handleCreate({ ...values, images: fileList });
  };

  const handleImageUpload = ({ fileList }) => {
    // Update fileList to reflect the new uploaded files
    setFileList(fileList.map(file => {
      if (file.response) {
        // Extract the URL from the server's response (adjust as per API response structure)
        return { ...file, url: file.response.url };
      }
      return file;
    }));
  };

  return (
    <Modal
      title={initialData ? 'Edit Post' : 'Create New Post'}
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {initialData ? 'Update Post' : 'Create Post'}
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input placeholder="Enter post title" />
        </Form.Item>
        
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: 'Please enter content!' }]}
        >
          <Editor
            apiKey="h9e9s3voc97017ejamk2taurl6qsi1d0y7n2pwz0vbh1mbyr"
            initialValue={initialData ? initialData.content : ''}
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
            onEditorChange={(content) => form.setFieldsValue({ content })}
          />
        </Form.Item>

        <Form.Item name="images" label="Upload Images">
          <Upload
            listType="picture"
            fileList={fileList}
            beforeUpload={() => false} // Prevent automatic upload; images will be handled by form submission
            onChange={handleImageUpload}
            multiple
          >
            <Button icon={<UpCircleOutlined />}>Select Images</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;

{/*export default CreatePostModal;
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Upload, notification } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { UpCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const CreatePostModal = ({ isModalVisible, handleCancel, fetchPosts }) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", editorContent);

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
      handleCancel();
      fetchPosts(); // Optional: Fetch posts again if needed
    } catch (error) {
      console.error("Error submitting the post:", error);
      notification.error({
        message: 'Error',
        description: 'Failed to create the post. Please try again.',
      });
    }
  };

  const handleEditorChange = (content) => setEditorContent(content);

  const handleImageUpload = ({ fileList }) => {
    setFileList(fileList);
    return false;
  };

  return (
    <Modal
      title="Create Forum Post"
      visible={isModalVisible}
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
            beforeUpload={handleImageUpload}
            onChange={handleImageUpload}
            multiple
          >
            <Button icon={<UpCircleOutlined />}>Select Images</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;
*/}