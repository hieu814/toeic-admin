import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, message, Button, Card, Divider } from "antd";
import { PlusOutlined, QqSquareFilled, UploadOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';
import MyEditor from "src/components/MyEditor";
import PassageModal from "./PassageModal";
import PassageTable from "./PassageTable";
import QuestionTable from "./QuestionTable";
import QuestionModal from "./QuestionModal";
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
const GroupQuestionModal = (props) => {
    const { isInsert, visible, onCancel, data } = props
    const [questionModalVisible, setQuestionModalVisible] = useState(false)
    const [passageModalVisible, setPassageModalVisible] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(defaultQs)
    const [currentPassage, setCurrentPassage] = useState(defaultPs)
    const [currentGroupQuestion, setCurrentGroupQuestion] = useState({})
    function handleUpdateQuestion(qs) {
        console.log(qs);
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
    useEffect(() => {
        setCurrentGroupQuestion(data)
    }, [data, currentGroupQuestion]);
    return (
        <Modal
            forceRender
            bodyStyle={{ overflowX: 'scroll' }}
            width="60%"
            title={`Group ${data?.group}`}
            centered
            open={visible} okText="Create" onCancel={onCancel} >
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
        </Modal>
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
