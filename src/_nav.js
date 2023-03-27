import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Theme',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/user',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
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
    name: 'Article',
    to: '/article',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Article',
        to: '/article',
      },
      {
        component: CNavItem,
        name: 'Category',
        to: '/article/category',
      },

    ],
  },
  {
    component: CNavGroup,
    name: 'Word',
    to: '/word',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Word',
        to: '/word',
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
