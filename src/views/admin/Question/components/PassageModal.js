import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, message, Button, InputNumber } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';
import MyEditor from "src/components/MyEditor";
const PassageModal = ({ data, visible, onComplete, onCancel }) => {
    const [form] = Form.useForm();
    const [content, setContent] = useState("");

    const onFinish = (values) => {
        values.content = content;
        onComplete(values);
        // form.resetFields();
        setContent("");
    };
    const handleEditorChange = (event, editor) => {
        setContent(editor.getData());
    };
    useEffect(() => {
        setContent(data?.content || "")
        form.setFieldsValue(data || {});
    }, [form, data]);
    return (
        <Modal
            forceRender
            // width="60%"
            centered
            open={visible} title="Create a new passage" okText="Create" onCancel={onCancel} onOk={form.submit}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Number" name="number" rules={[{ required: true, message: "Please input the passage number!" }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item label="Content" name="content" rules={[{ required: false, message: "Please input the passage content!" }]}>
                    <MyEditor
                        content={content}
                        onChange={handleEditorChange}
                    />
                </Form.Item>
                {/* <Form.Item label="Image" name="image" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload name="logo" listType="picture" beforeUpload={beforeUpload} accept=".jpg,.jpeg,.png">
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item> */}
            </Form>
        </Modal>
    );
};
PassageModal.propTypes = {
    onCancel: PropTypes.func,
    onComplete: PropTypes.func,
    visible: PropTypes.bool,
    data: PropTypes.any,
}
export default PassageModal;
