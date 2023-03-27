
import { Tag } from 'antd';

import React from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from "prop-types";
import WordAction from './WordAction';



export default function MyTable(props) {
    const { handleAction,
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
            name: 'Type',
            selector: (row, i) => row.type,
            sortable: true,
        },
        {
            name: 'Pronounce',
            selector: (row, i) => row.pronounce,
            sortable: true,
        },
        {
            name: 'Definition',
            selector: (row, i) => row.definition,
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
    handleAction: PropTypes.func,
    handleChangePage: PropTypes.func,
    handleChangeRowPerPage: PropTypes.func,
    totalPage: PropTypes.number,
    isloading: PropTypes.bool,
    data: PropTypes.any,
};
