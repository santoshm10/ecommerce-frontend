import React, { useState } from "react";
import { useParams } from "react-router-dom"

const AddAddress = () => {
  const { userId } = useParams()

  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!address.trim()) {
      setError("Address field cannot be empty.");
      return;
    }
    console.log("userId: ", userId);
    console.log("address: ", address);
    console.log("Type of userId:", typeof userId);
    console.log("Type of address:", typeof address);

    try {
      console.log("userId1: ", userId);
      console.log("address1: ", address);
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/users/${userId}/address`,
        
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            address: address , // API expects array of strings
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage("Address added successfully!");
      setAddress(""); // clear input
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Add New Address</h4>
      <form onSubmit={handleAddAddress}>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Enter your full address"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Add Address
        </button>
      </form>

      {message && <p className="text-success mt-2">{message}</p>}
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default AddAddress;
