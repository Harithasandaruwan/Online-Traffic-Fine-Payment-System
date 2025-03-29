import { motion } from "framer-motion";
import Input from "../User Tools/Input";
import { Loader, Lock, Mail, User, Phone, IdCard } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../User Tools/PasswordStrengthMeter";
import { useAuthStore } from "../User Tools/authStore";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [NICNumber, setNICNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { updateProfile, error, isLoading } = useAuthStore();

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      await updateProfile(firstName, lastName, email, phoneNumber, NICNumber);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 via-[#C68EFD] to-emerald-500 text-transparent bg-clip-text">
          Update Account
        </h2>

        <form onSubmit={handleUpdate}>
          <Input
            icon={User}
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            icon={User}
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Phone}
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Input
            icon={IdCard}
            type="text"
            placeholder="NIC Number"
            value={NICNumber}
            onChange={(e) => setNICNumber(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <PasswordStrengthMeter password={password} />

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-[#C68EFD] text-white 
						font-bold rounded-lg shadow-lg hover:bg-[#B07CE5] 
						focus:outline-none focus:ring-2 focus:ring-[#C68EFD] focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className=" animate-spin mx-auto" size={24} />
            ) : (
              "Update"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <Link to={"/profile"} className="text-[#C68EFD] hover:underline">
          Back to the Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default SignUp;
