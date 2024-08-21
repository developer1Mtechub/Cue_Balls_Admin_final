import { Archive, CheckCircle, Eye, XCircle } from "react-feather";
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  Button,
  Label,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";
import "@styles/react/libs/tables/react-dataTable-component.scss"
import exporticon from '@src/assets/images/pages/exporticon.png'

import { useEffect, useRef, useState } from "react";
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import { get, put } from "../apis/api";
import toastAlert from "@components/toastAlert";
import * as XLSX from 'xlsx';
const Feedbacks = () => {
  // ** States
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [searchValue, setSearchValue] = useState('')
  const [data, setData] = useState([])
  const [allData, setAllData] = useState([])
  const [loadingCreate, setLoadingCreate] = useState(false)

  const [confirmationModal, setConfirmationModal] = useState(false)
  const [changeStatus, setChangeStatus] = useState('')
  const [viewGameModal, setViewGameModal] = useState(false)
  const getAllUsers = async () => {

    const apiData1 = await get('contact_us/get_all_contact_us'); // Specify the endpoint you want to call
    console.log("apiData1")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      console.log("errorin fetching data")
      // setAllData([])
      toastAlert("error", apiData1.message)
      setEmptyData(true)
    } else {
      console.log("data")
      setAllData(apiData1.data)
      // setAllData([])
      setEmptyData(false)
      let DataGet = apiData1.data
      const filteredData = DataGet.filter(item =>
        item.email.toLowerCase().includes(searchValue.toLowerCase())
      )
      const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      setData(paginatedData)

    }
  }



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
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const getGameDetails = async (game_id) => {
    // setLoadingGameId(null)
    const apiData = await get(`contact_us/get_single_contact_us/${game_id}`); // Specify the endpoint you want to call
    console.log("apixxsData")

    console.log(apiData)
    if (apiData.error === true || apiData.error === true) {
      // if (apiData.errormsg === "NotVerifiedAccount") {
      //   console.log("NotVerifiedAccount")
      //   setEmailData(values.email)
      //   setModal(true)
      // } else if (apiData.errormsg === "invalid") {
      //   console.log("invalid")
      //   setSubmitting(false);
      //   toastAlert("error", apiData.message)
      // }
      // setLoadingCreate(false);

      toastAlert("error", "Something went wrong")
      setLoadingGameId(null)
    } else {
      console.log("get view data ")
      // console.log(apiData.data)
      setFirstName(apiData.data.first_name)
      setLastName(apiData.data.last_name)
      setEmail(apiData.data.email)
      setMessage(apiData.data.message)
      // setGameDetails(apiData.data)
      setViewGameModal(true)
      // window.location.href = '/verifyEmail'
      setLoadingGameId(null)

      // toastAlert("success", "You can Edit document ")
    }
  }
  // ** Table data to render
  const dataToRender = () => {
    return data
  }

  const serverSideColumns = [
    {
      sortable: true,
      name: 'EMAIL ADDRESS',
      minWidth: '225px',
      selector: row => row.email,

    },
    {
      sortable: true,
      name: 'MESSAGE',
      minWidth: '450px',
      selector: row => row.message
    },
    {
      sortable: false,
      name: 'ACTION',
      minWidth: '150px',
      // selector: row => row.start_date
      cell: row => (
        <>
          <div >
            {loadingGameId === row.message_id ? <Spinner color='primary' size='sm' /> :
            <>
            <Eye id="active"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  // Set the loading game_id when starting the load
                  setLoadingGameId(row.message_id);
                  getGameDetails(row.message_id)
                  // setViewGameModal(true)
                }}
                size={20}
                color="#F5BC01" />
                <UncontrolledTooltip placement='top' target={`active`}>
                    View
                  </UncontrolledTooltip>
           </>   }

          </div>




        </>)
    },

  ]
  // socket 



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
      getAllUsers()
      setLoadingCreate(false);
      setConfirmationModal(false)
      // window.location.href = '/verifyEmail'

      toastAlert("success", " Status Changed Successfully ")
    }
  }

  const [emptyData, setEmptyData] = useState(false)


  const [loadingGameId, setLoadingGameId] = useState(null);

  // Export to excel 
  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'games.xlsx');
  }

  useEffect(() => {
    getAllUsers();

    const filteredData = allData.filter(item =>
      item.email.toLowerCase().includes(searchValue.toLowerCase())
    )
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    setData(paginatedData)
  }, [currentPage, rowsPerPage, searchValue])


  return (

    <div>
      {emptyData ? <>
        <Card>
          <CardBody style={{ backgroundColor: 'white' }}>
            <Row>
              <Col lg="4" md="6" sm="12">

                <h3>
                  Feedback
                </h3>
              </Col>
              <Col lg="12" md="12" sm="12">
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
                   

                  </Col>
            </Row>
            {/* <div className="d-flex justify-content-center align-items-center" >
              <Archive size={30} color="#F5BC01" />

              <h3 style={{ marginLeft: '10px' }}>
                No Data
              </h3>
            </div> */}


          </CardBody>
        </Card>
      </> :
        <> {allData.length === 0 ? <>
          <Spinner color='primary' size='lg' />
        </> :
          <>
            <Card>
              <CardBody>
                <Row>
                  <Col lg="4" md="6" sm="12">

                    <h3>
                      Feedback
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="12">
                    <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
                      <Label className='me-1' for='search-input'>
                        Search
                      </Label>
                      <Input
                        placeholder="By Email"
                        className='dataTable-filter'
                        type='text'
                        bsSize='sm'
                        id='search-input'
                        value={searchValue}
                        onChange={handleFilter}
                      />
                    </Col>

                  </Col>
                  <Col lg="2" md="6" sm="12" className="d-flex justify-content-right mb-2">


                    <Button style={{
                      border: '4px solid #F5BC01',
                      borderRadius: '15px',
                      maxWidth: '122px',
                      display: 'flex',
                      justifyContent: 'center',
                      marginLeft: '10px',
                      alignItems: 'center',
                      // linerar gradient 
                      background: 'linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)'
                    }} color="primary" block
                      onClick={() => exportToExcel(allData)}
                    >
                      <img src={exporticon} alt="Export" />

                      {/* <Share size={20} color="#A4A4A4" /> */}
                      {/* {isSubmitting ? <Spinner  color='#060502' size='sm' /> : null} */}
                      <span style={{ color: '#060502' }} className='align-middle ms-25'> Export</span>
                    </Button>
                  </Col>
                  <Col lg="12" md="12" sm="12">
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
                   

                  </Col>
                  <Col sm='2' style={{ marginTop: '-30px' }}>
                    <div className='d-flex align-items-center'>
                      <Label for='sort-select'>show</Label>
                      <Input
                        className='dataTable-select'
                        type='select'
                        id='sort-select'
                        value={rowsPerPage}
                        onChange={e => handlePerPage(e)}
                      >
                        <option value={7}>7</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                      </Input>
                      <Label for='sort-select'>entries</Label>
                    </div>
                  </Col>

                </Row>
              </CardBody>
            </Card>
          </>}
        </>}


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
      {/* View Game modal  */}
      <Modal isOpen={viewGameModal} toggle={() => setViewGameModal(!viewGameModal)} centered>
        <ModalHeader toggle={() => setViewGameModal(!viewGameModal)}>Feedback</ModalHeader>
        <ModalBody style={{
          display: 'flex'
          , justifyContent: 'center', flexDirection: 'column', alignItems: 'center'
        }}>


          <Row>
            <Col lg="6" md="6" sm="6">
              <h3 style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#FFAB00',
              }}
              >
                First Name
              </h3>


            </Col>
            <Col lg="6" md="6" sm="6">
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#656565',
                }}

              >
                {first_name}

              </h3>
            </Col>
            <Col lg="6" md="6" sm="6">
              <h3 style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#FFAB00',
              }}
              >
                Last Name
              </h3>
            </Col>
            <Col lg="6" md="6" sm="6">
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#656565',
                }}

              >
                {last_name}

              </h3>
            </Col>
            <Col lg="6" md="6" sm="6">
              <h3 style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#FFAB00',
              }}
              >
                Email
              </h3>
            </Col>
            <Col lg="6" md="6" sm="6">
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#656565',
                }}

              >
                {email}

              </h3>
            </Col>
            <Col lg="6" md="6" sm="6">
              <h3 style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#FFAB00',
              }}
              >
                Message
              </h3>
            </Col>
            <Col lg="6" md="6" sm="6">
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#656565',
                }}

              >

                {message}
              </h3>
            </Col>

          </Row>

          {/* <Button 
           onClick={()=>{
            setRestartGameModal(false)
            setAnnounceResultModal(true)

           }}
           style={{
            marginBottom:'50px',
            maxWidth:'200px',
                  marginTop: '50px',
                  border: '6px solid #F5BC01',
                  borderRadius: '15px',
                  // linerar gradient 
                  background: 'linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)'
                }} type="submit" color="primary" block disabled={restartGameLoading}>
                  {restartGameLoading ? <Spinner color='success' size='sm' /> : null}
                  <span style={{ color: '#060502' }} className='align-middle ms-25'> Re-Start Game</span>
                </Button> */}
        </ModalBody>

      </Modal>




    </div>
  );
};

export default Feedbacks;
