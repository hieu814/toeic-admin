
import { Space, Tag, Popconfirm, Table, Button } from 'antd';

import React from 'react'
import PropTypes from "prop-types";
import {
    DeleteOutlined, EditOutlined, PlusOutlined,

} from '@ant-design/icons';
import MyImage from 'src/components/MyImage';
export default function PassageTable(props) {
    const { handleDelete,
        handleUpdate,
        handleInsert,
        data,
    } = props;
    const columns = [
        {
            title: 'Num',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (imageSrc) => {
                return <>
                    <MyImage
                        width={80}
                        height={80}
                        src={`${process.env.REACT_APP_BACKEND_URL}${imageSrc}`}
                    />

                </>

            },
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => (
                <Space size="middle">
                    <>
                        <Popconfirm
                            title="Are you sure you want to delete this record?"
                            onConfirm={() => handleDelete(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ color: "#FF0000" }} />
                        </Popconfirm>
                        <EditOutlined onClick={() => handleUpdate(record)} />
                    </>
                </Space>
            ),
        },
    ];
    return <div>
        <Table columns={columns} dataSource={data} pagination={false} rowKey="number" />
        <Button type="dashed" style={{ marginTop: 6 }} onClick={handleInsert} block icon={<PlusOutlined />}>
            Add Question
        </Button>
    </div>;

}

PassageTable.propTypes = {
    handleDelete: PropTypes.func,
    handleUpdate: PropTypes.func,
    handleInsert: PropTypes.func,
    data: PropTypes.any,
};
