import React, { useEffect, useState,useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import Loader from "../assets/image/loader.gif";
import axios from "axios";
import { useSelector } from "react-redux";
import { API } from "../utility/Auth";
import ReactMidtrans from "../module/react-midtrans/src/index";
import LoadingOverlay from 'react-loading-overlay';
import { Bounce, toast } from "react-toastify";
import { getMidtransStatus, PaymentStatusLabel } from "../helpers/Utils";

const getUrl = process.env.REACT_APP_URL;

const OrderDetail = (props) => {
    // var order_id = props.location.state.id
    var order_id = props.location.state?.id || null;
    var transaction_code = null;
    const [order, setOrder] = useState([]);
    const [orderDetail, setOrderDetail] = useState([]);
    const [midtransData, setMidtransData] = useState({});
    const [requestMidtransTrx, setRequestMidtransTrx] = useState(props.location.state?.requestMidtransTrx ? props.location.state.requestMidtransTrx : false);
    const [requestMidtransSnap, setRequestMidtransSnap] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const token = useSelector((state) => state.auth.data.token);

    // DUmmy
    const [orderDummy, setOrderDummy] = useState({
        shipment: {
          carrier: 'Dummy Carrier',
          trackingNumber: '1234567890',
          status: 'Pending',
          receiver: 'Dummy Receiver',
          address: 'Dummy Address',
        },
      });

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
        console.log('order_id',order_id)
        axios
        .get(`${getUrl}/orders/${order_id}`, {
            headers: {
                "x-access-token": "Bearer " + token,
            },
        })
        .then(({ data }) => {
            const order = data.data;
            if (data.data.id === undefined || data.data.id === null) {
                alert('undef')
            }
            console.log('order:',data)
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

    const getOrderItemByCode = () => {
        axios
        .get(`${getUrl}/orders/transaction-code/${transaction_code}`, {
            headers: {
                "x-access-token": "Bearer " + token,
            },
        })
        .then(({ data }) => {
            order_id = data.data?.id || null;
            const order = data.data;

            if (order_id === undefined || order_id === null) {
                props.history.push('/myorder/');
            }

            console.log('order:',data)
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
        console.log('snapCallback',data)
        if(data === 'close'){
            const interval = setInterval(() => {
                setIsLoading(false);
              }, 3000);
          
              return () => {
                clearInterval(interval);
              };
        }
        if (data.status_code) {
            // let formData = {
            //     'order_id' : order_id,
            //     'data' : {
            //         // transaction_id:data.transaction_id,
            //         payment_type:data.payment_type,
            //         transaction_status:data.transaction_status,
            //         status_code:data.status_code
            //     }
            // }
            // setIsLoading(true)
            // await axios
            // .patch(`${getUrl}/payment/midtrans`, formData, {
            //     headers: {
            //         "x-access-token": "Bearer " + token,
            //     },
            // })
            // .then( ({ data }) => {
            //     console.log('patch data:',data)
            //     // setMidtransData(data.data)
            // })
            // .catch((err,es) => {
            //     let message
            //     console.log("error", err);
            //     if (err.response) {
            //         console.log(err.response.data.message)
            //         message = err.response.data.message
            //     } else {
            //         console.log('API error')
            //         message = "Network error while trying to connet to API"
            //     }
            //     // let emessage = json.stringify(err)
            // })
            // .finally(() => {
            //     setIsLoading(false)
            //     window.location.reload(false);
            // });
            // setIsLoading(false)
            await getMidtransStatus(order.transaction_code,token)
            window.location.reload();
        } else {
            alert('Order Data not found')
        }
     }
    
    useEffect(() => {
        if (order_id==null || order_id == undefined ) {
            const uri = window.location.href;
            const params = uri.split('/'); // Split the URI by '/'
            const segment = params[4]; // Get the desired segment (index 2)

            // Check if the segment contains only numeric characters
            const isNumeric = /^\d+$/.test(segment);
            // console.log('segment',uri);
            if (isNumeric) {
                console.log('segment',segment); // Output: 12345
                transaction_code = segment
            }
            getOrderItemByCode()
        } else {
            getOrderItem()
        }
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

    // if (isLoading === true) {
    //     return(
    //       <LoadingOverlay
    //           active={isLoading}
    //           spinner
    //           text={'processing...'}
    //       >
              
    //           {/* <Navbar /> */}
                  
              
    //       </LoadingOverlay>
    //   )
    //   }

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
                                <td className={order.status_code=='200' ? "text-info" : 'text-danger'} style={{padding:10, textTransform:"uppercase"}}>{order.transaction_status ? PaymentStatusLabel(order.transaction_status) : 'waiting for payment' }</td>
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
                <Card style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <Card.Body>
                    <h6 style={{ marginBottom: '10px' }}><strong>Payment Details</strong></h6>
                    <hr />
                    {order ? (
                    <div>
                        <Row>
                            <Col className="mb-1">
                            <div className="mb-1"><strong>Transaction ID:</strong> {order.transaction_id ? order.transaction_id : 'Undefined' }</div>
                            <div className="mb-1"><strong>Channel Type:</strong> {order.payment_type ? order.payment_type.toUpperCase() : 'undefined' }</div>
                            <div className="mb-1"><strong>Channel Name:</strong> {order.channel_name ? order.channel_name.toUpperCase() : 'Undefined' }</div>
                            </Col>
                            <Col className="mb-1">
                            <div className="mb-1"><strong>Payment Status:</strong> {order.transaction_status ? PaymentStatusLabel(order.transaction_status) : 'Waiting for Payment' }</div>
                            <div className="mb-1"><strong>Amount:</strong> <span className="text-danger font-weight-bold">{order.total_amount ? PaymentStatusLabel(order.total_amount) : 'Dummy Price' }</span></div>
                            </Col>
                        </Row>
                    </div>
                    ) : (
                    <p>Loading...</p>
                    )}
                    </Card.Body>
                </Card>
                <Card style={{ marginTop: '20px' }}>
                <Card.Body>
                    <h6 style={{ marginBottom: '10px' }}><strong>Shipment Details</strong></h6>
                    <hr />
                    <Row>
                        <Col>
                            <div className="mb-1"><strong>Carrier:</strong> {orderDummy.shipment.carrier}</div>
                            <div className="mb-1"><strong>Tracking Number:</strong> {orderDummy.shipment.trackingNumber}</div>
                            <div className="mb-1"><strong>Status:</strong> {orderDummy.shipment.status}</div>
                        </Col>
                        <Col>
                            <div className="mb-1"><strong>To :</strong> {orderDummy.shipment.receiver}</div>
                            <div className="mb-1"><strong>To Address:</strong> {orderDummy.shipment.address}</div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
                <div className="row mt-3" style={{paddingBottom: "100px"}}>
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
                        <div className="row mt-4">
                            <div className="col-2 text-right"></div>
                            <div className="col-7 text-right vertical-align">Total Amount :</div>
                            <div className="col-3 vertical-align" style={{color:'#db3022',fontSize:20,fontWeight:'bold'}}>
                                {order.total ? `Rp. ${(
                                          order.total
                                        ).toLocaleString("id-ID")}` : ''}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2 text-right"></div>
                            <div className="col-7 text-right vertical-align">Shipping Cost :</div>
                            <div className="col-3 vertical-align" style={{color:'#db3022',fontSize:20,fontWeight:'bold',borderBottom:"1px solid #000"}}>
                                {order.shipping_cost ? `Rp. ${(
                                          order.shipping_cost
                                        ).toLocaleString("id-ID")}` : '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2 text-right"></div>
                            <div className="col-7 text-right vertical-align">Total Payment :</div>
                            <div className="col-3 vertical-align" style={{color:'#db3022',fontSize:20,fontWeight:'bold'}}>
                                {order.shipping_cost ? `Rp. ${(
                                          order.shipping_cost
                                        ).toLocaleString("id-ID")}` : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container-fluid text-center" style={{ backgroundColor:"white", position: 'fixed', bottom: 0, width: '100%', padding:"20px 20px"}}>
                <div className="row">
                    { Object.keys(midtransData).length>0 ? 
                    (
                        <>
                            {order.status_code != '200' && order.status_code != '407' ? (
                            <ReactMidtrans clientKey={'your-ker'} token={midtransData.token} callBack={midtransCallBackDataHandle}>
                                <div className="col-12">
                                    <Button className="btn-buy" ref={el => { paymentBtnRef.current = el; setRefMidtransVisible(!!el); }} onClick={() => setIsLoading(true)}> <p className="text-buy" style={{fontSize:"unset"}}>Check Payment</p> </Button>
                                </div>
                            </ReactMidtrans>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <div className="col-12">
                                <Button className="btn-buy" ref={el => { reqTokenBtnRef.current = el; setReqTokenBtnRefVisible(!!el)}} onClick={() => requestMidtransToken()}> <p className="text-buy" style={{fontSize:"unset"}}>Choose Payment</p></Button>
                            </div>
                        </>
                    )}
                </div>
                </div>
            </LoadingOverlay>
        
    )
}

export default OrderDetail;
