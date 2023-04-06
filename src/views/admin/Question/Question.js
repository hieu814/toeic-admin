import React, { useEffect, useState } from "react";
import { Space, Select, Input, Button, Card, message, AutoComplete } from "antd";
import { useFindAllExamMutation, useGetExamQuery } from "src/api/exam";
import { buidQuery, getPaginator } from "src/common/Funtion";
import { useDeleteQuestionMutation, useFindAllQuestionsMutation, useDeleteManyQuestionsMutation } from "src/api/question";
// import GroupQuestionModal from "./components/GroupQuestionModal";
import MyTable from "./components/GroupQuestionTable";
import { useLocation, useNavigate } from "react-router-dom";
import ImportModal from "./components/ImportModal";
const { Option } = Select;


///exam/quesions?examID=id
const ExamManagementPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const examIdQuery = query.get("examID");
  const navigate = useNavigate();
  const [page, setPage] = useState(1)
  const [type, setType] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [findAllQuestions, { data, isLoading, error }] = useFindAllQuestionsMutation();
  const [deleteManyQuestions] = useDeleteManyQuestionsMutation();
  const [deleteExam] = useDeleteQuestionMutation();
  const [findAllExams, { data: examData, isLoading: isExamLoading, isError }] = useFindAllExamMutation();
  const [examID, setExamID] = useState("");
  const { data: currentExam } = useGetExamQuery(examID);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData()
    setExamID(examIdQuery)
  }, [findAllQuestions, type, search, examID, rowsPerPage, currentExam, isExamLoading, page]);

  const loadData = () => {
    var _query = {}

    if (currentExam) {
      _query = { ...query, type: type, _id: { $in: currentExam?.data.questions || [] }, sort: { _id: 1, group: -1 }, }
    } else {
      _query = { ...query, type: type, sort: { _id: 1, group: -1 }, }
    }
    console.log({
      currentExam, _query, quesions: currentExam?.data.questions
    });
    try {
      findAllQuestions(buidQuery({
        page: page,
        rowsPerPage: rowsPerPage,
        queryField: _query,
      }))

    } catch (error) {
      console.log(error);
    }

  }

  function handleDelete(params) {
    console.log(params);
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
  function handleDeleteMany(ids) {

    deleteManyQuestions({ ids })
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
  function handleInsert(params) {
    navigate(`/exam/quesion${examIdQuery ? `?examID=${examIdQuery}` : ""}`)
  }
  function handleUpdate(qs) {
    console.log(qs);
    navigate(`/exam/quesion?${qs?.id ? `questionID=${qs?.id}` : ""}${examIdQuery ? `&examID=${examIdQuery}` : ""}`)
  }
  const handleSearch = (value) => {
    if (value) {
      findAllExams(buidQuery({
        searchField: ["name"],
        search: value,
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
  function handleComplete() {
    loadData()
  }
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
        <Select
          defaultValue={""}
          style={{ width: 120 }}
          onChange={setType}
        >
          {([{ name: "All", value: "" },
          { name: "Part 1", value: 1 },
          { name: "Part 2", value: 2 },
          { name: "Part 3", value: 3 },
          { name: "Part 4", value: 4 },
          { name: "Part 5", value: 5 },
          { name: "Part 6", value: 6 },
          { name: "Part 7", value: 7 },]).map(fbb =>
            <Option key={fbb.name} value={fbb.value}>{fbb.name}</Option>
          )};

        </Select>
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
        {examIdQuery && (<Button type="primary" onClick={handleInsert}>
          Add Question
        </Button>)}
        {examIdQuery && (<Button
          type="primary"
          onClick={() => setImportModalVisible(true)}
          style={{

            float: 'right'
          }}
        >Import</Button>)}
      </Space>
      <MyTable
        isloading={false}
        // data={data?.data?.data || []}
        data={data?.data?.data || []}
        totalPage={getPaginator(data).pageCount}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        handleChangeRowPerPage={setRowsPerPage}
        handleChangePage={setPage}
        handleDeleteMany={handleDeleteMany}

      />
      <ImportModal
        visible={importModalVisible}
        examId={examIdQuery}
        onCancel={() => { setImportModalVisible(false) }}
        onComplete={() => {
          setImportModalVisible(false)
          handleComplete()
        }}
      />
    </Card>

  );
}

export default ExamManagementPage;