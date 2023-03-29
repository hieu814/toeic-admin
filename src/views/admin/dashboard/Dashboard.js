import React, { useEffect, useState } from 'react'

import {
  CAvatar,

  CCard,
  CCardBody,

  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,

  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,

  cilPeople,

} from '@coreui/icons'


import WidgetsDropdown from '../../widgets/WidgetsDropdown'
import { useGetExamCountMutation } from 'src/api/exam'
import { useGetUserCountMutation } from 'src/api/user'
import { useGetWordCountMutation } from 'src/api/word'
import { useGetArticleCountMutation } from 'src/api/article'

const Dashboard = () => {

  const [exam, setExam] = useState(1)
  const [user, setUser] = useState(1)
  const [word, setWord] = useState(1)
  const [article, setArticle] = useState(1)
  const [countExam] = useGetExamCountMutation()
  const [countUser] = useGetUserCountMutation()
  const [countWord] = useGetWordCountMutation()
  const [countArticle] = useGetArticleCountMutation()
  function loadData() {
    console.log("loadData");
    countExam().unwrap()
      .then((respond) => {
        setExam(respond.data.count)
      })
      .catch((err) => {
        console.log(err);

      });

    countUser()
      .unwrap()
      .then((respond) => {
        setUser(respond.data.count)
      })
      .catch((err) => {
        console.log(err);

      });
    countWord()
      .unwrap()
      .then((respond) => {
        setWord(respond.data.count)
      })
      .catch((err) => {
        console.log(err);

      });
    countArticle()
      .unwrap()
      .then((respond) => {
        setArticle(respond.data.count)
      })
      .catch((err) => {
        console.log(err);

      });
  }
  useEffect(() => {
    loadData()
  }, []);
  const tableExample = [
    // {
    //   avatar: { src: avatar1, status: 'success' },
    //   user: {
    //     name: 'Yiorgos Avraamu',
    //     new: true,
    //     registered: 'Jan 1, 2021',
    //   },
    //   country: { name: 'USA', flag: cifUs },
    //   usage: {
    //     value: 50,
    //     period: 'Jun 11, 2021 - Jul 10, 2021',
    //     color: 'success',
    //   },
    //   payment: { name: 'Mastercard', icon: cibCcMastercard },
    //   activity: '10 sec ago',
    // }
  ]

  return (
    <>
      <WidgetsDropdown
        examCount={exam}
        wordCount={word}
        articleCoun={article}
        userCount={user}

      />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Country</CTableHeaderCell>
                    <CTableHeaderCell>Usage</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Payment Method</CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{item.usage.value}%</strong>
                          </div>
                          <div className="float-end">
                            <small className="text-medium-emphasis">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">Last login</div>
                        <strong>{item.activity}</strong>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
