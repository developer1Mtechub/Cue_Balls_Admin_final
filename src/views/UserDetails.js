import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,

} from "reactstrap";
import "@styles/react/libs/tables/react-dataTable-component.scss"

import {  useEffect, useState } from 'react'

import StatsVertical from '@components/widgets/stats/StatsVertical'
import { Archive, ArrowLeft, Check, CheckCircle, Copy, DollarSign, Edit, Eye, Play, Plus, Save, XCircle } from "react-feather";
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import toastAlert from "@components/toastAlert";
import { get, put } from "../apis/api";
import { useLocation } from "react-router-dom";
import { formatDate } from "../utility/Utils";


const UserDetails = (props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('user_id');

  const [user_name, setUserName] = useState('')
  const [user_email, setUserEmail] = useState('')

  const [data, setData] = useState([])
  const [allData, setAllData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')

  const [currentPage1, setCurrentPage1] = useState(1)
  const [rowsPerPage1, setRowsPerPage1] = useState(10)
  const [searchValue1, setSearchValue1] = useState('')

  const [activeUsers, setActiveUsers] = useState(0)
  const [deletedUsers, setDeletedUsers] = useState(0)
  const [totalGames, setTotalGames] = useState(0)
  const [appShareLink, setAppShareLink] = useState([])
  const [loaderData, setLoaderData] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [getAppUsersData, setGetAppUsersData] = useState([])
  const [getGameUsersData, setGetGameUsersData] = useState([])
  const [YearApp, setYearApp] = useState(new Date().getFullYear())
  const [YearGame, setYearGame] = useState(new Date().getFullYear())
  const [loadingGameId, setLoadingGameId] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [changeStatus, setChangeStatus] = useState('')
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [loadingState, setLoadingState] = useState(true)
  const ChangeRunningGameStatus = async () => {
    setLoadingCreate(true)
    const postData = {
      user_id: loadingGameId,
      account_status: changeStatus
    };
    const apiData = await put("user/update_user_account_status", postData); // Specify the endpoint you want to call
    console.log("apixxsData")

    console.log(apiData)
    if (apiData.error) {
      // if (apiData.errormsg === "NotVerifiedAccount") {
      //   console.log("NotVerifiedAccount")
      //   setEmailData(values.email)
      //   setModal(true)
      // } else if (apiData.errormsg === "invalid") {
      //   console.log("invalid")
      //   setSubmitting(false);
      toastAlert("error", apiData.message)
      // }
      setLoadingCreate(false);

      // toastAlert("error", "No Images Selected")
    } else {
      getUsersRecent()
      setLoadingCreate(false);
      setConfirmationModal(false)
      // window.location.href = '/verifyEmail'

      toastAlert("success", " Status Changed Successfully ")
    }
  }
  // const datam = {
  //   years: [2020, 2019, 2018, 2017, 2016, 2015]
  // }

  // Table 
  // ** Table data to render
  const dataToRender = () => {
    return data
  }
  const dataToRender1 = () => {
    return getAppUsersData
  }

  const serverSideColumns = [
    {
      sortable: true,
      name: 'GAME ID',
      minWidth: '20px',
      selector: row => row.game_id,
      cell: row => (
        <>
          <span style={{ color: '#F5BC01' }}>#{row.game_id}</span>
        </>
      )
    },
    {
      sortable: true,
      name: 'ENTRY FEE',
      minWidth: '20px',
      selector: row => row.entry_fee
    },
    {
      sortable: true,
      name: 'USER BALL',
      minWidth: '100px',
      selector: row => row.user_selections,
      cell: row => (
        <>
          {row.user_selections.map((selection, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={selection.user_selected_ball_image_url}
                alt={`Ball ${selection.user_selected_winning_ball}`}
                style={{ width: '30px', height: '30px', marginRight: '8px' }}
              />
              {/* <span>{selection.user_selected_winning_ball}</span> */}
            </div>
          ))}
        </>
      )
    
    }, {
      sortable: true,
      name: 'WINNING AMOUNT',
      minWidth: '200px',
      selector: row => row.winning_amount,
      cell: row => (
        <>
          <span style={{ color: '#F5BC01' }}>${row.winning_amount}</span>
        </>
      )
    }, {
      sortable: true,
      name: ' STATUS',
      minWidth: '20px',
      selector: row => row.game_status
    },


  ]
  const serverSideColumns1 = [
    {
      sortable: true,
      name: 'TRANSACTION ID',
      minWidth: '100px',
      selector: row => row.transaction_history_id,
      cell: row => (
        <>
          <span style={{ color: '#F5BC01' }}>#{row.transaction_history_id}</span>
        </>
      )
    },
    {
      sortable: true,
      name: 'AMOUNT',
      minWidth: '20px',
      selector: row => row.amount
    },
    {
      sortable: true,
      name: 'TYPE',
      minWidth: '20px',
      selector: row => row.type
    },
    {
      sortable: true,
      name: 'DATE',
      minWidth: '100px',
      selector: row => row.created_at,
      cell: row => (
        <>
          <span style={{ color: '#F5BC01' }}>{formatDate(row.created_at)}</span>
        </>
      )
    }


  ]


  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }
  const handlePagination1 = page => {
    setCurrentPage1(page.selected + 1)
  }



  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(allData.length / rowsPerPage)

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={Math.ceil(count) || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName='page-item'
        breakClassName='page-item'
        nextLinkClassName='page-link'
        pageLinkClassName='page-link'
        breakLinkClassName='page-link'
        previousLinkClassName='page-link'
        nextClassName='page-item next-item'
        previousClassName='page-item prev-item'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        }
      />
    )
  }
  const CustomPagination1 = () => {
    const count = Math.ceil(appShareLink.length / rowsPerPage1)

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={Math.ceil(count) || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage1 !== 0 ? currentPage1 - 1 : 0}
        onPageChange={page => handlePagination1(page)}
        pageClassName='page-item'
        breakClassName='page-item'
        nextLinkClassName='page-link'
        pageLinkClassName='page-link'
        breakLinkClassName='page-link'
        previousLinkClassName='page-link'
        nextClassName='page-item next-item'
        previousClassName='page-item prev-item'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        }
      />
    )
  }
  const setActiveUsersFormat = (value) => {
    if (typeof value === 'number' && !isNaN(value)) {
        return value.toFixed(2); // Rounds to 2 decimal places
    } else {
        // Handle non-numeric values or null/undefined
        return 0; // Or any appropriate default value or error handling
    }
};
  const getAllDashboard = async () => {
    const apiData1 = await get(`user/get_specific_user_by_id?user_id=${userId}`); // Specify the endpoint you want to call
    console.log("count data")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)


    } else {
      const walletValue = parseFloat(apiData1?.wallet); // Parse wallet value to ensure it's a number
      const formattedValue = setActiveUsersFormat(walletValue);
      setActiveUsers(formattedValue)
      setDeletedUsers(apiData1?.data[0]?.win_games)
      setTotalGames(apiData1?.data[0]?.played_games)
      setUserName(apiData1?.data[0]?.user_name)
      setUserEmail(apiData1?.data[0]?.email)
    }
  }
  const getShareAppLink = async () => {
    const apiData1 = await get(`transaction_history/get_transactions_by_user_id?user_id=${userId}`); // Specify the endpoint you want to call
    console.log("Share Link")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
    } else {
      setAppShareLink(apiData1?.data)
      let DataGet = apiData1.data
      if (DataGet) {
        const filteredData = DataGet.filter(item =>
          item.transaction_history_id.toString().includes(searchValue1.toLowerCase())
        )
        const paginatedData = filteredData.slice((currentPage1 - 1) * rowsPerPage1, currentPage1 * rowsPerPage1)
        setGetAppUsersData(paginatedData)
      } else {
        console.log('apiData or  is undefined');
      }
    }
  }


  const getUsersRecent = async () => {

    const apiData1 = await get(`game/get_game_details_by_user_id?user_id=${userId}`); // Specify the endpoint you want to call
    console.log("Recent Users")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
      setLoadingState(false)
    } else {
      setAllData(apiData1?.data)
      let DataGet = apiData1.data
      // const filteredData = DataGet.filter(item =>
      //   item?.user_id?.toLowerCase().includes(searchValue.toLowerCase())
      // )
      const filteredData = DataGet.filter(item =>
        String(item?.game_id).toLowerCase().includes(searchValue.toLowerCase())
      )
      const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      setData(paginatedData)
      setLoadingState(false)
    }
  }
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("@AdminCB"));
    if (items === '' || items === undefined || items === null) {
      window.location.href = '/login'
    } else {
      // window.location.href = '/home'

    }
    getAllDashboard();
    getShareAppLink();
    getUsersRecent();



    // const filteredData = allData.filter(item =>
    //   item.game_id.toLowerCase().includes(searchValue.toLowerCase())
    // )
    // const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    // setData(paginatedData)
    const filteredData = allData.filter(item =>
      item.email.toLowerCase().includes(searchValue.toLowerCase())
    )
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    setData(paginatedData)


  }, [currentPage, rowsPerPage, searchValue, currentPage1, rowsPerPage1, searchValue1])

  return (
    <div>
      {loadingState ? <Spinner color='primary' /> : null}
      <Row className='match-height'>
        <Col lg='6' md='6' xs='12'>
          <Card>
            <CardHeader style={{display:'flex'}}>
              <ArrowLeft style={{cursor:'pointer'}} onClick={() => window.location.href = '/users'
              } size={20} />
              <h4>User Details</h4>


            </CardHeader>

            <CardBody>
              <Row>
                <Col lg='12' md='12' xs='12' style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>User Id</h4>
                  <h3 >
                    # {userId}
                  </h3>
                </Col>
                <Col lg='12' md='12' xs='12' style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>User Name</h4>
                  <h3 >
                    {user_name}
                  </h3>
                </Col>
                <Col lg='12' md='12' xs='12' style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>Email</h4>
                  <h3 >
                    {user_email}
                  </h3>
                </Col>
              </Row>


            </CardBody>
          </Card>
        </Col>
        <Col lg='2' md='2' xs='12'>
          <StatsVertical icon={<DollarSign />} color='info' stats={activeUsers
          } statTitle='Wallet' />
        </Col>
        <Col lg='2' md='2' xs='12'>
          <StatsVertical icon={<Play />} color='info' stats={totalGames} statTitle='Played Games' />
        </Col>
        <Col lg='2' md='2' xs='12'>
          <StatsVertical icon={<Check />} color='info' stats={deletedUsers} statTitle='Win Games' />
        </Col>

        <Col lg='6' md='6' xs='12'>
          {data?.length === 0 ? <>
            <Card>
              <CardBody >
                <Row>
                  <Col lg="4" md="6" sm="12">

                    <h3>
                      Game History
                    </h3>
                  </Col>
                </Row>
                <div className="d-flex justify-content-center align-items-center" >
                  <Archive size={30} color="#F5BC01" />

                  <h3 style={{ marginLeft: '10px' }}>
                    No Data
                  </h3>
                </div>


              </CardBody>
            </Card>
          </> :
            <>
              <Card>
                <CardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <CardTitle tag='h4'> User Game History</CardTitle>
                  {/* <Button
                    onClick={() => {
                      window.location.href = '/users'
                    }}
                    style={{
                      border: '6px solid #F5BC01',
                      // linerar gradient 
                      background: 'linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)'
                    }} color="primary" >
                    <span style={{ color: '#060502' }} className='align-middle'> See All</span>
                  </Button> */}
                </CardHeader>
                <CardBody>
                  <div className='react-dataTable'>
                    <DataTable
                      noHeader
                      pagination
                      paginationServer
                      className='react-dataTable'
                      columns={serverSideColumns}
                      sortIcon={<ChevronDown size={10} />}
                      paginationComponent={CustomPagination}
                      data={dataToRender()}
                    />
                  </div>

                </CardBody>
              </Card>
            </>}

        </Col>
        <Col lg='6' md='6' xs='12'>
          {appShareLink?.length === 0 ? <>
            <Card>
              <CardBody >
                <Row>
                  <Col lg="4" md="6" sm="12">

                    <h3>
                      Transaction History
                    </h3>
                  </Col>
                </Row>
                <div className="d-flex justify-content-center align-items-center" >
                  <Archive size={30} color="#F5BC01" />

                  <h3 style={{ marginLeft: '10px' }}>
                    No Data
                  </h3>
                </div>


              </CardBody>
            </Card>
          </> :
            <>
              <Card>
                <CardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <CardTitle tag='h4'> Transaction History</CardTitle>
                  {/* <Button
                    onClick={() => {
                      window.location.href = '/users'
                    }}
                    style={{
                      border: '6px solid #F5BC01',
                      // linerar gradient 
                      background: 'linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)'
                    }} color="primary" >
                    <span style={{ color: '#060502' }} className='align-middle'> See All</span>
                  </Button> */}
                </CardHeader>
                <CardBody>
                  <div className='react-dataTable'>
                    <DataTable
                      noHeader
                      pagination
                      paginationServer
                      className='react-dataTable'
                      columns={serverSideColumns1}
                      sortIcon={<ChevronDown size={10} />}
                      paginationComponent={CustomPagination1}
                      data={dataToRender1()}
                    />
                  </div>

                </CardBody>
              </Card>
            </>}

        </Col>

      </Row>
      {/* Change Status Modal  */}

      <Modal isOpen={confirmationModal} toggle={() => setConfirmationModal(!confirmationModal)} centered>
        <ModalHeader toggle={() => setConfirmationModal(!confirmationModal)}>Confirmation Alert</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to Chnage Status to {changeStatus}?</p>
        </ModalBody>
        <ModalFooter>
          <Button disabled={loadingCreate} color='primary'
            onClick={ChangeRunningGameStatus}
          >
            {loadingCreate ? <Spinner color='light' size='sm' /> : null}
            <span className='align-middle ms-25'>Yes</span>
          </Button>
          {/* <Button color='primary' onClick={() => {
            // deletePosition(deleteIndex)
            setItemDeleteConfirmation(!itemDeleteConfirmation)
          }}>
            Yes
          </Button> */}
          <Button color='secondary' onClick={() => setConfirmationModal(!confirmationModal)} outline>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

    </div>
  );
};

export default UserDetails;
