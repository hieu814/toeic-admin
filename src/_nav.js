import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilPuzzle,
  cilBook,
  cilBookmark,
  cilSpeedometer,

} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  {
    component: CNavItem,
    name: 'Users',
    to: '/user',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Exam',
    to: '/exam',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Exam',
        to: '/exam',
      },
      {
        component: CNavItem,
        name: 'Category',
        to: '/exam/category',
      },
      {
        component: CNavItem,
        name: 'Question',
        to: '/exam/quesions',
      },

    ],
  },
  {
    component: CNavGroup,
    name: 'Lession',
    to: '/lession',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lession',
        to: '/lession',
      },
      {
        component: CNavItem,
        name: 'Category',
        to: '/lession/category',
      },

    ],
  },
  {
    component: CNavGroup,
    name: 'Word',
    to: '/word',
    icon: <CIcon icon={cilBookmark} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Word',
        to: '/word',
      },
      {
        component: CNavItem,
        name: 'Topic',
        to: '/word/topic',
      },
      {
        component: CNavItem,
        name: 'Category',
        to: '/word/category',
      },

    ],
  },
]

export default _nav
