
import { DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Dropdown, Popconfirm, Space, Table } from 'antd';
import React, { useState } from 'react';
import PassageModal from './components/PassageModal';
import PassageTable from './components/PassageTable';
import QuestionTable from './components/QuestionTable';

const App = () => {
  const [questionModalVisible, setQuestionModalVisible] = useState(false)
  const [passageModalVisible, setPassageModalVisible] = useState(false)
  var group_question_data = JSON.parse(`{
    "group":"92-94",
    "questions":[
       {
          "number":92,
          "question":"What are the listeners training to do?",
          "A":"Write promotional materials",
          "B":"Teach history classes",
          "C":"Give museum tours",
          "D":"Manage unpaid volunteers"
       },
       {
          "number":93,
          "question":"According to the speaker, what should the listeners pay attention to?",
          "A":"The layout of a space",
          "B":"Some visitors’ requests",
          "C":"Some safety guidelines",
          "D":"Her communication style"
       },
       {
          "number":94,
          "question":"What does the speaker ask the listeners to do?",
          "A":"Return a badge after the session",
          "B":"Take notes during a talk",
          "C":"Raise their hands to ask questions",
          "D":"Sign an attendance sheet"
       }
    ],
    "passages":[
       {
        "number":1,
          "content":"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
          "image":"https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
       }
    ]
 }`)

  return (
    <>
      <Card>
        <Divider>Question</Divider>
        <QuestionTable
          data={group_question_data.questions}
          handleInsert={() => setQuestionModalVisible(true)}
        />
        <PassageTable
          visible={questionModalVisible}
          onCancel={() => { setQuestionModalVisible(false) }}
        />
      </Card>
      <Card>
        <Divider>Question</Divider>
        <PassageTable
          data={group_question_data.passages}
          handleInsert={() => setQuestionModalVisible(true)}
        />
        <PassageModal
          visible={questionModalVisible}
          onCancel={() => { setQuestionModalVisible(false) }}
        />
      </Card>
    </>
  );
};
export default App;