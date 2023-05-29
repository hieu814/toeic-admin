import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, message } from "antd";
import { useDeleteArticleCategoryMutation, useFindAllArticleCategoriesMutation } from "src/api/article_category";
import MyTable from "./components/ArticleCategoryTable";
import { buidQuery, getPaginator } from "src/common/Funtion";
import ArticleCategoryModal from "./components/ArticleCategoryModal";
const { Option } = Select;
const defaultData = {
    name: "",
    description: "",
    image: ""
}


const ArticleCategoryManagementPage = () => {
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [findAllArticleCategorys, { data, isLoading, isError }] = useFindAllArticleCategoriesMutation();
    const [deleteCategory, { deleteLoading }] = useDeleteArticleCategoryMutation();
    const [currentData, setCurrentData] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isInsert, setIsInsert] = useState(false)
    const [type, setType] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadData()

    }, [findAllArticleCategorys, search, type, rowsPerPage]);
    const loadData = () => {
        try {
            findAllArticleCategorys(buidQuery({
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

        <Card title={`Lession Category`}>

            <Space>
                <Select
                    defaultValue={1}
                    style={{ width: 120 }}
                    onChange={handleTypeChange}
                >
                    <Option value={null}>All</Option>
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
            <ArticleCategoryModal
                visible={isModalVisible}
                isInsert={isInsert}
                data={currentData}
                onCancel={handleCalcel}
                onComplete={handleComplete}

            />
        </Card>

    );
}

export default ArticleCategoryManagementPage;