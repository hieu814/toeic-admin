import React, { useState } from "react";
import { Modal, Form, Input, Upload, message, Button } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';
import MyEditor from "src/components/MyEditor";
const PassageModal = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const [content, setContent] = useState("");

    const onFinish = (values) => {
        console.log(values);
        onCreate(values, content);
        form.resetFields();
        setContent("");
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleEditorChange = (event, editor) => {
        setContent(editor.getData());
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        return isJpgOrPng;
    };

    return (
        <Modal open={visible} title="Create a new passage" okText="Create" onCancel={onCancel} onOk={form.submit}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Number" name="number" rules={[{ required: true, message: "Please input the passage number!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Content" name="content" rules={[{ required: false, message: "Please input the passage content!" }]}>
                    <MyEditor
                        content= {content}
                        onChange={handleEditorChange}
                    />
                </Form.Item>
                <Form.Item label="Image" name="image" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload name="logo" listType="picture" beforeUpload={beforeUpload} accept=".jpg,.jpeg,.png">
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};
PassageModal.propTypes = {
    onCancel: PropTypes.func,
    onCreate: PropTypes.func,
    visible: PropTypes.bool
}
export default PassageModal;
