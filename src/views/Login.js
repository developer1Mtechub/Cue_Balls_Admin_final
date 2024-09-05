// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link } from "react-router-dom";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
import image from "@src/assets/images/pages/bg.jpg";


// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  // Form,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { post, put } from "../apis/api";
import toastAlert from "@components/toastAlert";

const Login = () => {
  const { skin } = useSkin();


  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("@AdminCB"));
    if (items === '' || items === undefined || items === null) {
      // window.location.href = '/login'
    } else {
      window.location.href = '/home'

    }



  }, []);
  return (<>




    <div className="auth-wrapper auth-cover">
      <div className="auth-background "
      />
      <Row className="auth-inner m-0 d-flex justify-content-center align-items-center">

        {/* <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col> */}
        <Col
          className="d-flex align-items-center  px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12" >
            <CardTitle tag="h2" className="fw-bold mb-1" style={{textAlign: 'center' , fontSize: '33px', fontWeight: 600, lineHeight: '47px', color: 'white' }}>
              Sign In to your Account
            </CardTitle>

            <Formik
              initialValues={{
                email: '',
                password: '',
                rememberMe: false,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                // Call your API here
                console.log(values);
                setSubmitting(true);
                const postData = {
                  email: values.email,
                  password: values.password
                };
                const apiData = await put("user/sign_in_admin", postData); // Specify the endpoint you want to call
                console.log("apixxsData")

                console.log(apiData)
                if (apiData.error===true||apiData.error==="true") {
                  toastAlert("error", apiData.message)
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

                  // toastAlert("error", "No Images Selected")
                } else {
                  setSubmitting(false);
                  // If "Remember Me" is checked, store the user's email in localStorage
                  // if (values.rememberMe) {
                  //   localStorage.setItem('userEmail', values.email);
                  //   localStorage.setItem('userPasword', values.password);

                  // }
                  localStorage.setItem('@AdminCB', JSON.stringify({ "token": apiData.data, user_type: apiData.user_type, password: values.password }))

                  window.location.href = "/";

                  // toastAlert("success", "You can Edit document ")


                }
              }}
            >
              {({ getFieldProps, errors, touched, isSubmitting }) => (

                <Form className="auth-login-form mt-2">
                  <div className="mb-1">
                    {/* <Label className="form-label" for="login-email">
                      Email
                    </Label> */}
                    <Input style={{
                      
                      backgroundColor: '#353535',
                      border: '3px solid #A4A4A4',
                      color: '#A4A4A4'
                    }}
                      className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                      {...getFieldProps('email')}
                      type="email"
                      id="login-email"
                      placeholder="Email Address"
                      autoFocus
                    />
                    {touched.email && errors.email ? (
                      <div className="invalid-feedback">{errors.email}</div>
                    ) : null}
                  </div>
                  <div className="mb-1">
                    <div className="d-flex justify-content-between">
                      {/* <Label className="form-label" for="login-password">
                        Password
                      </Label> */}

                    </div>
                    <InputPasswordToggle placeholder="Enter Password" style={{ backgroundColor: '#353535', border: '2px solid #353535' }}
                      className={`input-group-merge ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      {...getFieldProps('password')}
                      id="login-password"
                    />
                    {touched.password && errors.password ? (
                      <div className="invalid-feedback">{errors.password}</div>
                    ) : null}
                  </div>
                  <Link to="/forgot-password" style={{ display: 'flex', justifyContent: 'right' }}>
                    <small>Forgot Password?</small>
                  </Link>

                  <Button style={{ marginTop: '50px' ,
                border:'6px solid #F5BC01',
                // linerar gradient 
                background: 'linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)'}} type="submit" color="primary" block disabled={isSubmitting}>
                    {isSubmitting ? <Spinner  color='#060502' size='sm' /> : null}
                    <span style={{color:'#060502'}}  className='align-middle ms-25'> Sign in</span>
                  </Button>

                </Form>
              )}
            </Formik>



          </Col>
        </Col>
      </Row>
      {/* </div> */}
    </div>
  </>
  );
};

export default Login;
