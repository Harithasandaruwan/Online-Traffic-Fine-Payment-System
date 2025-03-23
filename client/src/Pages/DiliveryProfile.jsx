import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase'; // Adjust the path as per your project structure

import { useReactToPrint } from 'react-to-print';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DiliveryProfile() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);
  const componentPDF = useRef(); // Add reference for PDF generation

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/diliver/dilivery_user/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`/api/diliver/deleteDiliver/${orderIdToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        console.log('Error deleting order');
      } else {
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderIdToDelete));
      }
      setShowModal(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Total Item Report',
    onBeforeGetContent: () => {
      setIsGeneratingPDF(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
      alert('Data saved in PDF');
    }
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center font-weight-bold text-primary mb-4">Delivery Details</h2>

      <div ref={componentPDF} className="table-responsive">
        {orders.length > 0 ? (
          <Table className="table table-striped table-hover shadow-sm">
            <thead className="thead-dark">
              <tr>
                <th>Delivery ID</th>
                <th>Fine ID</th>
                <th>Delivery Type</th>
                <th>Tracking Id</th>
                <th>Delivery Status </th>
                <th>Expected Delivery Date </th>

                {!isGeneratingPDF && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
   
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.dilivery_id}</td>
                  <td>{order.fine_id}</td>
                  <td>{order.delivery_type}</td>
                  <td>{order.tracking_id}</td>
                  <td>{order.delivery_status}</td>
                  <td>{order.expected_delivery_date}</td>
                  {!isGeneratingPDF && (
  <td>
    <Button
      to={`/update-item/${order._id}`}
      className="btn btn-success btn-sm w-auto"  // w-auto for flexible width
    >
      Edit
    </Button>
    <Button
      className="btn btn-danger btn-sm w-auto"  // w-auto for flexible width
      onClick={() => {
        setShowModal(true);
        setOrderIdToDelete(order._id);
      }}
    >
      Delete
    </Button>
  </td>
)}


 



                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">You have no orders yet!</p>
        )}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={generatePDF} disabled={isGeneratingPDF}>
          {isGeneratingPDF ? 'Generating PDF...' : 'Generate Report'}
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete this order?
            </h3>
            <div className="d-flex justify-content-center gap-3">
              <Button className="btn btn-danger" onClick={handleDeleteOrder}>
                Yes, I am sure
              </Button>
              <Button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
