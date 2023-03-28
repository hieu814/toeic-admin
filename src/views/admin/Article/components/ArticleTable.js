
import { Space, Tag, Popconfirm } from 'antd';

import React from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from "prop-types";
import {
    DeleteOutlined, EditOutlined,

} from '@ant-design/icons';
import MyImage from 'src/components/MyImage';
import { checkUrl } from 'src/common/Funtion';
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
            name: 'Description',
            selector: (row, i) => row.description,
            sortable: true,
        },
        {
            name: 'Image',
            cell: (row) => (
                <MyImage
                    width={80}
                    height={80}
                    src={checkUrl(row?.thumbail)}
                />

            ),
        },
        {
            name: 'Type',
            cell: (row) => (
                <Tag color={row?.type === 1 ? "red" : "blue"}>{row?.type === 1 ? "Lession" : "Article"}</Tag>
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
