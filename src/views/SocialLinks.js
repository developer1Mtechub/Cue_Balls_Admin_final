import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Input,
  Spinner,

} from "reactstrap";
import "@styles/react/libs/tables/react-dataTable-component.scss"

import { useEffect, useState } from 'react'
import { Copy, Edit, Save } from "react-feather";

import toastAlert from "@components/toastAlert";
import { BASE_URL, get, post } from "../apis/api";
import { BallImage } from "./BallImage";
import FileUploaderSingle from "./forms/FileUploaderSingle";


const SocialLinks = (props) => {
  // social links 
  const [facebook_url, setFacebook_url] = useState('')
  const [instagram_url, setInstagram_url] = useState('')
  const [twitter_url, setTwitter_url] = useState('')
  const [linkedin_url, setLinkedin_url] = useState('')
  const [facebook_image_url, setFacebook_image_url] = useState('')
  const [instagram_image_url, setInstagram_image_url] = useState('')
  const [twitter_image_url, setTwitter_image_url] = useState('')
  const [linkedin_image_url, setLinkedin_image_url] = useState('')
  // support 
  const [support_email, setSupport_email] = useState('')
  const [support_phone, setSupport_phone] = useState('')
  const [support_address, setSupport_address] = useState('')
  // download button
  const [download_button_url, setDownload_button_url] = useState('')
  const [play_store_url, setPlay_store_url] = useState('')
  const [app_store_url, setApp_store_url] = useState('')
  // loaders 
  const [isEditingfb, setIsEditingfb] = useState(false);
  const [isEditinginsta, setIsEditinginsta] = useState(false);
  const [isEditingtwitter, setIsEditingtwitter] = useState(false);
  const [isEditinglinkedin, setIsEditinglinkedin] = useState(false);

  const [isEditingsupportemail, setIsEditingsupportemail] = useState(false);
  const [isEditingsupportphone, setIsEditingsupportphone] = useState(false);
  const [isEditingsupportaddress, setIsEditingsupportaddress] = useState(false);

  const [isEditingdownloadbutton, setIsEditingdownloadbutton] = useState(false);
  const [isEditingplaystore, setIsEditingplaystore] = useState(false);
  const [isEditingappstore, setIsEditingappstore] = useState(false);

  const [isEditingfbImage, setIsEditingfbImage] = useState(false);
  const [isEditinginstaImage, setIsEditinginstaImage] = useState(false);
  const [isEditingtwitterImage, setIsEditingtwitterImage] = useState(false);
  const [isEditinglinkedinImage, setIsEditinglinkedinImage] = useState(false);
  // -----------------------------------Loaders 
  const [loaderfb, setLoaderfb] = useState(false)
  const [loaderinsta, setLoaderinsta] = useState(false)
  const [loadertwitter, setLoadertwitter] = useState(false)
  const [loaderlinkedin, setLoaderlinkedin] = useState(false)

  const [loaderfbImage, setLoaderfbImage] = useState(false)
  const [loaderinstaImage, setLoaderinstaImage] = useState(false)
  const [loadertwitterImage, setLoadertwitterImage] = useState(false)
  const [loaderlinkedinImage, setLoaderlinkedinImage] = useState(false)

  const [loadersupportemail, setLoadersupportemail] = useState(false)
  const [loadersupportphone, setLoadersupportphone] = useState(false)
  const [loadersupportaddress, setLoadersupportaddress] = useState(false)

  const [loaderdownloadbutton, setLoaderdownloadbutton] = useState(false)
  const [loaderplaystore, setLoaderplaystore] = useState(false)
  const [loaderappstore, setLoaderappstore] = useState(false)

  // 0-1 balls states as ball_0 to ball_15 

  const [ballImages, setBallImages] = useState({});
  const [appShareLink, setAppShareLink] = useState('')
  const [loaderData, setLoaderData] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [loaderRefresh, setLoaderRefresh] = useState(true)



  const getShareAppLink = async () => {
    const apiData1 = await get('feedback/get_app_share_link'); // Specify the endpoint you want to call
    console.log("Share Link")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
      setLoaderRefresh(false)

    } else {
      setAppShareLink(apiData1?.result?.url)
      setLoaderRefresh(false)
    }
  }
  const getAllDashboard = async () => {
    const apiData1 = await get('privacy_policy/getSocialLinks'); // Specify the endpoint you want to call
    console.log("getSocialLinks")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
    } else {
      setFacebook_url(apiData1?.data?.facebook_url)
      setInstagram_url(apiData1?.data?.instagram_url)
      setTwitter_url(apiData1?.data?.twitter_url)
      setLinkedin_url(apiData1?.data?.linkedin_url)
      setFacebook_image_url(apiData1?.data?.facebook_image_url)
      setInstagram_image_url(apiData1?.data?.instagram_image_url)
      setTwitter_image_url(apiData1?.data?.twitter_image_url)
      setLinkedin_image_url(apiData1?.data?.linkedin_image_url)
      //   setActiveUsers(apiData1.total_active_users)
      //   setDeletedUsers(apiData1.deleted_users)
      //   setTotalGames(apiData1.total_games)
      // }
    }
  }
  const getAllsupportData = async () => {
    const apiData1 = await get('privacy_policy/getSupportEmail'); // Specify the endpoint you want to call
    console.log("getSupportEmail")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
    } else {
      setSupport_email(apiData1?.data?.email)
      setSupport_phone(apiData1?.data?.phone_no)
      setSupport_address(apiData1?.data?.address)
    }
  }
  const getAllButtonUrls = async () => {
    const apiData1 = await get('privacy_policy/getDownloadButtons'); // Specify the endpoint you want to call
    console.log("getDownloadButtons")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
    } else {
      setDownload_button_url(apiData1?.data?.download_now_url)
      setPlay_store_url(apiData1?.data?.play_store_url)
      setApp_store_url(apiData1?.data?.app_store_url)
    }
  }
  const getAllBallImages = async () => {
    const apiData1 = await get('contact_us/get_all_ball_images'); // Specify the endpoint you want to call
    console.log("get_all_ball_images")

    console.log(apiData1)
    if (apiData1.error === true || apiData1.error === true) {
      toastAlert('error', apiData1.message)
    } else {
      const newBallImages = {};
      let dataArray = apiData1.data
      dataArray.forEach(ball => {
        newBallImages[ball.name] = ball;
      });
      setBallImages(newBallImages)
      console.log(newBallImages);
    }
  }




  const savesocialUrls = async () => {
    const postData = {
      facebook_url: facebook_url,
      instagram_url: instagram_url,
      twitter_url: twitter_url,
      linkedin_url: linkedin_url,
      facebook_image_url: facebook_image_url,
      instagram_image_url: instagram_image_url,
      twitter_image_url: twitter_image_url,
      linkedin_image_url: linkedin_image_url,
    }
    const apiData1 = await post('privacy_policy/create_update_social_links', postData); // Specify the endpoint you want to call
    console.log("createSocialLinks")
    if (apiData1.error === true || apiData1.error === "true") {
      toastAlert('error', apiData1.message)
    } else {
      toastAlert('success', apiData1.message)
    }
    console.log(apiData1)
  }
  const savesupportdata = async () => {
    const postData = {
      email: support_email,
      phone_no: support_phone,
      address: support_address,
    }
    const apiData1 = await post('privacy_policy/create_update_support_email', postData); // Specify the endpoint you want to call
    console.log("createSocialLinks")
    if (apiData1.error === true || apiData1.error === "true") {
      toastAlert('error', apiData1.message)
    } else {
      toastAlert('success', apiData1.message)
    }
    console.log(apiData1)
  }
  const saveDownloadButtonUrls = async (appShareLinkd) => {
    const postData = {
      download_now_url: appShareLinkd,
      play_store_url: play_store_url,
      app_store_url: app_store_url,
    }
    const apiData1 = await post('privacy_policy/create_update_download_buttons', postData); // Specify the endpoint you want to call
    console.log("createSocialLinks")
    if (apiData1.error === true || apiData1.error === "true") {
      toastAlert('error', apiData1.message)
    } else {
      // toastAlert('success', apiData1.message)
    }
    console.log(apiData1)
  }
  const handleSave = async (name, imageUrl) => {
    console.log("ddfdfdfdf")
    console.log(name)
    console.log(imageUrl)
    const postData = {
      image_url: imageUrl,
      name: name
    }

    const apiData1 = await post('contact_us/add_ball_images', postData); // Specify the endpoint you want to call
    console.log(apiData1)
    if (apiData1.error) {
      toastAlert('error', response.message);
    } else {
      toastAlert('success', 'Saved successfully');
      getAllBallImages(); // Refresh the ball images
    }
  }
  const handleSaveApkApps=async(appShareLinkS)=>{
    const postData = {
      "url": appShareLinkS
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
      getShareAppLink()
    }
    setIsEditing(false)
  }
  // file upload 
  const fileUploader = async (file) => {
    console.log(file)
    const formData = new FormData();
    formData.append('image', file[0]);
    const response = await post('upload-image', formData); // Specify the endpoint you want to call
    console.log(response.path)
    if(response.path===undefined||response.path===null||response.path===''){
      toastAlert('error', 'Error in uploading APK');
    }else{
      // i want to add path base url with response.path 
      const fullPath = BASE_URL + response.path;
      saveDownloadButtonUrls(fullPath)
      handleSaveApkApps(fullPath)

    }
    // if (response.error) {
    //   toastAlert('error', response.message);
    // }
  }
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("@AdminCB"));
    if (items === '' || items === undefined || items === null) {
      window.location.href = '/login'
    } else {
      // window.location.href = '/home'

    }
    getAllDashboard();
    getAllsupportData();
    getAllButtonUrls();
    getAllBallImages();
    getShareAppLink();

  }, [])

  return (
    <div>
      {loaderRefresh ? <Spinner color='primary' size='sm' /> : null}
      <Row className='match-height'>

        <Col lg='6' md='6' xs='12'>
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <CardTitle tag='h4'>Social Links</CardTitle>

            </CardHeader>

            <CardBody>
              <Row>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Facebook</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={facebook_url}
                    onChange={
                      (e) => {
                        setFacebook_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingfb}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderfb ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingfb ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderfb(true)
                      savesocialUrls()
                      setLoaderfb(false)

                      // const postData = {
                      //   "url": facebook_url
                      // }
                      // const apiData1 = await post('feedback/create_app_share_link', postData); // Specify the endpoint you want to call
                      // console.log("apiData1")

                      // console.log(apiData1)
                      // if (apiData1.error === true || apiData1.error === true) {
                      //   setLoaderfb(false)
                      //   toastAlert('error', apiData1.message)

                      // } else {
                      //   setLoaderfb(false)
                      //   toastAlert('success', apiData1.message)

                      // }
                      setIsEditingfb(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingfb(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(facebook_url)
                  }} />
                </Col>
              </Row>
              {/* Insta  */}
              <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Instagram</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={instagram_url}
                    onChange={
                      (e) => {
                        setInstagram_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditinginsta}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderinsta ? <Spinner color='primary' size='sm' /> : null}
                  {isEditinginsta ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderinsta(true)
                      savesocialUrls()
                      setLoaderinsta(false)

                      setIsEditinginsta(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditinginsta(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(instagram_url)
                  }} />
                </Col>
              </Row>
              <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Twitter</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={twitter_url}
                    onChange={
                      (e) => {
                        setTwitter_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingtwitter}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loadertwitter ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingtwitter ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoadertwitter(true)
                      savesocialUrls()
                      setLoadertwitter(false)


                      setIsEditingtwitter(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingtwitter(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(twitter_url)
                  }} />
                </Col>
              </Row>
              <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>LinkedIn</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={linkedin_url}
                    onChange={
                      (e) => {
                        setLinkedin_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditinglinkedin}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderlinkedin ? <Spinner color='primary' size='sm' /> : null}
                  {isEditinglinkedin ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderlinkedin(true)
                      savesocialUrls()
                      setLoaderlinkedin(false)

                      setIsEditinglinkedin(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditinglinkedin(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(linkedin_url)
                  }} />
                </Col>
              </Row>


            </CardBody>
          </Card>
        </Col>

        {/* Image urls   */}
        {/* <Col lg='6' md='6' xs='12'>
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <CardTitle tag='h4'>Social Links Images For Email</CardTitle>

            </CardHeader>

            <CardBody>
              <Row>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Facebook</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={facebook_image_url}
                    onChange={
                      (e) => {
                        setFacebook_image_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingfbImage}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderfbImage ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingfbImage ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderfbImage(true)
                      savesocialUrls()
                      setLoaderfbImage(false)

                      // const postData = {
                      //   "url": appShareLink
                      // }
                      // const apiData1 = await post('feedback/create_app_share_link', postData); // Specify the endpoint you want to call
                      // console.log("apiData1")

                      // console.log(apiData1)
                      // if (apiData1.error === true || apiData1.error === true) {
                      //   setLoaderfbImage(false)
                      //   toastAlert('error', apiData1.message)

                      // } else {
                      //   setLoaderfbImage(false)
                      //   toastAlert('success', apiData1.message)

                      // }
                      setIsEditingfbImage(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingfbImage(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(facebook_image_url)
                  }} />
                </Col>
              </Row>
              <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Instagram</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={instagram_image_url}
                    onChange={
                      (e) => {
                        setInstagram_image_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditinginstaImage}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderinstaImage ? <Spinner color='primary' size='sm' /> : null}
                  {isEditinginstaImage ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderinstaImage(true)
                      savesocialUrls()
                      setLoaderinstaImage(false)

                      setIsEditinginstaImage(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditinginstaImage(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(instagram_image_url)
                  }} />
                </Col>
              </Row>
              <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Twitter</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={twitter_image_url}
                    onChange={
                      (e) => {
                        setTwitter_image_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingtwitterImage}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loadertwitterImage ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingtwitterImage ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoadertwitterImage(true)
                      savesocialUrls()
                      setLoadertwitterImage(false)

                      setIsEditingtwitterImage(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingtwitterImage(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(twitter_image_url)
                  }} />
                </Col>
              </Row>
              <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>LinkedIn</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={linkedin_image_url}
                    onChange={
                      (e) => {
                        setLinkedin_image_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditinglinkedinImage}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderlinkedinImage ? <Spinner color='primary' size='sm' /> : null}
                  {isEditinglinkedinImage ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderlinkedinImage(true)
                      savesocialUrls()
                      setLoaderlinkedinImage(false)

                      setIsEditinglinkedinImage(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditinglinkedinImage(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(linkedin_image_url)
                  }} />
                </Col>
              </Row>


            </CardBody>
          </Card>
        </Col> */}
        {/* suppport email data  */}
        <Col lg='6' md='6' xs='12'>
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <CardTitle tag='h4'>Support Data for Website</CardTitle>

            </CardHeader>

            <CardBody>
              <Row>
                {/* <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Email</span>
                </Col> */}
                <Col lg='10' md='10' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={support_email}
                    onChange={
                      (e) => {
                        setSupport_email(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingsupportemail}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loadersupportemail ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingsupportemail ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoadersupportemail(true)
                      savesupportdata()
                      setLoadersupportemail(false)

                      setIsEditingsupportemail(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingsupportemail(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(support_email)
                  }} />
                </Col>
              </Row>
              <Row>
                <h4 style={{ marginTop: '1%' }}>
                  App's Share Link
                </h4>

                {isEditing ? <Col lg='12' md='12' xs='12'>
                  <FileUploaderSingle  removeData={()=>setIsEditing(false)} fileUploader={fileUploader} />
                </Col> :
                  <Col lg='10' md='10' xs='12'>

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
                  </Col>}


                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderData ? <Spinner color='primary' size='sm' /> : null}
                  {isEditing ?
                   <> 
                   {/* <Save color="#03C4DE" size={20} style={{
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
                        saveDownloadButtonUrls(appShareLink)
                      }
                      setIsEditing(false)
                    }} /> */}
                    </> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditing(true)} />
                  }
                </Col>
                {isEditing?null:<Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(appShareLink)
                  }} />
                </Col>}
                
              </Row>
              {/* <Row>
               
                <Col lg='12' md='12' xs='12' style={{marginTop:'1%'}}>
                  <h4>
                       Download Button Url
                  </h4>
               
                  </Col>
                <Col lg='10' md='10' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={download_button_url}
                    onChange={
                      (e) => {
                        setDownload_button_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingdownloadbutton}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderdownloadbutton ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingdownloadbutton ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderdownloadbutton(true)
                      saveDownloadButtonUrls()
                      setLoaderdownloadbutton(false)

                      setIsEditingdownloadbutton(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingdownloadbutton(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(download_button_url)
                  }} />
                </Col>
              </Row> */}
              {/* Insta  */}
              {/* <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Phone No</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={support_phone}
                    onChange={
                      (e) => {
                        setSupport_phone(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingsupportphone}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loadersupportphone ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingsupportphone ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoadersupportphone(true)
                      savesupportdata()
                      setLoadersupportphone(false)
                      setIsEditingsupportphone(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingsupportphone(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(support_phone)
                  }} />
                </Col>
              </Row>
              <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Address</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={support_address}
                    onChange={
                      (e) => {
                        setSupport_address(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingsupportaddress}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loadersupportaddress ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingsupportaddress ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoadersupportaddress(true)
                      savesupportdata()
                      setLoadersupportaddress(false)
                      setIsEditingsupportaddress(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingsupportaddress(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(support_address)
                  }} />
                </Col>
              </Row> */}



            </CardBody>
          </Card>
        </Col>

        {/* Download Button  */}
        {/* <Col lg='6' md='6' xs='12'>
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <CardTitle tag='h4'>Download Button Urls</CardTitle>

            </CardHeader>

            <CardBody>
              <Row>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Download </span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={download_button_url}
                    onChange={
                      (e) => {
                        setDownload_button_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingdownloadbutton}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderdownloadbutton ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingdownloadbutton ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderdownloadbutton(true)
                      saveDownloadButtonUrls()
                      setLoaderdownloadbutton(false)

                      setIsEditingdownloadbutton(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingdownloadbutton(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(download_button_url)
                  }} />
                </Col>
              </Row>
             <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>Play Store</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={play_store_url}
                    onChange={
                      (e) => {
                        setPlay_store_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingplaystore}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderplaystore ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingplaystore ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderplaystore(true)
                      saveDownloadButtonUrls()
                      setLoaderplaystore(false)
                      setIsEditingplaystore(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingplaystore(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(play_store_url)
                  }} />
                </Col>
              </Row>
              <Row style={{ marginBlock: '1%' }}>
                <Col lg='2' md='2' xs='12'>
                  <span style={{ marginTop: '1px' }}>App Store</span>
                </Col>
                <Col lg='8' md='8' xs='12'>
                  <Input style={{

                    // backgroundColor: '#353535',
                    border: '1px solid #A4A4A4',
                    // color: '#A4A4A4'
                  }}
                    className={`form-control`}
                    value={app_store_url}
                    onChange={
                      (e) => {
                        setApp_store_url(e.target.value)
                      }
                    }
                    type="text"
                    id="login-email"
                    placeholder="Enter Link"
                    autoFocus
                    disabled={!isEditingappstore}
                  />
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  {loaderappstore ? <Spinner color='primary' size='sm' /> : null}
                  {isEditingappstore ?
                    <Save color="#03C4DE" size={20} style={{
                      cursor: 'pointer'
                    }} onClick={async () => {
                      setLoaderappstore(true)
                      saveDownloadButtonUrls()
                      setLoaderappstore(false)
                      setIsEditingappstore(false)
                    }} /> :
                    <Edit color="#03C4DE" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsEditingappstore(true)} />
                  }
                </Col>
                <Col lg='1' md='1' xs='12' style={{ marginTop: '5px' }}>
                  <Copy size={20} onClick={() => {
                    toastAlert("success", "Link Copied")
                    navigator.clipboard.writeText(app_store_url)
                  }} />
                </Col>
              </Row> 



            </CardBody>
          </Card>
        </Col> */}
        {/* Ball iMages  */}
        <Col lg='12' md='12' xs='12'>
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <CardTitle tag='h4'>Ball Images</CardTitle>

            </CardHeader>

            <CardBody>
              <Row style={{ display: 'flex', padding: "30px" }}>
                {Object.values(ballImages).map(ball => (

                  <Col lg='2' md='2' xs='12'>
                    <BallImage key={ball.name} ball={ball} onSave={handleSave} />
                  </Col>

                ))} </Row>
            </CardBody>
          </Card>
        </Col>


      </Row>


    </div>
  );
};

export default SocialLinks;
