import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const CourierSelectionModal = ({ show, onHide }) => {
  const [couriers, setCouriers] = useState([
    { id: 1, name: 'JNE', logo: 'logo1.png' },
    { id: 2, name: 'JNT', logo: 'logo2.png' },
    { id: 3, name: 'Sicepat', logo: 'logo3.png' },
  ]);
  const [selectedCourier, setSelectedCourier] = useState('');

  const handleCourierChange = (event) => {
    setSelectedCourier(event.target.value);
  };

  const handleConfirm = () => {
    // Do something with the selected courier
    console.log('Selected Courier:', selectedCourier);

    // Close the modal
    onHide();
  };

  const handleImageError = (event) => {
    event.target.src = 'https://dummyimage.com/100x100/d6d6d6/4a4a4a';
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Courier</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{paddingLeft: "30px"}}>
        <Form>
          {couriers.map((courier) => (
            <Form.Check
              key={courier.id}
              type="radio"
              id={courier.id}
              label={
                <>
                  <img
                    src={courier.logo}
                    alt={courier.name}
                    onError={handleImageError}
                    style={{ width: '40px', marginRight: '10px' }}
                  />
                  {courier.name}
                </>
              }
              name="courierSelection"
              value={courier.id}
              // checked={selectedCourier === courier.id}
              checked={selectedCourier === courier.id.toString()}
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
