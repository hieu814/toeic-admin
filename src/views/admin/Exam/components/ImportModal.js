import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Spin, Tabs, Card, Upload, Select, Form, } from 'antd';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import { useAddExamCategoryMutation, useUpdateExamCategoryMutation } from 'src/api/exam_category';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFileApi } from 'src/api/upload';
import { getQuestionName } from 'src/common/Funtion';
import { useGetExamQuery } from 'src/api/exam';
const { Option } = Select;

const ImportModal = (props) => {
    const { isInsert, visible, onCancel, data, onComplete ,examId} = props
    const [errorMsg, setErrorMsg] = useState("");
    const [type, setType] = useState(1);
    const [fileList, setFileList] = useState([]);
    const { data: exam, isLoading, error } = useGetExamQuery(examId);
    const onFinish = async () => {
        try {
            console.log(exam);
            if (fileList.length < 1) return
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('files', file);
            });
            await uploadFileApi(formData).then((res) => {
                var _fileName = res?.data?.uploadSuccess || []
                var _questionWithfileName = _fileName.reduce(function (map, obj) {
                    map[`${getQuestionName(obj.name)}`] = obj.path;
                    return map;
                }, {});
                console.log(_questionWithfileName);

            }).catch(err => {
                console.log(err);
            })

        } catch (error) {
            console.error(error);
        }
    };
    function importQuestion() {
        parseExcelFile(fileList[0]).then((arr) => {
            var _questions = []
            arr.forEach((row) => {

            })

        });
    }
    function parseExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                console.log({ data });
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                resolve(convertToJson(jsonData));
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    }
    function convertToJson(lines) {
        var result = [];
        var headers = lines[0]
        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i];
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }
        return result;

    }
    function handleCalcel() {
        setErrorMsg("-")

        onCancel()
    }
    useEffect(() => {
    }, [data, errorMsg, fileList]);


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
                <Button key="update" onClick={onFinish} type="primary" loading={false}>
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
                    <Option key={1} value={1}>CSV</Option>
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