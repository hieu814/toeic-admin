import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { useForgotPasswordMutation } from 'src/api/auth'
import { message } from 'antd'


const Register = () => {
  const [forgotPassword] = useForgotPasswordMutation()
  function forgot(e) {
    e.preventDefault()
    console.log(e.target.email.value);
    forgotPassword(e.target.email.value).unwrap()
      .then((respond) => {
        console.log(respond);
        message.success(respond.message)
      })
      .catch((err) => {
        message.error(err.message)

      });
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm id='form-id' onSubmit={forgot}>
                  <h1>Forgot password</h1>
                  <p className="text-medium-emphasis">Send vertify email</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput type='email' placeholder="Email" autoComplete="email" name='email' />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton key="update" htmlType='submit' type="primary" form="form-id" color="success">Send vertify</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
