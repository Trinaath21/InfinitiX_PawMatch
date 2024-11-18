import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Editor } from '@tinymce/tinymce-react';

const EditPostModal = ({ isModalVisible, handleCancel, post }) => {
  const [form] = Form.useForm();

  useState(() => {
    if (post) {
      form.setFieldsValue({ title: post.title, content: post.content });
    }
  }, [post, form]);

  const handleSave = async (values) => {
    try {
      // Make an API call to save edited post data
      console.log('Edited values:', values);
      handleCancel();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Modal
      title="Edit Post"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>Save Changes</Button>,
      ]}
    >
      <Form form={form} onFinish={handleSave} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please enter content!' }]}>
          <Editor
            apiKey="YOUR_TINYMCE_API_KEY"
            init={{
              height: 200,
              menubar: false,
              plugins: 'link image code',
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
            }}
            onEditorChange={(content) => form.setFieldsValue({ content })}
            initialValue={post.content}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPostModal;
