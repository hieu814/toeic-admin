
import { Space, Tag, Popconfirm, Table, Button } from 'antd';

import React from 'react'
import PropTypes from "prop-types";
import {
    DeleteOutlined, EditOutlined, PlusOutlined,

} from '@ant-design/icons';
export default function QuestionTable(props) {
    const { handleDelete,
        handleUpdate,
        handleInsert,
        data,
    } = props;
    const columns = [
        {
            title: 'Num',
            dataIndex: 'number',
            // key: 'number',
        },
        {
            title: 'Question',
            dataIndex: 'question',
            // key: 'question',
        },
        {
            title: 'A',
            dataIndex: 'A',
            // key: 'A',
        },
        {
            title: 'B',
            dataIndex: 'B',
            // key: 'B',
        },
        {
            title: 'C',
            dataIndex: 'C',
            // key: 'C',
        },
        {
            title: 'D',
            dataIndex: 'D',
            // key: 'D',
        },
        {
            title: 'Answer',
            dataIndex: 'correct_answer',
            // key: 'correct_answer',
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            // key: 'operation',
            render: (_,record) => (
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
                        <EditOutlined onClick={() => {
                            console.log(record);
                            handleUpdate(record)
                        }} />
                    </>
                </Space>
            ),
        },
    ];
    return <div>
        <Table columns={columns} dataSource={data} pagination={false} rowKey="number"/>
        <Button type="dashed" style={{ marginTop: 6 }} onClick={handleInsert} block icon={<PlusOutlined />}>
            Add Question
        </Button>
    </div>;

}

QuestionTable.propTypes = {
    handleDelete: PropTypes.func,
    handleUpdate: PropTypes.func,
    handleInsert: PropTypes.func,
    data: PropTypes.any,
};
