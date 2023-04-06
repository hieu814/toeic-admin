

import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Upload, Select, Form, } from 'antd';
import PropTypes from 'prop-types';

import { useBulkInsertQuestionsMutation, useFindAllQuestionsMutation, useBulkUpdateQuestionsMutation, useUpdateQuestionMutation } from 'src/api/question';

import Papa from 'papaparse';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFileApi } from 'src/api/upload';
import { buidQuery, getQuestionName, parseExcelFile, parseQuestion } from 'src/common/Funtion';
import { useGetExamQuery, useUpdateExamMutation } from 'src/api/exam';
const { Option } = Select;

const ImportModal = (props) => {
    const { isInsert, visible, onCancel, data, onComplete, examId } = props
    const [errorMsg, setErrorMsg] = useState("");
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
        console.log("onFinish ", type);
        setIsloading(true)
        try {
            if (fileList.length < 1) return
            if (type === 4) {
                await importAudio()
            } else if (type == 3) {
                await importImage()
            } else if (type === 2) {
                await importQuestion()
            } else if (type === 1) {
                // console.log("to csv");
                // getQuestions().then((quesions) => {
                //     downloadCSV(quesions)

                // })
                csvToJson(fileList[0])

            }


        } catch (error) {
            console.error(error);
        }
        setErrorMsg("")
        onComplete()
        setIsloading(false)
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
        console.log("getQuestions");
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
            console.log({ examType });
            parseExcelFile(fileList[0]).then((arr) => {
                var _question = []
                arr.forEach((val) => {
                    if (val?.question) {
                        var qs = parseQuestion({
                            questions: val?.question,
                            answers: val?.answers,
                            type: val?.type,
                            transcript: val?.transcript
                        })
                        if (examType <= 1 || (examType - 1) == (val?.type))
                            _question.push(qs)
                    }

                })
                bulkInsertQuestion({
                    data: _question
                })
                    .unwrap()
                    .then((respond) => {
                        message.success(respond.message)
                        console.log(respond?.data || []);
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
                        // console.log({ _quesionsTemp });
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
                        map[`${getQuestionName(obj.name)}`] = obj.path;
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
                    {`${isInsert ? "Insert" : "Update"}`}
                </Button>,
            ]}
        >

            {(errorMsg) && <div style={{ color: 'red', marginBottom: 10 }}>{`${errorMsg}`}</div>}
            <Form.Item label="Type">
                <Select
                    defaultValue={type}
                    onChange={(val) => {
                        setType(val)
                    }}
                    placeholder="Select type">
                    {/* <Option key={1} value={1}>CSV</Option> */}
                    <Option key={4} value={2}>Question</Option>
                    <Option key={2} value={3}>Image</Option>
                    <Option key={3} value={4}>Audio</Option>
                </Select>
            </Form.Item>
            <Form.Item label="File">
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
            </Form.Item>


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
