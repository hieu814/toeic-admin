import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, message, Button, Card, Divider, Col, Select, Space, Row, Tabs, Spin } from "antd";
import { PlusOutlined, QqSquareFilled, UploadOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';
import PassageModal from "./PassageModal";
import PassageTable from "./PassageTable";
import QuestionTable from "./QuestionTable";
import QuestionModal from "./QuestionModal";
import { useLocation } from "react-router-dom";
import { useGetQuestionQuery, useAddQuestionMutation, useUpdateQuestionMutation } from "src/api/question"
import CustomManualUpload from "src/components/CustomManualUpload";
import { uploadFileApi } from "src/api/upload";
import { getUrlfromUploadRespond } from "src/common/Funtion";
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
    const questionIdQuery = query.get("questionID");
    const examIdQuery = query.get("examID");
    const [questionModalVisible, setQuestionModalVisible] = useState(false)
    const [passageModalVisible, setPassageModalVisible] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(defaultQs)
    const [currentPassage, setCurrentPassage] = useState(defaultPs)
    const [currentGroupQuestion, setCurrentGroupQuestion] = useState(defaultGroupQuestion)
    const [imageFormData, setImageFormData] = useState(null)
    const [audioFormData, setAudioFormData] = useState(null)
    const [isloading, setIsloading] = useState(false)
    const [type, setType] = useState(1);
    const { data } = useGetQuestionQuery(questionIdQuery);
    const [updateQuestion] = useUpdateQuestionMutation();
    const [addQuestion] = useAddQuestionMutation();

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
    async function onFinish() {
        setIsloading(true)
        const update = new Promise(async (resolve, reject) => {
            if (!examIdQuery) {
                message.error("Exam incorrect")
                return
            }
            if (imageFormData) {
                await uploadFileApi(imageFormData).then((res) => {
                    let arrUrl = getUrlfromUploadRespond(res)
                    if (arrUrl?.length < 1) currentGroupQuestion.image = ""
                    else currentGroupQuestion.image = arrUrl[0].path
                }).catch(err => {
                    currentGroupQuestion.image = ""
                })
            }
            if (audioFormData) {
                await uploadFileApi(audioFormData).then((res) => {
                    let arrUrl = getUrlfromUploadRespond(res)
                    if (arrUrl?.length < 1) currentGroupQuestion.audio = ""
                    else currentGroupQuestion.audio = arrUrl[0].path
                }).catch(err => {
                    currentGroupQuestion.audio = ""
                })
            }

            if (questionIdQuery) {
                var qs = { ...currentGroupQuestion, exam: examIdQuery || "", type: type }
                console.log({qs});
                updateQuestion({ id: questionIdQuery, data: qs })
                    .unwrap()
                    .then((respond) => {
                        resolve(respond)
                    })
                    .catch((err) => {
                        reject(err)
                    });
            } else {
                var qs = { ...currentGroupQuestion, exam: examIdQuery || "", type: type }
                console.log(qs);
                addQuestion(qs)
                    .unwrap()
                    .then((respond) => {
                        resolve(respond)
                    })
                    .catch((err) => {
                        reject(err)
                    });
            }


        });
        await update.then(res => {
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log(err);
        })
        setImageFormData(null)
        setAudioFormData(null)
        setIsloading(false)
    }
    useEffect(() => {
        if (data && questionIdQuery) {
            setCurrentGroupQuestion({ ...data, exam: examIdQuery || "" })
            setType(data?.type || 1)
        }
        else {
            var qs = { ...defaultGroupQuestion, image: "", audio: "", exam: examIdQuery || "" }
            console.log({ qs });
            setCurrentGroupQuestion(qs)

        }

    }, [data]);
    return (
        <Card
            title={`${questionIdQuery ? "Update" : "Insert"} question  ${questionIdQuery}`}
        >
            <Space>
                <Button
                    onClick={onFinish}
                    type="primary" >
                    Add Question
                </Button >
            </Space>
            <Spin spinning={isloading}>
                <Tabs
                    defaultActiveKey="1"
                    type="card"
                    size={"large"}
                    items={
                        [
                            {
                                label: `Infor`,
                                key: 1,
                                children: (
                                    <Card title="Infor">
                                        <Form.Item
                                            label="Type"

                                        >
                                            <Select
                                                defaultValue={type}
                                                onChange={(val) => {
                                                    console.log(val);
                                                    setType(val)
                                                }}
                                                placeholder="Select type">
                                                {([1, 2, 3, 4, 5, 6, 7]).map(part =>
                                                    <Option key={part} value={part}>{`Part ${part}`}</Option>
                                                )};
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label={[1, 2, 5].includes(type) ? "Question" : "Group"}>
                                            <Input.Group compact>
                                                <Form.Item
                                                    noStyle
                                                >
                                                    <Input style={{ width: '20%' }}
                                                        value={currentQuestion.group}
                                                        onChange={(val) => setCurrentGroupQuestion({ currentGroupQuestion, group: val.target.value })}
                                                        placeholder={[1, 2, 5].includes(type) ? "Question" : "Group"} />
                                                </Form.Item>
                                                {![1, 2, 5].includes(type) && (<Form.Item
                                                    noStyle
                                                >
                                                    <Input style={{ width: '80%' }}
                                                        value={currentQuestion.group}
                                                        onChange={(val) => setCurrentGroupQuestion({ currentGroupQuestion, label: val.target.value })}
                                                        placeholder="Label" />
                                                </Form.Item>)}
                                            </Input.Group>
                                        </Form.Item>
                                        <Form.Item
                                            // name="image"
                                            label="Image"
                                        >
                                            <CustomManualUpload
                                                url={currentGroupQuestion?.image || ""}
                                                onChange={(formData) => {
                                                    setImageFormData(formData)
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            // name="image"
                                            label="Audio"
                                        >
                                            <CustomManualUpload
                                                url={currentGroupQuestion?.audio || ""}
                                                onChange={(formData) => {
                                                    setAudioFormData(formData)
                                                }}
                                            />
                                        </Form.Item>

                                    </Card>
                                ),
                            },
                            {
                                label: `Question`,
                                key: 2,
                                children: (
                                    <Card title="Question">

                                        <QuestionTable
                                            type={type}
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
                                ),
                            },
                            {
                                label: `Passage`,
                                key: 3,
                                disabled: type <= 5,
                                children: (
                                    <Card title="Passage">
                                        <PassageTable
                                            data={currentGroupQuestion?.passages || []}
                                            handleInsert={(_) => {
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
                                ),
                            }
                        ]
                    }
                />
            </Spin>

        </Card >
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
