import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Spin, Switch, Select } from 'antd';
import PropTypes from 'prop-types';

import { useAddUserMutation, useUpdateUserMutation } from 'src/api/user';
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
const UserModal = (props) => {
    const { isInsert, visible, onCancel, data, onUpdate } = props
    const [form] = Form.useForm();
    const [addUser, { error: insertError, isLoading: insertLoading = false }] = useAddUserMutation();
    const [updateUser, { error: updateError, isLoading: updateLoading = false }] = useUpdateUserMutation();
    const onFinish = async (values) => {
        values = removeUndefined(values)

        if (isInsert) {
            addUser(values)
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
            updateUser(values)
                .unwrap()
                .then((respond) => {
                    message.success(respond.message)
                    console.log(`updated: ${JSON.stringify(respond)}`);
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
            title={`${isInsert ? "Insert" : "Update"} User ${data?.email}`}
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
                        name="username"
                        label="Username"
                        tooltip="To login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input username!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="nickname"
                        label="Nickname"
                        tooltip="What do you want others to call you?"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please input your nickname!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please input your phone number!',
                            },
                        ]}
                    >
                        <Input
                            // addonBefore={prefixSelector}
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="intro"
                        label="Intro"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please input Intro',
                            },
                        ]}
                    >
                        <Input.TextArea showCount maxLength={100} />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please select gender!',
                            },
                        ]}
                    >
                        <Select placeholder="select your gender">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="userType"
                        label="Role"
                        rules={[
                            {
                                required: true,
                                message: 'Please select gender!',
                            },
                        ]}
                    >
                        <Select placeholder="select your gender" defaultValue={1}>
                            <Option value={2}>Admin</Option>
                            <Option value={1}>User</Option>
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
UserModal.propTypes = {
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func,
    visible: PropTypes.bool,
    onUserUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool
}
export default UserModal;
