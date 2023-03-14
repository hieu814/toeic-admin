import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, message, Button, Card, Divider, Col, Select, Space, Row } from "antd";
import { PlusOutlined, QqSquareFilled, UploadOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';
import PassageModal from "./PassageModal";
import PassageTable from "./PassageTable";
import QuestionTable from "./QuestionTable";
import QuestionModal from "./QuestionModal";
import { useLocation } from "react-router-dom";
import { useGetQuestionQuery, useAddQuestionMutation } from "src/api/question"
import CustomManualUpload from "src/components/CustomManualUpload";
import CustomUpload from "src/components/CustomUpload";
import { uploadFileApi } from "src/api/upload";
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
const defaultQs = {
    number: 0,
    question: "",
    A: "",
    B: "",
    C: "",
    D: ""
}
const defaultPs = {
    number: 0,
    content: "",
    image: "",
}
const defaultGroupQuestion = {
    group: "",
    type: 1,
    image: "",
    audio: "",
    questions: [],
    passages: []
}
const GroupQuestionModal = (props) => {
    const query = new URLSearchParams(useLocation().search);
    const [form] = Form.useForm();
    const questionIdQuery = query.get("questionID");
    const [questionModalVisible, setQuestionModalVisible] = useState(false)
    const [passageModalVisible, setPassageModalVisible] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(defaultQs)
    const [currentPassage, setCurrentPassage] = useState(defaultPs)
    const [currentGroupQuestion, setCurrentGroupQuestion] = useState(defaultGroupQuestion)
    const { data, isLoading } = useGetQuestionQuery(questionIdQuery);
    function handleUpdateQuestion(qs) {
        var _questions = currentGroupQuestion?.questions || []
        var _questions = [..._questions.filter((obj) => obj.number !== qs.number), { ...qs }]
        currentGroupQuestion.questions = _questions
        setCurrentGroupQuestion(currentGroupQuestion)
        setCurrentQuestion(defaultQs)
        setQuestionModalVisible(false)
    }
    function handleUpdatePassage(ps) {
        var _passages = currentGroupQuestion?.passages || []
        var _passages = [..._passages.filter((obj) => obj.number !== ps.number), { ...ps }]
        currentGroupQuestion.passages = _passages
        setCurrentGroupQuestion(currentGroupQuestion)
        setCurrentPassage(defaultPs)
        setPassageModalVisible(false)
    }
    function handleDeleteQuestion(qs) {
        console.log(qs);
        var _questions = currentGroupQuestion?.questions || []
        _questions = _questions.filter((obj) => obj.number !== qs.number)
        currentGroupQuestion.questions = _questions
        setCurrentGroupQuestion({ ...currentGroupQuestion })
    }
    function handleDeletePassage(ps) {
        var _passages = currentGroupQuestion?.passages || []
        _passages = _passages.filter((obj) => obj.number !== ps.number)
        currentGroupQuestion.passages = _passages
        setCurrentGroupQuestion({ ...currentGroupQuestion })
    }
    function onFinish(params) {

    }
    useEffect(() => {
        if (data) {

        }
        else
            setCurrentGroupQuestion(defaultGroupQuestion)
    }, [data]);
    return (
        <Card
            title={`${questionIdQuery ? "Update" : "Insert"} question`}
        >
            <Row span={8}>
                <Select placeholder="select type">
                    <Option value={"A"}>A</Option>
                    <Option value={"B"}>B</Option>
                    <Option value={"C"}>C</Option>
                    <Option value={"D"}>D</Option>
                </Select>
            </Row>

            <Space>
                <Button type="primary" >
                    Add Question
                </Button>
            </Space>
            <Card title="Passage">
                <Form.Item
                    label="Type"

                >
                    <Select placeholder="Select type">
                        {([1, 2, 3, 4, 5, 6, 7]).map(part =>
                            <Option key={part} value={part}>{`Part ${part}`}</Option>
                        )};
                    </Select>
                </Form.Item>
                <Form.Item label="Group">
                    <Input.Group compact>
                        <Form.Item
                            noStyle
                        >
                            <Input style={{ width: '20%' }} placeholder="Input group" />
                        </Form.Item>
                        <Form.Item
                            noStyle
                        >
                            <Input style={{ width: '80%' }} placeholder="Input label" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>


                <Form.Item
                    // name="image"
                    label="Image"
                >
                    <CustomManualUpload
                        url="https://i.stack.imgur.com/oK2WD.jpg?s=64&g=1"
                        onChange={(url) => {
                            console.log(url);
                        }}
                    />
                </Form.Item>


            </Card>
            <Divider>Question</Divider>
            <Card title="Question">

                <QuestionTable
                    data={currentGroupQuestion?.questions || []}
                    handleInsert={(data) => {
                        setCurrentQuestion(defaultQs)
                        setQuestionModalVisible(true)
                    }}
                    handleUpdate={(data) => {
                        setCurrentQuestion(data)
                        setQuestionModalVisible(true)
                    }}
                    handleDelete={handleDeleteQuestion}
                />
                <QuestionModal
                    data={currentQuestion}
                    visible={questionModalVisible}
                    onCancel={() => setQuestionModalVisible(false)}
                    onComplete={(qs) => handleUpdateQuestion(qs)}
                />
            </Card>
            <Divider>Passage</Divider>
            <Card title="Passage">
                <PassageTable
                    data={currentGroupQuestion?.passages || []}
                    handleInsert={(data) => {
                        setCurrentPassage(defaultQs)
                        setPassageModalVisible(true)
                    }}
                    handleUpdate={(data) => {
                        console.log(data);
                        setCurrentPassage(data)
                        setPassageModalVisible(true)
                    }}
                    handleDelete={handleDeletePassage}
                />
                <PassageModal
                    data={currentPassage}
                    visible={passageModalVisible}
                    onComplete={handleUpdatePassage}
                    onCancel={() => { setPassageModalVisible(false) }}
                />
            </Card>
        </Card>
    );
};
GroupQuestionModal.propTypes = {
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func,
    visible: PropTypes.bool,
    data: PropTypes.any,
    isInsert: PropTypes.bool
}
export default GroupQuestionModal;
