import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useSelector } from "react-redux";
import {  Navigate } from 'react-router-dom'
const DefaultLayout = () => {
  const { isLogin } = useSelector((state) => state.global);
  return !isLogin  ? (
    <Navigate to="/login" />
  ): (
    <div>
      
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
