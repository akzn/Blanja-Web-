import React, { useEffect, useState,useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useHistory } from "react-router-dom";
import Loader from "../assets/image/loader.gif";
import axios from "axios";
import { useSelector } from "react-redux";
import { API } from "../utility/Auth";
import ReactMidtrans from "../module/react-midtrans/src/index";
import LoadingOverlay from 'react-loading-overlay';
import { Bounce, toast } from "react-toastify";

const getUrl = process.env.REACT_APP_URL;

const OrderDetail = (props) => {
    var order_id = props.location.state.id
    const [order, setOrder] = useState([]);
    const [orderDetail, setOrderDetail] = useState([]);
    const [midtransData, setMidtransData] = useState({});
    const [requestMidtransTrx, setRequestMidtransTrx] = useState(props.location.state.requestMidtransTrx ? props.location.state.requestMidtransTrx : false);
    const [requestMidtransSnap, setRequestMidtransSnap] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const token = useSelector((state) => state.auth.data.token);

    // // autoreq midtrans if prop requestMidtransTrx true from checkout page
    // console.log('requestMidtransTrx',props.location.state.requestMidtransTrx)
    // if (props.location.state.requestMidtransTrx) {
    //     setRequestMidtransTrx(props.location.state.requestMidtransTrx)   
    // }
    
    // ref to midtrans button
    const paymentBtnRef= useRef(null);
    const [refMidtransVisible, setRefMidtransVisible] = useState(false)

    //ref to req midtrans token button
    const reqTokenBtnRef= useRef(null);
    const [reqTokenBtnRefVisible, setReqTokenBtnRefVisible] = useState(false)

    const getOrderItem = () => {
        axios
        .get(`${getUrl}/orders/${order_id}`, {
            headers: {
                "x-access-token": "Bearer " + token,
            },
        })
        .then(({ data }) => {
            const order = data.data;
            console.log('order:',data.data)
            console.log("order-detail", data.data.order_detail);

            if (data.data.midtrans_token != null) {
                // set midtrans toke to snap if order already has token
                let tempMidtransData =  {
                    'token' : data.data.midtrans_token
                }
    
                console.log('tokenm:',tempMidtransData)
                setMidtransData(tempMidtransData)
                setReqTokenBtnRefVisible(false)
            }

            setOrder(order);
            setOrderDetail(order.order_detail)
        })
        .catch((err) => {
            console.log("error", err);
        });
    };

    const requestMidtransToken = async () => {
        setIsLoading(true)
        setReqTokenBtnRefVisible(false)
        await axios
        .get(`${getUrl}/payment/midtrans/token/${order_id}`, {
            headers: {
                "x-access-token": "Bearer " + token,
            },
        })
        .then( ({ data }) => {
            console.log(data.data)
            setMidtransData(data.data)
            
        })
        .catch((err,es) => {
            let message
            console.log("error", err);
            if (err.response) {
                console.log(err.response.data.message)
                message = err.response.data.message
            } else {
                console.log('API error')
                message = "Network error while trying to connet to API"
            }
            // let emessage = json.stringify(err)
            toast.error('Error occured while trying to connect to payment gateway. Please try again', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              transition: Bounce,
            });
        })
        .finally(() => {
            // setIsLoading(false)
        });
        // setIsLoading(false)

    }

    const midtransCallBackDataHandle = async (data) => {
        // update order with midtrans data
        console.log('data',data)
        if (data.status_code) {
            let formData = {
                'order_id' : order_id,
                'data' : {
                    // transaction_id:data.transaction_id,
                    payment_type:data.payment_type,
                    transaction_status:data.transaction_status,
                    status_code:data.status_code
                }
            }
            setIsLoading(true)
            await axios
            .patch(`${getUrl}/payment/midtrans`, formData, {
                headers: {
                    "x-access-token": "Bearer " + token,
                },
            })
            .then( ({ data }) => {
                console.log('patch data:',data)
                // setMidtransData(data.data)
            })
            .catch((err,es) => {
                let message
                console.log("error", err);
                if (err.response) {
                    console.log(err.response.data.message)
                    message = err.response.data.message
                } else {
                    console.log('API error')
                    message = "Network error while trying to connet to API"
                }
                // let emessage = json.stringify(err)
            })
            .finally(() => {
                setIsLoading(false)
                window.location.reload(false);
            });
            setIsLoading(false)
        } else {
            
        }
     }
    
    useEffect(() => {
        getOrderItem()
    }, []);

    useEffect(() => {
        if (requestMidtransTrx && reqTokenBtnRefVisible && Object.keys(midtransData).length==0 && Object.keys(order).length>0) {
            console.log('hit req :')
            setIsLoading(true)
            setTimeout(() => {
                setRequestMidtransTrx(false)
                setRequestMidtransSnap(true)
                reqTokenBtnRef.current.click()
            }, 2000);
        }
    }, [reqTokenBtnRefVisible,midtransData,order]);

    useEffect( () => {
        
        // handle autoclick midtrans snap
        if (refMidtransVisible && Object.keys(midtransData).length>0 && requestMidtransSnap) { 
            setIsLoading(true)
            setTimeout(() => {
                paymentBtnRef.current.click()
                setIsLoading(false)
                setRequestMidtransSnap(false)
            }, 2000);

          }
        
    }, [refMidtransVisible,requestMidtransSnap]);

    return (
        <LoadingOverlay
                active={isLoading}
                spinner
                text='Trying to connect to Payment Gateway...'
                >
        <div>
            <Navbar />
            <div className="container">
                <div style={{display: 'flex'}}>
                    <div style={{padding:10}}>
                        <h1 style={{ fontSize: "34px", fontWeight: "700", marginBottom: "15px" }}>
                            Order Detail 
                        </h1>
                    </div>
                    <div className="text-center ">
                        {/* | ID : {order.transaction_code} */}
                    </div>
                </div>                
                <div className="row">
                    <div className="col-sm-12">
                        <table className="table table-bordered">
                            <tr>
                                <td style={{color:'gray'}}>Order ID : </td>
                                <td className="" style={{padding:10, textTransform:"uppercase"}}>{order.transaction_code}</td>
                            </tr>
                            <tr>
                                <td style={{color:'gray'}}>Payment : </td>
                                <td className={order.status_code=='200' ? "text-info" : 'text-danger'} style={{padding:10, textTransform:"uppercase"}}>{order.transaction_status ? order.transaction_status : 'waiting for payment' }</td>
                            </tr>
                            <tr>
                                <td style={{color:'gray'}}>Shipping : </td>
                                <td className="" style={{padding:10, textTransform:"uppercase"}}>{order.status_order}</td>
                            </tr>
                            <tr>
                                <td style={{color:'gray'}}>Address : </td>
                                <td className="" style={{padding:10, textTransform:"uppercase"}}>{order.address}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <h2>Items</h2>
                        {
                            orderDetail.map(({product_id,product_name,brand,product_photo,price,qty,sub_total_item})=>{
                                let photo = JSON.parse(product_photo)
                                return (
                                    <div
                                      className="col prodct d-flex justify-content-between"
                                      key={product_id}
                                      style={{ padding: "10px", marginBottom: "20px" }}
                                    >
                                      <div className="col-2 img-chart">
                                        <img
                                          style={{ height: "70px" }}
                                          src={API + photo[0]}
                                          alt=""
                                        />
                                      </div>
                                      <div className="col-7">
                                        <p className="name-prodct">{product_name}</p>
                                        <p className="brand-product text-muted">{brand}</p>
                                      </div>
                                      <div className="col-3">
                                        <p className="prc">{`Rp. ${(
                                          sub_total_item
                                        ).toLocaleString("id-ID")}`}</p>
                                      </div>
                                      {/* </div> */}
                                    </div>
                                  );
                            })
                        }
                        <div className="row" style={{ padding: "10px", marginBottom: "20px" }}>
                            <div className="col-2 text-right"></div>
                            <div className="col-7 text-right vertical-align">Total Amount :</div>
                            <div className="col-3 vertical-align" style={{color:'#db3022',fontSize:20,fontWeight:'bold'}}>
                                {order.total ? `Rp. ${(
                                          order.total
                                        ).toLocaleString("id-ID")}` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{marginBottom:50}}>
                    { Object.keys(midtransData).length>0 ? 
                    (
                        <>
                            {order.status_code != '200' ? (
                            <ReactMidtrans clientKey={'your-ker'} token={midtransData.token} callBack={midtransCallBackDataHandle}>
                                <button className="btn-buy" ref={el => { paymentBtnRef.current = el; setRefMidtransVisible(!!el); }} onClick={() => setIsLoading(true)}> <p className="text-buy">Payment</p> </button>
                            </ReactMidtrans>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <button className="btn-buy" ref={el => { reqTokenBtnRef.current = el; setReqTokenBtnRefVisible(!!el)}} onClick={() => requestMidtransToken()}> <p className="text-buy">Choose Payment</p></button>
                        </>
                    )}
                </div>
            </div>
        </div>
            </LoadingOverlay>
        
    )
}

export default OrderDetail;
