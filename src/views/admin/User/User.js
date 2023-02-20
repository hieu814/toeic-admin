import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, Modal } from "antd";
import { useFindAllUserMutation, useAddUserMutation } from "src/api/user";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";
import MyTable from "./components/UserTable";
import { buidQuery, getPaginator } from "src/common/Funtion";
const { Option } = Select;



const UserManagementPage = () => {
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [findAllUsers, { data, isLoading, isError }] = useFindAllUserMutation();
    const [currentData, setCurrentData] = useState(null)

    const [role, setRole] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Call the findAllUsers function with the search and role filter parameters
        try {
            findAllUsers(buidQuery({
                searchField: ["username", "email", "name"],
                search: search,
                page: page,
                rowsPerPage: rowsPerPage
            }));
        } catch (error) {
            console.log(error);
        }

    }, [findAllUsers, search, role]);
    const handleRoleChange = (value) => {
        setRole(value);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    function handleDelete(params) {

    }
    function handleInsert(params) {

    }
    function handleUpdate(params) {

    }
    // return(
    //     <div>
    //         <b>`User Management ${JSON.stringify(data)}`</b>
    //     </div>
    // )
    return (

        <Card title={`User Management `}>

            <Space>
                <Select
                    defaultValue=""
                    style={{ width: 120 }}
                    onChange={handleRoleChange}
                >
                    <Option value="">All Roles</Option>
                    <Option value="admin">Admin</Option>
                    <Option value="user">User</Option>
                </Select>
                <Input.Search
                    placeholder="Search by username or email"
                    onChange={handleSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={handleInsert}>
                    Add User
                </Button>
            </Space>
            <MyTable
                isloading={isLoading}
                data={data?.data?.data || []}
                totalPage={getPaginator(data).pageCount}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
            />
        </Card>
    );
}

export default UserManagementPage;