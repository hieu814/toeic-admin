import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser, setIsLogin } from 'src/stores/global';
import { useState } from 'react';
import { useLoginMutation } from 'src/api/auth';
import { getErrorMessage } from 'src/common/Funtion'
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isLogin, user } = useSelector((state) => state.global);
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = (e) => {
    setError('')
    e.preventDefault();

    login({ username, password })
      .unwrap()
      .then((respond) => {
        dispatch(setCurrentUser(respond.data))
        dispatch(setIsLogin(true))
        navigate('/dashboard');

      })
      .catch((err) => {
        setError(getErrorMessage(err))
        dispatch(setCurrentUser(null))
        dispatch(setIsLogin(false))
      });
    // dispatch(setIsLogin(false))
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      {/* <b>{`${isLogin} ${error}`}</b> */}
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    {error && <p className="text-danger">{error}</p>}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" disabled={isLoading} type="submit">
                          {isLoading ? 'Logging in...' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/forgot-password">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </Link>

                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login
