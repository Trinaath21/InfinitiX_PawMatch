import React, { useState } from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const { TextArea } = Input;

const PostForm = ({ isVisible, onClose }) => {
    const [form] = Form.useForm();
    const [editorContent, setEditorContent] = useState("");
    const [imageFile, setImageFile] = useState(null); // Image file state

    // Editor change handler
    const handleEditorChange = (content) => {
        setEditorContent(content);
    };

    // Image upload handler
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', editorContent);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await axios.post('http://localhost:8000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            notification.success({
                message: 'Success',
                description: 'Post created successfully!',
            });

            form.resetFields();
            setEditorContent("");
            setImageFile(null);
            onClose();

        } catch (error) {
            console.error("There was an error submitting the post:", error);
            notification.error({
                message: 'Error',
                description: 'Failed to create the post. Please try again.',
            });
        }
    };

    return (
        <Modal
            title="Create Forum Post"
            visible={isVisible}
            onOk={handleSubmit}
            onCancel={onClose}
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

                <Form.Item label="Message">
                    <Editor
                        apiKey="YOUR_TINY_MCE_API_KEY"
                        value={editorContent}
                        init={{
                            height: 300,
                            menubar: true,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
                                     'alignleft aligncenter alignright alignjustify | ' +
                                     'bullist numlist outdent indent | removeformat | help',
                        }}
                        onEditorChange={handleEditorChange}
                    />
                </Form.Item>

                <Form.Item name="images" label="Upload Images">
                    <input type="file" onChange={handleImageUpload} multiple accept="image/*" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PostForm;
