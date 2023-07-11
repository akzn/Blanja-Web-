import React, { useState, useEffect } from "react";
import styles from "./another.module.css";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../utility/Auth";
import Sidebar from "../SidebarProfile/Sidebar";
import { Jumbotron } from "react-bootstrap";
import ModalChooseAddress from "../Modal/ModalAddress/ModalAddAddress";
import { Badge } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";


export default function ShippingAddress() {
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
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="container-selling">
          <Jumbotron
            className="container-content"
            style={{ height: "90%", backgroundColor: "white" }}
          >
            {/* Header */}
            <div className={styles.header}>
              <h6 className={styles.title}>Choose another address</h6>
              <p className={styles.subtitle}>Manage your shipping address</p>
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
          </Jumbotron>
        </div>
      </div>
      <ModalChooseAddress
        show={showChooseAddress}
        // onHide={() => setShowChooseAddress(false)}
        onHide={() => ReloadPage()}
      />
    </>
  );
}
