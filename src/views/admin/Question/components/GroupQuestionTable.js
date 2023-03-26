
import { Space, Tag, Popconfirm } from 'antd';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from "prop-types";
import {
    DeleteOutlined, EditOutlined,

} from '@ant-design/icons';
export default function MyTable(props) {
    const { handleDelete,
        handleUpdate,
        handleDeleteMany,
        handleChangePage,
        handleChangeRowPerPage,
        totalPage,
        isloading,
        data,
    } = props;
    const [selectedRows, setSelectedRows] = useState([]);
    useEffect(() => {
        setSelectedRows([])
      }, [data]);
    function deleteMany() {
        let ids = Array.from((selectedRows || []), (field) => {
            return field.id
        })
        handleDeleteMany(ids)

    }
    const columns = [
        {
            name: 'group',
            selector: row => `${row.group} `,
            sortable: true,
            //maxWidth: "150px",
            wrap: true,
        },
        {
            name: 'Image',
            wrap: true,
            //maxWidth: "150px",
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
            //maxWidth: "150px",
            key: "userType",
            cell: (record) => (
                <Tag color={"blue"}>{`Part ${record?.type ?? 1}`}</Tag>
            ),
        },
        {
            name: 'Exam',
            selector: row => `${row?.exam ? (row?.exam?.name || "") : ""} `,
            sortable: true,
            //maxWidth: "150px",
            wrap: true,
        },
        {
            name: 'Actions',
            wrap: true,
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
            <Button
                danger
                onClick={deleteMany}
                style={{
                    color: 'red',
                    display: `${selectedRows.length == 0 ? 'none' : 'inline'}`,
                    float: 'right'
                }}
            >Delete alll</Button>
            <DataTable
                selectableRows
                onSelectedRowsChange={state => {
                    console.log(state.selectedRows);
                    setSelectedRows(state.selectedRows);
                }}
                columns={columns}
                data={data}
                onChangePage={(p) => handleChangePage(p)}
                pagination={true}
                // totalPage={totalPage}
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
    handleDeleteMany: PropTypes.func,
    handleChangePage: PropTypes.func,
    handleChangeRowPerPage: PropTypes.func,
    totalPage: PropTypes.number,
    isloading: PropTypes.bool,
    data: PropTypes.any,
};
