import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Home";
import Product from "./Product";
import Mybag from "./Mybag";
import Checkout from "./Checkout";
import SortCategory from "./SortCategory";
import AddProduct from "../components/MyProfile/AddProduct";
import Update from "./Update";
import MyProfile from "./MyProfile";
import Filter from "./Filter";
import Search from "./Search";
import GetProduct from "../components/MyProfile/GetProduct";
import PrivateRouter from "../components/Privaterouter";
import RoutePrivate from "../components/RoutePrivate";
import EditProduct from "../components/MyProfile/EditProduct";
import GetOrder from "../components/MyProfile/GetOrder";
import ChangePassword from "../components/MyProfile/ChangePassword";
import ShippingAddress from "../components/MyProfile/ShippingAddress";
// ADMIN PAGE
import PrivateRouterAdmin from "../components/PrivateRouterAdmin";
import AdminLogin from "./admin/login/ViewLogin";
import AdminDashboard from "./admin/Dashboard";
import AdminFormAddProduct from "./admin/product/FormAddProduct";
import AdminProductList from "./admin/product/ViewProductList";
import AdminFormProductEdit from "./admin/product/FormProductEdit";
import AdminOrderList from "./admin/order/ViewOrderList";
import AdminOrderDetail from "./admin/order/ViewOrderDetail";
import AdminShippingAddress from "./admin/setting/ViewShippingAddress";

// Login Page
// import Login from "../components/";
import Register from "../components/Login/Register";
// import KonfirmasiPassword from "../components/Login/KonfirmasiPassword";
// import ResetPassword from "../components/Login/ResetPassword";
import OtpConfrim from "../components/Login/OtpConfrim";
import KonfirmasiPassword from "../components/Login/KonfirmasiPassword";
import Auth from "./Auth";
import Chat from "../components/Chat/Chat";

import OrderDetail from "./OrderDetail";
// midtrans
import {MidtransFinishRedirect} from "./Midtrans"

export default function Router() {
  return (
    <BrowserRouter>
     <Route path="/" exact component={Home} />
      <RoutePrivate path="/products/:id" component={Product} />
      <PrivateRouter path="/mybag" component={Mybag} />
      <PrivateRouter path="/checkout" component={Checkout} />
      <PrivateRouter path="/profile" component={MyProfile} />
      <PrivateRouter path="/inputProduct" component={AddProduct} />
      <PrivateRouter path="/edit/:id" component={EditProduct} />
      <PrivateRouter path="/myproduct" component={GetProduct} />
      <PrivateRouter path="/shippingAddress" component={ShippingAddress} />
      <PrivateRouter path="/myorder" component={GetOrder} />
      <PrivateRouter path="/order-detail" component={OrderDetail} />
      <PrivateRouter path="/update" component={Update} />
      <PrivateRouter path="/chat" component={Chat} />
      <PrivateRouter path="/midtrans-finish-redirect" component={MidtransFinishRedirect} />
      <Route path="/category/:id_categories" component={SortCategory} />
      <Route path="/search" component={Search} />
      <Route path="/filter" component={Filter} />
      <Route path="/login" component={Auth} />
      <Route path="/otp" component={OtpConfrim} />
      <Route path="/confrim" component={KonfirmasiPassword} />
      <Route path="/register" component={Register} />
      <Route path="/change" component={ChangePassword} />

      {/* ADMIN PAGE */}
      <PrivateRouterAdmin exact path="/admin" component={AdminDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <PrivateRouterAdmin path="/admin/dashboard" component={AdminDashboard} />
      <PrivateRouterAdmin path="/admin/new-product" component={AdminFormAddProduct} />
      <PrivateRouterAdmin path="/admin/product-list" component={AdminProductList} />
      <PrivateRouterAdmin path="/admin/edit-product" component={AdminFormProductEdit} />
      <PrivateRouterAdmin path="/admin/order-list" component={AdminOrderList} />
      <PrivateRouterAdmin path="/admin/order-detail/:transaction_code" component={AdminOrderDetail} />
      <PrivateRouterAdmin path="/admin/shipping-address" component={AdminShippingAddress} />

    </BrowserRouter>
  );
}
