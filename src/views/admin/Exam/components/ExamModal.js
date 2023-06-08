import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Spin, Switch, Select, Upload } from 'antd';
import PropTypes from 'prop-types';

import { useAddExamMutation, useUpdateExamMutation } from 'src/api/exam';
import { removeUndefined } from 'src/common/Funtion';
import CustomUpload from 'src/components/CustomUpload';
import { UploadOutlined } from '@ant-design/icons';
import { useBulkInsertQuestionsMutation, useFindAllQuestionsMutation } from 'src/api/question';
const { Option } = Select;
const fullTestQuestions = {
    1: 6,
    2: 25,
    3: 13,
    4: 10,
    5: 30,
    6: 100,
    7: 200,
}
const miniTestQuestions = {
    1: 2,
    2: 7,
    3: 3,
    4: 3,
    5: 8,
    6: 2,
    7: 2,
}
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
const ExamModal = (props) => {
    const { isInsert, visible, onCancel, data, category } = props
    const [form] = Form.useForm();
    const [addExam, { error: insertError, isLoading: insertLoading = false }] = useAddExamMutation();
    const [updateExam, { error: updateError, isLoading: updateLoading = false }] = useUpdateExamMutation();
    const [findAllQuestions] = useFindAllQuestionsMutation();
    const [bulkInsertQuestion] = useBulkInsertQuestionsMutation();
    const onFinish = async (values) => {
        values = removeUndefined(values)

        // return
        if (isInsert) {
            addExam(values)
                .then(async (respond) => {

                    if (respond.data.id && values.random) {
                        await updateQuestions(respond.data.id, values.type).then(async (respond) => {
                            message.success(respond.message)
                            handleCalcel()
                        })
                            .catch((err) => {
                                console.log(err);

                            });
                    } else {
                        message.success(respond.message)
                        handleCalcel()
                    }

                })
                .catch((err) => {
                    console.log(err);

                });
        } else {
            values.id = data?.id
            updateExam(values)
                .unwrap()
                .then(async (respond) => {
                    console.log(respond);
                    if (respond.data.id && values.random) {
                        await updateQuestions(respond.data.id, values.type).then(async (respond) => {
                            message.success(respond.message)
                            handleCalcel()
                        })
                            .catch((err) => {
                                console.log(err);

                            });
                    } else {
                        message.success(respond.message)
                        handleCalcel()
                    }
                })
                .catch((err) => {
                    console.log(err);

                });
        }
        // handleCalcel()

    };
    async function updateQuestions(examId, type) {
        return new Promise(async (resolve, reject) => {
            const questions = await getRandomQuestion(type)
            console.log(questions);
            bulkInsertQuestion({
                data: questions
            })
                .unwrap()
                .then((respond) => {
                    message.success(respond.message)
                    // console.log(respond?.data || []);
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
        })
    }
    function getRandomQuestion(examType) {
        const types = examType < 2 ? [1, 2, 3, 4, 5, 6, 7] : [examType - 1];
        const promises = [];

        var questionsCntMap = examType === 1 ? miniTestQuestions : fullTestQuestions;

        types.forEach(type => {

            const promise = findAllQuestions({
                random: true,
                size: questionsCntMap[type] ?? 0,
                query: [
                    {
                        $match: {
                            type: type,
                            random: false
                        }
                    },
                    { $sample: { size: questionsCntMap[type] ?? 0, } }
                ]
            });
            promises.push(promise);
        });
        return Promise.all(promises)
            .then(responses => {
                if (!responses || !Array.isArray(responses)) {
                    return []
                }
                var allQuestions = [];
                for (let i = 0; i < responses.length; i++) {
                    var array = responses[i].data.data ?? []
                    if (examType === 0 && array.length > 0 && (array[0].type === 6 || array[0].type === 7)) {
                        array = getRandomReading(array, array[0].type === 7 ? 54 : 16)
                        // console.log({ reading: array });
                    }
                    allQuestions = allQuestions.concat(array);
                }
                return allQuestions;
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .then(allQuestions => {
                var documents = allQuestions.sort((a, b) => a.type - b.type);
                // Remove specified keys from each document
                const modifiedDocuments = documents.map(({ _id, addedBy, createdAt, updatedAt, isDeleted, isActive, __v, updatedBy, ...rest }) => rest);
                var currentQuestionNum = 1
                const convertedArray = modifiedDocuments.map(obj => {
                    const _questions = obj.questions.map(question => {
                        return { ...question, number: currentQuestionNum++ };
                    });
                    return { ...obj, questions: _questions, random: true,group: _questions.length < 2 ? `${_questions[0].number}` : `${_questions[0].number}-${_questions[_questions.length - 1].number}` };
                });
                return convertedArray

            });
    }
    function getRandomReading(records, targetSum) {
        let sum = 0;
        let sequence = [];

        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            sum += record.questions.length;
            sequence.push(record);

            if (sum === targetSum) {
                return sequence;
            } else if (sum > targetSum) {
                while (sum > targetSum) {
                    const removedRecord = sequence.shift();
                    sum -= removedRecord.questions.length;
                }

                if (sum === targetSum) {
                    return sequence;
                }
            }
        }

        return [];
    }
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
            open={visible}
            title={`${isInsert ? "Insert" : "Update"} Exam`}
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
                            <Option value={0}>Full Test</Option>
                            <Option value={1}>Mini Test</Option>
                            <Option value={2}>Part 1</Option>
                            <Option value={3}>Part 2</Option>
                            <Option value={4}>Part 3</Option>
                            <Option value={5}>Part 4</Option>
                            <Option value={6}>Part 5</Option>
                            <Option value={7}>Part 6</Option>
                            <Option value={8}>Part 7</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="name"
                        // tooltip="To login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input Examname!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
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
                        <Select placeholder="select type">
                            {(category || []).map(fbb =>
                                <Option key={fbb.key} value={fbb.id}>{fbb.name}</Option>
                            )};
                        </Select>
                    </Form.Item>
                    {/* <Form.Item
                        name="image"
                        label="Image"
                        rules={[
                            {
                                required: isInsert,
                                message: 'Please select type!',
                            },
                        ]}
                    >
                        <CustomUpload />
                    </Form.Item> */}

                    <Form.Item name="random" label="Random question" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};
ExamModal.propTypes = {
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func,
    visible: PropTypes.bool,
    onExamUpdated: PropTypes.func,
    data: PropTypes.any,
    isLoading: PropTypes.bool,
    isInsert: PropTypes.bool,
    category: PropTypes.array
}
export default ExamModal;
