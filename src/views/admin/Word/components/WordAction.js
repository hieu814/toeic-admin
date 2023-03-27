import React from 'react'
import { DeleteOutlined, DownOutlined, EditOutlined, ExclamationCircleOutlined, ExportOutlined, FileSyncOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Modal, Space } from 'antd';
import PropTypes from "prop-types";

const WordAction = ({ onSelect }) => {

    const [modal, contextHolder] = Modal.useModal();
    const confirm = () => {
        modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this record?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                onSelect(2)
            },
        });
    };
    function handleMenuClick(e) {
        console.log(e.key);
        if (e.key == 2) {
            confirm()
        } else {
            onSelect(e.key)
        }

    }
    const items = [
        {
            label: 'Edit',
            key: 1,
            icon: <EditOutlined />,
        },
        {
            label: 'Delete',
            key: 2,
            danger: true,
            icon: <DeleteOutlined />,
        },

    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (<Space wrap>
        <Dropdown menu={menuProps}>
            <Button>
                <Space>
                    Actions
                    <DownOutlined />
                </Space>
            </Button>
        </Dropdown>
        {contextHolder}
    </Space>)
};
WordAction.propTypes = {
    onSelect: PropTypes.func
};
export default WordAction;