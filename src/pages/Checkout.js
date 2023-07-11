import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useHistory } from "react-router-dom";
import Loader from "../assets/image/loader.gif";
import ModalChooseAddress from "../components/Modal/ModalAddress/ModalChooseAddress";
import ModalSelectPayment from "../components/Modal/ModalAddress/ModalSelectPayment";
import ModalAddAddress from "../components/Modal/ModalAddress/ModalAddAddress";
import ModalCourierSelection from "../components/Modal/Shipment/CourierSelectionModal";
import { Bounce, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  clearCheckout,
  addToCheckout,
} from "../redux/actions/product";
import {Button,Card} from 'react-bootstrap';
import axios from "axios";
import { API } from "../utility/Auth";
import "react-toastify/dist/ReactToastify.css";
import "../assets/style/mybag.css";
import "../assets/style/checkout.css";
import LoadingOverlay from "react-loading-overlay";


toast.configure();
const Checkout = (props) => {
  const [showChooseAddress, setShowChooseAddress] = useState(false);
  const [showChooseAddres2, setShowChooseAddress2] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCourierSelection, setShowCourierSelection] = useState(false);
  const [courierData, setCourierData] = useState([]);
  const [address, setAddress] = useState([]);
  const [addressStore, setAddressStore] = useState([]);
  const [shipperAreaID, setShipperAreaID] = useState([]);
  const [destinationAreaID, setDestinationAreaID] = useState([]);
  const [isRender, setIsRender] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);

  const dispatch = useDispatch();
  const checkout = useSelector((state) => state.product.checkout);
  const seller_id = useSelector((state) => state.product.checkout.seller_id);
  const transaction_code = useSelector(
    (state) => state.product.checkout.transaction_code
  );
  const item = useSelector((state) => state.product.checkout.item);
  const [updatedItems, setUpdatedItems] = useState([]);

  const stateCarts = useSelector((state) => state.product.carts);
  const token = useSelector((state) => state.auth.data.token);
  // const { getAddress } = props.location;
  // const { changeAddres } = props.location;
  // console.log("CHECKOUT", checkout);

  const {
    Id_address,
    Fullname,
    Address,
    City,
    Region,
    Zip_code,
    Country,
  } = props.location;

  const history = useHistory();

  const transaction = async () => {
    // reject transaction if addres is null 
    if (address === null) {  
      toast.error("You need to pick address first ", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Bounce,
      }); 
    } else {
      // console.log(checkout);
      // console.log(address);
      let body = {
        transaction_code: checkout.transaction_code,
        seller_id: checkout.seller_id,
        id_address: address.id_address,
        id_store_address:addressStore.id_address,
        item: updatedItems,
        courier_code:courierData.courier,
        courier_type:courierData.type,
        courier_price:courierData.price,
      }

      setIsLoading(true)
      await axios
        .post(`${API}/orders`, body, {
          headers: {
            "x-access-token": "Bearer " + token,
          },
        })
        .then((res) => {
          console.log("success", res);
          dispatch(clearCart());
          dispatch(clearCheckout());
          setShowPayment(false);
          history.push({
            pathname: '/order-detail/'+transaction_code,
            state: { 
              id:res.data.data.id,
              // midtransData:res.data.data.midtransData
              requestMidtransTrx:true
            }
          });
        })
        .catch((err) => {
          console.log("ERROR", err.response);
        })
        .finally(() => {
          setIsLoading(false)
      });
    }
  };

  // console.log("tea dd", address);
  

  const getAddressUser = async () => {
    await axios
    .get(`${API}/address`, {
      headers: {
        "x-access-token": "Bearer " + token,
      },
    })
    .then((res) => {
      console.log('get address:',res)
      const addressNull = res.data.data;
      const addressData = res.data.data[0];

      if (address === null) {
        setAddress(addressNull);
      } else {
        setAddress(addressData);
        const id_address = res.data.data[0].id_address;
        const sendData = {
          transaction_code: transaction_code,
          seller_id: seller_id,
          id_address: id_address,
          item: item,
        };
        dispatch(addToCheckout({ sendData }));
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const getAddressStore = async () => {
    await axios
    .get(`${API}/address/store`, {
      headers: {
        "x-access-token": "Bearer " + token,
      },
    })
    .then((res) => {
      console.log('get address store:',res)
      const addressNull = res.data.data;
      const addressData = res.data.data[0];

      if (addressStore === null) {
        setAddressStore(addressNull);
      } else {
        setAddressStore(addressData);
        const id_address = res.data.data[0].id_address;
        const sendData = {
          transaction_code: transaction_code,
          seller_id: seller_id,
          id_address: id_address,
          item: item,
          id_store_address:id_address
        };
        dispatch(addToCheckout({ sendData }));
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  // if (showAddAddress === true) {
  //   getAddressUser();
  // }

  async function fetchProduct(it) {
    try {
      const response = await axios.get(`${API}/products/${it.product_id}`, {
        headers: {
          "x-access-token": "Bearer " + token,
        },
      });
      
      console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  const handleModalClose = (selectedValue) => {
    setSelectedValue(selectedValue);
  };

  const handleToPayment = async (courierData) =>{
    if (!courierData.price) {
      alert('Please select courier first!') 
    } else {
      setShowPayment(true)
    }
      
  } 

  // update items weight grams data
  useEffect(() => {
    if (!checkout || !transaction_code || !seller_id) {
      history.push({
              pathname: '/mybag/'
            });
    } else {
      getAddressUser();
      getAddressStore();
      if (item){
        Promise.all(item.map(async (it) => {
          try {
            const productData = await fetchProduct(it);
            // Update the item with the fetched product data
            const updatedItem = { ...it, weight: productData.weight_gram, value:it.sub_total_item,quantity:it.product_qty };
            return updatedItem;
          } catch (error) {
            console.error('Error fetching product data:', error);
          }
        })).then((updatedItems) => {
          // Perform further operations with the updated items array
          console.log(updatedItems);
          setUpdatedItems(updatedItems);
          // Pass the updated items to the component or update the state accordingly
        });
      }
      
    }
  }, []);



  useEffect(() => {
    setDestinationAreaID(address.biteship_address_id)
    setShipperAreaID(addressStore.biteship_address_id)
  }, [address, addressStore]);

  // handle update courier data
  useEffect(() => {
    if (selectedValue) {
      try {
        const parsedObject = JSON.parse(selectedValue);
        console.log(parsedObject);
        console.log(parsedObject.courier);
        console.log(parsedObject.type);
        console.log(parsedObject.price);

        setCourierData(parsedObject)

        const sendData = {
          transaction_code: transaction_code,
          seller_id: seller_id,
          id_address: address.id_address,
          id_store_address:addressStore.id_address,
          courier:parsedObject,
          item: updatedItems,
        };
        dispatch(addToCheckout({ sendData }));

      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
    console.log('checkout',checkout)
  },[selectedValue,updatedItems])

  return (
    <LoadingOverlay
          active={isLoading}
          spinner
          text='Trying to connect to Payment Gateway...'
          >
    <div>
      <Navbar />
      <div className="container">
        <h1
          style={{ fontSize: "34px", fontWeight: "700", marginBottom: "15px" }}
        >
          Checkout
        </h1>
        {stateCarts.filter((item) => item.selected === true).length ? (
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="col address" style={{ border:"1px solid rgba(0,0,0,.125)",boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",marginTop:"unset" }}>
              {/* <p className="ttl-addrs">Shipping Address</p> */}
              <Card.Title>Shipping Address</Card.Title>
              {address ? (
                <>
                    <div>
                    <p>{address.fullname}</p>
                    <p>
                      {`${address.address}, Kota ${address.city}, Provinsi ${address.region}, Kodepos: ${address.zip_code}, ${address.country}`}
                    </p>
                    <Button
                      // className="btn-choose-address"
                      variant="secondary"
                      onClick={() => {
                        setShowChooseAddress(true);
                        getAddressUser(address);
                      }}
                      style={{ display: "flex" }}
                    >
                      {/* <p className="addres-btn">Choose another address</p> */}
                      Change address
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3>you haven't entered the address yet</h3>
                    <p>add your address first!</p>
                    <button
                      className="btn-choose-address"
                      onClick={() => setShowAddAddress(true)}
                      style={{
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <p
                        className="addres-btn"
                        style={{ color: "black", height: "10px" }}
                      >
                        Add new Address
                      </p>
                    </button>
                  </div>
                </>
              )}
              </div>

              <Card style={{boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",marginTop:"15px"}}>
                <Card.Body>
                  <Card.Title>Choose Courier</Card.Title>
                  <Card.Text style={{color:'#6b6b6b'}}>
                    Pick your favourite shipment courier
                  </Card.Text>
                  <Button variant="primary" onClick={() => setShowCourierSelection(true)}>Choose</Button>
                  {selectedValue && (
                    <div className="card mt-3">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="card-title">Selected Courier</h5>
                          <p className="card-text">{courierData.courier_name} {courierData.courier_service_name}</p>
                        </div>
                        <div>
                          <h5 className="card-title">Price</h5>
                          <p className="card-text">{courierData.price}</p> {/* Replace with your actual price */}
                        </div>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              <h4 style={{marginTop:'20px',marginBottom:'unset'}}>Items :</h4>
              {stateCarts
                .filter((item) => item.selected === true)
                .map((item) => {
                  return (
                    <div
                      className="col prodct d-flex justify-content-between"
                      key={item.id}
                      style={{ border:"1px solid rgba(0,0,0,.125)",boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",padding: "10px", marginBottom: "10px",marginTop: '8px' }}
                    >
                      {/* <div className="selectAll" > */}
                      <div className="col-2 img-chart align-items-center d-flex flex-column" style={{marginLeft:" 10px",marginRight:" 10px"}}>
                        <img className="mx-auto"
                          style={{ height: "70px" }}
                          src={API + item.photo}
                          alt=""
                        />
                      </div>
                      <div className="col-7">
                        <p className="name-prodct">{item.name}</p>
                        <p className="brand-product text-muted">{item.brand}</p>
                      </div>
                      <div className="col-3" style={{textAlign:" right",flex: "0 0 24%",bottom: "-3vh"}}>
                        <p className="prc text-danger" style={{fontSize: "18px"}}>{`Rp. ${(
                          item.price * item.qty
                        ).toLocaleString("id-ID")}`}</p>
                      </div>
                      {/* </div> */}
                    </div>
                  );
                })}
            </div>
            <div className="col-12 col-lg-4">
              <div className="shop-sumry" style={{ border:"1px solid rgba(0,0,0,.125)",boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}>
                <h5 style={{marginBottom:"30px"}}>Shopping summary</h5>
                <div className="ttl-price">
                  <p className="text-price text-muted" style={{fontSize:"20px"}}>Total price</p>
                  <p className="pay text-danger">{`Rp${stateCarts
                    .filter((item) => item.selected === true)
                    .reduce((total, item) => {
                      return total + item.price * item.qty;
                    }, 0)
                    .toLocaleString("id-ID")}`}</p>
                </div>
                <div className="ttl-price">
                  <p className="text-price text-muted" style={{fontSize:"20px"}}>Shipping Fee</p>
                  {(courierData && courierData.price) && (
                    <p className="pay text-danger">Rp{courierData.price.toLocaleString('id-ID')}</p>
                  )}
                </div>
                <div
                  style={{
                    width: "100%",
                    borderStyle: "solid",
                    border: "2px",
                    marginBottom: "2px",
                    marginTop: "2px",
                  }}
                ></div>
                <div className="text-decoration-none">
                  <Button
                    variant="primary"
                    className="btn-buy"
                    onClick={() => handleToPayment(courierData)}
                    style={{width:"100%"}}
                  >
                    {/* <p className="text-buy">Checkout</p> */}
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1
          // className={classname(
          //   text.headline,
          //   colors.grayText,
          //   "text-empty-cart"
          // )}
          >
            (Checkout item is empty)
          </h1>
        )}
      </div>
      <ModalChooseAddress
        show={showChooseAddress}
        onHide={() => setShowChooseAddress(false)}
        showAddAddress={() => {
          getAddressUser(address);
          setShowAddAddress(true);
        }}
        // changeAddress={() => setShow(true)}
      />
      <ModalSelectPayment
        show={showPayment}
        onHide={() => setShowPayment(false)}
        showAddAddress={() => setShowAddAddress(true)}
        cart={stateCarts.filter((item) => item.selected === true)}
        courierData={courierData}
        onSubmit={() => transaction()}
        // handleSelectPayment={(evt) => handleSelectPayment(evt)}
      />
      <ModalAddAddress
        show={showAddAddress}
        onHide={() => {
          setShowAddAddress(false);
          getAddressUser(address);
          // setShowChooseAddress(false);
        }}
      />

      <ModalCourierSelection
        show={showCourierSelection}
        onHide={() => {
          setShowCourierSelection(false);
          // getAddressUser(address);
        }}
        onClose={(response) => {
          handleModalClose(response)
          setShowCourierSelection(false);
        }}
        params={{shipper_area_id:shipperAreaID,destination_area_id:destinationAreaID,items:updatedItems}}
      />
    </div>
    </LoadingOverlay>
  );
};

export default Checkout;
