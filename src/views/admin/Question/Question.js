import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, message, AutoComplete } from "antd";
import { useFindAllExamMutation } from "src/api/exam";
import { buidQuery, getPaginator } from "src/common/Funtion";
import { useDeleteQuestionMutation, useFindAllQuestionsMutation } from "src/api/question";
import GroupQuestionModal from "./components/GroupQuestionModal";
import MyTable from "./components/GroupQuestionTable";
import { useLocation } from "react-router-dom";
const { Option } = Select;


///exam/quesions?examID=id
const ExamManagementPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const examIdQuery = query.get("examID");
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [findAllQuestions, { data, isLoading, error }] = useFindAllQuestionsMutation();
  const [deleteExam] = useDeleteQuestionMutation();
  const [findAllExams, { data: examData, isExamLoading, isError }] = useFindAllExamMutation();
  const [currentData, setCurrentData] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isInsert, setIsInsert] = useState(false)
  const [search, setSearch] = useState("");
  const [examID, setExamID] = useState("");

  useEffect(() => {
    loadData()

  }, [findAllQuestions, search, examID, rowsPerPage]);

  const loadData = () => {
    try {
      findAllQuestions(buidQuery({
        page: page,
        rowsPerPage: rowsPerPage,
        queryField: {
          exam: examID
        },
      }))

    } catch (error) {
      console.log(error.data);
    }

  }

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
  const handleSearch = (value) => {
    if (value) {
      findAllExams(buidQuery({
        searchField: ["name"],
        search: value,
        // queryField: {
        //     type: type
        // },
        page: 0,
        rowsPerPage: 10,
      }));
    }
  };
  const onSelect = (value) => {

    const found = (examData?.data?.data || []).find(exam => exam.name === value);
    console.log('onSelect', found);
    setExamID(found.id)
  };
  const searchResult = (data) => {
    console.log(JSON.stringify(data));
    if (!Array.isArray(data) || data.length == 0) return []
    var options = data.map((category) => {

      return {
        value: category?.name,
        labelInValue: false,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              {category?.name}
            </span>
          </div>
        ),
      };
    });
    console.log(options);
    return options
  }


  return (

    <Card title={`Question Management`}>
      <Space>
        {!examIdQuery && (<AutoComplete
          dropdownMatchSelectWidth={252}
          style={{
            width: 300,
          }}
          options={searchResult(examData?.data?.data)}
          onSelect={onSelect}

        >
          <Input.Search placeholder="input here" enterButton onSearch={handleSearch} />
        </AutoComplete>)}
        <Button type="primary" onClick={handleInsert}>
          Add Question
        </Button>
      </Space>
      <MyTable
        isloading={false}
        // data={data?.data?.data || []}
        data={data}
        totalPage={getPaginator(data).pageCount}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        handleChangeRowPerPage={setRowsPerPage}
        handleChangePage={setPage}

      />
      <GroupQuestionModal
        visible={isModalVisible}
        isInsert={isInsert}
        data={currentData}
        onCancel={handleCalcel}

      />
    </Card>

  );
}

export default ExamManagementPage;