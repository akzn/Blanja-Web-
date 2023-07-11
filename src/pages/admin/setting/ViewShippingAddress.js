import React, { useState, useEffect } from "react";
import Layout from '../../../components/Admin/Layout';
import styles from "./another.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { API } from "../../../utility/Auth";
import { Badge } from "react-bootstrap";
import ModalChooseAddress from "../../../components/Modal/ModalAddress/ModalAddAddress";

export default function ViewShippingAddress() {
    const [showChooseAddress, setShowChooseAddress] = useState(false);
    const [changeAddress, setChangeAddress] = useState([]);
  
    const token = useSelector((state) => state.auth.data.token);
  
    useEffect(() => {
      const unsubscribe = window.addEventListener("pageshow", () => {
        getAddressUser(changeAddress);
      });
      return unsubscribe;
    }, []);
  
    useEffect(() => {
      getAddressUser(changeAddress);
      console.log('Loaded!!!')
    }, []);
  
    const getAddressUser = async () => {
      await axios
        .get(`${API}/address`, {
          headers: {
            "x-access-token": "Bearer " + token,
          },
        })
        .then((res) => {
          const address = res.data.data;
          console.log('address',address)
          setChangeAddress(address);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const _handleSetActiveAddress = async (id) => {

      await axios
      .patch(`${API}/address/set-primary/${id}`,{ id: id }, {
        headers: {
          "x-access-token": "Bearer " + token,
        },
      })
      .then((res) => {
        console.log('res',res)
        console.log('Data updated successfully:', res.data);
        getAddressUser(changeAddress);
        toast.success("Set Primary success!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
        });
      })
      .catch((err) => {
        console.log('Error updating data:',err);
        alert('failed to update data')
      });
    };

    const _handleDeleteAddress = async (id) => {

      await axios
      .delete(`${API}/address/safe-delete/${id}`, {
        headers: {
          "x-access-token": "Bearer " + token,
        },
      })
      .then((res) => {
        console.log('res',res)
        console.log('Data deleted :', res.data);
        toast.success("Address deleted!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
        });
        getAddressUser(changeAddress);
      })
      .catch((err) => {
        console.log('Error updating data:',err);
        alert('failed to delete data')
      });
    };

    const ReloadPage = () => {
        // window.location.reload();
      getAddressUser(changeAddress);
      setShowChooseAddress(false)
      // toast.success("Address Added Successfully!", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   transition: Bounce,
      // });
    }
  
    return (
      <>
        <Layout>
              {/* Header */}
              <div className={styles.header}>
                <h6 className={styles.title}>Store Address</h6>
                <p className={styles.subtitle}>Manage store shipping addresses</p>
              </div>
  
              {/* FormContainer */}
              <div className={styles.addresscontainer}>
                {changeAddress.length === 0 ? (
                  <div className={styles.addnewaddress}>
                    <h5
                      className={styles.addtext}
                      onClick={() => setShowChooseAddress(true)}
                    >
                      Add new address
                    </h5>
                  </div>
                ) : (
                  <>
                    <div className={styles.addnewaddress}>
                      <h5
                        className={styles.addtext}
                        onClick={() => setShowChooseAddress(true)}
                      >
                        Add new address
                      </h5>
                    </div>
                    {changeAddress &&
                      changeAddress.map((address) => {
                        return (
                          <div className="container-fluid">
                            {address.is_active == '1' ? 
                          <div
                            className={styles.listaddress}
                            key={address.id_address}
                            style={address.is_primary == '1' ? { border:"1px solid #db3022" } : { border:"1px solid #000" }}
                          >
                            {address.is_primary == '1' ? <Badge variant="primary" style={{marginBottom:"10px"}}>Primary Address</Badge> : '' }

                            {/* <h5 className={styles.delete}>DELETE</h5> */}
                            <h5 className={styles.listtitle} style={{marginTop:"20px"}}>
                              Receiver : {address.fullname}
                            </h5>
                            <p className={styles.detailaddres}>
                              Phone Number : {`${address.phone}`}
                            </p>
                            <p className={styles.detailaddres}>
                              {`${address.address}`}
                            </p>
                            <p className={styles.detailaddres}>
                              {`${address.city}, Kota. ${address.city}, Prov. ${address.region}, ${address.zip_code}, ${address.country}`}
                            </p>
                            
                               {address.is_primary == '0' ? (
                                <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  marginBottom: "20px",
                                  marginTop: "20px",
                                  justifyContent: "space-around",
                                }}
                              >
                              <button
                                className="editProd"
                                style={{width:'unset',padding:'0 10px',marginRight:'10px'}}
                                onClick={() => _handleSetActiveAddress(address.id_address)}
                              >
                                <div className="btn-login-nav ">Set as Primary Address</div>
                              </button>
                 
                              <button
                                className="deleteProd"
                                onClick={() => _handleDeleteAddress(address.id_address)}
                              >
                                <div className="btn-login-nav ">Delete</div>
                              </button> 
                              </div>
                              ) : ''}
                            </div>
                            
                         
                          : ''}
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
              {/* </div> */}
        <ModalChooseAddress
          show={showChooseAddress}
          onHide={() => ReloadPage()}
        />
        </Layout>
      </>
    );
  }
  