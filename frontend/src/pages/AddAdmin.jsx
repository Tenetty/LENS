import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/spinner/LoadingSpinner";

const AddAdmin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Passwords do not match!",
      });
      return;
    }

    if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Missing required fields!",
      });
      return;
    }

    if (!email.includes("@")) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter a valid email address",
      });
      return;
    }

    if (mobile.length !== 10) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Mobile number must be exactly 10 digits",
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Add this new Admin?",
      text: "This user will have full administrative controls.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Create Admin",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axios.post("auth/register-admin", {
          name,
          email,
          mobile,
          country,
          password,
        });
        setLoading(false);
        Swal.fire("Success!", "New Admin registered successfully!", "success");
        navigate("/users");
      } catch (err) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: err.response?.data?.message || err.message,
        });
      }
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8 md:px-24 p-4 sm:py-8">
        <div className="flex flex-col justify-center items-center md:py-36 py-10 gap-5 rounded-lg md:m-20 m-5 bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
          <div className="text-center mx-6 pt-3 pb-3">
            <h1 className="text-4xl font-bold text-red-500">Add Admin</h1>
            <p className="text-gray-500 mt-4 text-sm max-w-xs leading-relaxed">
              Create a new administrative user. New admin accounts will be granted full root permissions to manage users, approve hotels, and oversee system records.
            </p>
          </div>
          <div className="mt-4 border-t w-full pt-6 flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-3xl font-bold">
              A
            </div>
            <span className="text-xs font-semibold uppercase text-red-500 mt-2 tracking-wider">Root Role</span>
          </div>
        </div>
        
        <div className="grid rounded-lg items-center bg-white p-6">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-2">Admin Details</h2>
            
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg placeholder-gray-400 text-gray-600 bg-white border border-gray-300 outline-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg placeholder-gray-400 text-gray-600 bg-white border border-gray-300 outline-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 rounded-lg placeholder-gray-400 text-gray-600 bg-white border border-gray-300 outline-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            
            <input
              type="text"
              placeholder="Mobile (10 digits)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-2 rounded-lg placeholder-gray-400 text-gray-600 bg-white border border-gray-300 outline-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg placeholder-gray-400 text-gray-600 bg-white border border-gray-300 outline-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg placeholder-gray-400 text-gray-600 bg-white border border-gray-300 outline-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            
            {loading && <Spinner />}
            
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition duration-150 mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Add Admin Account"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAdmin;
