import React, { useState } from 'react';
import { Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const CreateForumPost = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (values) => {
        setLoading(true);
        console.log('Submitted values:', values);
        message.success('Post created successfully!');
        setLoading(false);
    };

    return ( <
        div style = {
            { padding: '24px', maxWidth: '600px', margin: 'auto' } } >
        <
        h2 > Create Forum Post < /h2> <
        Form layout = "vertical"
        onFinish = { handleSubmit }
        initialValues = {
            { content: '', image: null } } >
        <
        Form.Item label = "Content"
        name = "content"
        rules = {
            [{ required: true, message: 'Please enter the content' }] } >
        <
        TextArea rows = { 4 }
        placeholder = "Enter your post content here" / >
        <
        /Form.Item>

        <
        Form.Item label = "Upload Image"
        name = "image" >
        <
        Upload listType = "picture"
        maxCount = { 1 }
        beforeUpload = {
            () => false } // Prevent automatic upload
        >
        <
        Button icon = { < UploadOutlined / > } > Click to Upload < /Button> <
        /Upload> <
        /Form.Item>

        <
        Form.Item >
        <
        Button type = "primary"
        htmlType = "submit"
        loading = { loading } >
        Submit <
        /Button> <
        /Form.Item> <
        /Form> <
        /div>
    );
};

export default CreateForumPost;