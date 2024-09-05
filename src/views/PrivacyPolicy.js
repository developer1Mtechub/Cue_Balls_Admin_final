// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import * as Yup from 'yup';

// ** Icons Imports
import { ChevronLeft } from "react-feather";
// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { get, post, put } from "../apis/api";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/forgot-password-v2.svg";
import illustrationsDark from "@src/assets/images/pages/forgot-password-v2-dark.svg";
import privacyPolicy from "@src/assets/images/pages/privacyPolicy.png";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { Formik, Form } from "formik";
import { useEffect, useRef, useState } from "react";
import toastAlert from "@components/toastAlert";
import { email_contact_policy, email_cue_balls } from "../apis/product_id";
import { Editor } from '@tinymce/tinymce-react';
import { PrimaryKey } from "../apis/api_keys_Editor";

const PrivacyPolicy = () => {
  // ** Hooks
  const { skin } = useSkin();
  const [PrivacyPolicyState,setPrivacyPolicyState]=useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const editorRef=useRef();
  const [loader, setLoader] = useState(true)
  const getPrivacyPolicy = async () => {
    const apiData = await get("privacy_policy/get"); // Specify the endpoint you want to call
    console.log("apixxsData")
    console.log(apiData)
    if (apiData?.error===true||apiData?.error==="true") {
      setLoader(false)
      toastAlert("error", apiData?.message)
    } else {
      setLoader(false)
      setPrivacyPolicyState(apiData?.data?.content)
    }
  }
  useEffect(() => {
    // defaultLoader 
    const items = JSON.parse(localStorage.getItem("@AdminCB"));
    if (items === '' || items === undefined || items === null) {
      window.location.href = '/login'
      setLoader(false)
      console.log("dffdf")
    } else {
      // window.location.href = '/home'
      setLoader(false)
      getPrivacyPolicy()


    }
  }
    , []);
  return (
    <div >

      {loader ? <Spinner color='#060502' style={{ position: 'absolute', top: '50%', left: '50%' }} /> :
        <Row >
          <Col  sm="12" md="12" lg="12">

<h4 style={{ fontSize: '36px', fontWeight: '500', padding: '10px' }}>Privacy Policy</h4>
</Col>
          <Col className="d-flex align-items-center "
            lg="12"
            sm="12">
            <div >
              <Editor
                onInit={(evt, editor) => {
                  editorRef.current = editor
                }
                }
                initialValue={PrivacyPolicyState}
                init={{
                  height: 400,
                  menubar: false,
                  toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                apiKey={PrimaryKey} />
            </div>
          </Col>
          <Col className="d-flex align-items-right justify-content-right"

            lg="12" 
            sm="12">
            <Button.Ripple

              className="m-1 "
              color="primary"
              onClick={async () => {
                setIsSubmitting(true)
               
                const postData = {
                  content: editorRef.current.getContent(),
                };
                const apiData = await post("privacy_policy/create_update_policy", postData); // Specify the endpoint you want to call
                console.log("apixxsData")
 
                console.log(apiData)
                if (apiData?.error===true||apiData?.error==="true") {
                  setIsSubmitting(false);
                   toastAlert("error", apiData?.message)
                } else {
                  setIsSubmitting(false);
                  toastAlert("success", apiData?.message)


                }
              }
              }
             >
          {isSubmitting ? <Spinner  color='#060502' size='sm' /> : null}
                    <span style={{color:'#060502'}}  className='align-middle ms-25'> Save</span>
             </Button.Ripple>
             </Col>

          {/* <Col
            className="d-flex align-items-center px-2 p-lg-5"
            lg="12"
            sm="12"
          > */}
          {/* <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="8">

            <h4 style={{ fontSize: '36px', fontWeight: '500', padding: '10px' }}>Privacy Policy</h4>
            <span style={{ color: "#00000099", fontSize: '20px', fontWeight: 400, lineHeight: '50px' }}>
              <span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>1. Introduction:</span><br />Welcome to Cue Ball, a live prediction gaming platform. This Privacy Policy outlines how we collect, use, and protect your personal information when you use the Cue Ball mobile application ("the App").
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>3. Use of Information:</span><br />Your information is used to provide and improve Cue Ball's services, such as processing payments, facilitating game participation, and enhancing user experience. Aggregated, anonymized data may be used for analytical and statistical purposes.


            </span>
          </Col>
          <Col sm="4" md="6" lg="4">
            <img src={privacyPolicy} alt="illustration" className="img-fluid" />



          </Col>
          <Col className="px-xl-2 mx-auto" sm="12" md="12" lg="12">
            <span style={{ color: "#00000099", fontSize: '20px', fontWeight: 400, lineHeight: '50px' }}> <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>2. Information We Collect:</span><br />We collect personal information, including names, email addresses, and payment details, when you create an account or participate in live prediction games. Additionally, device information, IP addresses, and usage data are collected for analytical purposes.
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>4. Payment Processing:</span><br />To process payments, we use third-party payment gateways, such as PayPal. Please review the privacy policies of these providers for information on their data handling practices.
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>5. Security:</span><br />We employ industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. While we strive for security, no method of transmission over the internet or electronic storage is entirely secure.
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>6. Third-Party Services:</span><br />Cue Ball may contain links to third-party websites or services. This Privacy Policy does not apply to those third-party services, so please review their respective privacy policies.
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>7. Cookies:</span><br />The App may use cookies or similar technologies to enhance user experience and gather information about usage patterns. Users can manage cookie preferences through their browser settings.
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>8. Data Retention:</span><br />Your data is retained as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>9. User Rights:</span><br />You have the right to access, correct, or delete your personal information. Requests can be submitted through <span>
                {email_contact_policy}</span>.
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>10. Children's Privacy:</span><br />Cue Ball is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us to have it removed.
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>11. Changes to the Privacy Policy:</span><br />Cue Ball reserves the right to update or modify this Privacy Policy at any time. Users will be notified of any changes.
              <br /><span style={{ fontSize: '30px', fontWeight: '500', lineHeight: '36px' }}>12. Contact Information:</span><br />For questions or concerns regarding this Privacy Policy, please contact
              <span style={{ color: 'red', marginLeft: '10px' }}>
                {email_cue_balls}       </span>.
              By using Cue Ball, you acknowledge that you have read, understood, and agreed to this Privacy Policy.
            </span></Col> */}
          {/* </Col> */}
        </Row>
      }

    </div>
  );
};

export default PrivacyPolicy;
