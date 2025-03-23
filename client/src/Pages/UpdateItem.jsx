import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './css/updateitem.css';
import { app } from '../firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';

function UpdateDiliver() {
  const [imagePercent, setImagePercent] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef1 = useRef(null);

  const [image1, setImage1] = useState(undefined);
  const [image2, setImage2] = useState(undefined);
  const [updatediscount, setupdatediscount] = useState({
    dilivery_id: "",
    fine_id: "",
    delivery_type: "",
    tracking_id: "",
    delivery_status: "",
    expected_delivery_date: "",
  });

  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  useEffect(() => {
    if (image2) {
      handleFileUpload(image2, 'alternateProfilePicture');
    }
  }, [image2]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        console.error('Image upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setupdatediscount((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    if (fileRef1.current) {
      fileRef1.current.click();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/diliver/Dilivergetitem/${id}`);
        const data = await response.json();
        console.log(data);

        if (data.success) {
          setupdatediscount(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    setupdatediscount({
      ...updatediscount,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/diliver/updatediliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatediscount._id,
          ...updatediscount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Updated successfully");
        navigate('/DiliveryProfile');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
 
  return (
    <div className="service-update">
      <input
        type="text"
        placeholder="ProductId"
        id="dilivery_id"
        name="dilivery_id"
        onChange={handleInputChange}
        value={updatediscount?.dilivery_id}
      />
      <input
        type="text"
        placeholder="productName"
        id="fine_id"
        name="fine_id"
        onChange={handleInputChange}
        value={updatediscount?.fine_id}
      />
      <input
        type="text"
        placeholder="description"
        id="delivery_type"
        name="delivery_type"
        onChange={handleInputChange}
        value={updatediscount?.delivery_type}
      />
      <input
        type="text"
        placeholder="price"
        id="tracking_id"
        name="tracking_id"
        onChange={handleInputChange}
        value={updatediscount?.tracking_id}
      />
      <input
        type="text"
        placeholder="percentage"
        id="delivery_status"
        name="delivery_status"
        onChange={handleInputChange}
        value={updatediscount?.delivery_status}
      />
      <input
        type="text"
        placeholder="finalprice"
        id="expected_delivery_date"
        name="expected_delivery_date"
        onChange={handleInputChange}
        value={updatediscount?.expected_delivery_date}
      />
 

     

      <button className="update-btn" onClick={handleUpdate}>
        Update Details
      </button>
      <br />
      <br />
    </div>
  );
}

export default UpdateDiliver;
