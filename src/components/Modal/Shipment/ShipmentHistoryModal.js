import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './shipmentHistoryModal.css';

const TrackingModal = ({ show, onClose, trackingData }) => {
    if (!trackingData || !trackingData.history || trackingData.history.length === 0) {
        console.log('no data')
        return null; // Return null or show an appropriate message when trackingData is not available
    }
    return (
        <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Tracking Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <VerticalTimeline>
            {trackingData.history.map((event, index) => {
                const eventDate = new Date(event.updated_at);
                const eventDateOffset = new Date(eventDate.getTime() + (7 * 60 * 60 * 1000)); // Add the UTC+7 offset in milliseconds
                const formattedDate = eventDateOffset.toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  timeZone: "UTC",
                });
            return (
                <VerticalTimelineElement
                key={index}
                date={new Date(event.updated_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    timeZone: "UTC",
                  })}
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                >
                <h4 className="vertical-timeline-element-subtitle">{event.note}</h4>
                <p>Status: {event.status}</p>
                </VerticalTimelineElement>
            )
                })}
            </VerticalTimeline>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
            Close
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default TrackingModal;
