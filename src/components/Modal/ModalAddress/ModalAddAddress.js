import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import styles from "./modal.module.css";
import { API } from "../../../utility/Auth";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';

export default function ModalAddAddress(props) {
  const [myaddress, setAddress] = useState({
    fullname: "",
    address: "",
    city: "",
    region: "",
    zip_code: "",
    country: "",
  });
  const [address, setAddresss] = useState(false);
  const [term, setTerm] = useState(false);
  const [mapsData, setMapsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const history = useHistory();
  const token = useSelector((state) => state.auth.data.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { mapsid, fullname, phone, address, city, region, zip_code, country } = myaddress;

    // Validate required fields
    if (!mapsid || !fullname || !address || !city || !region || !zip_code || !country) {
      setError('Please fill in all fields.');
      return;
    }

    // Reset error state if there are no validation errors
  setError(null);
    
    let body = {
      biteship_address_id : mapsid,
      fullname: fullname,
      phone: phone,
      address: address,
      region: region,
      city: city,
      zip_code: zip_code,
      country: country,
    };

    let formData = new FormData();
    formData.append("mapsid", mapsid);
    formData.append("fullname", fullname);
    formData.append("address", address);
    formData.append("region", region);
    formData.append("city", city);
    formData.append("zip_code", zip_code);
    formData.append("country", country);

    await axios
      .post(`${API}/address`, body, {
        headers: {
          "x-access-token": "Bearer " + token,
        },
      })
      .then((res) => {
        console.log('address add:',res)
        if (res.data.status === 200) {
          props.onHide();
          // setAddresss(true);
        } else if (res.data.status === 500) {
          props.onHide();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchMapsArea = async (e) => {
    setIsLoading(true);
    await axios
      .get(`${API}/shipping/maps?input=${term}`, {
        headers: {
          "x-access-token": "Bearer " + token,
        },
      })
      .then((res) => {
        setMapsData(res.data.areas)
        console.log('maps :',mapsData)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  // begin function series to handle search begin on typing stop interval
  

  /// ---
  const handleOptionChange = (selected) => {
    setSelectedOption(selected);
    console.log('selected',selected)
    setAddress({ ...myaddress, 
      mapsid: selected.id,
      country: selected.country_name,
      country: selected.country_name,
      region: selected.administrative_division_level_1_name,
      city: selected.administrative_division_level_2_name,
      zip_code: selected.postal_code,
     });
  };

  const handleInputChange = (inputValue) => {
    setTerm(inputValue);

    clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      if (term.length > 3) {
      fetchMapsArea(inputValue);
      }
    }, 1000); // Adjust the timeout duration (in milliseconds) as needed

    setTypingTimeout(timeout);
  };

  // useEffect = (() => {
  //   console.log('addresss',myaddress)
  // }, [myaddress])

  useEffect(() => {
    console.log('addresss',myaddress)
  }, [myaddress]);

  // Define custom styles for the Select component
const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '4px',
    borderColor: '#ccc',
    boxShadow: 'none',
    color:'white'
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#e8e8e8' : 'transparent',
    color: state.isSelected ? '#fff' : '#333',
    cursor: 'pointer',
  }),
};

  // if (address === true) {
  //   return <Redirect to="/checkout"/>
  // }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: "none" }}>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.container}>
        <h4 className={styles.title}>Add new address</h4>
        <div className={styles.content}>
        {error && <Alert variant="danger">{error}</Alert>}

        <div className={styles.iteminput}>
          <Select
            id="area"
            className={styles.contentinput}
            styles={customStyles} 
            value={selectedOption}
            options={mapsData}
            onInputChange={handleInputChange}
            onChange={handleOptionChange}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            isLoading={isLoading}
            placeholder={isLoading ? 'Loading...' : 'Search Area'}
          />
          </div>

          <div className={styles.iteminput} style={{display:'none'}}>
            <div className={styles.contentinput}>
              <label className={styles.label} for="address">
                Maps ID
              </label>
              <input
                id="id"
                className={styles.input}
                // onChange={(e) => {
                //   setAddress({ ...myaddress, mapsid: e.target.value });
                // }}
                value={myaddress.mapsid}
              />
            </div>
          </div>

          

          <div className={styles.iteminput}>
            <div className={styles.contentinput}>
              <label className={styles.label} for="tlp">
                Recipient's region/province
              </label>
              <input
                id="tlp"
                className={styles.inputReadonly}
                // onChange={(e) => {
                //   setAddress({ ...myaddress, region: e.target.value });
                // }}
                value={myaddress.region}
                readOnly
              />
            </div>
            <div className={styles.space}></div>
            <div className={styles.contentinput}>
              <label className={styles.label} for="city">
                City or subdistrict
              </label>
              <input
                id="city"
                className={styles.inputReadonly}
                // onChange={(e) => {
                //   setAddress({ ...myaddress, city: e.target.value });
                // }}
                value={myaddress.city}
                readOnly
              />
            </div>
          </div>

          <div className={styles.iteminput}>
            <div className={styles.contentinput}>
              <label className={styles.label} for="address">
                Country
              </label>
              <input
                id="address"
                className={styles.inputReadonly}
                // onChange={(e) => {
                //   setAddress({ ...myaddress, country: e.target.value });
                // }}
                value={myaddress.country}
                readOnly
              />
            </div>
            <div className={styles.space}></div>
            <div className={styles.contentinput}>
              <label className={styles.label} for="postal">
                Postal code
              </label>
              <input
                id="postal"
                className={styles.inputReadonly}
                // onChange={(e) => {
                //   setAddress({ ...myaddress, zip_code: e.target.value });
                // }}
                value={myaddress.zip_code}
                readOnly
              />
            </div>
          </div>

          <div className={styles.iteminput}>
            <div className={styles.contentinput}>
              <label className={styles.label} for="recipients">
                Recipient’s name
              </label>
              <input
                id="recipients"
                className={styles.input}
                onChange={(e) => {
                  setAddress({ ...myaddress, fullname: e.target.value });
                }}
              />
            </div>
          </div>

          <div className={styles.iteminput}>
            <div className={styles.contentinput}>
              <label className={styles.label} for="recipients">
                Recipient’s Phone Number
              </label>
              <input
                id="recipients"
                className={styles.input}
                onChange={(e) => {
                  setAddress({ ...myaddress, phone: e.target.value });
                }}
              />
            </div>
          </div>

          <div className={styles.iteminput}>
            <div className={styles.contentinput} style={{height:"unset"}}>
              <label className={styles.label} for="address">
                Address
              </label>
              <textarea
                id="address"
                className={styles.input}
                rows={3}
                onChange={(e) => {
                  setAddress({ ...myaddress, address: e.target.value });
                }}
              />
            </div>
            
          </div>

          <div className={styles.iteminput}>
            
            <div className={styles.space}></div>
            <div className={styles.contentinput}></div>
          </div>

          <div className={styles.iteminput}>
            <input
              className={styles.itemcheckbox}
              type="checkbox"
              id="primary"
              value="1"
              onChange={(e) => {
                setAddress({ ...myaddress, primary: e.target.value });
              }}
            />
            <label className={styles.label} for="primary">
              Make it primary addres
            </label>
          </div>
          <div className={styles.iteminput}>
            <div className={styles.contentinput}></div>
            <div className={styles.space}></div>
            <div className={styles.contentbtn}>
              <button onClick={props.onHide} className={styles.btncancel}>
                Cancel
              </button>
              <button
                onClick={(e) => handleSubmit(e)}
                className={styles.btnsave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
