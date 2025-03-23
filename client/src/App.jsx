import { Route, Routes } from "react-router-dom";

//User Management System
import SignUp from "./components/User/SignUp";
import Login from "./components/User/Login";

function App() {

  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
