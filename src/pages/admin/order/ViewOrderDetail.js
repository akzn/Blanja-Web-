import React, { useEffect, useState,useRef } from "react";
import Layout from '../../../components/Admin/Layout';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import axios from "axios";
import { API } from "../../../utility/Auth";
import { formatNumber, getMidtransStatus, PaymentStatusLabel } from "../../../helpers/Utils";
import { useSelector } from "react-redux";
import styles from "./order.module.css";
import LoadingOverlay from "react-loading-overlay";

const ViewOrderDetail = (props) => {
  var order_id = props.location.state.id
  const token = useSelector((state) => state.auth.data.token);
  const [order, setOrder] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const orderDummy = {
    id: '12345',
    date: 'June 25, 2023',
    total: '$50.00',
    items: [
      { id: '1', name: 'Product A', quantity: 2, price: '$20.00' },
      { id: '2', name: 'Product B', quantity: 1, price: '$10.00' },
      { id: '3', name: 'Product C', quantity: 3, price: '$5.00' },
    ],
    customer: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        address: '123 Main St, City, State',
    },
    payment: {
        channelType: 'Bank',
        channelName: 'BNI',
        channelPaymentCode: '123456',
        thirdPartyTransactionId: '789012345',
        paymentStatus: 'Paid',
      },
    shipment: {
        carrier: 'Shipping Co.',
        trackingNumber: 'ABC123XYZ',
        status: 'Shipped',
        receiver : 'Andika',
        address: "Jl. Malioboro, Yogyakarta, 55213, Yogyakarta Special Region, Indonesia"

    },
  };

  const getOrderItem = () => {
    axios
    .get(`${API}/orders/adm/${order_id}`, {
        headers: {
            "x-access-token": "Bearer " + token,
        },
    })
    .then(({ data }) => {
        console.log('data',data)
        const order = data.data;
        console.log('order:',data.data)
        console.log("order-detail", data.data.order_detail);
        console.log("user", data.data.user);
        console.log("payment", data.data.payment);

        setOrder(order);
        setOrderDetail(order.order_detail)
    })
    .catch((err) => {
        console.log("error", err);
    });
  };

  const _handleCheckPaymentStatus = async () => {
    setSpinner(true)
    let check = await getMidtransStatus(order.transaction_code,token);
    if (check) {
      setSpinner(false)
      window.location.reload()
    } else {
      setSpinner(false)
      alert('there are error when trying to check payment status')
    }
  }

  // const getMidtransStatus = async () => {
  //   await axios
  //     .get(`${API}/payment/midtrans/get-status/${orderId}`, {
  //       headers: {
  //         "x-access-token": "Bearer " + token,
  //       },
  //     })
  //     .then((res) => {
  //       const response = res;
  //       const data = response.data.data
  //       console.log('response',response.data.data)
  //       updatePaymentData(data)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const parseDateFromISOString = (dateString) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    getOrderItem()
  }, []);

  if (spinner === true) {
    return(
      <LoadingOverlay
          active={spinner}
          spinner
          text={'processing...'}
      >
          
          {/* <Navbar /> */}
              
          
      </LoadingOverlay>
  )
  }

  return (
    <Layout>
      <h3>Order Detail</h3>
      <p>information about customer order</p>
      <hr />
    <Container fluid>
      <Card>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <Card.Title>Order #{order.transaction_code}</Card.Title>
              {order.created_at ? (
                <Card.Subtitle>Date: {parseDateFromISOString(order.created_at)}</Card.Subtitle>
              ) : (
                <p>Loading...</p>
              )}
              <Card.Text style={{ fontSize: '20px',marginTop: '20px' }}>Total: Rp {formatNumber(order.total)}</Card.Text>
            </div>
            <div className="col-md-6">
              {order.user ? (
                <div>
                <h6><strong>Customer :</strong></h6>
                <h6 style={{marginTop:"10px"}}><strong>Name:</strong> {order.user[0].full_name}</h6>
                <h6 style={{marginTop:"5px"}}><strong>Email:</strong> {order.user[0].email}</h6>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          <Card style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Card.Body>
            <h6 style={{ marginBottom: '10px' }}><strong>Payment Details</strong></h6>
            <hr />
            {order.payment ? (
              <div>
                <Row>
                    <Col className="mb-1">
                      <div className="mb-1"><strong>Transaction ID:</strong> {order.payment[0].transaction_id ? order.payment[0].transaction_id : 'Undefined' }</div>
                      <div className="mb-1"><strong>Channel Type:</strong> {order.payment[0].payment_type ? order.payment[0].payment_type.toUpperCase() : 'undefined' }</div>
                      <div className="mb-1"><strong>Channel Name:</strong> {order.payment[0].channel_name ? order.payment[0].channel_name.toUpperCase() : 'Undefined' }</div>
                    </Col>
                    <Col className="mb-1">
                      <div className="mb-1"><strong>VA Number:</strong> {order.payment[0].va_number ? order.payment[0].va_number : '-' }</div>
                      <div className="mb-1"><strong>Payment Status:</strong> {order.payment[0].transaction_status ? PaymentStatusLabel(order.payment[0].transaction_status) : 'Waiting for Payment' }</div>
                    </Col>
                </Row>
                <Row className="mb-1 mt-3 text-right">
                  <Col>
                    <Button className={["btn-sm",styles.btn]} onClick={_handleCheckPaymentStatus}>
                      Re-Check Status
                    </Button>
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
                      <div className={styles.col_spacing_1}><strong>Carrier:</strong> {orderDummy.shipment.carrier}</div>
                      <div className={styles.col_spacing_1}><strong>Tracking Number:</strong> {orderDummy.shipment.trackingNumber}</div>
                      <div className={styles.col_spacing_1}><strong>Status:</strong> {orderDummy.shipment.status}</div>
                    </Col>
                    <Col>
                      <div className={styles.col_spacing_1}><strong>To :</strong> {orderDummy.shipment.receiver}</div>
                      <div className={styles.col_spacing_1}><strong>To Address:</strong> {orderDummy.shipment.address}</div>
                    </Col>
                </Row>
                <Row className="mb-1 mt-3 text-right">
                  <Col>
                    <Button className={["btn-sm",styles.btn]}>
                      Re-Check Status
                    </Button>
                  </Col>
                </Row>
            </Card.Body>
        </Card>
        <Card style={{marginTop: '20px'}}>
            <Card.Body>
            <h4 style={{ marginBottom: '10px' }}>Items</h4>
            {orderDetail ? (
              <div>
            <Table bordered>
              <thead>
                <tr>
                  <th className="text-center">Item Name</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail.map((item) => (
                  <tr key={item.product_id}>
                    <td>{item.product_name}</td>
                    <td className="text-center">{item.product_qty}</td>
                    <td className="text-right">Rp {formatNumber(item.sub_total_item)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{fontSize:"20px",fontWeight:"600"}}>
                  <td colSpan="2" className="text-right">Total:</td>
                  <td className="text-right">Rp {formatNumber(order.total)}</td>
                </tr>
              </tfoot>
            </Table>
            </div>
            ) : (
              <p>Loading...</p>
            )}
            </Card.Body>
        </Card>
        </Card.Body>
      </Card>
    </Container>
    </Layout>
  );

};

export default ViewOrderDetail;
