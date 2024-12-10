import React, { useState } from 'react';
import { Modal, Button, Form, Input, Upload, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const CreateForumPost = ({ isModalVisible, setIsModalVisible, isEditing, currentPostId, fetchAllPosts }) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Handle form submission for creating or updating a post
const handleSubmit = async () => {
  try {

      setLoading(true);
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
      setLoading(false);
      form.resetFields();
      setEditorContent("");
      setFileList([]);
      setIsModalVisible(false);
      //setIsEditListVisible(false);
      fetchAllPosts(); // Refresh the post list

  } catch (error) {
      setLoading(false);
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
  //setIsEditListVisible(false);
};


  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Create Forum Post</h2>
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

    </div>
  );
};

export default CreateForumPost;
