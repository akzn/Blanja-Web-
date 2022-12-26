import React, { Component } from "react";
import Navbar from "../components/Navbar";
import Carousell from "../components/Home/Carousell";
import Category from "../components/Home/Category";
import NewData from "../components/Home/New";
import Popular from "../components/Home/Popular";
import ReactMidtrans from "../module/react-midtrans/src/index";

export default class Home extends Component {
  render() {
    return (
      <>
        <Navbar />
        <Carousell />
        <ReactMidtrans clentKey={'your-ker'} token={'8116f5e7-8a8d-4214-b5cb-21b70d5caab1'}>
   <button> My Button For PayMe </button>
 </ReactMidtrans>
        <Category />
        <NewData />
        <Popular />
      </>
    );
  }
}
