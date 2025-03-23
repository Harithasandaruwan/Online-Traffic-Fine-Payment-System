import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase'; // Adjust path
import { useReactToPrint } from 'react-to-print';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

export default function RefundProfile() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);
  const componentPDF = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/refund/refund_user/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      data.forEach(order => {
        if (order.profilePicture) fetchFirebaseImage(order.profilePicture, 'profilePicture', order._id);
        if (order.alternateProfilePicture) fetchFirebaseImage(order.alternateProfilePicture, 'alternateProfilePicture', order._id);
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchFirebaseImage = async (imageUrl, field, orderId) => {
    const storageRef = ref(storage, imageUrl);
    try {
      const downloadUrl = await getDownloadURL(storageRef);
      setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, [field]: downloadUrl } : order));
    } catch (error) {
      console.error(`Error fetching image from Firebase for ${field}:`, error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`/api/refund/deleterefund/${orderIdToDelete}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
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
    onBeforeGetContent: () => { setIsGeneratingPDF(true); return Promise.resolve(); },
    onAfterPrint: () => { setIsGeneratingPDF(false); alert('Data saved in PDF'); }
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold text-primary">Payment Details</h2>

      <div ref={componentPDF} className="table-responsive">
        {orders.length > 0 ? (
          <table className="table table-striped table-bordered mt-4 shadow-lg">
            <thead className="thead-dark">
              <tr>
                <th>Ticket Number</th>
                <th>Name</th>
                <th>Refund Amount</th>
                <th>Reason</th>
                {!isGeneratingPDF && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.ticket_nb}</td>
                  <td>{order.Name}</td>
                  <td>{order.refund_Amount}</td>
                  <td>{order.refund_reason}</td>
                  {!isGeneratingPDF && (
                    <td>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => { setShowModal(true); setOrderIdToDelete(order._id); }}>
                        <b>Delete Payment</b>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-muted">You have no orders yet!</p>
        )}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button 
          className="btn btn-primary" 
          onClick={generatePDF} 
          disabled={isGeneratingPDF}>
          {isGeneratingPDF ? 'Generating PDF...' : 'Generate Report'}
        </button>
      </div>

      {/* Bootstrap Modal */}
      <div className={`modal fade ${showModal ? 'show d-block' : 'd-none'}`} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Confirm Deletion</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-3 display-4 text-warning" />
              <p className="text-secondary">Are you sure you want to delete this order?</p>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button className="btn btn-danger" onClick={handleDeleteOrder}>Yes, Delete</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
