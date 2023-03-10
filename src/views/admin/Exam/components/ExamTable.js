
import { Space, Tag, Popconfirm } from 'antd';

import React from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from "prop-types";
import {
    DeleteOutlined, EditOutlined,

} from '@ant-design/icons';
export default function MyTable(props) {
    const { handleDelete,
        handleUpdate,
        handlePreview,
        handleChangePage,
        handleChangeRowPerPage,
        totalPage,
        isloading,
        data,
    } = props;
    const columns = [
        {
            name: 'ID',
            selector: (row, i) => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: (row, i) => row.name,
            sortable: true,
        },
        {
            name: 'Image',
            cell: (row) => (
                <img src={`${process.env.REACT_APP_BACKEND_URL}${row?.image}`}
                    onError={(e) => {
                        e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
                    }}
                    style={{
                        width: 80,
                        height: 80,
                        margin: '10px',
                        borderRadius: '10%'
                    }}
                />
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (role) => (
                <Tag color={role === 1 ? "red" : "blue"}>{role}</Tag>
            ),
        },
        {
            name: 'Actions',
            cell: (record) => (

                <Space>
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
            button: true,
        },
    ];
    return (
        <div>
            <DataTable
                columns={columns}
                data={data}

                onChangePage={(p) => handleChangePage(p)}
                pagination={true}
                paginationTotalRows={totalPage}
                onChangeRowsPerPage={(r) => handleChangeRowPerPage(r)}
                paginationServer={true}
                progressPending={isloading}

            />
        </div>
    );

}

MyTable.propTypes = {
    handleDelete: PropTypes.func,
    handleUpdate: PropTypes.func,
    handlePreview: PropTypes.func,
    handleChangePage: PropTypes.func,
    handleChangeRowPerPage: PropTypes.func,
    totalPage: PropTypes.number,
    isloading: PropTypes.bool,
    data: PropTypes.any,
};
