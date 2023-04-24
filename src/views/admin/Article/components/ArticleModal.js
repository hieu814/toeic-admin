import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Spin, Switch, Select, Upload } from 'antd';
import PropTypes from 'prop-types';

import { useAddArticleMutation, useUpdateArticleMutation } from 'src/api/article';
import { removeUndefined } from 'src/common/Funtion';
import CustomUpload from 'src/components/CustomUpload';
import { UploadOutlined } from '@ant-design/icons';
import MyEditor from 'src/components/MyEditor';
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
const ArticleModal = (props) => {
    const { isInsert, visible, onCancel, data, category } = props
    const [form] = Form.useForm();
    const [content, setContent] = useState("");
    const [addArticle, { error: insertError, isLoading: insertLoading = false }] = useAddArticleMutation();
    const [updateArticle, { error: updateError, isLoading: updateLoading = false }] = useUpdateArticleMutation();
    useEffect(() => {
        setContent(data?.content || "")
        form.setFieldsValue(data || {});
    }, [form, data]);
    const onFinish = async (values) => {
        values.content = content
        values = removeUndefined(values)
        if (isInsert) {
            addArticle(values)
                .then((respond) => {
                    if (!respond.error) {
                        message.success(respond.message)
                        handleCalcel()
                    }
                })
                .catch((err) => {
                    console.log(err);

                });
        } else {
            values.id = data?.id
            updateArticle(values)
                .unwrap()
                .then((respond) => {
                    if (!respond.error) {
                        message.success(respond.message)
                        handleCalcel()
                    }
                })
                .catch((err) => {
                    console.log(err);

                });
        }

    };
    const handleEditorChange = (html) => {
        setContent(html);
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
            width={1000}
            open={visible}
            title={`${isInsert ? "Insert" : "Update"} Article`}
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
                        <Input.TextArea showCount />
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
                        <Select placeholder="select category">
                            {(category || []).map(fbb =>
                                <Option key={fbb.key} value={fbb.id}>{fbb.name}</Option>
                            )};
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="thumbail"
                        label="Thumbail"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please select thumbail!',
                            },
                        ]}
                    >
                        <CustomUpload />
                    </Form.Item>

                    <Form.Item name="isActive" label="Active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
                <MyEditor
                    content={content}
                    onChange={handleEditorChange}
                />
            </Spin>
        </Modal>
    );
};
ArticleModal.propTypes = {
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func,
    visible: PropTypes.bool,
    onArticleUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool,
    category: PropTypes.array
}
export default ArticleModal;
