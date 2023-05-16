
import { Space, Tag, Popconfirm, Button } from 'antd';

import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from "prop-types";
import {
    DeleteOutlined, EditOutlined,

} from '@ant-design/icons';
import MyImage from 'src/components/MyImage';
import WordCategoryAction from './WordTopicAction';
import { checkUrl } from 'src/common/Funtion';
export default function MyTable(props) {
    const { handleAction,
        handleChangePage,
        handleChangeRowPerPage,
        handleDeleteMany,
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
                <MyImage
                    width={80}
                    height={80}
                    src={checkUrl(row?.image)}
                />
            ),
        },
        {
            name: 'Actions',
            cell: (record) => (
                <WordCategoryAction
                    onSelect={(key) => {
                        handleAction(key, record)
                    }}
                />


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
                columns={columns}
                data={data}
                onSelectedRowsChange={state => {
                    console.log(state.selectedRows);
                    setSelectedRows(state.selectedRows);
                }}
                onChangePage={(p) => handleChangePage(p)}
                pagination={true}
                paginationTotalRows={totalPage}
                onChangeRowsPerPage={(r) => handleChangeRowPerPage(r)}
                paginationServer={true}
                progressPending={isloading}
                selectableRows
            />
        </div>
    );

}

MyTable.propTypes = {
    handleAction: PropTypes.func,
    handleUpdate: PropTypes.func,
    handlePreview: PropTypes.func,
    handleChangePage: PropTypes.func,
    handleChangeRowPerPage: PropTypes.func,
    totalPage: PropTypes.number,
    handleDeleteMany: PropTypes.func,
    isloading: PropTypes.bool,
    data: PropTypes.any,
};
