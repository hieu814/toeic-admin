import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, Modal, message } from "antd";
import { useFindAllUserMutation, useAddUserMutation, useDeleteUserMutation } from "src/api/user";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";
import MyTable from "./components/UserTable";
import { buidQuery, getPaginator } from "src/common/Funtion";
import UserModal from "./components/UserModal";
const { Option } = Select;

const defaultUser = {
    email: "",
    password: "",
    nickname: "",
    phone: "",
    intro: "",

}

const UserManagementPage = () => {
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [findAllUsers, { data, isLoading, isError }] = useFindAllUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [currentData, setCurrentData] = useState(defaultUser)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isInsert, setIsInsert] = useState(false)
    const [role, setRole] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Call the findAllUsers function with the search and role filter parameters
        loadData()

    }, [findAllUsers, search, role, rowsPerPage]);
    const loadData = () => {
        try {
            findAllUsers(buidQuery({
                searchField: ["username", "email", "name"],
                search: search,
                queryField: {
                    userType: role
                },
                page: page,
                rowsPerPage: rowsPerPage,
            }));
        } catch (error) {
            console.log(error.data);
        }

    }
    const handleRoleChange = (value) => {
        setRole(value);
    };

    const handleSearch = (e) => {
        setSearch(e);
    };
    function handleDelete(params) {
        setIsModalVisible(false)
        deleteUser(params.id)
            .unwrap()
            .then((respond) => {
                message.success(respond.message)
                loadData()
            })
            .catch((err) => {
                console.log(err);

            });
    }
    function handleInsert(params) {
        setIsInsert(true)
        setCurrentData(defaultUser)
        setIsModalVisible(true)
    }
    function handleUpdate(params) {

        setIsInsert(false)
        setCurrentData(params)
        setIsModalVisible(true)

    }
    function handleCalcel(params) {
        setCurrentData(defaultUser)
        setIsModalVisible(false)

    }
    return (

        <Card title={`User`}>

            <Space>
                <Select
                    defaultValue={1}
                    style={{ width: 120 }}
                    onChange={handleRoleChange}
                >
                    <Option value={null}>All User</Option>
                    <Option value={2}>Admin</Option>
                    <Option value={1}>User</Option>
                    <Option value={3}>Customer</Option>
                </Select>
                <Input.Search
                    placeholder="Search by username or email"
                    onChange={(e) => {
                        if (!e.target.value)
                            setSearch("")
                    }}
                    onSearch={handleSearch}
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
                handleChangeRowPerPage={setRowsPerPage}

            />
            <UserModal
                visible={isModalVisible}
                isInsert={isInsert}
                data={currentData}
                onCancel={handleCalcel}

            />
        </Card>

    );
}

export default UserManagementPage;