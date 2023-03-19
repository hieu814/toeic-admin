import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const CustomManualUpload = ({ url = '', maxCount = 1, onChange, value }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        console.log("url chage ", url);
        setFileList(url ? [
            {
                uid: '-1',
                name: 'file',
                status: 'done',
                url: `${process.env.REACT_APP_BACKEND_URL}${url}`,
            }
        ] : [])
    }, [url]);
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = (_fileList) => {
        setFileList(_fileList)
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files', file);
        });
        onChange(formData)

    };
    const handleRemoveFile = (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        // handleChange(newFileList);
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    return (
        <>
            <Upload
                // action={`${process.env.REACT_APP_BACKEND_URL}/admin/upload`}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onRemove={handleRemoveFile}
                beforeUpload={(file) => {
                    setFileList([...fileList, file]);
                    return false;
                }}
                onChange={({ fileList: newFileList }) => {
                    handleChange(newFileList)
                }}
                maxCount={maxCount}
            >
                {fileList.length >= maxCount ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
};
CustomManualUpload.propTypes = {
    onChange: PropTypes.func,
    url: PropTypes.string,
    maxCount: PropTypes.number,
    value: PropTypes.any
}
export default CustomManualUpload;