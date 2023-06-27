import React, { useState,useEffect } from "react";
// import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { Logo } from "../../../assets/style/index";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { authLoginCreator } from "../../../redux/actions/auth";
import "../../../assets/style/login.css";

const ViewLogin = ({ changeToRegister, changeToReset }) => {
    const history = useHistory();
  const dispatch = useDispatch();
  const msgInvalid = useSelector((state) => state.auth.msgInvalid);
  const userLevel = useSelector((state) => state.auth.data.level);
  // console.log("pesan : ", msgInvalid);

  const [role, setRole] = useState(2);

  let styleBtnCustomer = "btn-custommer";
  if (role === 2) {
    styleBtnCustomer = "btn-custommer-active";
  } else {
    styleBtnCustomer = "btn-custommer";
  }

  let styleBtnSeller = "btn-seller";
  if (role === 1) {
    styleBtnSeller = "btn-seller-active";
  } else {
    styleBtnSeller = "btn-seller";
  }

  const reviewSchema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  });

  const hideStyle = {
    display: 'none',
    important: 'true' // Custom property to simulate !important behavior
  };

  hideStyle.cssText = Object.entries(hideStyle)
    .map(([property, value]) => `${property}: ${value} !important;`)
    .join(' ');

    const handleSubmit = (values, { resetForm }) => {
        // Dispatch your authentication action here
        dispatch(authLoginCreator(values.email, values.password));
    
        // Assuming the login is successful, redirect to the dashboard
        if (!(msgInvalid.length) && userLevel == 2) {
          history.push('/admin/dashboard');
        }
    
        resetForm({ values: '' });
    };
      
  useEffect(() => {
    setRole(1)
  }, []);

  useEffect(() => {
    // Run this code whenever the msgInvalid state changes

    // Check if the msgInvalid state is invalid
    console.log('Invalid message:', msgInvalid);
    console.log('userlevel:', userLevel);
    // Assuming the login is successful, redirect to the dashboard
    if (!(msgInvalid.length) && userLevel == 2) {
        history.push('/admin/dashboard');
      }
  }, [msgInvalid,userLevel]); // Include msgInvalid as a dependency

  return (
    <>
      <section className="home-page">
        <div id="logo">
          <div className="logo-shop">
            <img src={Logo} alt="logo-shop" />
          </div>
          <div className="logo-text">
            <p className="tag-logo">Blanja</p>
          </div>
        </div>
        <h4 className="tag-h4">Administrator Login</h4>
        <div className="col-md-12 d-flex justify-content-center align-items-center mt-3" style={hideStyle}>
          <button
            type="button"
            className={styleBtnCustomer}
            onClick={() => setRole(2)}
          >
            Customer
          </button>
          <button
            type="button"
            className={styleBtnSeller}
            onClick={() => setRole(1)}
          >
            Seller
          </button>
        </div>
        {(msgInvalid.length || (userLevel != 2 && userLevel!=undefined)) ? (
          <div className="col-md-12 d-flex justify-content-center align-items-center mt-4">
            <p className="text-red">Wrong email or password</p>
          </div>
        ) : null}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={reviewSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <>
              <form action="" className="tag-form">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.email}
                />
                <p className="text-red">
                  {props.touched.email && props.errors.email}
                </p>
                <br />
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.password}
                />
                <p className="text-red">
                  {props.touched.password && props.errors.password}
                </p>
              </form>
              {/* <div className="forgot-password">
                <p className="text-forgot-password" onClick={changeToReset}>
                  Forgot password?
                </p>
              </div> */}
              <div className="button-primary">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={props.handleSubmit}
                  style={{
                    backgroundColor: "rgba(219, 48, 34, 1)",
                    border: "2px solid rgba(219, 48, 34, 1)",
                  }}
                >
                  Login
                </button>
              </div>
            </>
          )}
        </Formik>
      </section>
    </>
  );
};

export default ViewLogin;
