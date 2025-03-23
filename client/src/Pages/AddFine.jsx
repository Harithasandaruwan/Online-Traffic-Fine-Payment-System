import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddFine() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser?._id || "",
    fine_id: "",
    amount: "",
    status: "",
    issue_date: "",
    due_date: "",
    description: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    if (!formData.fine_id.trim()) errors.fine_id = "Fine ID is required";
    if (!formData.amount.trim() || isNaN(formData.amount)) errors.amount = "Valid amount is required";
    if (!formData.status.trim()) errors.status = "Status is required";
    if (!formData.issue_date) errors.issue_date = "Issued date is required";
    if (!formData.due_date) errors.due_date = "Due date is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("/api/fine/add_fine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to process Fine");

      Swal.fire({ icon: "success", title: "Success", text: "Fine added successfully!" });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong." });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-50">
        <h2 className="text-center mb-4 text-primary">Add Fine</h2>
        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div className="mb-3" key={key}>
              <label className="form-label text-capitalize">{key.replace("_", " ")}</label>
              <input
                type={key.includes("date") ? "date" : "text"}
                className={`form-control ${formErrors[key] ? "is-invalid" : ""}`}
                placeholder={`Enter ${key.replace("_", " ")}`}
                value={value}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              />
              {formErrors[key] && <div className="invalid-feedback">{formErrors[key]}</div>}
            </div>
          ))}
          <button className="btn btn-primary w-100" type="submit">Add Fine</button>
        </form>
      </div>
    </div>
  );
}
