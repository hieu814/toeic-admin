
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Form } from 'antd';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const CustomUpload = ({ fileList = [], onPreview, onChange, max }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = useCallback((info) => {
        if (info.file.status === 'uploading') {
            // setImage({ loading: true, image: null });
            info.file.status = 'done';
        }
        if (info.file.status === 'done') {
            console.log(JSON.stringify(info.file.respond));
            // getBase64(info.file.originFileObj, (imageUrl) => {
            //     const img = new Image();
            //     img.src = imageUrl;
            //     img.addEventListener('load', function () {
                    
            //         // setImage({ loading: false, image: imageUrl });
            //         // setFileList([{ ...info.fileList[0] }]);
            //     });
            // });
        }
    }, []);
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
        <div>
            <Upload
                action="http://localhost:5000/admin/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={onPreview || handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= max ? null : uploadButton}
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
        </div>
    );
};
CustomUpload.propTypes = {
    onChange: PropTypes.func,
    onPreview: PropTypes.func,
    fileList: PropTypes.array,
    max: PropTypes.number
}
export default CustomUpload;
