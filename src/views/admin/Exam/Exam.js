import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, message } from "antd";
import { useDeleteExamMutation, useFindAllExamMutation } from "src/api/exam";
import MyTable from "./components/ExamTable";
import { buidQuery, getPaginator } from "src/common/Funtion";
import ExamModal from "./components/ExamModal";
import { useFindAllExamCategoriesMutation } from "src/api/exam_category";
const { Option } = Select;



const ExamManagementPage = () => {
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [findAllExams, { data, isLoading, isError }] = useFindAllExamMutation();
    const [deleteExam] = useDeleteExamMutation();
    const [findAllExamCategorys, { data: categotyData }] = useFindAllExamCategoriesMutation();
    const [currentData, setCurrentData] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isInsert, setIsInsert] = useState(false)
    const [type, setType] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadData()

    }, [findAllExams, search, type, rowsPerPage]);
    const loadData = () => {
        try {
            findAllExamCategorys(buidQuery({
                page: 1,
                rowsPerPage: 100,
            }))
            findAllExams(buidQuery({
                searchField: ["name"],
                search: search,
                // queryField: {
                //     type: type
                // },
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
        deleteExam(params.id)
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

        <Card title={`Exam Management`}>
            <Space>
                <Select
                    defaultValue={1}
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
                handleChangePage = {setPage}

            />
            <ExamModal
                visible={isModalVisible}
                isInsert={isInsert}
                data={currentData}
                onCancel={handleCalcel}
                category={(categotyData?.data?.data || [])}

            />
        </Card>

    );
}

export default ExamManagementPage;