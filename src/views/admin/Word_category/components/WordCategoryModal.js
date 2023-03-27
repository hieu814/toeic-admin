import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Spin, Switch, Select } from 'antd';
import PropTypes from 'prop-types';

import { useAddWordCategoryMutation, useUpdateWordCategoryMutation } from 'src/api/word_category';
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
const CategoryModal = (props) => {
    const { isInsert, visible, onCancel, data, onComplete } = props
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState("");
    const [addCategory, { error: insertError, isLoading: insertLoading = false }] = useAddWordCategoryMutation();
    const [updateCategory, { error: updateError, isLoading: updateLoading = false }] = useUpdateWordCategoryMutation();
    const onFinish = async (values) => {
        values = removeUndefined(values)

        if (isInsert) {
            addCategory(values)
                .then((respond) => {
                    checkRespond(respond)
                })
                .catch((err) => {
                    console.log(err);

                });
        } else {
            values.id = data?.id
            updateCategory(values)
                .unwrap()
                .then((respond) => {
                    checkRespond(respond)
                })
                .catch((err) => {
                    console.log(err);

                });
        }

    };
    function checkRespond(respond) {
        if (respond.error) {
            setErrorMsg(respond?.error?.data?.message)
        } else {
            setErrorMsg("")
            onComplete()
        }
    }
    function handleCalcel() {
        setErrorMsg("-")
        form.resetFields();
        onCancel()
    }
    useEffect(() => {
        form.setFieldsValue(data || {});
    }, [form, data, errorMsg]);


    return (
        <Modal
            centered
            open={visible}
            title={`${isInsert ? "Insert" : "Update"} Category`}
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
                {(errorMsg) && <div style={{ color: 'red', marginBottom: 10 }}>{`${errorMsg}`}</div>}
                <Form id='form-id'
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={data || {}}
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
                        name="description"
                        label="Description"
                        // tooltip="To login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input description!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <TextArea />
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

                    <Form.Item name="isActive" label="Active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};
CategoryModal.propTypes = {
    onCancel: PropTypes.func,
    onComplete: PropTypes.func,
    visible: PropTypes.bool,
    onCategoryUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool
}
export default CategoryModal;
