import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, message, Button, InputNumber, Spin } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';
import MyEditor from "src/components/MyEditor";
import { getUrlfromUploadRespond } from "src/common/Funtion";
import { uploadFileApi } from "src/api/upload";
import CustomManualUpload from "src/components/CustomManualUpload";
const PassageModal = ({ data, visible, onComplete, handleCancel }) => {
    const [form] = Form.useForm();
    const [content, setContent] = useState("");
    const [imageFormData, setImageFormData] = useState(null)
    const [isloading, setIsloading] = useState(false)
    const onFinish = async (values) => {
        values.content = content;
        setIsloading(true)
        if (imageFormData) {
            await uploadFileApi(imageFormData).then((res) => {
                let arrUrl = getUrlfromUploadRespond(res)
                if (arrUrl?.length < 1) values.image = ""
                else values.image = arrUrl[0].path
            }).catch(err => {
                values.image = ""
            })
        }
        console.log(values);
        onComplete(values);
        form.resetFields();
        setContent("");
        setIsloading(false)
    };
    const handleEditorChange = (data) => {
        setContent(data);
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
            open={visible} title="Create a new passage" okText="Create" onCancel={()=>{
                setIsloading(false)
                handleCancel()
            }} onOk={form.submit}>
            <Spin
                spinning={isloading}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Number" name="number" rules={[{ required: true, message: "Please input the passage number!" }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        // name="image"
                        label="Image"
                    >
                        <CustomManualUpload
                            url={data?.image || ""}
                            onChange={(formData) => {
                                setImageFormData(formData)
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Content" name="content" rules={[{ required: false, message: "Please input the passage content!" }]}>
                        <MyEditor
                            content={content}
                            onChange={handleEditorChange}
                        />
                    </Form.Item>


                </Form>
            </Spin>
        </Modal>
    );
};
PassageModal.propTypes = {
    handleCancel: PropTypes.func,
    onComplete: PropTypes.func,
    visible: PropTypes.bool,
    data: PropTypes.any,
}
export default PassageModal;
