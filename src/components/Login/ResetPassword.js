import React, { useState } from "react";
import { Logo } from "../../assets/style/index";
import { Formik } from "formik";
import * as yup from "yup";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import "../../assets/style/login.css";
import { API } from "../../utility/Auth";
import { BrandMedium } from "../Brand";

const ResetPassword = ({ changeToRegister }) => {
  const [isreset, setIsReset] = useState(false);

  const sendEmail = (email) => {
    const api = `${API}/auth/forgot`;
    Axios.post(api, { email: email })
      .then((data) => {
        setIsReset(true);
      })
      .catch((err) => console.log(err));
  };

  const reviewSchema = yup.object({
    email: yup.string().required().email(),
  });

  if (isreset === true) {
    return <Redirect to="/otp" />;
  }
  return (
    <div className="d-flex justify-content-center align-items-center container-auth">
      <form>
        <div className="content">
          <div id="logo" style={{ justifyContent: "center" }}>
            <BrandMedium/>
          </div>
          <div className="col-md-12 text-center mt-3">
            <p className="font-weight-bold">Reset password</p>
          </div>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={reviewSchema}
            onSubmit={(values, { resetForm }) => {
              sendEmail(values.email);
              resetForm({ values: "" });
              //   Redirect.push("/otp")
            }}
          >
            {(props) => (
              <>
                <div className="col-md-12 d-flex justify-content-center align-items-center mt-4">
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Email"
                    name="email"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.email}
                  />
                </div>
                <div className="col-md-12 d-flex justify-content-center align-items-center">
                  <p className="text-red">
                    {props.touched.email && props.errors.email}
                  </p>
                </div>
                <div className="col-md-12 d-flex justify-content-center align-items-center mt-5">
                  <button
                    type="button"
                    className="btn-submit"
                    onClick={props.handleSubmit}
                    // onClick={() => { props.handleSubmit(); changeToOtp()}}
                  >
                    Send email
                  </button>
                </div>
              </>
            )}
          </Formik>

          <div className="col-md-12 d-flex justify-content-center align-items-center mt-3">
            <p>
              Don't have a Blanja account?{" "}
              <span className="text-red" onClick={changeToRegister}>
                Register
              </span>
            </p>
          </div>
        </div>
      </form>
      {/* <Modal show={show} handleShow={handleShow} handleClose={handleClose} /> */}
    </div>
  );
};
export default ResetPassword;

// export default class ResetPassword extends Component {
//     render() {
//         return (
//             <div>
//                 <section className="home-page">
//                     <div id="logo">
//                         <div className="logo-shop">
//                             <img src={Logo} alt="logo-shop"/>
//                         </div>
//                         <div className="logo-text">
//                             <p className="tag-logo">Blanja</p>
//                         </div>
//                     </div>
//                     <h4 className="tag-h4">Reset Password</h4>
//                     <form action="" className="tag-form">
//                         <input type="email" name="email" id="email" placeholder="Email"/>
//                     </form>
//                     <div className="button-primary">
//                         <button type="button" class="btn-primary" style={{backgroundColor: 'rgba(219, 48, 34, 1)', border: '2px solid rgba(219, 48, 34, 1)'}}><a href="konfirmasi" style={{textDecoration:'none'}}>Primary</a></button>
//                     </div>
//                     <Link to="/register">
//                     <p className="text-register">Don't have a Tokopedia account? Register</p>
//                     </Link>
//                 </section>
//             </div>
//         )
//     }
// }
