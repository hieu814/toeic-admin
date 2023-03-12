import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useSelector } from "react-redux";
import {  Navigate } from 'react-router-dom'
const DefaultLayout = () => {
  const { isLogin } = useSelector((state) => state.global);
  console.log(isLogin);
  return !isLogin  ? (
    <Navigate to="/login" />
  ): (
    <div>
      
      <AppSidebar />
      <h1>{isLogin}</h1>
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
