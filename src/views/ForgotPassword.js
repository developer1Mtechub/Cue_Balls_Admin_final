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
import { post } from "../apis/api";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/forgot-password-v2.svg";
import illustrationsDark from "@src/assets/images/pages/forgot-password-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { Formik, Form } from "formik";
import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";


const ForgotPassword = () => {
  // ** Hooks
  const { skin } = useSkin();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });
  const [loader,setLoader]=useState(true)
  useEffect(() => {
    // defaultLoader 
    const items = JSON.parse(localStorage.getItem("@AdminCB"));
    if (items === '' || items === undefined || items === null) {
      // window.location.href = '/login'
      setLoader(false)
      console.log("dffdf")
    } else {
      window.location.href = '/home'

    }
  }
    , []);
  return (
    <div className="auth-wrapper auth-cover">
       <div className="auth-background "
      />
      {loader?<Spinner color='#060502' style={{position:'absolute',top:'50%',left:'50%'}}/>:
       <Row className="auth-inner m-0 d-flex justify-content-center align-items-center">
      
       
       <Col
         className="d-flex align-items-center px-2 p-lg-5"
         lg="4"
         sm="12"
       >
         <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
         <CardTitle tag="h2" className="fw-bold mb-1" style={{textAlign: 'center' , fontSize: '33px', fontWeight: 600, lineHeight: '47px', color: 'white' }}>
             Forget Password
           </CardTitle>
           <CardText className="mb-4" style={{textAlign: 'center' ,fontSize:'18px',lineHeight:'23px',display:'flex',justifyContent:'center',color:'#FFFFFF',marginBottom:'20px'}}>
           Please enter the email address associated with your account below.
           </CardText>
           <Formik
             initialValues={{
               email: '',
             }}
             validationSchema={validationSchema}
             onSubmit={async (values, { setSubmitting }) => {
               setSubmitting(true);
               console.log(values);
               const postData = {
                 email: values.email,
               };
               const apiData = await post("user/forget_password_email", postData); // Specify the endpoint you want to call
               console.log("apixxsData")

               console.log(apiData)
               if (apiData?.error===true||apiData?.error==="true") {
                 setSubmitting(false);
                  toastAlert("error", apiData?.message)

                 // toastAlert("error", "No Images Selected")
               } else {
                 setSubmitting(false);
                //  set localstorage email for verification 
                localStorage.setItem('email_verification', JSON.stringify({  email: values.email }))
                localStorage.setItem('otp_verification', JSON.stringify({  otp: apiData.otp }))


                // localStorage.setItem("email_verification",values.email)
                // localStorage.setItem("otp_verification",apiData.otp)

                 window.location.href = '/verifyEmail'

                 toastAlert("success", "OTP sent to your email!")


               }
             }}
           >
             {({ getFieldProps, errors, touched, isSubmitting }) => (

               <Form
                 className="auth-forgot-password-form mt-2"
                 // onSubmit={(e) => e.preventDefault()}
               >
                 <div className="mb-1">
                   
                   <Input style={{
                    backgroundColor: '#353535',
                    border: '3px solid #A4A4A4',
                    color: '#A4A4A4'}}
                     className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}

                     {...getFieldProps('email')} type="email" id="register-email" placeholder="Email Address" />
                   {touched.email && errors.email ? (
                     <div className="invalid-feedback">{errors.email}</div>
                   ) : null}
                 </div>
                 {/* <Button.Ripple style={{marginTop:'50px',border:'6px solid #F5BC01',
                 // linerar gradient 
                 background: 'linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)'
                
               }} type="submit" color="primary" block disabled={isSubmitting}>
                   {isSubmitting ? <Spinner color='#060502' size='sm' /> : null}
                   <span style={{color:'#060502'}} className='align-middle ms-25'>Send Code</span>

                 </Button.Ripple> */}
                 <Button style={{ marginTop: '50px' ,
               border:'6px solid #F5BC01',
               // linerar gradient 
               background: 'linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)'}} type="submit" color="primary" block disabled={isSubmitting}>
                   {isSubmitting ? <Spinner  color='#060502' size='sm' /> : null}
                   <span style={{color:'#060502'}}  className='align-middle ms-25'> Send Code</span>
                 </Button>
               </Form>
             )}
           </Formik>
           <p className="text-center mt-2">
             <Link to="/login">
               <ChevronLeft className="rotate-rtl me-25" size={14} />
               <span className="align-middle">Back to login</span>
             </Link>
           </p>
         </Col>
       </Col>
     </Row>
      }
     
    </div>
  );
};

export default ForgotPassword;
