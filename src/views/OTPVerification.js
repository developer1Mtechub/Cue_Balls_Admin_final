// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Button, Input, Spinner } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
// import { Formik,Form } from 'formik'
// import * as Yup from 'yup';
import toastAlert from "@components/toastAlert";
import { useEffect, useState } from 'react'
import { post } from '../apis/api'



const TwoStepsCover = () => {
  // ** Hooks
  
  const { skin } = useSkin()
 const [email,setEmail]=useState('')
 const [loaderResend,setLoaderResend]=useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSaved, setOTPSaved] = useState(''); // This is just to simulate a successful API call
  const [inputs, setInputs] = useState(Array(6).fill('')); // Initialize state with 6 empty strings
  const handleChange = (position) => (e) => {
    const value = e.target.value;
    setInputs([...inputs.slice(0, position), value, ...inputs.slice(position + 1)]);
  
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = inputs.join('');
    console.log(otp);
    setIsSubmitting(true)
    if (otp === otpSaved) {
      setIsSubmitting(false)
      toastAlert("success", "OTP Verified Successfully")
      localStorage.removeItem("otp_verification");
      setTimeout(() => {

        window.location.href = '/reset-password'
       }
         , 1000);
     
    } else {
      setIsSubmitting(false)
      toastAlert("error", "OTP is not correct")
    }

    // Call your API here with the otp value
  };
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("email_verification"));
    console.log(items)
    if (items === '' || items === undefined || items === null) {
      window.location.href = '/forgot-password'
    } else {
      // window.location.href = '/home'
      setEmail(items.email)
    const otp = JSON.parse(localStorage.getItem("otp_verification"));

      setOTPSaved(otp.otp)

    }
  }, []);
  return (
    <div className='auth-wrapper auth-cover'>
       <div className="auth-background "
      />
      <Row className='auth-inner m-0 d-flex justify-content-center align-items-center'>
       
        {/* <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col> */}
        <Col className='d-flex align-items-center  px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bolder mb-1' style={{textAlign: 'center' , fontSize: '33px', fontWeight: 600, lineHeight: '47px', color: 'white' }}>
               Verification 
            </CardTitle>
            <CardText className='mb-75' style={{textAlign: 'center' ,fontSize:'18px',lineHeight:'23px',display:'flex',justifyContent:'center',color:'#FFFFFF',marginBottom:'20px'}}>
            We've sent a verification code to the email address associated with your account.
            </CardText>
            {/* <Formik
              initialValues={{
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                console.log(values);
                const postData = {
                  email: email,
                  // otp:
                  
                };
                const apiData = await post("user/verification_otp", postData); // Specify the endpoint you want to call
                console.log("apixxsData")

                console.log(apiData)
                if (apiData?.error) {
                  setSubmitting(false);

                  toastAlert("error", apiData.message)
                } else {
                  setSubmitting(false);
                  // window.location.href = '/verifyEmail'

                  // toastAlert("success", "You can Edit document ")


                }
              }}
            >
              {({ getFieldProps, errors, touched, isSubmitting }) => ( */}
            <form className='mt-4 mb-4'  onSubmit={handleSubmit}
            >
              <div className='auth-input-wrapper d-flex align-items-center justify-content-between'>
              {inputs.map((value, index) => (
          <Input
            key={index}
            style={{
              backgroundColor: '#353535',
              border: '3px solid #A4A4A4',
              color: '#A4A4A4'
            }}
            autoFocus={index === 0}
            maxLength='1'
            className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
            value={value}
            onChange={handleChange(index)}
          />
        ))}
                {/* <Input style={{
                     backgroundColor: '#353535',
                     border: '3px solid #A4A4A4',
                     color: '#A4A4A4'}} autoFocus maxLength='1' className='auth-input height-50 text-center numeral-mask mx-25 mb-1' />
                <Input style={{
                     backgroundColor: '#353535',
                     border: '3px solid #A4A4A4',
                     color: '#A4A4A4'}} maxLength='1' className='auth-input height-50 text-center numeral-mask mx-25 mb-1' />
                <Input style={{
                     backgroundColor: '#353535',
                     border: '3px solid #A4A4A4',
                     color: '#A4A4A4'}} maxLength='1' className='auth-input height-50 text-center numeral-mask mx-25 mb-1' />
                <Input style={{
                     backgroundColor: '#353535',
                     border: '3px solid #A4A4A4',
                     color: '#A4A4A4'}} maxLength='1' className='auth-input height-50 text-center numeral-mask mx-25 mb-1' />
                <Input style={{
                     backgroundColor: '#353535',
                     border: '3px solid #A4A4A4',
                     color: '#A4A4A4'}} maxLength='1' className='auth-input height-50 text-center numeral-mask mx-25 mb-1' />
                <Input style={{
                     backgroundColor: '#353535',
                     border: '3px solid #A4A4A4',
                     color: '#A4A4A4'}} maxLength='1' className='auth-input height-50 text-center numeral-mask mx-25 mb-1' /> */}
              </div>
              <Button style={{ marginTop: '50px' ,
                border:'6px solid #F5BC01',
                // linerar gradient 
                background: 'linear-gradient(90deg, #FFE064 0%,#FFEA96 100%)'}} type="submit" color="primary" block disabled={isSubmitting}>
                    {isSubmitting ? <Spinner  color='#060502'  /> : null}
                    <span style={{color:'#060502'}}  className='align-middle ms-25'>Verify</span>
                  </Button>
            </form>
                {/* )}
                </Formik> */}
        
            <p className='text-center mt-2' style={{color:'#FFFFFF'}} >
              <span>Didn’t get the code?</span>{' '}
               <span onClick={async()=>{
                setLoaderResend(true)
                 const postData = {
                  email: email,
                };
                const apiData = await post("user/forget_password_email", postData); // Specify the endpoint you want to call
                console.log("apixxsData")
 
                console.log(apiData)
                if (apiData?.error===true||apiData?.error==="true") {
                   toastAlert("error", apiData?.message)
                   setLoaderResend(false)
 
                  // toastAlert("error", "No Images Selected")
                } else {
                 //  set localstorage email for verification 
                 localStorage.setItem('otp_verification', JSON.stringify({  otp: apiData.otp }))
                  setOTPSaved(apiData.otp)
                 setLoaderResend(false)
 
                 // localStorage.setItem("email_verification",values.email)
                 // localStorage.setItem("otp_verification",apiData.otp)
 
 
                  toastAlert("success", "OTP Resent to your email!")
 
 
                }
               }} style={{color:'#FFE064',cursor:'pointer'}}>Resend
               {loaderResend?<Spinner style={{marginLeft:'10px'}} color='#FFE064' size='sm' />:
               null}
                </span> 
             {' '}
            
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default TwoStepsCover
