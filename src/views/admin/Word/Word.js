import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, message } from "antd";
import { useDeleteWordMutation, useFindAllWordMutation, useBulkInsertWordMutation, useDeleteManyWordMutation } from "src/api/word";
import MyTable from "./components/WordTable";
import { buidQuery, getPaginator } from "src/common/Funtion";
import WordModal from "./components/WordModal";
import { useFindAllWordCategoriesMutation, useGetWordCategoryQuery, useUpdateWordCategoryMutation } from "src/api/word_category";
import { useLocation, useNavigate } from "react-router-dom";
import ImportModal from "./components/ImportModal";
// import ImportModal from "./components/ImportModal";
const { Option } = Select;



const WordManagementPage = () => {
    const query = new URLSearchParams(useLocation().search);
    const category = query.get("category");
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [findAllWords, { data, isLoading, isError }] = useFindAllWordMutation();
    const [deleteMany] = useDeleteManyWordMutation();
    const [insertOrUpdate] = useBulkInsertWordMutation();
    const [deleteWord] = useDeleteWordMutation();
    const [updateCategory] = useUpdateWordCategoryMutation();
    const [currentData, setCurrentData] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [importModalVisible, setImportModalVisible] = useState(false)
    const { data: currentCategory, refetch } = useGetWordCategoryQuery(category || "");
    const [isInsert, setIsInsert] = useState(false)
    const [type, setType] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadData()

    }, [findAllWords, search, type, page, rowsPerPage, currentCategory]);
    const loadData = () => {
        try {
            var _query = {
            }
            if (category) {
                _query = { ...query, _id: { $in: currentCategory?.data.words || [] }, sort: { _id: 1, group: -1 }, }
            } else {
                _query = { ...query, sort: { _id: 1, group: -1 }, }
            }
            findAllWords(buidQuery({
                searchField: ["name"],
                search: search,
                page: page,
                rowsPerPage: rowsPerPage,
                queryField: _query,
            }));
        } catch (error) {
            console.log(error.data);
        }

    }
    function handleDeleteMany(ids) {
        if (category) {
            updateCategory({
                id: category,
                $pullAll: { words: ids }
                // $addToSet: { words: _ids }
            })
                .unwrap()
                .then((respond) => {
                    message.success(respond.message)
                    console.log(respond);
                    refetch()
                    // loadData()
                })
                .catch((err) => {
                    message.error(err.message)

                });
        } else {
            deleteMany({ ids })
                .unwrap()
                .then((respond) => {
                    console.log(respond);
                    message.success(respond.message)
                    loadData()
                })
                .catch((err) => {
                    console.log(err);

                });
        }

    }
    const importWord = () => {
        setImportModalVisible(true)
        // insertOrUpdate({ data })
        //     .unwrap()
        //     .then((respond) => {
        //         console.log(respond);
        //     })
        //     .catch((err) => {
        //         console.log(err);

        //     });
    };

    const handleSearch = (e) => {
        setSearch(e);
    };
    function handleDelete(params) {
        deleteWord(params.id)
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
    function handleAction(action, value) {
        console.log({ action, value });
        if (action == 1) {
            handleUpdate(value)
        } else if (action == 2) {
            handleDelete(value)
        }
    }
    return (

        <Card title={`Word Management ${currentCategory?.data.name}`}>
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
                    Add
                </Button>
                <Button type="primary" onClick={importWord}>
                    Import
                </Button>
            </Space>
            <MyTable
                isloading={isLoading}
                data={data?.data?.data || []}
                totalPage={getPaginator(data).pageCount}
                handleAction={handleAction}
                handleChangeRowPerPage={setRowsPerPage}
                handleChangePage={setPage}
                handleDeleteMany={handleDeleteMany}
                rowsPerPage={rowsPerPage}

            />
            <WordModal
                visible={isModalVisible}
                isInsert={isInsert}
                data={currentData}
                onCancel={handleCalcel}

            // category={(categotyData?.data?.data || [])}

            />
            <ImportModal
                visible={importModalVisible}
                categoryID={category}
                onCancel={() => { setImportModalVisible(false) }}
                onComplete={() => {
                    setImportModalVisible(false)
                    refetch()
                }}
            />
        </Card>

    );
}

export default WordManagementPage;