import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Spin, Switch, Select, Upload } from 'antd';
import PropTypes from 'prop-types';

import { useAddWordMutation, useUpdateWordMutation } from 'src/api/word';
import { getUrlfromUploadRespond, removeUndefined } from 'src/common/Funtion';
import CustomUpload from 'src/components/CustomUpload';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFileApi } from 'src/api/upload';
import CustomManualUpload from 'src/components/CustomManualUpload';
const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const WordModal = (props) => {
    const { isInsert, visible, onCancel, data, category } = props
    const [form] = Form.useForm();
    const [imageFormData, setImageFormData] = useState(null)
    const [audioFormData, setAudioFormData] = useState(null)
    const [addWord, { error: insertError, isLoading: insertLoading = false }] = useAddWordMutation();
    const [updateWord, { error: updateError, isLoading: updateLoading = false }] = useUpdateWordMutation();
    const onFinish = async (values) => {
        values = removeUndefined(values)
        if (imageFormData) {
            await uploadFileApi(imageFormData).then((res) => {
                let arrUrl = getUrlfromUploadRespond(res)
                if (arrUrl?.length < 1) values.image = ""
                else values.image = arrUrl[0].path
            }).catch(err => {
                values.image = ""
            })
        }
        if (audioFormData) {
            await uploadFileApi(audioFormData).then((res) => {
                let arrUrl = getUrlfromUploadRespond(res)
                if (arrUrl?.length < 1) values.sound = ""
                else values.sound = arrUrl[0].path
            }).catch(err => {
                values.sound = ""
            })
        }
        if (isInsert) {
            addWord(values)
                .then((respond) => {

                    console.log(respond);
                    message.success(respond.message)
                    // handleCalcel()
                })
                .catch((err) => {
                    console.log(err);

                });
        } else {
            values.id = data?.id
            updateWord(values)
                .unwrap()
                .then((respond) => {
                    message.success(respond.message)
                    handleCalcel()
                })
                .catch((err) => {
                    console.log(err);

                });
        }
        handleCalcel()

    };
    function handleCalcel() {
        form.resetFields();
        onCancel()
    }
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        return isJpgOrPng;
    };
    useEffect(() => {
        form.setFieldsValue(data)
    }, [form, data])
    return (
        <Modal
            getContainer={false}
            centered
            open={visible}
            title={`${isInsert ? "Insert" : "Update"} Word`}
            onCancel={handleCalcel}
            footer={[
                <Button key="cancel" onClick={handleCalcel}>
                    Cancel
                </Button>,
                <Button key="update" htmlType='submit' type="primary" form="form-id" loading={insertLoading || updateLoading}>
                    {`${isInsert ? "Insert" : "Update"}`}
                </Button>,
            ]}
        >
            <Spin spinning={insertLoading || updateLoading}>
                {(updateError || insertError) && <div style={{ color: 'red', marginBottom: 10 }}>{`${isInsert ? insertError?.data?.message : updateError?.data.message}`}</div>}
                <Form id='form-id'
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={data}
                    style={{
                        maxWidth: 600,
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="name"
                        label="name"
                        // tooltip="To login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input name!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="type"
                        // tooltip="To login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input pronounce!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="mean"
                        label="mean"
                        // tooltip="To login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input mean!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="definition"
                        label="definition"
                        // tooltip="To login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input definition!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="pronounce"
                        label="pronounce"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="example"
                        label="example"
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        name="image"
                        label="Image"

                    >
                        <CustomManualUpload
                            url={data?.image || ""}
                            onChange={(formData) => {
                                setImageFormData(formData)
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="sound"
                        label="sound"

                    >
                        <CustomManualUpload
                            url={data?.sound || ""}
                            onChange={(formData) => {
                                setAudioFormData(formData)
                            }}
                        />
                    </Form.Item>
                    {/* <Form.Item name="isActive" label="Active" valuePropName="checked">
                        <Switch />
                    </Form.Item> */}
                </Form>
            </Spin>
        </Modal>
    );
};
WordModal.propTypes = {
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func,
    visible: PropTypes.bool,
    onWordUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool,
    category: PropTypes.array
}
export default WordModal;
