import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/payment.css";

export default function AddItem() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser?._id || "",
    fname: "",
    payment_id: "",
    finePaymentid: "",
    payment_method: "",
    crd_number: ""||null,
    expd_date: ""||null,
    cvv: ""||null,
    amount: ""||null,
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    let errors = {};
  
    if (!formData.fname) errors.fname = "First Name is required";
    if (!formData.payment_id) errors.payment_id = "Payment ID is required";
    if (!formData.finePaymentid) errors.finePaymentid = "Fine Payment ID is required";
    if (!formData.payment_method) errors.payment_method = "Payment Method is required";
    if (!formData.amount) errors.amount = "Amount is required";
  
    if (formData.payment_method === "Card") {
      if (!formData.crd_number) {
        errors.crd_number = "Card Number is required";
      } else if (!/^\d{16}$/.test(formData.crd_number)) {
        errors.crd_number = "Card Number must be exactly 16 digits and contain only numbers";
      }
  
      if (!formData.expd_date) {
        errors.expd_date = "Expiration Date is required";
      } else {
        // Ensure the expiration date is not in the past
        const currentDate = new Date();
        const expDate = new Date(formData.expd_date);
        if (expDate < currentDate) {
          errors.expd_date = "Expiration Date cannot be in the past";
        }
      }
  
      if (!formData.cvv) {
        errors.cvv = "CVV is required";
      } else if (!/^\d{3}$/.test(formData.cvv)) {
        errors.cvv = "CVV must be exactly 3 digits";
      }
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    let requestData = { ...formData };
  
    // Remove card details if payment method is Cash
    if (formData.payment_method === "Cash") {
      delete requestData.crd_number;
      delete requestData.expd_date;
      delete requestData.cvv;
    }
  
    try {
      const res = await fetch("/api/auth/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      if (!res.ok) throw new Error("Failed to process payment");
  
      Swal.fire({ icon: "success", title: "Success", text: "Payment successful" });
      navigate("/items");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong." });
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="payment-container">
        <h2 className="text-center mb-4 text-primary">Secure Payment</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={formData.fname}
              onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
            />
            {formErrors.fname && <small className="text-danger">{formErrors.fname}</small>}
          </div>
          
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Payment ID"
              value={formData.payment_id}
              onChange={(e) => setFormData({ ...formData, payment_id: e.target.value })}
            />
            {formErrors.payment_id && <small className="text-danger">{formErrors.payment_id}</small>}
          </div>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Fine Payment ID"
              value={formData.finePaymentid}
              onChange={(e) => setFormData({ ...formData, finePaymentid: e.target.value })}
            />
            {formErrors.finePaymentid && <small className="text-danger">{formErrors.finePaymentid}</small>}
          </div>

          <select
            className="form-select"
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
          >
            <option value="">Select Payment Method</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
          </select>
          {formErrors.payment_method && <small className="text-danger">{formErrors.payment_method}</small>}

          {formData.payment_method === "Card" && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Card Number"
                  value={formData.crd_number}
                  onChange={(e) => setFormData({ ...formData, crd_number: e.target.value })}
                />
                {formErrors.crd_number && <small className="text-danger">{formErrors.crd_number}</small>}
              </div>

              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Expire Date"
                  value={formData.expd_date}
                  onChange={(e) => setFormData({ ...formData, expd_date: e.target.value })}
                />
                {formErrors.expd_date && <small className="text-danger">{formErrors.expd_date}</small>}
              </div>

              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                />
                {formErrors.cvv && <small className="text-danger">{formErrors.cvv}</small>}
              </div>
            </>
          )}

          <div className="input-group">
            <input
              type="number"
              className="form-control"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            {formErrors.amount && <small className="text-danger">{formErrors.amount}</small>}
          </div>

          <button className="submit-button" type="submit">Proceed to Pay</button>
        </form>
      </div>
    </div>
  );
}