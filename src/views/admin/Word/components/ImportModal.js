

import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Upload, Select, Form, } from 'antd';
import PropTypes from 'prop-types';

import { UploadOutlined } from '@ant-design/icons';
import { parseExcelFile } from 'src/common/Funtion';
import { useGetExamQuery, useUpdateExamMutation } from 'src/api/exam';
import { useBulkInsertWordMutation } from 'src/api/word';
import { useUpdateWordCategoryMutation } from 'src/api/word_category';
const { Option } = Select;

const ImportModal = (props) => {
    const { isInsert, visible, onCancel, data, onComplete, categoryID } = props
    const [errorMsg, setErrorMsg] = useState("");
    const [fileList, setFileList] = useState([]);
    const [isloading, setIsloading] = useState(false)
    const [insertOrUpdate] = useBulkInsertWordMutation();
    const [updateCategory] = useUpdateWordCategoryMutation();
    const onFinish = async () => {
        setIsloading(true)
        await importData()
        setIsloading(false)
        onComplete()
    };


    function importData() {
        return new Promise((resolve, reject) => {
            parseExcelFile(fileList[0]).then(async (arr) => {
                var set = 0
                var data = []
                for (let i = 0; i < arr.length; i++, set++) {
                    if (set == 100) {
                        var resData = await insertOrUpdate({ data }).unwrap()
                        var _ids = Array.from(resData?.data || [], val => val.id)
                        console.log({ _ids });
                        if (categoryID) {
                            var res = await updateCategory({
                                id: categoryID,
                                $addToSet: { words: { $each: _ids } }
                                // $addToSet: { words: _ids }
                            })
                                .unwrap()

                        }

                        data = []
                        set = 0
                    } else {
                        data.push((arr[i]))
                    }

                }
                resolve("")

            });
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
                    <Button icon={<UploadOutlined />}>Select xlsx file</Button>
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
