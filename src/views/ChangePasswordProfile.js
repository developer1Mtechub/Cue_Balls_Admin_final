import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Input,
  Button,
  Spinner,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { useEffect, useState } from 'react'

import { ChevronDown } from 'react-feather'
import toastAlert from "@components/toastAlert";
import { get, post, put } from "../apis/api";
import { Formik,Form } from "formik";
import * as Yup from 'yup';


const ChangePasswordProfile = (props) => {
  const [email, setEmail] = useState('')
  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required('Old Password is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
  });

 

  useEffect(() => {
    // getAllDashboard();
    // get localstorage 3email 
    const items = JSON.parse(localStorage.getItem("@AdminCB"));
    if (items === '' || items === undefined || items === null) {
      window.location.href = '/login'
    } else {
      // window.location.href = '/home'
      setEmail(items?.token?.email)

    }

   
  }, [])

  return (
    <div>

      <Row className='match-height'>
      <Col lg='4' md='4' xs='12'>
      </Col>
        <Col lg='4' md='4' xs='12'>
          <Card>
            <CardHeader >
              <CardTitle tag='h4'>Change Password</CardTitle>
              
            </CardHeader>

            <CardBody>
              <Row>
                <Col lg='12' md='12' xs='12'>
                <Formik
             initialValues={{
              old_password:'',
               password: '',
                confirmPassword: '',
             }}
             validationSchema={validationSchema}
             onSubmit={async (values, { setSubmitting }) => {
               setSubmitting(true);
               console.log(values);
               const postData = {
                 email: email,
                 old_password: values.old_password,
                 new_password: values.password,

               };
               const apiData = await put("user/reset_password_admin_profile", postData); // Specify the endpoint you want to call
               console.log("apixxsData")

               console.log(apiData)
               if (apiData?.error===true||apiData?.error==="true") {
                 setSubmitting(false);
                  toastAlert("error", apiData?.message)

                 // toastAlert("error", "No Images Selected")
               } else {
                 setSubmitting(false);
                 toastAlert("success", "Password Reset Successfully!")


               }
             }}
           >
             {({ getFieldProps, errors, touched, isSubmitting }) => (

               <Form
                 className="auth-forgot-password-form mt-2"
                 // onSubmit={(e) => e.preventDefault()}
               >
                <div className="mb-1">
                    
                    <Input
                      className={`form-control ${touched.old_password && errors.old_password ? 'is-invalid' : ''}`}
  
                      {...getFieldProps('old_password')} type="password" id="register-password1" placeholder="Old Password" />
                    {touched.old_password && errors.old_password ? (
                      <div className="invalid-feedback">{errors.old_password}</div>
                    ) : null}
                </div>
                 <div className="mb-1">
                   
                   <Input 
                     className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}

                     {...getFieldProps('password')} type="password" id="register-password2" placeholder="New Password" />
                   {touched.password && errors.password ? (
                     <div className="invalid-feedback">{errors.password}</div>
                   ) : null}
                 </div>
                  <div className="mb-1">

                    <Input
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
                </Col>
                
              </Row>


            </CardBody>
          </Card>
        </Col>
       

      </Row>
      {/* Change Status Modal  */}

    

    </div>
  );
};

export default ChangePasswordProfile;
