import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  Row,
  Col,
  Input,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,

} from "reactstrap";
import "@styles/react/libs/tables/react-dataTable-component.scss"

import { useContext, useEffect, useState } from 'react'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import StatsCard from "../@core/components/StatsCard";
import DashboardCard from "../@core/components/DashboardCard";
import StatsVertical from '@components/widgets/stats/StatsVertical'
import { Archive, CheckCircle, Copy, DollarSign, Edit, Eye, Plus, Save, XCircle } from "react-feather";
import imageusers from "../assets/images/pages/man.png"
import balls from "../assets/images/pages/game.png"
import deleteds from "../assets/images/pages/deleted.png"
import Chart from 'react-apexcharts'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import toastAlert from "@components/toastAlert";
import { get, post, put } from "../apis/api";


const Home = (props) => {
  const [winning_amount_sum_details, setWinning_amount_sum_details] = useState(0)
  const [commisiion_amount_sum_details, setCommisiion_amount_sum_details] = useState(0)
  const [data, setData] = useState([])
  const [allData, setAllData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [activeUsers, setActiveUsers] = useState(0)
  const [deletedUsers, setDeletedUsers] = useState(0)
  const [totalGames, setTotalGames] = useState(0)
  const [appShareLink, setAppShareLink] = useState('')
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
  const currentYear = new Date().getFullYear();
  const datam = {
    years: [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4, currentYear - 5]
  }
  const options = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      type: 'line',
      dropShadow: {
        enabled: true,
        top: 18,
        left: 2,
        blur: 5,
        opacity: 0.2
      },
      offsetX: -10
    },
    stroke: {
      curve: 'smooth',
      width: 4
    },
    grid: {
      borderColor: '#ebe9f1',
      padding: {
        top: -20,
        bottom: 5,
        left: 20
      }
    },
    legend: {
      show: false
    },
    colors: ['#FFE064'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        inverseColors: false,
        gradientToColors: [props.primary],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 5
      }
    },
    xaxis: {
      labels: {
        offsetY: 5,
        style: {
          colors: '#b9b9c3',
          fontSize: '0.857rem',
          fontFamily: 'Montserrat'
        }
      },
      axisTicks: {
        show: false
      },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false
      },
      tickPlacement: 'on'
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: '#b9b9c3',
          fontSize: '0.857rem',
          fontFamily: 'Montserrat'
        },
        formatter(val) {
          return val > 999 ? `${(val / 1000).toFixed(1)}k` : val
        }
      }
    },
    tooltip: {
      x: { show: false }
    }
  },
    series = [
      {
        name: 'App Users',
        data: getAppUsersData
      }
    ]

  const options1 = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      type: 'line',
      dropShadow: {
        enabled: true,
        top: 18,
        left: 2,
        blur: 5,
        opacity: 0.2
      },
      offsetX: -10
    },
    stroke: {
      curve: 'smooth',
      width: 4
    },
    grid: {
      borderColor: '#ebe9f1',
      padding: {
        top: -20,
        bottom: 5,
        left: 20
      }
    },
    legend: {
      show: false
    },
    colors: ['#FFE064'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        inverseColors: false,
        gradientToColors: [props.primary],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 5
      }
    },
    xaxis: {
      labels: {
        offsetY: 5,
        style: {
          colors: '#b9b9c3',
          fontSize: '0.857rem',
          fontFamily: 'Montserrat'
        }
      },
      axisTicks: {
        show: false
      },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false
      },
      tickPlacement: 'on'
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: '#b9b9c3',
          fontSize: '0.857rem',
          fontFamily: 'Montserrat'
        },
        formatter(val) {
          return val > 999 ? `${(val / 1000).toFixed(1)}k` : val
        }
      }
    },
    tooltip: {
      x: { show: false }
    }
  },
    series1 = [
      {
        name: 'Game Users',
        data: getGameUsersData
      }
    ]
  // Table 
  // ** Table data to render
  const dataToRender = () => {
    return data
  }

  const serverSideColumns = [
    {
      sortable: true,
      name: 'GAME ID',
      minWidth: '225px',
      selector: row => row.user_id,
      cell: row => (
        <>
          <span style={{ color: '#F5BC01' }}>#{row.user_id}</span>
        </>
      )
    },
    {
      sortable: true,
      name: 'EMAIL',
      minWidth: '250px',
      selector: row => row.email
    },
    {
      sortable: true,
      name: 'PLAYED GAMES',
      minWidth: '250px',
      selector: row => row.played_games
    }, {
      sortable: true,
      name: 'WIN GAMES',
      minWidth: '150px',
      selector: row => row.win_games
    },
    {
      sortable: true,
      name: 'ACCOUNT STATUS',
      minWidth: '250px',
      selector: row => row.account_status,
      cell: row => (
        <>
          {row.account_status === 'active' ?
            <Badge color='success'>
              Active
            </Badge> :
            null}
          {row.account_status === 'inactive' ?
            <Badge color='danger'>
              Block
            </Badge> :
            null}

        </>
      )
    },

    {
      sortable: false,
      name: 'ACTION',
      minWidth: '150px',
      // selector: row => row.start_date
      cell: row => (
        <>
          <div >
            {
              row.account_status === 'active' ?
                <>
                  <XCircle id="block"
                    onClick={() => {
                      setLoadingGameId(row.user_id);
                      setChangeStatus('inactive')
                      setConfirmationModal(true)
                    }}
                    size={20} color="#ea5455" style={{ marginLeft: '20px', cursor: 'pointer' }} />
                  <UncontrolledTooltip placement='top' target={`block`}>
                    Block
                  </UncontrolledTooltip>
                </> :
                <>
                  <CheckCircle id="active" onClick={() => {
                    setLoadingGameId(row.user_id);
                    setChangeStatus('active')
                    setConfirmationModal(true)
                  }}
                    size={20} color="#28C76F" style={{ marginLeft: '20px', cursor: 'pointer' }} />
                 <UncontrolledTooltip placement='top' target={`active`}>
                    Active
                  </UncontrolledTooltip></>
            }
          </div>




        </>)
    },

  ]
  const handleFilter = e => {
    setSearchValue(e.target.value)
  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }

  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value))
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
  const getAllDashboard = async () => {
    const apiData1 = await get('feedback/get_dashboard_counts'); // Specify the endpoint you want to call
    console.log("apiData1")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
      setLoaderRefresh(false)
    } else {
      setActiveUsers(apiData1.total_active_users)
      setDeletedUsers(apiData1.deleted_users)
      setTotalGames(apiData1.total_games)
    setLoaderRefresh(false)

    }
  }
  const getShareAppLink = async () => {
    const apiData1 = await get('feedback/get_app_share_link'); // Specify the endpoint you want to call
    console.log("Share Link")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
    } else {
      setAppShareLink(apiData1?.result?.url)
    }
  }
  const get_completed_games_commision_winning_amount_sum = async () => {
    const apiData = await get(`feedback/get_completed_games_commision_winning_amount_sum`); // Specify the endpoint you want to call
    console.log("get_completed_games_commision_winning_amount_sum")
    console.log(apiData)

    if (apiData.error === true || apiData.error === true) {
      console.log("errorin fetching data")
    }
    else {
      console.log("data")
      console.log(apiData.data.winning_amount_sum)
      setWinning_amount_sum_details(apiData.data.winning_amount_sum)
      setCommisiion_amount_sum_details(apiData.data.commission_sum)

    }
  }
  const getAppUsers = async (year) => {
    // get current year fron new Date()

    const apiData1 = await get(`user/get_users_by_year?year=${year}`); // Specify the endpoint you want to call
    console.log("App Users")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
    } else {
      // setAllData(apiData1?.result)
      setYearApp(year)
      const counts = Object.values(apiData1.data).map(value => parseInt(value));
      // const counts = Object.values(parseInt(apiData1)).map(Number); // Convert values to numbers
      console.log("counts")
      console.log(counts)
      setGetAppUsersData(counts);
    }
  }
  const getGameUsers = async (year) => {
    const apiData1 = await get(`game/get_games_by_year?year=${year}`); // Specify the endpoint you want to call
    console.log("Game Users")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
    } else {
      setYearGame(year)
      const counts = Object.values(apiData1.data).map(value => parseInt(value));
      setGetGameUsersData(counts);
      // setAllData(apiData1?.result)
    }
  }

  const getUsersRecent = async () => {

    const apiData1 = await get(`user/get_top_5_recent_registered_users`); // Specify the endpoint you want to call
    console.log("Recent Users")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
    } else {
      setAllData(apiData1?.data)
      let DataGet = apiData1.data
      // const filteredData = DataGet.filter(item =>
      //   item?.user_id?.toLowerCase().includes(searchValue.toLowerCase())
      // )
      const filteredData = DataGet.filter(item =>
        String(item?.email).toLowerCase().includes(searchValue.toLowerCase())
      )
      const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      setData(paginatedData)
    }
  }
  const [loaderRefresh, setLoaderRefresh] = useState(true)
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
    get_completed_games_commision_winning_amount_sum();
    const currentYear = new Date().getFullYear();
    getAppUsers(currentYear);
    getGameUsers(currentYear);

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
  }, [currentPage, rowsPerPage, searchValue])

  return (
    <div>
{loaderRefresh? <Spinner color='primary' size='sm' /> : null}
      <Row className='match-height'>
        <Col lg='2' md='2' xs='12'>
          <StatsVertical icon={<img src={imageusers} />} color='info' stats={activeUsers} statTitle='All Users' />
        </Col>
        <Col lg='2' md='2' xs='12'>
          <StatsVertical icon={<img src={balls} />} color='info' stats={totalGames} statTitle='All Games' />
        </Col>
        <Col lg='2' md='2' xs='12'>
          <StatsVertical icon={<img src={deleteds} />} color='info' stats={deletedUsers} statTitle='Deleted Users' />
        </Col>
        {/* payment earning  */}
        <Col lg='3' md='3' xs='12'>
        <StatsVertical icon={<DollarSign />} color='info' stats={winning_amount_sum_details} statTitle='Platform Earning' />
        </Col>
        <Col lg='3' md='3' xs='12'>
        <StatsVertical icon={<DollarSign />} color='info' stats={commisiion_amount_sum_details} statTitle='Admin Earning' />
        </Col>
        {/* <Col lg='6' md='6' xs='12'>
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <CardTitle tag='h4'>App's Share Link</CardTitle>
              <Copy size={20} onClick={() => {
                toastAlert("success", "Link Copied")
                navigator.clipboard.writeText(appShareLink)
              }} />
            </CardHeader>

            <CardBody>
              <Row>
                <Col lg='11' md='11' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={appShareLink}
                    onChange={
                      (e) => {
                        setAppShareLink(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditing}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderData ? <Spinner color='primary' size='sm' /> : null}
                  {isEditing ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderData(true)
                      const postData = {
                        "url": appShareLink
                      }
                      const apiData1 = await post('feedback/create_app_share_link', postData); // Specify the endpoint you want to call
                      console.log("apiData1")

                      console.log(apiData1)
                      if (apiData1.error === true || apiData1.error === true) {
                        setLoaderData(false)
                        toastAlert('error', apiData1.message)

                      } else {
                        setLoaderData(false)
                        toastAlert('success', apiData1.message)

                      }
                      setIsEditing(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditing(true)} />
                  }
                </Col>
              </Row>


            </CardBody>
          </Card>
        </Col> */}
        <Col lg='6' md='6' xs='12'>
          <Card>
            <CardHeader className="d-flex justify-content-between" >
              <CardTitle tag='h4'>App's Overview</CardTitle>
              <UncontrolledButtonDropdown>
                <DropdownToggle className='budget-dropdown' outline color='primary' size='sm' caret>
                  {YearApp}
                </DropdownToggle>
                <DropdownMenu>
                  {datam.years.map(item => (
                    <DropdownItem className='w-100' key={item} onClick={() => getAppUsers(item)}>
                      {item}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </CardHeader>
            <CardBody>
              <Chart options={options} series={series} type='line' height={240} />

            </CardBody>
          </Card>
        </Col>
        <Col lg='6' md='6' xs='12'>
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <CardTitle tag='h4'>Game's Overview</CardTitle>
              <UncontrolledButtonDropdown>
                <DropdownToggle className='budget-dropdown' outline color='primary' size='sm' caret>
                  {YearGame}
                </DropdownToggle>
                <DropdownMenu>
                  {datam.years.map(item => (
                    <DropdownItem className='w-100' key={item} onClick={() => getGameUsers(item)}>
                      {item}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </CardHeader>
            <CardBody>
              <Chart options={options1} series={series1} type='line' height={240} />

            </CardBody>
          </Card>
        </Col>
        <Col lg='12' md='12' xs='12'>
          {data?.length === 0 ? <>
            <Card>
              <CardBody >
                <Row>
                  <Col lg="4" md="6" sm="12">

                    <h3>
                      Recent Users
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
                  <CardTitle tag='h4'>Recent Users</CardTitle>
                  <Button
                    onClick={() => {
                      window.location.href = '/users'
                    }}
                    style={{
                      border: '6px solid #F5BC01',
                      // linerar gradient 
                      background: 'linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)'
                    }} color="primary" >
                    <span style={{ color: '#060502' }} className='align-middle'> See All</span>
                  </Button>
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

export default Home;
