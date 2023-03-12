import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Spin, Switch, Select, InputNumber } from 'antd';
import PropTypes from 'prop-types';
import { removeUndefined } from 'src/common/Funtion';
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
const QuestionModal = (props) => {
    const { isInsert, visible, onCancel, data, onComplete } = props
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState("");
    const onFinish = async (values) => {
        values = removeUndefined(values)
        onComplete(values)
        form.resetFields();
    };

    function handleCalcel() {
        form.resetFields();
        onCancel()
    }
    useEffect(() => {
        if (data)
            form.setFieldsValue(data || {});
        else
            form.resetFields();
    }, [form, data]);


    return (
        <Modal
            forceRender
            centered
            open={visible}
            title={`${isInsert ? "Insert" : "Update"} Question`}
            onCancel={handleCalcel}
            footer={[
                <Button key="cancel" onClick={handleCalcel}>
                    Cancel
                </Button>,
                <Button key="update" htmlType='submit' type="primary" form="form-id" loading={false}>
                    {`${isInsert ? "Insert" : "Update"}`}
                </Button>,
            ]}
        >
            {(errorMsg != "") && <div style={{ color: 'red', marginBottom: 10 }}>{`${errorMsg}`}</div>}
            <Form id='form-id'
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={data || {}}
                style={{
                    maxWidth: 600,
                }}
                defaultValue={{
                    number: 0,
                    question: "",
                    A: "",
                    B: "",
                    C: "",
                    D: ""
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="number"
                    label="Number"
                // tooltip="To login"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="question"
                    label="Question"
                >
                    <TextArea />
                </Form.Item>
                <Form.Item
                    name="A"
                    label="A"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="B"
                    label="B"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="C"
                    label="C"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="D"
                    label="D"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="correct_answer"
                    label="Correct answer"
                    rules={[
                        {
                            required: true,
                            message: 'Please select type!',
                        },
                    ]}
                >
                    <Select placeholder="select type">
                        <Option value={"A"}>A</Option>
                        <Option value={"B"}>B</Option>
                        <Option value={"C"}>C</Option>
                        <Option value={"D"}>D</Option>
                    </Select>
                </Form.Item>
            </Form>



        </Modal>
    );
};
QuestionModal.propTypes = {
    onCancel: PropTypes.func,
    onComplete: PropTypes.func,
    visible: PropTypes.bool,
    onQuestionUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool
}
export default QuestionModal;