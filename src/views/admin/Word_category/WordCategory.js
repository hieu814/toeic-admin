import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, message } from "antd";
import { useDeleteWordCategoryMutation, useFindAllWordCategoriesMutation } from "src/api/word_category";
import MyTable from "./components/WordCategoryTable";
import { buidQuery, getPaginator } from "src/common/Funtion";
import WordCategoryModal from "./components/WordCategoryModal";
import { useNavigate } from "react-router-dom";

const defaultData = {
    name: "",
    description: "",
    image: ""
}


const WordCategoryManagementPage = () => {
    const [page, setPage] = useState(1)
    const navigate = useNavigate();
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [findAllWordCategorys, { data, isLoading, isError }] = useFindAllWordCategoriesMutation();
    const [deleteCategory, { deleteLoading }] = useDeleteWordCategoryMutation();
    const [currentData, setCurrentData] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isInsert, setIsInsert] = useState(false)
    const [type, setType] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadData()

    }, [findAllWordCategorys, search, type, rowsPerPage]);
    const loadData = () => {
        try {
            findAllWordCategorys(buidQuery({
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
    function handleAction(action, value) {
        console.log({ action, value });
        if (action == 1) {
            handleUpdate(value)
        } else if (action == 2) {
            handleDelete(value)
        } else if (action == 3) {
            navigate(`/word?category=${value?.id || null}`)
        } 
    }

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

        <Card title={`Word Category `}>

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
                handleAction={handleAction}
                handleChangeRowPerPage={setRowsPerPage}
                handleChangePage={setPage}

            />
            <WordCategoryModal
                visible={isModalVisible}
                isInsert={isInsert}
                data={currentData}
                onCancel={handleCalcel}
                onComplete={handleComplete}

            />
        </Card>

    );
}

export default WordCategoryManagementPage;