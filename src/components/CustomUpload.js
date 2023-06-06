
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { checkUrl, getUrlfromUploadRespond } from 'src/common/Funtion';
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
const CustomUpload = (props) => {
    const { onChange, value } = props;
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const handleChange = (info) => {
        console.log(info);
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);

            });
            var urls = getUrlfromUploadRespond(info.file.response) || [""]
            console.log("vluess",value);
            onChange(urls[0]?.path || "")
        }
    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
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
                // name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={`${process.env.REACT_APP_BACKEND_URL}/admin/upload`}
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                {value ? (
                    <img
                        src={checkUrl(value)}
                        alt="avatar"
                        style={{
                            width: 80,
                            height: 80
                        }}
                    />
                ) : (
                    uploadButton
                )}
            </Upload>

        </>
    );
};
CustomUpload.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any
}
export default CustomUpload;