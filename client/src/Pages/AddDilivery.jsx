import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddDilivery() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser?._id || "",
    dilivery_id: "",
    fine_id: "",
    delivery_type: "",
    tracking_id: "",
    delivery_status: "",
    expected_delivery_date: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!formData.dilivery_id.trim()) errors.dilivery_id = "Delivery ID is required";
    if (!formData.fine_id.trim()) errors.fine_id = "Payment ID is required";
    if (!formData.delivery_type.trim()) errors.delivery_type = "Delivery Type is required";
    if (!formData.tracking_id.trim()) errors.tracking_id = "Tracking ID is required";
    if (!formData.delivery_status.trim()) errors.delivery_status = "Delivery Status is required";
    if (!formData.expected_delivery_date.trim()) errors.expected_delivery_date = "Expected Delivery Date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("/api/diliver/dilivery_store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to process delivery");

      Swal.fire({ icon: "success", title: "Success", text: "Delivery added successfully!" });
      navigate('/DiliveryProfile');

    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong." });
    }
  };

  useEffect(() => {
    // Set today's date as the minimum value for the expected delivery date
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setFormData((prevData) => ({
      ...prevData,
      expected_delivery_date: prevData.expected_delivery_date || today,
    }));
  }, []);

  // Auto-generate tracking ID when delivery ID changes
  const handleDeliveryIdChange = (e) => {
    const deliveryId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      dilivery_id: deliveryId,
      tracking_id: deliveryId ? `TKR${deliveryId}` : "", // Generate tracking ID
    }));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-50">
        <h2 className="text-center mb-4 text-primary">Add Delivery</h2>
        <form onSubmit={handleSubmit}>
          {/* Delivery ID */}
          <div className="mb-3">
            <label className="form-label">Delivery ID</label>
            <input
              type="text"
              className={`form-control ${formErrors.dilivery_id ? "is-invalid" : ""}`}
              placeholder="Enter Delivery ID"
              value={formData.dilivery_id}
              onChange={handleDeliveryIdChange} // Handle change event
            />
            {formErrors.dilivery_id && <div className="invalid-feedback">{formErrors.dilivery_id}</div>}
          </div>

          {/* Payment ID */}
          <div className="mb-3">
            <label className="form-label">Payment ID</label>
            <input
              type="text"
              className={`form-control ${formErrors.fine_id ? "is-invalid" : ""}`}
              placeholder="Enter Payment ID"
              value={formData.fine_id}
              onChange={(e) => setFormData({ ...formData, fine_id: e.target.value })}
            />
            {formErrors.fine_id && <div className="invalid-feedback">{formErrors.fine_id}</div>}
          </div>

          {/* Delivery Type */}
          <div className="mb-3">
            <label className="form-label">Delivery Type</label>
            <select
              className="form-control"
              value={formData.delivery_type}
              onChange={(e) => setFormData({ ...formData, delivery_type: e.target.value })}
            >
              <option value="">Select Delivery Type</option>
              <option value="fast delivery">Fast Delivery</option>
              <option value="normal delivery">Normal Delivery</option>
            </select>
            {formErrors.delivery_type && <div className="invalid-feedback">{formErrors.delivery_type}</div>}
          </div>

          {/* Tracking ID */}
          <div className="mb-3">
            <label className="form-label">Tracking ID</label>
            <input
              type="text"
              className={`form-control ${formErrors.tracking_id ? "is-invalid" : ""}`}
              placeholder="Tracking ID"
              value={formData.tracking_id}
              readOnly
            />
            {formErrors.tracking_id && <div className="invalid-feedback">{formErrors.tracking_id}</div>}
          </div>

          {/* Delivery Status */}
          <div className="mb-3">
            <label className="form-label">Delivery Status</label>
            <input
              type="text"
              className={`form-control ${formErrors.delivery_status ? "is-invalid" : ""}`}
              placeholder="Enter Delivery Status"
              value={formData.delivery_status}
              onChange={(e) => setFormData({ ...formData, delivery_status: e.target.value })}
            />
            {formErrors.delivery_status && <div className="invalid-feedback">{formErrors.delivery_status}</div>}
          </div>

          {/* Expected Delivery Date */}
          <div className="mb-3">
            <label className="form-label">Expected Delivery Date</label>
            <input
              type="date"
              className={`form-control ${formErrors.expected_delivery_date ? "is-invalid" : ""}`}
              value={formData.expected_delivery_date}
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
              onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
            />
            {formErrors.expected_delivery_date && <div className="invalid-feedback">{formErrors.expected_delivery_date}</div>}
          </div>

          {/* Submit Button */}
          <button className="btn btn-primary w-100" type="submit">
            Add Delivery
          </button>
        </form>
      </div>
    </div>
  );
}
