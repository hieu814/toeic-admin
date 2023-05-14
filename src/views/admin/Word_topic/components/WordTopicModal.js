import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Spin, Switch, Select } from 'antd';
import PropTypes from 'prop-types';

import { useAddWordTopicMutation, useUpdateWordTopicMutation } from 'src/api/word_topic';
import { removeUndefined } from 'src/common/Funtion';
import CustomUpload from 'src/components/CustomUpload';
const { Option } = Select;
const { TextArea } = Input;
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

const WordTopicModal = (props) => {
    const { isInsert, visible, onCancel, data, category } = props
    const [form] = Form.useForm();
    const [addWordTopic, { error: insertError, isLoading: insertLoading = false }] = useAddWordTopicMutation();
    const [updateWordTopic, { error: updateError, isLoading: updateLoading = false }] = useUpdateWordTopicMutation();
    const onFinish = async (values) => {
        values = removeUndefined(values)
        console.log(values);
        if (isInsert) {
            addWordTopic(values)
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
            updateWordTopic(values)
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
            title={`${isInsert ? "Insert" : "Update"} WordTopic`}
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
                                message: 'Please input WordTopicname!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please select type!',
                            },
                        ]}
                    >
                        <Select placeholder="select type">
                            {(category || []).map(fbb =>
                                <Option key={fbb.key} value={fbb.id}>{fbb.name}</Option>
                            )};
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please select type!',
                            },
                        ]}
                    >
                        <CustomUpload />
                    </Form.Item>

                </Form>
            </Spin>
        </Modal>
    );
};
WordTopicModal.propTypes = {
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func,
    visible: PropTypes.bool,
    onWordTopicUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool,
    category: PropTypes.array
}
export default WordTopicModal;
