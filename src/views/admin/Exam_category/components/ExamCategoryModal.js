import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Spin, Switch, Select } from 'antd';
import PropTypes from 'prop-types';

import { useAddExamCategoryMutation, useUpdateExamCategoryMutation } from 'src/api/exam_category';
import { removeUndefined } from 'src/common/Funtion';
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
const CategoryModal = (props) => {
    const { isInsert, visible, onCancel, data, onUpdate } = props
    const [form] = Form.useForm();
    const [addCategory, { error: insertError, isLoading: insertLoading = false }] = useAddExamCategoryMutation();
    const [updateCategory, { error: updateError, isLoading: updateLoading = false }] = useUpdateExamCategoryMutation();
    const onFinish = async (values) => {
        values = removeUndefined(values)

        if (isInsert) {
            addCategory(values)
                .then((respond) => {

                    console.log(respond);
                    message.success(respond.message)
                    handleCalcel()
                })
                .catch((err) => {
                    console.log(err);

                });
        } else {
            values.id = data?.id
            updateCategory(values)
                .unwrap()
                .then((respond) => {
                    message.success(respond.message)
                    handleCalcel()
                })
                .catch((err) => {
                    console.log(err);

                });
        }

    };
    function handleCalcel() {
        form.resetFields();
        onCancel()
    }
    useEffect(() => {
        form.setFieldsValue(data)
    }, [form, data])
    return (
        <Modal
            centered
            open={visible}
            title={`${isInsert ? "Insert" : "Update"} Category ${data?.email}`}
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
                {(updateError || insertError) && <div style={{ color: 'red', marginBottom: 10 }}>{`${isInsert ? insertError?.data.message : updateError?.data.message}`}</div>}
                <Form forceRender  id='form-id'
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
                                message: 'Please input Categoryname!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
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
                            <Option value={2}>Article</Option>
                            <Option value={1}>Lession</Option>
                        </Select>
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
    onUpdate: PropTypes.func,
    visible: PropTypes.bool,
    onCategoryUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool
}
export default CategoryModal;
