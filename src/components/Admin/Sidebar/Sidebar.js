import React, { useState, useEffect } from "react";
import { Link,NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Accordion, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { API } from "../../../utility/Auth";
import {
  faPen,
  faAngleDown,
  faHome,
  faCube,
  faCog,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import "./style.css";

// useselector = state.auth.data

const Sidebar = () => {
  const [address, setAddress] = useState([]);
  const full_name = useSelector((state) => state.auth.data.full_name);
  //   console.log("ini fullname", full_name);
  const token = useSelector((state) => state.auth.data.token);

  return (
    <>
      <div className="container-sidebar">
        <div className="content-sidebar">
          <div className="d-flex justify-content-center pt-5">
            <div className="dp-profil">
              <img className="img-profil" alt="" />
            </div>
            <div className="ml-4">
              <p>{full_name}</p>
              <div className="d-flex margin-up">
                <div className="mr-1">
                  <FontAwesomeIcon icon={faPen} />
                </div>
                <p>Ubah Profile</p>
              </div>
            </div>
          </div>

          <div className="mt-5 ml-4">
            <div className="d-flex justify-content-between ml-3">
                <Accordion defaultActiveKey="0">
                    {/* Dashboard */}
                        <NavLink to={{ pathname: "/admin/dashboard/" }}>
                            <Card style={{ border: "none" }}>
                              <Card.Header style={{ backgroundColor: "white" }}>
                                  <Accordion.Toggle
                                      as={Button}
                                      variant="link"
                                      eventKey="0"
                                      className="d-flex justify-content-between"
                                  >
                                      <div
                                          className="icon mr-4"
                                          style={{
                                            backgroundColor: "#456BF3",
                                            marginLeft: "5px",
                                          }}
                                      >
                                        <FontAwesomeIcon
                                            icon={faHome}
                                            style={{ color: "white" }}
                                        />
                                      </div>
                                      <p className="mr-4 mt-1 text-black">Dashboard</p>
                                  </Accordion.Toggle>
                              </Card.Header>
                            </Card>
                        </NavLink>
                    {/* Products */}
                        <Card style={{ border: "none" }}>
                            <Card.Header style={{ backgroundColor: "white" }}>
                                <Accordion.Toggle
                                    as={Button}
                                    variant="link"
                                    eventKey="1"
                                    className="d-flex justify-content-between"
                                >
                                    <div
                                    className="icon mr-4"
                                    style={{
                                        backgroundColor: "#F36F45",
                                        marginLeft: "5px",
                                    }}
                                    >
                                    <FontAwesomeIcon
                                        icon={faCube}
                                        style={{ color: "white" }}
                                    />
                                    </div>
                                    <p className="mr-4 mt-1">Product</p>
                                    <FontAwesomeIcon className="mt-2" icon={faAngleDown} />
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Link to={{ pathname: "/admin/product-list/" }}>
                                    <Card.Body className="list-side">Items</Card.Body>
                                </Link>
                            </Accordion.Collapse>
                            <Accordion.Collapse eventKey="1">
                                <NavLink  to={{ pathname: "/admin/new-product/" }}>
                                    <Card.Body className="list-side">Add New</Card.Body>
                                </NavLink>
                            </Accordion.Collapse>
                        </Card>
                    {/* End Products */}
                    {/* Orders */}
                        <Card style={{ border: "none" }}>
                            <Card.Header style={{ backgroundColor: "white" }}>
                                <Accordion.Toggle
                                    as={Button}
                                    variant="link"
                                    eventKey="2"
                                    className="d-flex justify-content-between"
                                >
                                    <div
                                    className="icon mr-4"
                                    style={{
                                        backgroundColor: "#F36F45",
                                        marginLeft: "5px",
                                    }}
                                    >
                                    <FontAwesomeIcon
                                        icon={faShoppingBag}
                                        style={{ color: "white" }}
                                    />
                                    </div>
                                    <p className="mr-4 mt-1">Orders</p>
                                    <FontAwesomeIcon className="mt-2" icon={faAngleDown} />
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                                <Link to={{ pathname: "/admin/order-list/" }}>
                                    <Card.Body className="list-side">Order List</Card.Body>
                                </Link>
                            </Accordion.Collapse>
                        </Card>
                    {/* End Orders */}
                    {/* Setting */}
                        <Card style={{ border: "none" }}>
                            <Card.Header style={{ backgroundColor: "white" }}>
                                <Accordion.Toggle
                                    as={Button}
                                    variant="link"
                                    eventKey="3"
                                    className="d-flex justify-content-between"
                                >
                                    <div
                                    className="icon mr-4"
                                    style={{
                                        backgroundColor: "#F36F45",
                                        marginLeft: "5px",
                                    }}
                                    >
                                    <FontAwesomeIcon
                                        icon={faCog}
                                        style={{ color: "white" }}
                                    />
                                    </div>
                                    <p className="mr-4 mt-1">Settings</p>
                                    <FontAwesomeIcon className="mt-2" icon={faAngleDown} />
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                                <Link to={{ pathname: "/admin/shipping-address/" }}>
                                    <Card.Body className="list-side">Store Address</Card.Body>
                                </Link>
                            </Accordion.Collapse>
                        </Card>
                    {/* End Setting */}
                </Accordion>
            </div>
          </div>
        </div>
        <div className="container-btn d-flex justify-content-center mb-5">
          <Link to="/change">
            <button
              className="btn-primary"
              style={{ width: "170px" }}
              // onClick={(e) => handleSubmit(e)}
            >
              Change Password
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
