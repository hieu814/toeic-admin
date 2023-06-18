

import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Upload, Select, Form, } from 'antd';
import PropTypes from 'prop-types';
import csv from 'csvtojson';
import { UploadOutlined } from '@ant-design/icons';
import { isValidObjectId, parseExcelFile } from 'src/common/Funtion';
import { useBulkInsertWordMutation } from 'src/api/word';
import { useUpdateWordTopicMutation, useAddWordTopicMutation } from 'src/api/word_topic';
const { Option } = Select;

const ImportModal = (props) => {
    const { isInsert, visible, onCancel, data, onComplete, categoryID } = props
    const [errorMsg, setErrorMsg] = useState("");
    const [fileList, setFileList] = useState([]);
    const [isloading, setIsloading] = useState(false)
    const [insertOrUpdate] = useBulkInsertWordMutation();
    const [updateCategory] = useUpdateWordTopicMutation();
    const [addWordTopic] = useAddWordTopicMutation();
    const onFinish = async () => {
        setIsloading(true)
        await importData()
        setIsloading(false)
        onComplete()
    };


    function importData() {
        return new Promise(async (resolve, reject) => {
            const fileReader = new FileReader();
            const file = fileList[0]
            fileReader.onload = async (e) => {

                const text = e.target.result;
                const arr = await csv({
                    delimiter: '|', // Set the delimiter to a custom character, such as '|'
                }).fromString(text);
                var set = 0
                var data = []
                console.log(arr);
                return
                for (let i = 0; i < arr.length; i++, set++) {
                    await importTopic(arr[i])

                }

                resolve()

            };

            fileReader.readAsText(file);

        })
    }
    function importTopic(data) {
        return new Promise(async (resolve, reject) => {
            if (!data || !categoryID) {
                resolve()
                return
            }
            var dataTemp = data
            dataTemp.category = categoryID
            var _words = data.words
            if (!isValidObjectId(dataTemp.id ?? "")) {
                delete dataTemp.id
            }
            delete dataTemp.words

            addWordTopic(dataTemp)
                .then((respond) => {
                    var topicId = respond?.data?.data?.id
                    console.log(" addWordTopic ", { respond, topicId });
                    if (topicId && _words && _words.length > 0) {
                        importToTopic(_words, topicId).then((_) => {
                            resolve()
                        })

                    }
                })
                .catch((err) => {
                    console.log(err);

                });

        })

    }
    function importToTopic(data, topicId) {
        return new Promise(async (resolve, reject) => {
            console.log({ data, topicId });
            if (!isValidObjectId(topicId)) {
                resolve()
                return
            }

            var resData = await insertOrUpdate({ data }).unwrap()
            var _ids = Array.from(resData?.data || [], val => val.id)
            if (topicId) {
                var res = await updateCategory({
                    id: topicId,
                    $addToSet: { words: { $each: _ids } }
                    // $addToSet: { words: _ids }
                }).unwrap()
                console.log("import OK", res);
            }
            resolve()
        })

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
                    <Button icon={<UploadOutlined />}>Select CSV file</Button>
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
    categoryID: PropTypes.string

}
export default ImportModal;
