import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { store } from 'src/stores/store'
import { setIsLogin } from 'src/stores/global'
import { useDispatch, useSelector } from 'react-redux'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.global);
  const logout = () => {
    localStorage.clear()
    console.log(isLogin);
    dispatch(setIsLogin(false))
    Object.keys(store.getState()).forEach((reducerKey) => {
      console.log(reducerKey);
      store.dispatch({ type: `${reducerKey}/reset` })
    })
    // navigate('/login');
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
      <CIcon icon={cilUser}  />,
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/* <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>

        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider /> */}
        <CDropdownItem onClick={() => {
          logout()
        }}>
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
