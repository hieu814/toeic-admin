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
import { useResetPasswordMutation } from 'src/api/auth'
import { message } from 'antd'
import { useParams } from 'react-router-dom'


const ResetPass = () => {
    const { code } = useParams();
    const [forgotPassword] = useResetPasswordMutation()
    function forgot(e) {
        e.preventDefault()
        forgotPassword({ code, newPassword: e.target.pass.value }).unwrap()
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
                                    <h1>Reset Password</h1>
                                    <p className="text-medium-emphasis">Enter new password</p>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>@</CInputGroupText>
                                        <CFormInput placeholder="New password" name='pass' />
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

export default ResetPass
