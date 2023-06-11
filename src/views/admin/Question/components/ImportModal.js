

import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Upload, Select, Form, Input } from 'antd';
import PropTypes from 'prop-types';

import { useBulkInsertQuestionsMutation, useFindAllQuestionsMutation, useBulkUpdateQuestionsMutation, useUpdateQuestionMutation } from 'src/api/question';

import Papa from 'papaparse';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFileApi } from 'src/api/upload';
import { buidQuery, createExcelFile, getQuestionName, parseExcelFile, parseQuestion } from 'src/common/Funtion';
import { useGetExamQuery, useUpdateExamMutation } from 'src/api/exam';
const { Option } = Select;

const ImportModal = (props) => {
    const { isInsert, visible, onCancel, data, onComplete, examId } = props
    const [errorMsg, setErrorMsg] = useState("");
    const [answersData, setAnswersData] = useState("");
    const [type, setType] = useState(1);
    const [fileList, setFileList] = useState([]);
    const [isloading, setIsloading] = useState(false)
    const { data: exam } = useGetExamQuery(examId);
    const [findAllQuestions] = useFindAllQuestionsMutation();
    const [updateExam] = useUpdateExamMutation();
    const [bulkInsertQuestion] = useBulkInsertQuestionsMutation();
    const [bulkUpdateQuestions] = useBulkUpdateQuestionsMutation();
    const [updateQuestion] = useUpdateQuestionMutation();
    const onFinish = async () => {

        setIsloading(true)
        try {
            if ((type !== 1 && type !== 5) && fileList.length < 1) return
            if (type === 4) {
                await importAudio()
            } else if (type == 3) {
                await importImage()
            } else if (type === 2) {
                await importQuestion()
            } else if (type === 1) {
                await exportData()

            } else if (type === 5) {
                await importAnswers()
            }
            else if (type === 6) {
                await importTranscripts()
            }

        } catch (error) {
            console.error(error);
        }
        setAnswersData("")
        setErrorMsg("")
        onComplete()
        setIsloading(false)
        setFileList([])
    };
    function csvToJson(csvFile) {
        Papa.parse(csvFile, {
            header: true,
            delimiter: ',',
            skipEmptyLines: true,
            complete: function (results) {
                const json = results.data;
                console.log(json);
                // Do something with the JSON data
            }
        });
    }
    function getQuestions() {
        return new Promise((resolve, reject) => {
            var _query = { _id: { $in: exam?.data.questions || [] } }
            findAllQuestions(buidQuery({
                page: 0,
                rowsPerPage: 200,
                queryField: _query,
            }))
                .unwrap()
                .then((respond) => {
                    resolve(respond?.data?.data || [])
                })
                .catch((err) => {
                    resolve([])

                });
        })

    }
    function importQuestion() {
        return new Promise((resolve, reject) => {
            var examType = exam?.data.type ?? 0
            parseExcelFile(fileList[0]).then((arr) => {
                var _question = []
                arr.forEach((val) => {
                    if (val?.question) {

                        var qs = parseQuestion({
                            questions: val?.question ?? "",
                            answers: val?.answers ?? "",
                            type: val?.type ?? 0,
                            transcript: val?.transcript ?? "",
                            image: val?.image ?? "",
                            audio: val?.audio ?? ""
                        })

                        if (examType <= 1 || (examType - 1) == (val?.type))
                            _question.push(qs)
                    }

                })
                // format question
                var _questioFormatted = []
                _question.forEach((quesion) => {
                    if (quesion.type == 2 || quesion.type == 5) {
                        (quesion.questions ?? []).forEach((val) => {

                            _questioFormatted.push({ ...quesion, questions: [{ ...val }], group: `${val.number}` })
                        })

                    } else if (quesion.type == 3 || quesion.type == 4) {

                        if (quesion.questions.length > 3) {
                            var questionArr = [...quesion.questions]
                            questionArr.sort((a, b) => a.number - b.number);
                            var array2 = [];
                            let currentArrayQss = [];

                            questionArr.forEach((item) => {
                                currentArrayQss.push({ ...item });

                                if (currentArrayQss.length === 3) {
                                    array2.push({
                                        ...quesion,
                                        questions: currentArrayQss,
                                        group: currentArrayQss.length < 2 ? `${currentArrayQss[0].number}` : `${currentArrayQss[0].number}-${currentArrayQss[currentArrayQss.length - 1].number}`

                                    })
                                    currentArrayQss = [];
                                }
                            });

                            if (currentArrayQss.length > 0) {
                                array2.push({
                                    ...quesion,
                                    questions: currentArrayQss,
                                    group: currentArrayQss.length < 2 ? `${currentArrayQss[0].number}` : `${currentArrayQss[0].number}-${currentArrayQss[currentArrayQss.length - 1].number}`

                                })
                            }

                            _questioFormatted = _questioFormatted.concat(array2)
                        } else {
                            _questioFormatted.push({ ...quesion })
                        }
                    }
                    else {
                        _questioFormatted.push({ ...quesion })
                    }

                })
                bulkInsertQuestion({
                    data: _questioFormatted
                })
                    .unwrap()
                    .then((respond) => {
                        message.success(respond.message)
                        updateExam({
                            id: examId,
                            $addToSet: { questions: respond?.data || [] }
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
            });
        })
    }

    function updateManyQuestion(quesions) {
        const allPromise = Promise.all(Array.from((quesions), (qs) => {

            return new Promise((resolve, reject) => {
                updateQuestion(qs)
                    .unwrap()
                    .then((respond) => {
                        resolve(respond.data)
                    })
                    .catch((err) => {
                        reject(err)
                    });
            })
        }));
        return allPromise

    }
    function importAudio() {
        return new Promise((resolve, reject) => {
            try {
                const formData = new FormData();
                fileList.forEach((file) => {
                    formData.append('files', file);
                });
                uploadFileApi(formData).then((res) => {
                    var _fileName = res?.data?.uploadSuccess || []
                    var _questionWithfileName = _fileName.reduce(function (map, obj) {
                        map[`${getQuestionName(obj.name)}`] = obj.path;
                        return map;
                    }, {});
                    getQuestions().then((quesions) => {
                        var _quesionsTemp = Array.from((quesions), (qs) => {
                            return { ...qs, audio: _questionWithfileName[qs?.group] }
                        })
                        updateManyQuestion(_quesionsTemp).then(datas => {
                            resolve("ok")
                        }).catch(err => {
                            reject(err); // Reject if updateManyQuestion() fails
                        })
                    })
                })
            } catch (error) {
                reject(error)
            }
        });
    }
    function exportData() {
        return new Promise((resolve, reject) => {
            try {

                getQuestions().then((groupQuesions) => {
                    var arrayData = []
                    groupQuesions.forEach(groupQuesion => {
                        var questionString = ""
                        var answerString = ""
                        groupQuesion.questions.forEach(obj => {
                            answerString += obj.correct_answer + "\n"
                            questionString += `${obj.number}. ${obj.question ?? ""}\n(A) ${obj.A ?? ""}\n(B) ${obj.B ?? ""}\n(C) ${obj.C ?? ""}\n${obj.D ? `(D) ${obj.D ?? ""}` : ""}\n`
                        });

                        arrayData.push({
                            question: questionString,
                            answers: answerString,
                            type: groupQuesion.type ?? 0,
                            transcript: groupQuesion.transcript ?? "",
                            image: groupQuesion.image ?? "",
                            audio: groupQuesion.audio ?? ""
                        })
                    });
                    arrayData.sort((a, b) => a.type - b.type);
                    createExcelFile(arrayData, `${exam?.data.name ?? "data"}.xlsx`)
                    resolve("ok")
                })



            } catch (error) {
                reject(error)
            }
        });
    }
    function importTranscripts() {
        return new Promise((resolve, reject) => {
            try {
                parseExcelFile(fileList[0]).then((transcripts) => {
                    getQuestions().then((quesions) => {
                        var _quesionsTemp = Array.from((transcripts), (transcript) => {
                            var qs = quesions.find(obj => transcript.number === obj?.group);
                            return { id: qs?.id ?? "", transcript: transcript.transcript ?? "" }
                        })
                        updateManyQuestion(_quesionsTemp).then(datas => {
                            resolve("ok")
                        }).catch(err => {
                            reject(err); // Reject if updateManyQuestion() fails
                        })
                    })
                })

            } catch (error) {
                reject(error)
            }
        });
    }
    function importImage() {
        return new Promise((resolve, reject) => {
            try {
                const formData = new FormData();
                fileList.forEach((file) => {
                    formData.append('files', file);
                });
                uploadFileApi(formData).then((res) => {
                    var _fileName = res?.data?.uploadSuccess || []
                    var _questionWithfileName = _fileName.reduce(function (map, obj) {
                        map[`${getQuestionName(obj.name)} `] = obj.path;
                        return map;
                    }, {});
                    getQuestions().then((quesions) => {
                        var _quesionsTemp = Array.from((quesions), (qs) => {
                            return { ...qs, image: _questionWithfileName[qs?.group] }
                        })
                        updateManyQuestion(_quesionsTemp).then(datas => {
                            resolve("ok")
                        }).catch(err => {
                            reject(err); // Reject if updateManyQuestion() fails
                        })
                    })
                })
            } catch (error) {
                reject(error)
            }
        });
    }
    function importAnswers() {
        return new Promise((resolve, reject) => {
            try {

                const lines = answersData.trimEnd().split("\n");
                var resultMap = new Map();
                for (const line of lines) {
                    const [key, value] = line.split(" ");
                    const parsedKey = parseInt(key.trim());
                    resultMap.set(parsedKey, value.trim());
                }
                getQuestions().then((datas) => {
                    var _quesionsTemp = Array.from((datas), (qs) => {
                        var _quesions = Array.from((qs.questions), (quesionValue) => {
                            return { ...quesionValue, correct_answer: resultMap.get(quesionValue.number) ?? "" }
                        })
                        return { ...qs, questions: _quesions }
                    })

                    updateManyQuestion(_quesionsTemp).then(datas => {
                        resolve("ok")
                    }).catch(err => {
                        reject(err); // Reject if updateManyQuestion() fails
                    })
                })
            } catch (error) {
                reject(error)
            }
        });
    }
    function handleCalcel() {
        setIsloading(false)
        setErrorMsg("")
        onCancel()
    }
    useEffect(() => {
    }, [data, errorMsg, fileList, visible]);


    return (
        <Modal
            centered
            open={visible}
            title={`Import Data`}
            onCancel={handleCalcel}
            footer={[
                <Button key="cancel" onClick={handleCalcel}>
                    Cancel
                </Button>,
                <Button loading={isloading} key="update" onClick={onFinish} type="primary" >
                    {`${isInsert ? "Insert" : "Update"} `}
                </Button>,
            ]}
        >

            {(errorMsg) && <div style={{ color: 'red', marginBottom: 10 }}>{`${errorMsg} `}</div>}
            <Form.Item label="Type">
                <Select
                    defaultValue={type}
                    onChange={(val) => {
                        setType(val)
                    }}
                    placeholder="Select type">
                    <Option key={1} value={1}>Export</Option>
                    <Option key={4} value={2}>Question</Option>
                    <Option key={2} value={3}>Image</Option>
                    <Option key={3} value={4}>Audio</Option>
                    <Option key={5} value={5}>Answers</Option>
                    <Option key={6} value={6}>Transcript</Option>
                </Select>
            </Form.Item>
            {type !== 5 && <Form.Item label="File">
                <Upload
                    supportServerRender
                    onRemove={(file) => {
                        const index = fileList.indexOf(file);
                        const newFileList = fileList.slice();
                        newFileList.splice(index, 1);
                        setFileList(newFileList);
                    }}
                    beforeUpload={async (file) => {
                        fileList.push(file)
                        setFileList(fileList);
                        return false;
                    }}
                    multiple
                    fileList={fileList}                >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
            </Form.Item>}
            {type === 5 && <Input.TextArea
                placeholder='1 A
                6 D
                2 A
                3 C
                4 B
                5 B
                ...'
                onChange={(e) => {
                    setAnswersData(e.target.value);
                }}
                autoSize={{ minRows: 2, maxRows: 600 }} // Set a minimum and maximum number of rows
                style={{ height: "auto", minHeight: "300px" }} // Set the height to auto and provide a minimum height
            />}


        </Modal>
    );
};
ImportModal.propTypes = {
    onCancel: PropTypes.func,
    onComplete: PropTypes.func,
    visible: PropTypes.bool,
    onCategoryUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool,
    examId: PropTypes.string

}
export default ImportModal;
