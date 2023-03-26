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
import MyEditor from "src/components/MyEditor";
import { useFindAllExamMutation, useUpdateExamMutation } from "src/api/exam";
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
    transcript: "",
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
    const [group, setGroup] = useState("")
    const [groupLabel, setGroupLabel] = useState("")
    const [transcript, setTranscript] = useState("")
    const [isloading, setIsloading] = useState(false)
    const [examID, setExamID] = useState(examIdQuery)
    const [type, setType] = useState(1);
    const { data, isLoading: firstLoading } = useGetQuestionQuery(questionIdQuery);
    const [findAllExams, { data: examData }] = useFindAllExamMutation();
    const [updateQuestion] = useUpdateQuestionMutation();
    const [updateExam] = useUpdateExamMutation();
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
            var qs = { ...currentGroupQuestion, exam: examIdQuery || "", type: type, group: group, label: groupLabel, transcript: transcript, exam: examIdQuery || '' }
            console.log({ qs });
            if (questionIdQuery) {
                updateQuestion(qs)
                    .unwrap()
                    .then((respond) => {
                        resolve(respond)
                    })
                    .catch((err) => {
                        reject(err)
                    });
            } else {
                addQuestion(qs)
                    .unwrap()
                    .then((respond) => {
                        var qsID = respond?.data?.id
                        if (!(qsID)) reject("error")
                        console.log({ addqs: qsID });
                        updateExam({
                            id: examIdQuery,
                            $addToSet: { questions: qsID }
                        })
                            .unwrap()
                            .then((respond) => {
                                resolve(respond)
                            })
                            .catch((err) => {
                                reject(err)
                            });
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
        var _data = {}
        if (data && questionIdQuery) {
            _data = { ...data?.data }
        }
        else {
            _data = { ...defaultGroupQuestion, image: "", audio: "", exam: examIdQuery || "" }
        }
        if (examIdQuery) {
            _data = { ..._data, exam: examIdQuery || "" }
        }
        console.log({ _data });
        setType(_data.type || 1)
        setGroup(_data.group)
        setGroupLabel(_data.label)
        setTranscript(_data.transcript)
        setCurrentGroupQuestion(_data)


    }, [data, firstLoading]);
    return (
        <Card
            title={`Save ${JSON.stringify(data?.data.audio)}`}
        >
            <Space>
                <Button
                    onClick={onFinish}
                    type="primary" >
                    Add Question
                </Button >
            </Space>
            <Spin spinning={isloading || firstLoading && questionIdQuery}>
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
                                                        value={group}
                                                        onChange={(val) => {
                                                            setGroup(val.target.value)
                                                        }}
                                                        placeholder={[1, 2, 5].includes(type) ? "Question" : "Group"} />
                                                </Form.Item>
                                                {![1, 2, 5].includes(type) && (<Form.Item
                                                    noStyle
                                                >
                                                    <Input style={{ width: '80%' }}
                                                        value={groupLabel}
                                                        onChange={(val) => {
                                                            setGroupLabel(val.target.value)
                                                        }}
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
                                            handleCancel={() => { setPassageModalVisible(false) }}
                                        />
                                    </Card>
                                ),
                            },
                            {
                                label: `Transcript`,
                                key: 4,
                                children: (
                                    <Card title="Transcript">
                                        <MyEditor
                                            content={transcript}
                                            onChange={(event, editor) => {
                                                setTranscript(editor.getData());
                                            }}
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
