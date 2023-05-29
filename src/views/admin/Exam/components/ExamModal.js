import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Spin, Switch, Select, Upload } from 'antd';
import PropTypes from 'prop-types';

import { useAddExamMutation, useUpdateExamMutation } from 'src/api/exam';
import { removeUndefined } from 'src/common/Funtion';
import CustomUpload from 'src/components/CustomUpload';
import { UploadOutlined } from '@ant-design/icons';
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
const ExamModal = (props) => {
    const { isInsert, visible, onCancel, data, category } = props
    const [form] = Form.useForm();
    const [addExam, { error: insertError, isLoading: insertLoading = false }] = useAddExamMutation();
    const [updateExam, { error: updateError, isLoading: updateLoading = false }] = useUpdateExamMutation();
    const onFinish = async (values) => {
        values = removeUndefined(values)
        console.log(values);
        if (isInsert) {
            addExam(values)
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
            updateExam(values)
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
            title={`${isInsert ? "Insert" : "Update"} Exam`}
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
                        name="type"
                        label="Type"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please select type!',
                            },
                        ]}
                    >
                        <Select placeholder="select type">
                            <Option value={0}>Full Test</Option>
                            <Option value={1}>Mini Test</Option>
                            <Option value={2}>Part 1</Option>
                            <Option value={3}>Part 2</Option>
                            <Option value={4}>Part 3</Option>
                            <Option value={5}>Part 4</Option>
                            <Option value={6}>Part 5</Option>
                            <Option value={7}>Part 6</Option>
                            <Option value={8}>Part 7</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="name"
                        // tooltip="To login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input Examname!',
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
                    {/* <Form.Item
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
                    </Form.Item> */}

                    <Form.Item name="isActive" label="Active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};
ExamModal.propTypes = {
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func,
    visible: PropTypes.bool,
    onExamUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool,
    category: PropTypes.array
}
export default ExamModal;
