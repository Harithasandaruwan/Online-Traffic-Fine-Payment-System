import { useState, useEffect } from "react";
import axios from "axios";

const GetUser = () => {
  const [file, setFile] = useState();

  const handleUpload = (e) => {
    const formdata = new FormData();
    formdata.append('file', file);
    axios.post('http://localhost:3000/api/fine/upload', formdata, {
  headers: { "Content-Type": "multipart/form-data" }
})
.then(res => console.log(res))
.catch(err => console.log(err));
};
  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload} >Upload</button>
    </div>
  );
};

export default GetUser;
