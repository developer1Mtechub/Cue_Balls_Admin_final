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
import { post, put } from "../apis/api";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/forgot-password-v2.svg";
import illustrationsDark from "@src/assets/images/pages/forgot-password-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { Formik, Form } from "formik";
import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";


const ResetPassword = () => {
  // ** Hooks
  const { skin } = useSkin();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const validationSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
  });
  const [loader,setLoader]=useState(true)
  const [email,setEmail]=useState('')
  useEffect(() => {
    // defaultLoader 
    const items = JSON.parse(localStorage.getItem("email_verification"));
    if (items === '' || items === undefined || items === null) {
      window.location.href = '/login'
      setLoader(false)
      console.log("dffdf")
    } else {
      // window.location.href = '/home'
      setLoader(false)
      setEmail(items.email)

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
             Reset Password
           </CardTitle>
           <CardText className="mb-4" style={{textAlign: 'center' ,fontSize:'18px',lineHeight:'23px',display:'flex',justifyContent:'center',color:'#FFFFFF',marginBottom:'20px'}}>
           Enter your new password below. Make sure it's something secure and memorable.
           </CardText>
           <Formik
             initialValues={{
               password: '',
                confirmPassword: '',
             }}
             validationSchema={validationSchema}
             onSubmit={async (values, { setSubmitting }) => {
               setSubmitting(true);
               console.log(values);
               const postData = {
                 email: email,
                 password: values.password,

               };
               const apiData = await put("user/reset_password_admin", postData); // Specify the endpoint you want to call
               console.log("apixxsData")

               console.log(apiData)
               if (apiData?.error===true||apiData?.error==="true") {
                 setSubmitting(false);
                  toastAlert("error", apiData?.message)

                 // toastAlert("error", "No Images Selected")
               } else {
                 setSubmitting(false);
                 toastAlert("success", "Password Reset Successfully!")

                //  set localstorage email for verification 
               localStorage.removeItem("email_verification")
              //  timer for delay of 1 second 
                
                setTimeout(() => {

                 window.location.href = '/login'
                }
                  , 1000);

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
                     className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}

                     {...getFieldProps('password')} type="password" id="register-password" placeholder="Password" />
                   {touched.password && errors.password ? (
                     <div className="invalid-feedback">{errors.password}</div>
                   ) : null}
                 </div>
                  <div className="mb-1">

                    <Input style={{
                      backgroundColor: '#353535',
                      border: '3px solid #A4A4A4',
                      color: '#A4A4A4'
                    }}
                      className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                      {...getFieldProps('confirmPassword')} type="password" id="register-confirm-password" placeholder="Confirm Password" />
                    {touched.confirmPassword && errors.confirmPassword ? (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
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
                   <span style={{color:'#060502'}}  className='align-middle ms-25'> Reset Password</span>
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

export default ResetPassword;
