
import { Button, Tag } from 'antd';

import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from "prop-types";
import WordAction from './WordAction';
import MyImage from 'src/components/MyImage';
import { checkUrl } from 'src/common/Funtion';



export default function MyTable(props) {
    const { handleAction,
        handleChangePage,
        handleChangeRowPerPage,
        totalPage,
        isloading,
        handleDeleteMany,
        rowsPerPage,
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
            name: 'Type',
            selector: (row, i) => row.type,
            sortable: true,
        },
        {
            name: 'Pronounce',
            selector: (row, i) => row.pronounce,
            sortable: true,
        },
        // {
        //     name: 'Definition',
        //     selector: (row, i) => row.definition,
        //     sortable: true,
        // },


        {
            name: 'Actions',
            cell: (record) => (
                <WordAction
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
                paginationTotalRows={totalPage * rowsPerPage}
                onChangeRowsPerPage={(r) => handleChangeRowPerPage(r)}
                paginationServer={true}
                progressPending={isloading}

            />
        </div>
    );

}

MyTable.propTypes = {
    handleAction: PropTypes.func,
    handleChangePage: PropTypes.func,
    handleChangeRowPerPage: PropTypes.func,
    totalPage: PropTypes.number,
    isloading: PropTypes.bool,
    data: PropTypes.any,
    handleDeleteMany: PropTypes.func,
    rowsPerPage: PropTypes.number
};
