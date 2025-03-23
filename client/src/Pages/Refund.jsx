import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/refund.css";

export default function Refund() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser?._id || "",
    ticket_nb: "",
    Name: "",
    refund_Amount: "",
    refund_reason: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.ticket_nb.trim()) {
      errors.ticket_nb = "Ticket Number is required";
    }

    if (!formData.Name.trim()) {
      errors.Name = "Name is required";
    }

    if (!formData.refund_Amount.trim() || isNaN(formData.refund_Amount) || Number(formData.refund_Amount) <= 0) {
      errors.refund_Amount = "Valid refund amount is required";
    }

    if (!formData.refund_reason.trim()) {
      errors.refund_reason = "Refund reason is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("/api/refund/refund_store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to process refund");
      Swal.fire({ icon: "success", title: "Success", text: "Refund successful" });
      navigate("/refunds");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong." });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="refund-payment-container">
        <h2 className="text-center mb-4 text-primary">Refund Payment</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Ticket Number"
              name="ticket_nb"
              value={formData.ticket_nb}
              onChange={handleChange}
            />
            {formErrors.ticket_nb && <p className="error">{formErrors.ticket_nb}</p>}
          </div>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            />
            {formErrors.Name && <p className="error">{formErrors.Name}</p>}
          </div>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Refund Amount"
              name="refund_Amount"
              value={formData.refund_Amount}
              onChange={handleChange}
            />
            {formErrors.refund_Amount && <p className="error">{formErrors.refund_Amount}</p>}
          </div>

          <div className="input-group">
            <textarea
              className="form-control"
              placeholder="Reason for Refund"
              name="refund_reason"
              value={formData.refund_reason}
              onChange={handleChange}
            />
            {formErrors.refund_reason && <p className="error">{formErrors.refund_reason}</p>}
          </div>

          <br />
          <button className="submit-button" type="submit">Refund Money</button>
        </form>
      </div>
    </div>
  );
}
