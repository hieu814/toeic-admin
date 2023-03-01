import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, message } from "antd";
import { useDeleteExamCategoryMutation, useFindAllExamCategoriesMutation } from "src/api/exam_category";
import MyTable from "./components/ExamCategoryTable";
import { buidQuery, getPaginator } from "src/common/Funtion";
import ExamCategoryModal from "./components/ExamCategoryModal";
const { Option } = Select;



const ExamCategoryManagementPage = () => {
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [findAllExamCategorys, { data, isLoading, isError }] = useFindAllExamCategoriesMutation();
    const [deleteCategory, { deleteLoading }] = useDeleteExamCategoryMutation();
    const [currentData, setCurrentData] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isInsert, setIsInsert] = useState(false)
    const [type, setType] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadData()

    }, [findAllExamCategorys, search, type, rowsPerPage]);
    const loadData = () => {
        try {
            findAllExamCategorys(buidQuery({
                searchField: [ "name"],
                search: search,
                queryField: {
                    type: type
                },
                page: page,
                rowsPerPage: rowsPerPage,
            }));
        } catch (error) {
            console.log(error.data);
        }

    }
    const handleTypeChange = (value) => {
        setType(value);
    };

    const handleSearch = (e) => {
        setSearch(e);
    };
    function handleDelete(params) {
        deleteCategory(params.id)
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
        setCurrentData({})
        setIsModalVisible(true)
    }
    function handleUpdate(params) {

        setIsInsert(false)
        setCurrentData(params)
        setIsModalVisible(true)

    }
    function handleCalcel(params) {
        loadData()
        setCurrentData({})
        setIsModalVisible(false)

    }
    return (

        <Card title={`ExamCategory Management `}>

            <Space>
                <Select
                    defaultValue={1}
                    style={{ width: 120 }}
                    onChange={handleTypeChange}
                >
                    {/* <Option value={null}>All</Option> */}
                    <Option value={2}>Article</Option>
                    <Option value={1}>Lession</Option>
                </Select>
                <Input.Search
                    placeholder="Search by name"
                    onChange={(e) => {
                        if (!e.target.value)
                            setSearch("")
                    }}
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={handleInsert}>
                    Add Category
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
            <ExamCategoryModal
                visible={isModalVisible}
                isInsert={isInsert}
                data={currentData}
                onCancel={handleCalcel}

            />
        </Card>

    );
}

export default ExamCategoryManagementPage;