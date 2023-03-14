import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getUrlfromUploadRespond } from 'src/common/Funtion';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const CustomManualUpload = ({ url, maxCount = 1, onChange }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState(url ? [
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: url,
        }
    ] : []);
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList)
        const fileUrls = [];
        newFileList.forEach(o => {
            o?.response && fileUrls.push((getUrlfromUploadRespond(o.response) || [""])[0]?.path);
        });
        onChange(fileUrls)
    };
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
                action={`${process.env.REACT_APP_BACKEND_URL}/admin/upload`}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                    showDownloadIcon: false,
                }}
                onChange={handleChange}
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
    maxCount: PropTypes.number
}
export default CustomManualUpload;