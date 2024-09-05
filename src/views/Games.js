import {
  Archive,
  DollarSign,
  Eye,
  Plus,
  Search,
  Share,
  Trash2,
} from "react-feather";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  Input,
  InputGroup,
  InputGroupText,
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
  Table,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Nav,
} from "reactstrap";
import exporticon from "@src/assets/images/pages/exporticon.png";
import plusicon from "@src/assets/images/pages/plusicon.png";
import metaPhone from "@src/assets/images/pages/metaphone.png";
import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import { BASE_URL, deleteApi, get, post, put } from "../apis/api";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { io } from "socket.io-client";
import jackpotImage from "@src/assets/images/pages/jackpot.png";
import StatsCard from "../@core/components/StatsCard";
import toastAlert from "@components/toastAlert";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import StatsVertical from "@components/widgets/stats/StatsVertical";

import * as XLSX from "xlsx";
import formatDate from "../apis/dateFormat";
const Games = () => {
  // ** States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchValue, setSearchValue] = useState("");

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [allWinnersArray, setAllWinnersArray] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [total_participants_running_game, setTotal_participants_running_game] =
    useState(0);
  const [entry_fee_running_game, setEntry_fee_running_game] = useState(0);
  const [commission_running_game, setCommission_running_game] = useState(0);
  const [jackpot_running_game, setJackpot_running_game] = useState(0);
  const [game_statusRunning, setGame_statusRunning] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [changeStatus, setChangeStatus] = useState("");
  const [running_game_id, setRunning_Game_id] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [confirmationModalResult, setConfirmationModalResult] = useState(false);
  const [gameIdResult, setGameIdResult] = useState("");
  const [selected_winner_ball, setSelected_winner_ball] = useState("");
  const [selected_winner_ball_url, setSelected_winner_ball_url] = useState("");
  const [restartGameLoading, setRestartGameLoading] = useState(false);
  const [loadingAnounce, setLoadingAnounce] = useState(false);
  const [confirmationModalDelete, setConfirmationModalDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [viewGameModal, setViewGameModal] = useState(false);
  const [gameIdDetails, setGameIdDetails] = useState("");
  const [entryFeeDetails, setEntryFeeDetails] = useState("");
  const [commissionDetails, setCommissionDetails] = useState("");
  const [jackpotDetails, setJackpotDetails] = useState("");

  const [totalParticipantsDetails, setTotalParticipantsDetails] = useState("");
  const [gameStatusDetails, setGameStatusDetails] = useState("");
  const [winnerBallUrlDetails, setWinnerBallUrlDetails] = useState("");
  const [winningAmountSingleDetails, setWinningAmountSingleDetails] =
    useState("");
  const [winnersTotalDetails, setWinnersTotalDetails] = useState("");
  const [playedAtDetails, setPlayedAtDetails] = useState("");
  const [loadingGameId, setLoadingGameId] = useState(null);
  const [isGameAdded, setIsGameAdded] = useState(false);

  const validationSchema = Yup.object().shape({
    entry_fees: Yup.string().required("Entry Fees is required"),
    commission: Yup.string().required("Commission is required"),
  });
  const getAllGames = async () => {
    const apiData1 = await get("game/get_all_games"); // Specify the endpoint you want to call
    console.log("Get all games");

    console.log(apiData1);
    if (apiData1.error === true || apiData1.error === true) {
      console.log("errorin fetching data");
      // setAllData([])
      toastAlert("error", apiData1.message);
      setEmptyData(true);
    } else {
      console.log("data");
      setAllData(apiData1.data);
      // setAllData([])
      setEmptyData(false);
      // setIsGameAdded
      // check if the array contains any of the game whose status is not scheduled then setIsGameAdded true
      // const isGameAdded = apiData1.data.some(game => game.game_status !== 'scheduled');
      // console.log("isGameAdded")
      // console.log(isGameAdded)

      // setIsGameAdded(isGameAdded);
      let DataGet = apiData1.data;
      const filteredData = DataGet.filter((item) =>
        item.game_id.toLowerCase().includes(searchValue.toLowerCase())
      );
      const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
      setData(paginatedData);
    }
  };
  const DeleteCall = async () => {
    setLoadingDelete(true);
    console.log("gameIdResult");
    console.log(gameIdResult);
    if (running_game_id === gameIdResult) {
      console.log("socket");
      socket.current.emit("game-created", {
        status: "deleted",
        message: "Game Deleted Socket Called",
        game_id: running_game_id,
      });
    }

    const postData = {
      game_id: gameIdResult,
    };
    const apiData1 = await deleteApi("game/delete_game", postData); // Specify the endpoint you want to call
    console.log("apiData1");

    console.log(apiData1);
    if (apiData1.error === true || apiData1.error === true) {
      setLoadingDelete(false);
      toastAlert("error", apiData1.message);
      console.log("errorin fetching data");
      setConfirmationModalDelete(false);
    } else {
      setLoadingDelete(false);
      toastAlert("success", apiData1.message);
      setConfirmationModalDelete(false);
      console.log("data");
      getAllGames();
      getCurrentRunningGames();
    }
  };

  const handleFilter = (e) => {
    setSearchValue(e.target.value);
  };

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(allData.length / rowsPerPage);

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={Math.ceil(count) || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName="page-item"
        breakClassName="page-item"
        nextLinkClassName="page-link"
        pageLinkClassName="page-link"
        breakLinkClassName="page-link"
        previousLinkClassName="page-link"
        nextClassName="page-item next-item"
        previousClassName="page-item prev-item"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
        }
      />
    );
  };
  // custom pagination users winners
  // ** Custom Pagination

  // ** Table data to render
  const dataToRender = () => {
    return data;
  };

  const serverSideColumns = [
    {
      sortable: true,
      name: "GAME ID",
      minWidth: "225px",
      selector: (row) => row.game_id,
      cell: (row) => (
        <>
          <span style={{ color: "#F5BC01" }}>#{row.game_id}</span>
        </>
      ),
    },
    {
      sortable: true,
      name: "ENTRY FEES",
      minWidth: "250px",
      selector: (row) => row.entry_fee,
    },
    {
      sortable: true,
      name: "COMMISSION",
      minWidth: "250px",
      selector: (row) => row.commission,
    },
    {
      sortable: true,
      name: "PARTICIPANTS",
      minWidth: "150px",
      selector: (row) => row.total_participants,
    },
    {
      sortable: true,
      name: "WINNERS",
      minWidth: "150px",
      selector: (row) => row.winners,
    },
    {
      sortable: true,
      name: "WINNING AMOUNT",
      minWidth: "200px",
      selector: (row) => row.winning_amount,
      cell: (row) => <>$ {row.winning_amount}</>,
    },
    {
      sortable: true,
      name: "GAME STATUS",
      minWidth: "250px",
      selector: (row) => row.game_status,
      cell: (row) => (
        <>
          {row.game_status === "scheduled" ? (
            <Badge color="danger">Scheduled</Badge>
          ) : null}
          {row.game_status === "waiting" ? (
            <Badge color="primary">Waiting</Badge>
          ) : null}
          {row.game_status === "started" ? (
            <Badge color="info">Started</Badge>
          ) : null}
          {row.game_status === "completed" ? (
            <Badge color="success">Completed</Badge>
          ) : null}
        </>
      ),
    },

    {
      sortable: false,
      name: "ACTION",
      minWidth: "150px",
      // selector: row => row.start_date
      cell: (row) => (
        <>
          <div>
            {loadingGameId === row.game_id ? (
              <Spinner color="primary" size="sm" />
            ) : (
              <>
                <Eye
                  id="view"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (row.game_status === "completed") {
                    } else {
                      setTotalParticipantsDetails(row.total_participants);
                    }

                    // Set the loading game_id when starting the load
                    setLoadingGameId(row.game_id);
                    getGameDetails(row.game_id);
                    // setViewGameModal(true)
                  }}
                  size={20}
                  color="#F5BC01"
                />
                <UncontrolledTooltip placement="top" target={`view`}>
                  View
                </UncontrolledTooltip>
              </>
            )}
            <Trash2
              id="delete"
              onClick={() => {
                setGameIdResult(row.game_id);
                setConfirmationModalDelete(true);
              }}
              size={20}
              color="#ea5455"
              style={{ marginLeft: "20px", cursor: "pointer" }}
            />
            <UncontrolledTooltip placement="top" target={`delete`}>
              Delete
            </UncontrolledTooltip>{" "}
            {row.game_status === "started" ? (
              <>
                <img
                  id="announce"
                  src={metaPhone}
                  alt="anounce Result"
                  onClick={() => {
                    setGameIdResult(row.game_id);
                    setAnnounceResultModal(true);
                  }}
                  style={{ marginLeft: "20px", cursor: "pointer" }}
                />
                <UncontrolledTooltip placement="top" target={`announce`}>
                  Announce
                </UncontrolledTooltip>
              </>
            ) : null}
          </div>
        </>
      ),
    },
  ];

  // socket
  // const ENDPOINT = "http://localhost:3016/"; // replace with your server's address

  const [currentRunningGame, setCurrentRunningGame] = useState([]);
  const getCurrentRunningGames = async () => {
    const apiData1 = await get("game/get_scheduled_games"); // Specify the endpoint you want to call
    console.log("scheduled game ");

    console.log(apiData1);
    if (apiData1.error === true || apiData1.error === true) {
      console.log("errorin fetching data");
      setCurrentRunningGame([]);
      setIsGameAdded(false);
    } else {
      console.log("data");
      // if empty
      setIsGameAdded(true);

      setCurrentRunningGame(apiData1?.data);
      setTotal_participants_running_game(apiData1?.data[0]?.total_participants);
      setEntry_fee_running_game(apiData1?.data[0]?.entry_fee);
      setCommission_running_game(apiData1?.data[0]?.commission);
      setJackpot_running_game(apiData1?.data[0]?.jackpot);
      setGame_statusRunning(apiData1?.data[0]?.game_status);
      setRunning_Game_id(apiData1?.data[0]?.game_id);
      // setAllData(apiData1.data)
      // let DataGet = apiData1.data
      // const filteredData = DataGet.filter(item =>
      //   item.game_id.toLowerCase().includes(searchValue.toLowerCase())
      // )
      // const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      // setData(paginatedData)
    }
  };

  const ChangeRunningGameStatus = async () => {
    setLoadingCreate(true);
    const postData = {
      game_id: running_game_id,
      game_status: changeStatus,
    };
    const apiData = await put("game/change_game_status", postData); // Specify the endpoint you want to call
    console.log("apixxsData");

    console.log(apiData);
    if (apiData.error) {
      // if (apiData.errormsg === "NotVerifiedAccount") {
      //   console.log("NotVerifiedAccount")
      //   setEmailData(values.email)
      //   setModal(true)
      // } else if (apiData.errormsg === "invalid") {
      //   console.log("invalid")
      //   setSubmitting(false);
      toastAlert("error", apiData.message);
      // }
      setLoadingCreate(false);

      // toastAlert("error", "No Images Selected")
    } else {
      getCurrentRunningGames();
      getAllGames();
      getAllBalls();
      setLoadingCreate(false);
      setConfirmationModal(false);
      // window.location.href = '/verifyEmail'
      if (isSocketReady === true || isSocketReady === "true") {
        socket.current.emit("game-created", {
          status: changeStatus,
          message: "Game Status Changed Socket Called",
          game_id: running_game_id,
        });
        toastAlert("success", "Game Status Changed Successfully ");
      } else {
        toastAlert("error", "Could Not Change Game Status !");
      }
    }
  };
  const ChangeRunningGameStatusRestart = async () => {
    setRestartGameLoading(true);
    const postData = {
      game_id: running_game_id,
      game_status: "scheduled",
      restarted: true,
    };
    const apiData = await put("game/change_game_status", postData); // Specify the endpoint you want to call
    console.log("apixxsData");

    console.log(apiData);
    if (apiData.error) {
      // if (apiData.errormsg === "NotVerifiedAccount") {
      //   console.log("NotVerifiedAccount")
      //   setEmailData(values.email)
      //   setModal(true)
      // } else if (apiData.errormsg === "invalid") {
      //   console.log("invalid")
      //   setSubmitting(false);
      toastAlert("error", apiData.message);
      // }
      setRestartGameLoading(false);

      // toastAlert("error", "No Images Selected")
    } else {
      getCurrentRunningGames();
      getAllGames();
      getAllBalls();
      setRestartGameLoading(false);
      setRestartGameModal(false);
      setAnnounceResultModal(false);
      setConfirmationModal(false);
      // window.location.href = '/verifyEmail'
      if (isSocketReady === true || isSocketReady === "true") {
        socket.current.emit("game-created", {
          status: "restart",
          message: "Game Restarted",
          game_id: running_game_id,
        });
        toastAlert("success", "Game Restarted Successfully ");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toastAlert("error", "Could Not Change Game Status !");
      }
    }
  };
  const [ballsImages, setBallImages] = useState([]);
  const [anounceResultModal, setAnnounceResultModal] = useState(false);
  const getAllBalls = async () => {
    const apiData1 = await get("contact_us/get_all_ball_images"); // Specify the endpoint you want to call
    console.log("apiData1");

    console.log(apiData1);
    if (apiData1.error === true || apiData1.error === true) {
      console.log("errorin fetching data");
    } else {
      console.log("data");
      console.log(apiData1.data);

      setBallImages(apiData1.data);
    }
  };
  const [emptyData, setEmptyData] = useState(false);
  const [winnerBallModal, setWinnerBallModal] = useState(false);
  const [restartGameModal, setRestartGameModal] = useState(false);
  const [winning_amount_single, setWinning_amount_single] = useState(0);
  const [winnersTotal, setWinnersTotal] = useState(0);
  const AnounceResultCall = async () => {
    setLoadingAnounce(true);
    console.log("gameIdResult");
    console.log(gameIdResult);
    console.log(selected_winner_ball);
    const postData = {
      game_id: gameIdResult,
      winning_ball: selected_winner_ball,
    };
    const apiData = await post("game/announce_result", postData); // Specify the endpoint you want to call
    console.log("apixxsData");

    console.log(apiData);
    if (apiData.error === true || apiData.error === true) {
      if (
        apiData.again_start_game === "true" ||
        apiData.again_start_game === true
      ) {
        console.log("again start game");
        setConfirmationModalResult(false);
        setRestartGameModal(true);
        toastAlert("error", "No User Winner! Restart Game to continue.");
        // setTimeout(() => {
        //   window.location.reload()
        //           }
        //           , 1000);
      } else {
        console.log("not again start game");
      }
      // if (apiData.errormsg === "NotVerifiedAccount") {
      //   console.log("NotVerifiedAccount")
      //   setEmailData(values.email)
      //   setModal(true)
      // } else if (apiData.errormsg === "invalid") {
      //   console.log("invalid")
      //   setSubmitting(false);
      //   toastAlert("error", apiData.message)
      // }
      setLoadingAnounce(false);
      getAllGames();
      getAllBalls();
      // toastAlert("error", "No Images Selected")
    } else {
      console.log("anoujnce result");
      console.log(apiData);
      setJackpot_running_game(apiData.game_details.winning_amount);
      setWinnerBallModal(true);
      setSelected_winner_ball_url(apiData.winner_ball_image_url);
      setWinnersTotal(apiData.game_details.winners);
      setWinning_amount_single(apiData.game_details.winning_amount_single);
      getAllGames();
      getAllBalls();
      setLoadingAnounce(false);
      setAnnounceResultModal(false);
      setConfirmationModalResult(false);
      if (isSocketReady === true || isSocketReady === "true") {
        socket.current.emit("game-created", {
          status: "result-anounced",
          message: "Anounced Result socket",
          game_id: gameIdResult,
        });
        // timer 1 second
        toastAlert("success", "Result Announced Successfully ");

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toastAlert("error", "Could Not Complete Game !");
      }
      // setWinnerBallModal(true)
      // window.location.href = '/verifyEmail'

      // toastAlert("success", "You can Edit document ")
    }
  };
  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const [participated_users_array, setParticipated_users_array] = useState([]);
  const [WinnerballNo, setWinnerballNo] = useState("");
  const getGameDetails = async (game_id) => {
    // setLoadingGameId(null)
    const apiData = await get(`game_user/get_game_details?game_id=${game_id}`); // Specify the endpoint you want to call
    console.log("apixxsData");

    console.log(apiData);
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

      toastAlert("error", "Something went wrong");
      setLoadingGameId(null);
    } else {
      console.log("get view data ");
      console.log(apiData);
      setJackpot_running_game(apiData?.jackpot);
      setWinnersTotal(apiData?.game_details?.winners);
      setGameIdDetails(apiData?.game_details?.game_id);
      setEntryFeeDetails(apiData?.game_details?.entry_fee);
      setCommissionDetails(apiData?.game_details?.commission);
      setTotalParticipantsDetails(apiData?.game_details?.participants);
      setGameStatusDetails(apiData?.game_details?.game_status);

      // setParticipated_users_array(apiData?.participated_users_array)
      setAllWinnersArray(apiData?.winners_array);
      // setAllData([])
      // setIsGameAdded
      // check if the array contains any of the game whose status is not scheduled then setIsGameAdded true
      // const isGameAdded = apiData1.data.some(game => game.game_status !== 'scheduled');
      // console.log("isGameAdded")
      // console.log(isGameAdded)

      // get ball Url from get all balls based on winner ball
      console.log(ballsImages);
      const winnerBallNumber = apiData?.game_details?.winner_ball; // replace this with your actual winner ball number
      const winnerBall = ballsImages.find(
        (ball) => ball.name === `ball_${winnerBallNumber}`
      );

      if (winnerBall) {
        setWinnerBallUrlDetails(winnerBall.image_url);
        setWinnerballNo(winnerBallNumber);
      } else {
        console.log(`No image found for ball number ${winnerBallNumber}`);
      }
      // setWinnerBallUrlDetails(apiData.game_details.)
      setWinningAmountSingleDetails(apiData.game_details.winning_amount_single);
      setWinnersTotalDetails(apiData.game_details.winners);
      setJackpotDetails(apiData.jackpot);
      setPlayedAtDetails(apiData.game_details.created_at);
      // setGameDetails(apiData.data)
      setViewGameModal(true);
      // window.location.href = '/verifyEmail'
      setLoadingGameId(null);
      // setIsGameAdded(isGameAdded);
      console.log(apiData?.participants_array);
      setParticipated_users_array(apiData?.participants_array);
      // let DataGet = apiData?.participants_array
      // if (DataGet) {
      //   const filteredData = DataGet.filter(item =>
      //     typeof item.user_id === 'string' && item.user_id.toLowerCase().includes(searchValue1.toLowerCase())
      //   )
      //   const paginatedData = filteredData.slice((currentPage1 - 1) * rowsPerPage1, currentPage1 * rowsPerPage1)
      //   setParticipated_users_array(paginatedData)
      // } else {
      //   console.log('apiData or participants_array is undefined');
      // }
      // toastAlert("success", "You can Edit document ")
    }
  };
  // Export to excel
  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "games.xlsx");
  };
  const [isSocketReady, setSocketReady] = useState(false);
  const [winning_amount_sum_details, setWinning_amount_sum_details] =
    useState(0);
  const [commisiion_amount_sum_details, setCommisiion_amount_sum_details] =
    useState(0);
  const socket = useRef();
  // socket.current = io(BASE_URL, { autoConnect: false });
  const get_completed_games_commision_winning_amount_sum = async () => {
    const apiData = await get(
      `feedback/get_completed_games_commision_winning_amount_sum`
    ); // Specify the endpoint you want to call
    console.log("get_completed_games_commision_winning_amount_sum");
    console.log(apiData);

    if (apiData.error === true || apiData.error === true) {
      console.log("errorin fetching data");
    } else {
      console.log("data");
      console.log(apiData.data.winning_amount_sum);
      setWinning_amount_sum_details(apiData.data.winning_amount_sum);
      setCommisiion_amount_sum_details(apiData.data.commission_sum);
    }
  };
  useEffect(() => {
    socket.current = io(BASE_URL);

    const messageListener = (msg) => {
      console.log(msg);
    };

    socket.current.on("connect", () => {
      setSocketReady(true);
    });

    socket.current.on("received-data", messageListener);

    return () => {
      socket.current.off("received-data", messageListener);
      socket.current.disconnect();
    };
  }, []);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("@AdminCB"));
    if (items === "" || items === undefined || items === null) {
      window.location.href = "/login";
    } else {
      // window.location.href = '/home'
    }
    getAllGames();
    getCurrentRunningGames();
    getAllBalls();
    get_completed_games_commision_winning_amount_sum();

    const filteredData = allData.filter((item) =>
      item.game_id.toLowerCase().includes(searchValue.toLowerCase())
    );
    const paginatedData = filteredData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
    setData(paginatedData);
  }, [currentPage, rowsPerPage, searchValue]);

  return (
    <>
      {/* {isSocketReady?'TRUE':'FALSE'}
 <button onClick={() => {

socket.current.emit("game-created", { status: "scheduled", message: "Hello", game_id: 85928 });//scheduled
}
}>Game created</button> */}
      <div>
        {emptyData ? (
          <>
            <Card>
              <CardBody>
                <Row>
                  <Col lg="10" md="10" sm="10">
                    <h3>All Games</h3>
                  </Col>
                  <Col lg="2" md="2" sm="2" className="mb-2">
                    <Button
                      disabled={isGameAdded}
                      onClick={() => {
                        setModalOpen(true);
                      }}
                      style={{
                        border: "4px solid #F5BC01",
                        borderRadius: "15px",
                        maxWidth: "122px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // linerar gradient
                        background:
                          "linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)",
                      }}
                      color="primary"
                      block
                    >
                      {/* {isSubmitting ? <Spinner  color='#060502' size='sm' /> : null} */}
                      <img src={plusicon} alt="Add" />

                      <span
                        style={{ color: "#060502" }}
                        className="align-middle ms-25"
                      >
                        Create{" "}
                      </span>
                    </Button>
                  </Col>
                  <Col lg="12" md="12" sm="12">
                    <div className="react-dataTable">
                      <DataTable
                        noHeader
                        pagination
                        paginationServer
                        className="react-dataTable"
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
          </>
        ) : (
          <>
            {" "}
            {allData.length === 0 ? (
              <>
                <Spinner color="primary" />
              </>
            ) : (
              <>
                {" "}
                <Row>
                  <Col lg="12" md="12" sm="12">
                    {currentRunningGame.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        {" "}
                        <StatsCard
                          total_participants_running_game={
                            total_participants_running_game
                          }
                          entry_fee_running_game={entry_fee_running_game}
                          commission_running_game={commission_running_game}
                          jackpot_running_game={jackpot_running_game}
                          game_statusRunning={game_statusRunning}
                          returnStatusChanger={(status) => {
                            setChangeStatus(status);
                            setConfirmationModal(true);
                            console.log(status);
                          }}
                          cols={{ md: "3", sm: "6", xs: "12" }}
                        />
                      </>
                    )}
                  </Col>
                </Row>
                <Card>
                  <CardBody>
                    <Row>
                      <Col lg="4" md="6" sm="12">
                        <h3>All Games</h3>
                      </Col>
                      <Col lg="5" md="6" sm="12">
                        <Col
                          className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
                          sm="6"
                        >
                          <Label className="me-1" for="search-input">
                            Search
                          </Label>
                          <Input
                            placeholder="By Game Id"
                            className="dataTable-filter"
                            type="text"
                            bsSize="sm"
                            id="search-input"
                            value={searchValue}
                            onChange={handleFilter}
                          />
                        </Col>
                        {/* <InputGroup style={{
                width: '300px',
                borderRadius: '20px',
                height: '50px',
                backgroundColor: '#FFFFFF',
                // border: '3px solid #FFE064',
                color: '#A4A4A4'
              }}>

                <Input
                  style={{
                    // backgroundColor: '#FFFFFF',
                    border: 'none',
                    // border: '3px solid #FFE064', 
                    // borderRadius:'50px',
                    color: '#A4A4A4'
                  }}
                  className="form-control"
                  type="text"
                  id="login-email"
                  placeholder="Search Game"
                  autoFocus
                />
                <InputGroupText style={{
                  // backgroundColor: '#FFFFFF',
                  border: 'none',
                  // border: '3px solid #FFE064', 
                  // borderRadius:'50px',
                }} >
                  <Search size={20} color="#A4A4A4" />
                </InputGroupText>
              </InputGroup> */}
                      </Col>
                      <Col
                        lg="3"
                        md="6"
                        sm="12"
                        className="d-flex justify-content-right mb-2"
                      >
                        <Button
                          disabled={isGameAdded}
                          onClick={() => {
                            setModalOpen(true);
                          }}
                          style={{
                            border: "4px solid #F5BC01",
                            borderRadius: "15px",
                            maxWidth: "122px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // linerar gradient
                            background:
                              "linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)",
                          }}
                          color="primary"
                          block
                        >
                          {/* {isSubmitting ? <Spinner  color='#060502' size='sm' /> : null} */}
                          <img src={plusicon} alt="Add" />

                          <span
                            style={{ color: "#060502" }}
                            className="align-middle ms-25"
                          >
                            Create{" "}
                          </span>
                        </Button>

                        <Button
                          style={{
                            border: "4px solid #F5BC01",
                            borderRadius: "15px",
                            maxWidth: "122px",
                            display: "flex",
                            justifyContent: "center",
                            marginLeft: "10px",
                            alignItems: "center",
                            // linerar gradient
                            background:
                              "linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)",
                          }}
                          color="primary"
                          block
                          onClick={() => exportToExcel(allData)}
                        >
                          <img src={exporticon} alt="Export" />

                          {/* <Share size={20} color="#A4A4A4" /> */}
                          {/* {isSubmitting ? <Spinner  color='#060502' size='sm' /> : null} */}
                          <span
                            style={{ color: "#060502" }}
                            className="align-middle ms-25"
                          >
                            {" "}
                            Export
                          </span>
                        </Button>
                      </Col>
                      <Col lg="12" md="12" sm="12">
                        <div className="react-dataTable">
                          <DataTable
                            noHeader
                            pagination
                            paginationServer
                            className="react-dataTable"
                            columns={serverSideColumns}
                            sortIcon={<ChevronDown size={10} />}
                            paginationComponent={CustomPagination}
                            data={dataToRender()}
                          />
                        </div>
                      </Col>
                      <Col sm="2" style={{ marginTop: "-30px" }}>
                        <div className="d-flex align-items-center">
                          <Label for="sort-select">show</Label>
                          <Input
                            className="dataTable-select"
                            type="select"
                            id="sort-select"
                            value={rowsPerPage}
                            onChange={(e) => handlePerPage(e)}
                          >
                            <option value={7}>7</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={75}>75</option>
                            <option value={100}>100</option>
                          </Input>
                          <Label for="sort-select">entries</Label>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </>
            )}
          </>
        )}

        <Modal
          isOpen={modalOpen}
          toggle={() => setModalOpen(false)}
          className="modal-dialog-centered"
          modalClassName="primary"
          key="success"
        >
          <ModalHeader
            style={{ fontSize: "27px", fontWeight: 500 }}
            toggle={() => setModalOpen(false)}
          >
            Create Game
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                entry_fees: "",
                commission: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                // Call your API here
                console.log(values);
                // socket.current.emit("game-created", { status: "scheduled", message: "Hello", game_id: 85928 });

                // if (socket.current.connected) {
                //   socket.current.emit("game-created", { status: "scheduled", message: "Hello", game_id: 85928 });
                // } else {
                //   console.log("Socket is not connected");
                // }
                // socket.current.emit("game-created", { status: "scheduled", message: "Hello", game_id: 85928 });//scheduled

                // setSubmitting(true);
                const postData = {
                  entry_fee: values.entry_fees,
                  commission: values.commission,
                };
                const apiData = await post("game/create_game", postData); // Specify the endpoint you want to call
                console.log("apixxsData");

                console.log(apiData);
                if (apiData.error) {
                  // if (apiData.errormsg === "NotVerifiedAccount") {
                  //   console.log("NotVerifiedAccount")
                  //   setEmailData(values.email)
                  //   setModal(true)
                  // } else if (apiData.errormsg === "invalid") {
                  //   console.log("invalid")
                  //   setSubmitting(false);
                  //   toastAlert("error", apiData.message)
                  // }
                  setSubmitting(false);
                  toastAlert("error", "Could Not Create Game !");

                  // toastAlert("error", "No Images Selected")
                } else {
                  console.log("emit");
                  setSubmitting(false);
                  setModalOpen(false);
                  getAllGames();
                  getCurrentRunningGames();
                  // If "Remember Me" is checked, store the user's email in localStorage
                  // if (values.rememberMe) {
                  //   localStorage.setItem('userEmail', values.email);
                  //   localStorage.setItem('userPasword', values.password);

                  // }
                  // localStorage.setItem('@AdminCB', JSON.stringify({ "token": apiData.data, user_type: apiData.user_type, password: values.password }))

                  // window.location.href = "/";
                  if (isSocketReady === true || isSocketReady === "true") {
                    socket.current.emit("game-created", {
                      status: "created",
                      message: "Game Created Successfully Socket",
                      game_id: apiData?.data?.game_id,
                    }); //scheduled
                    socket.current.emit("received-data", {
                      status: "created",

                      message: "Game Created Successfully Socket",
                      game_id: apiData?.data?.game_id,
                    });
                    toastAlert("success", "Game Created Successfully !");
                  } else {
                    toastAlert("error", "Could Not Create Game !");
                  }
                  // socket.current.emit("game-created", { status: "scheduled", message: "Hello", game_id: 85928 });//scheduled
                  // toastAlert("success", "Game Created Successfully !")
                }
              }}
            >
              {({ getFieldProps, errors, touched, isSubmitting }) => (
                <Form className="auth-login-form mt-2">
                  <div className="mb-1">
                    {/* <Label className="form-label" for="login-email">
                      Email
                    </Label> */}
                    <Input
                      style={{}}
                      className={`form-control ${
                        touched.entry_fees && errors.entry_fees
                          ? "is-invalid"
                          : ""
                      }`}
                      {...getFieldProps("entry_fees")}
                      type="number"
                      id="login-email"
                      placeholder="Entry fees"
                      autoFocus
                    />
                    {touched.entry_fees && errors.entry_fees ? (
                      <div className="invalid-feedback">
                        {errors.entry_fees}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-1">
                    <div className="d-flex justify-content-between">
                      {/* <Label className="form-label" for="login-password">
                        Password
                      </Label> */}
                    </div>
                    <Input
                      style={{}}
                      className={`form-control ${
                        touched.commission && errors.commission
                          ? "is-invalid"
                          : ""
                      }`}
                      {...getFieldProps("commission")}
                      type="number"
                      id="login-email"
                      placeholder="Commission (Add in %)"
                      autoFocus
                    />
                    {touched.commission && errors.commission ? (
                      <div className="invalid-feedback">
                        {errors.commission}
                      </div>
                    ) : null}
                  </div>

                  <Button
                    style={{
                      marginTop: "50px",
                      border: "6px solid #F5BC01",
                      // linerar gradient
                      background:
                        "linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)",
                    }}
                    type="submit"
                    color="primary"
                    block
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Spinner color="success" size="sm" />
                    ) : null}
                    <span
                      style={{ color: "#060502" }}
                      className="align-middle ms-25"
                    >
                      {" "}
                      Create Game
                    </span>
                  </Button>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </Modal>
        {/* Change Status Modal  */}
        <Modal
          isOpen={confirmationModal}
          toggle={() => setConfirmationModal(!confirmationModal)}
          centered
        >
          <ModalHeader toggle={() => setConfirmationModal(!confirmationModal)}>
            Confirmation Alert
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to Change Status to {changeStatus}?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={loadingCreate}
              color="primary"
              onClick={ChangeRunningGameStatus}
            >
              {loadingCreate ? <Spinner color="light" size="sm" /> : null}
              <span className="align-middle ms-25">Yes</span>
            </Button>
            {/* <Button color='primary' onClick={() => {
            // deletePosition(deleteIndex)
            setItemDeleteConfirmation(!itemDeleteConfirmation)
          }}>
            Yes
          </Button> */}
            <Button
              color="secondary"
              onClick={() => setConfirmationModal(!confirmationModal)}
              outline
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* Anounce Result modal  */}
        <Modal
          className={"modal-dialog-centered modal-lg"}
          isOpen={anounceResultModal}
          toggle={() => setAnnounceResultModal(!anounceResultModal)}
          centered
        >
          <ModalHeader
            toggle={() => setAnnounceResultModal(!anounceResultModal)}
          >
            Select Winner Ball
          </ModalHeader>
          <ModalBody>
            <Row>
              {ballsImages.map((item, index) => (
                <>
                  <Col lg="2" md="4" sm="6" style={{ padding: "10px" }}>
                    <img
                      onClick={() => {
                        console.log(item);
                        const ball_no = item.name.split("_")[1];
                        setSelected_winner_ball(ball_no);
                        setSelected_winner_ball_url(item.image_url);
                        setConfirmationModalResult(true);
                      }}
                      style={{
                        width: "100px",
                        height: "100px",
                        cursor: "pointer",
                        border:
                          activeImageIndex === index
                            ? "2px solid #1e1e1e"
                            : "none",
                        borderRadius: "50px",
                      }}
                      src={item.image_url}
                      alt={item.balls_images_id}
                      onMouseEnter={() => setActiveImageIndex(index)}
                      onMouseLeave={() => setActiveImageIndex(null)}
                    />
                  </Col>
                </>
              ))}
            </Row>
          </ModalBody>
        </Modal>
        {/* confirmation anounce result modal  */}
        <Modal
          isOpen={confirmationModalResult}
          toggle={() => setConfirmationModalResult(!confirmationModalResult)}
          centered
        >
          <ModalHeader
            toggle={() => setConfirmationModalResult(!confirmationModalResult)}
          >
            Confirmation Alert
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to announce{" "}
              <span style={{ color: "#F5BC01" }}>
                Ball{" "}
                {selected_winner_ball === 0 || selected_winner_ball === "0"
                  ? "white"
                  : selected_winner_ball}{" "}
              </span>{" "}
              as winner ball?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={loadingAnounce}
              color="primary"
              onClick={AnounceResultCall}
            >
              {loadingAnounce ? <Spinner color="light" size="sm" /> : null}
              <span className="align-middle ms-25">Yes , Announce</span>
            </Button>
            {/* <Button color='primary' onClick={() => {
            // deletePosition(deleteIndex)
            setItemDeleteConfirmation(!itemDeleteConfirmation)
          }}>
            Yes
          </Button> */}
            <Button
              color="secondary"
              onClick={() =>
                setConfirmationModalResult(!confirmationModalResult)
              }
              outline
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* Restart gamre Modal  */}
        <Modal
          isOpen={restartGameModal}
          toggle={() => setRestartGameModal(!restartGameModal)}
          centered
        >
          <ModalHeader
            toggle={() => setRestartGameModal(!restartGameModal)}
          ></ModalHeader>
          <ModalBody
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginTop: "50px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                backgroundColor: "#070606",
                borderRadius: "60px",
                height: "42px",
                width: "263px",
              }}
            >
              <h5
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  marginLeft: "50px",
                  color: "#FFE064",
                }}
              >
                Jackpot
              </h5>
              <h5
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  color: "#FFE064",
                  marginLeft: "10px",
                }}
              >
                $ {jackpot_running_game}
              </h5>
              <div style={{ position: "absolute", left: 0, top: "-30px" }}>
                <img
                  src={jackpotImage}
                  alt="jackpot"
                  style={{ width: "70px", height: "72px" }}
                />
              </div>
            </div>
            <h3
              style={{
                marginTop: "50px",
                fontFamily: "Pacifico",
                fontSize: "36px",
                fontWeight: 400,
                // border:'1.5px solid #000000',
                color: "#11D000",
                textAlign: "center",
                textShadow:
                  "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
              }}
            >
              Winner Ball
            </h3>
            <img
              src={selected_winner_ball_url}
              style={{ width: "100px", height: "100px" }}
              alt="winner_ball_selected"
            />
            <h3
              style={{
                fontFamily: "Pacifico",
                fontSize: "36px",
                fontWeight: 400,
                // border:'1.5px solid #000000',
                color: "#11D000",
                textAlign: "center",
                textShadow:
                  "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
              }}
            >
              Winners :0
            </h3>
            <Button
              onClick={() => {
                ChangeRunningGameStatusRestart();
              }}
              style={{
                marginBottom: "50px",
                maxWidth: "200px",
                marginTop: "50px",
                border: "6px solid #F5BC01",
                borderRadius: "15px",
                // linerar gradient
                background: "linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)",
              }}
              type="submit"
              color="primary"
              block
              disabled={restartGameLoading}
            >
              {restartGameLoading ? (
                <Spinner color="success" size="sm" />
              ) : null}
              <span style={{ color: "#060502" }} className="align-middle ms-25">
                {" "}
                Re-Start Game
              </span>
            </Button>
          </ModalBody>
        </Modal>
        {/* winer ball modal  */}
        <Modal
          isOpen={winnerBallModal}
          toggle={() => setWinnerBallModal(!winnerBallModal)}
          centered
        >
          {/* <ModalHeader toggle={() => setRestartGameModal(!restartGameModal)}>Confirmation Alert</ModalHeader> */}
          <ModalBody
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginTop: "50px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                backgroundColor: "#070606",
                borderRadius: "60px",
                height: "42px",
                width: "263px",
              }}
            >
              <h5
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  marginLeft: "50px",
                  color: "#FFE064",
                }}
              >
                Jackpot
              </h5>
              <h5
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  color: "#FFE064",
                  marginLeft: "10px",
                }}
              >
                $ {jackpot_running_game}
              </h5>
              <div style={{ position: "absolute", left: 0, top: "-30px" }}>
                <img
                  src={jackpotImage}
                  alt="jackpot"
                  style={{ width: "70px", height: "72px" }}
                />
              </div>
            </div>
            <h3
              style={{
                marginTop: "50px",
                fontFamily: "Pacifico",
                fontSize: "36px",
                fontWeight: 400,
                // border:'1.5px solid #000000',
                color: "#11D000",
                textAlign: "center",
                textShadow:
                  "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
              }}
            >
              Winner Ball
            </h3>
            <img
              src={selected_winner_ball_url}
              style={{ width: "100px", height: "100px" }}
              alt="winner_ball_selected"
            />
            <h3
              style={{
                marginTop: "50px",
                fontFamily: "Pacifico",
                fontSize: "36px",
                fontWeight: 400,
                color: "#11D000",
              }}
            >
              Winners {winnersTotal}
            </h3>
            <h5 style={{ fontSize: "18px" }}>
              Winning Amount{" "}
              <span style={{ fontWeight: 500 }}>$ {winning_amount_single}</span>
            </h5>
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
        {/* confirmation delete game modal  */}
        <Modal
          isOpen={confirmationModalDelete}
          toggle={() => setConfirmationModalDelete(!confirmationModalDelete)}
          centered
        >
          <ModalHeader
            toggle={() => setConfirmationModalDelete(!confirmationModalDelete)}
          >
            Confirmation Alert
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete that game ?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={loadingDelete}
              color="danger"
              onClick={DeleteCall}
            >
              {loadingDelete ? <Spinner color="light" size="sm" /> : null}
              <span className="align-middle ms-25">Yes Delete</span>
            </Button>
            {/* <Button color='primary' onClick={() => {
            // deletePosition(deleteIndex)
            setItemDeleteConfirmation(!itemDeleteConfirmation)
          }}>
            Yes
          </Button> */}
            <Button
              color="secondary"
              onClick={() =>
                setConfirmationModalDelete(!setConfirmationModalDelete)
              }
              outline
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* View Game modal  */}
        <Modal
          className={"modal-dialog-centered modal-xl"}
          isOpen={viewGameModal}
          toggle={() => setViewGameModal(!viewGameModal)}
          centered
        >
          <ModalHeader toggle={() => setViewGameModal(!viewGameModal)}>
            Game Details
          </ModalHeader>
          <ModalBody
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Row>
              <Col
                lg="4"
                md="4"
                sm="12"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {gameStatusDetails === "completed" ? (
                  <>
                    <img
                      src={winnerBallUrlDetails}
                      style={{ width: "100px", height: "100px" }}
                      alt="winner_ball_selected"
                    />
                    <h3
                      style={{
                        marginTop: "50px",
                        fontFamily: "Pacifico",
                        marginBottom: "10px",
                        fontSize: "36px",
                        fontWeight: 400,
                        // border:'1.5px solid #000000',
                        color: "#11D000",
                        textAlign: "center",
                        textShadow:
                          "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
                      }}
                    >
                      Winner Ball
                    </h3>{" "}
                  </>
                ) : (
                  <></>
                )}

                <Row>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "19px",
                        fontWeight: 500,
                        color: "#FFAB00",
                      }}
                    >
                      Game ID
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#656565",
                      }}
                    >
                      # {gameIdDetails}
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "19px",
                        fontWeight: 500,
                        color: "#FFAB00",
                      }}
                    >
                      Entry Fees
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#656565",
                      }}
                    >
                      $ {entryFeeDetails}
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "19px",
                        fontWeight: 500,
                        color: "#FFAB00",
                      }}
                    >
                      Commission
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#656565",
                      }}
                    >
                      {commissionDetails} %
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "19px",
                        fontWeight: 500,
                        color: "#FFAB00",
                      }}
                    >
                      Total Participants
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#656565",
                      }}
                    >
                      {totalParticipantsDetails === null ||
                      totalParticipantsDetails === undefined
                        ? 0
                        : totalParticipantsDetails}
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "19px",
                        fontWeight: 500,
                        color: "#FFAB00",
                      }}
                    >
                      Jackpot
                    </h3>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#656565",
                      }}
                    >
                      $ {jackpotDetails}
                    </h3>
                  </Col>
                  {gameStatusDetails === "completed" ? (
                    <>
                      <Col lg="6" md="6" sm="6">
                        <h3
                          style={{
                            fontSize: "19px",
                            fontWeight: 500,
                            color: "#FFAB00",
                          }}
                        >
                          Total Winners
                        </h3>
                      </Col>
                      <Col lg="6" md="6" sm="6">
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: 400,
                            color: "#656565",
                          }}
                        >
                          {winnersTotalDetails}
                        </h3>
                      </Col>
                      <Col lg="6" md="6" sm="6">
                        <h3
                          style={{
                            fontSize: "19px",
                            fontWeight: 500,
                            color: "#FFAB00",
                          }}
                        >
                          Single User Winning Price
                        </h3>
                      </Col>
                      <Col lg="6" md="6" sm="6">
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: 400,
                            color: "#656565",
                          }}
                        >
                          ${" "}
                          {winningAmountSingleDetails === null ||
                          winningAmountSingleDetails === undefined
                            ? 0
                            : winningAmountSingleDetails}
                        </h3>
                      </Col>
                      <Col lg="6" md="6" sm="6">
                        <h3
                          style={{
                            fontSize: "19px",
                            fontWeight: 500,
                            color: "#FFAB00",
                          }}
                        >
                          Played at
                        </h3>
                      </Col>
                      <Col lg="6" md="6" sm="6">
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: 400,
                            color: "#656565",
                          }}
                        >
                          {formatDate(playedAtDetails)}
                        </h3>
                      </Col>
                    </>
                  ) : (
                    <></>
                  )}
                </Row>
              </Col>
              <Col lg="8" md="8" sm="12">
                <Nav className="justify-content-center" tabs>
                  <NavItem>
                    <NavLink
                      active={active === "1"}
                      onClick={() => {
                        toggle("1");
                      }}
                    >
                      Participants
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={active === "2"}
                      onClick={() => {
                        toggle("2");
                      }}
                    >
                      Winners
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent className="py-50" activeTab={active}>
                  <TabPane tabId="1">
                    <div style={{ maxWidth: "900px" }}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th scope="col" className="text-nowrap">
                              #
                            </th>
                            <th scope="col" className="text-nowrap">
                              USER ID
                            </th>
                            <th scope="col" className="text-nowrap">
                              USER NAME
                            </th>
                            <th scope="col" className="text-nowrap">
                              EMAIL
                            </th>
                            <th scope="col" className="text-nowrap">
                              PLAYED GAMES
                            </th>
                            <th scope="col" className="text-nowrap">
                              WIN GAMES
                            </th>
                            <th scope="col" className="text-nowrap">
                              Wallet
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {participated_users_array.map((item, index) => (
                            <>
                              <tr>
                                <td className="text-nowrap">{index + 1}</td>
                                <td className="text-nowrap">{item?.user_id}</td>
                                <td className="text-nowrap">
                                  {item.user_name}
                                </td>
                                <td className="text-nowrap">{item.email}</td>
                                <td className="text-nowrap">
                                  {item.played_games}
                                </td>
                                <td className="text-nowrap">
                                  {item.win_games}
                                </td>
                                <td className="text-nowrap">
                                  {item.wallet_balance}
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </TabPane>
                  <TabPane tabId="2">
                    {WinnerballNo === 0 || WinnerballNo === "0" ? (
                      <>
                        <div
                          style={{
                            marginTop: "50px",
                            // position: 'relative',
                            display: "flex",
                            justifyContent: "center",
                            textAlign: "center",
                            alignItems: "center",
                            // backgroundColor: '#070606',
                            borderRadius: "60px",
                          }}
                        >
                          <h5
                            style={{
                              fontSize: "30px",
                              fontWeight: 400,
                              marginLeft: "50px",
                              color: "rgb(17, 208, 0)",
                              textAlign: "center",
                              textShadow:
                                "black -1px 0px, black 0px 1px, black 1px 0px, black 0px -1px",
                            }}
                          >
                            House Wins
                          </h5>
                          <h5
                            style={{
                              fontSize: "30px",
                              fontWeight: 400,
                              color: "rgb(17, 208, 0)",
                              textAlign: "center",
                              textShadow:
                                "black -1px 0px, black 0px 1px, black 1px 0px, black 0px -1px",
                              marginLeft: "10px",
                            }}
                          >
                            $ {jackpotDetails}
                          </h5>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ maxWidth: "900px" }}>
                          <Table responsive>
                            <thead>
                              <tr>
                                <th scope="col" className="text-nowrap">
                                  #
                                </th>
                                <th scope="col" className="text-nowrap">
                                  USER ID
                                </th>
                                <th scope="col" className="text-nowrap">
                                  USER NAME
                                </th>
                                <th scope="col" className="text-nowrap">
                                  EMAIL
                                </th>
                                <th scope="col" className="text-nowrap">
                                  PLAYED GAMES
                                </th>
                                <th scope="col" className="text-nowrap">
                                  WIN GAMES
                                </th>
                                <th scope="col" className="text-nowrap">
                                  Wallet
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {allWinnersArray.map((item, index) => (
                                <>
                                  <tr>
                                    <td className="text-nowrap">{index + 1}</td>
                                    <td className="text-nowrap">
                                      # {item?.user_id}
                                    </td>
                                    <td className="text-nowrap">
                                      {item.user_name}
                                    </td>
                                    <td className="text-nowrap">
                                      {item.email}
                                    </td>
                                    <td className="text-nowrap">
                                      {item.played_games}
                                    </td>
                                    <td className="text-nowrap">
                                      {item.win_games}
                                    </td>
                                    <td className="text-nowrap">
                                      $ {item.wallet_balance}
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </>
                    )}
                  </TabPane>
                </TabContent>
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
    </>
  );
};

export default Games;
