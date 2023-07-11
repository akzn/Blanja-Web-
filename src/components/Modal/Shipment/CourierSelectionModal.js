import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { API } from "../../../utility/Auth";
import { Bounce, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";


const CourierSelectionModal = ({ show, onHide, params, onClose  }) => {

  // const [couriers, setCouriers] = useState([
  //   { id: 1, name: 'JNE', logo: 'logo1.png' },
  //   { id: 2, name: 'JNT', logo: 'logo2.png' },
  //   { id: 3, name: 'Sicepat', logo: 'logo3.png' },
  // ]);

  const [couriers,setCouriers] = useState([])
  const [selectedCourier, setSelectedCourier] = useState('');
  
  const token = useSelector((state) => state.auth.data.token);


  const handleCourierChange = (event) => {
    setSelectedCourier(event.target.value);
  };

  const handleConfirm = () => {
    // Do something with the selected courier
    console.log('Selected Courier:', selectedCourier);
    
    onClose(selectedCourier);
    
    // Close the modal
    // onHide();
  };
  

  const handleImageError = (event) => {
    event.target.src = 'https://dummyimage.com/100x100/d6d6d6/4a4a4a';
  };

  const handleFetchCouriersRates = async () => {

    let body = {
      shipper_area_id:params.shipper_area_id,
      destination_area_id:params.destination_area_id,
      items:params.items
    }
    console.log('body',body)

    await axios
    .post(`${API}/shipping/rates/couriers/`, body, {
      headers: {
        "x-access-token": "Bearer " + token,
      },
    })
    .then((res) => {
      console.log('res',res)
      console.log('Data couriers rates :', res.data);
      setCouriers(res.data.pricing);
    })
    .catch((err) => {
      console.log('Error fetch data:',err);
      alert('failed fetch rates')
    });
  };

  useEffect( () => {
    if(show){
      handleFetchCouriersRates();
    }
  },[params])

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Courier</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{paddingLeft: "30px"}}>
        <Form>
          {couriers.map((courier) => (
            <Form.Check
              key={courier.company + '.' + courier.type}
              type="radio"
              id={courier.company + '.' + courier.type}
              label={
                <>
                  {/* <img
                    src={courier.logo}
                    alt={courier.name}
                    onError={handleImageError}
                    style={{ width: '40px', marginRight: '10px' }}
                  /> */}
                  {courier.courier_name + ' ' +courier.courier_service_name + ' (' +`Rp. ${(
                          courier.price
                        ).toLocaleString("id-ID")}` + ')'}
                </>
              }
              name="courierSelection"
              // value={courier.company + '.' + courier.type}
              value={JSON.stringify({ courier: courier.company, type: courier.type, price: courier.price, courier_name:courier.courier_name, courier_service_name:courier.courier_service_name })}
              // checked={selectedCourier === courier.id}
              checked={selectedCourier === JSON.stringify({ courier: courier.company, type: courier.type, price: courier.price, courier_name:courier.courier_name,courier_service_name:courier.courier_service_name })}
              onChange={handleCourierChange}
              style={{marginBottom:"10px"}}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={!selectedCourier}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CourierSelectionModal;
