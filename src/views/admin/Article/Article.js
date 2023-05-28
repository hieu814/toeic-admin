import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, message } from "antd";
import { useDeleteArticleMutation, useFindAllArticleMutation } from "src/api/article";
import MyTable from "./components/ArticleTable";
import { buidQuery, getPaginator } from "src/common/Funtion";
import ArticleModal from "./components/ArticleModal";
import { useFindAllArticleCategoriesMutation } from "src/api/article_category";
import { useNavigate } from "react-router-dom";
// import ImportModal from "./components/ImportModal";
const { Option } = Select;



const ArticleManagementPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [findAllArticles, { data, isLoading, isError }] = useFindAllArticleMutation();
    const [deleteArticle] = useDeleteArticleMutation();
    const [findAllArticleCategorys, { data: categotyData }] = useFindAllArticleCategoriesMutation();
    const [currentData, setCurrentData] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [importModalVisible, setImportModalVisible] = useState(false)
    const [isInsert, setIsInsert] = useState(false)
    const [type, setType] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadData()

    }, [findAllArticles, search, type, rowsPerPage]);
    const loadData = () => {
        try {
            findAllArticleCategorys(buidQuery({
                page: 1,
                rowsPerPage: 100,
            }))
            findAllArticles(buidQuery({
                searchField: ["name"],
                search: search,
                queryField: {
                    category: type
                },
                page: page,
                rowsPerPage: rowsPerPage,
            }));
        } catch (error) {
            console.log(JSON.stringify(error.data));
        }

    }
    const handleTypeChange = (value) => {
        setType(value);
    };

    const handleSearch = (e) => {
        setSearch(e);
    };
    function handleDelete(params) {
        console.log("delete ", params);
        deleteArticle(params.id)
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
        setCurrentData({ image: "asdadsa" })
        setIsModalVisible(true)
    }
    function handleUpdate(params) {

        setIsInsert(false)
        setCurrentData(params)
        console.log(params);
        setIsModalVisible(true)

    }
    function handleCalcel(params) {
        loadData()
        setCurrentData({})
        setIsModalVisible(false)
    }
    return (

        <Card title={`Lession`}>
            <Space>
                <Select
                    defaultValue={""}
                    style={{ width: 120 }}
                    onChange={handleTypeChange}
                >
                    {(categotyData?.data?.data || []).map(fbb =>
                        <Option key={fbb.key} value={fbb.id}>{fbb.name}</Option>
                    )};

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
                    Add
                </Button>
            </Space>
            <MyTable
                isloading={isLoading}
                data={data?.data?.data || []}
                totalPage={getPaginator(data).pageCount}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                handleChangeRowPerPage={setRowsPerPage}
                handleChangePage={setPage}

            />
            <ArticleModal
                visible={isModalVisible}
                isInsert={isInsert}
                data={currentData}
                onCancel={handleCalcel}
                category={(categotyData?.data?.data || [])}

            />

        </Card>

    );
}

export default ArticleManagementPage;