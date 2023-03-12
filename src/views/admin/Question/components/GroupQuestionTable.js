
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
            name: 'group',
            selector: row => `${ row.group } `,
            sortable: true,
            maxWidth: "150px",
            wrap: true,
        },
        {
            name: 'Image',
            wrap: true,

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
            name: "Type",
            dataIndex: "type",
            wrap: true,
            maxWidth: "150px",
            key: "userType",
            cell: (record) => (
                <Tag color={"blue"}>{`Part ${record?.type ?? 1}`}</Tag>
            ),
        },
        {
            name: 'Audio',
            wrap: true,
            cell: (row) => (
                <div width="1150" height="50">
                    <audio src="http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" controls />
                </div>
            ),
        },
        {
            name: 'Actions',
            wrap: true,
            cell: (record) => (

                <Space>
                    <>
                        <Popconfirm
                            title="Are you sure you want to delete this record?"
                            onConfirm={() => handleUpdate(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ color: "#FF0000" }} onClick={() => handleDelete(record)} />
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
