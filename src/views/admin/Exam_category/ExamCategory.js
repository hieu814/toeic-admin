import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, message } from "antd";
import { useDeleteExamCategoryMutation, useFindAllExamCategoriesMutation } from "src/api/exam_category";
import MyTable from "./components/ExamCategoryTable";
import { buidQuery, getPaginator } from "src/common/Funtion";
import ExamCategoryModal from "./components/ExamCategoryModal";
const { Option } = Select;
const defaultData = {
    name:"",
    description:"",
    image:""
}


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
                searchField: ["name"],
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
        setCurrentData(defaultData)
        setIsModalVisible(true)
    }
    function handleUpdate(params) {

        setIsInsert(false)
        setCurrentData(params)
        setIsModalVisible(true)

    }
    function handleComplete() {
        loadData()
        setCurrentData(defaultData)
        setIsModalVisible(false)

    }
    function handleCalcel(_) {
        setCurrentData(defaultData)
        setIsModalVisible(false)

    }
    return (

        <Card title={`Exam Category`}>

            <Space>
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
                    Add new
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
                onComplete={handleComplete}

            />
        </Card>

    );
}

export default ExamCategoryManagementPage;