import React from 'react'

const Dashboard = React.lazy(() => import('./views/admin/dashboard/Dashboard'))
const User = React.lazy(() => import('./views/admin/User/User'))
const ExamCategory = React.lazy(() => import('./views/admin/Exam_category/ExamCategory'))
const Exam = React.lazy(() => import('./views/admin/Exam/Exam'))
const ArticleCategory = React.lazy(() => import('./views/admin/Article_category/ArticleCategory'))
const Questions = React.lazy(() => import('./views/admin/Question/Question'))
const Question = React.lazy(() => import('./views/admin/Question/components/GroupQuestionPage'))
const Article = React.lazy(() => import('./views/admin/Article/Article'))
const WordCategory = React.lazy(() => import('./views/admin/Word_category/WordCategory'))
const Word = React.lazy(() => import('./views/admin/Word/Word'))
const WordTopic = React.lazy(() => import('./views/admin/Word_topic/WordTopic'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/user', name: 'User', element: User },
  { path: '/exam', name: 'Exam', element: Exam },
  { path: '/exam/quesions', name: 'Questions', element: Questions },
  { path: '/exam/quesion', name: 'Question', element: Question },
  { path: '/exam/category', name: 'Exam Category', element: ExamCategory },
  { path: '/article/category', name: 'Article Category', element: ArticleCategory },
  { path: '/article', name: 'Article', element: Article },
  { path: '/word/category', name: 'Category', element: WordCategory },
  { path: '/word/topic', name: 'Category', element: WordTopic },
  { path: '/word', name: 'Word', element: Word },
]

export default routes
