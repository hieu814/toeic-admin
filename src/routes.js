import React from 'react'

const Dashboard = React.lazy(() => import('./views/admin/dashboard/Dashboard'))
const User = React.lazy(() => import('./views/admin/User/User'))
const ExamCategory = React.lazy(() => import('./views/admin/Exam_category/ExamCategory'))
const Exam = React.lazy(() => import('./views/admin/Exam/Exam'))
const ArticleCategory = React.lazy(() => import('./views/admin/Article_category/ArticleCategory'))
const Questions = React.lazy(() => import('./views/admin/Question/Question'))
const Question = React.lazy(() => import('./views/admin/Question/components/GroupQuestionPage'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/user', name: 'Dashboard', element: User },
  { path: '/exam', name: 'Dashboard', element: Exam },
  { path: '/exam/quesions', name: 'Dashboard', element: Questions },
  { path: '/exam/quesion', name: 'Dashboard', element: Question },
  { path: '/exam/category', name: 'Dashboard', element: ExamCategory },
  { path: '/article/category', name: 'Dashboard', element: ArticleCategory },
]

export default routes
