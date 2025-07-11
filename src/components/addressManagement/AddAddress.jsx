import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../useFetch";

const AddAddress = () => {
  const { userId } = useParams();

  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [localAddress, setLocalAddress] = useState("");

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
            address: address, // API expects array of strings
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setLocalAddress((prev) => ({
        ...prev,
        address: [...(prev?.address || []), address],
      }));

      setMessage("Address added successfully!");
      setAddress(""); // clear input
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAddress = async (index) => {
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/users/${userId}/address/${index}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete address");
      }

      setLocalAddress((prev) => ({
        ...prev,
        address: prev.address.filter((_, i) => i !== index),
      }));

      setMessage("Address deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const { data } = useFetch(
    `https://ecommerce-backend-gules-phi.vercel.app/api/users/${userId}`
  );

  //console.log("Add Address page data checking is Array: ", Array.isArray(data), Array.isArray(data.address));
  

  // Sync local state with global address
  useEffect(() => {
    setLocalAddress(data || []);
  }, [data, setLocalAddress]);

  console.log("localAddress: ", localAddress.address);
  

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

      <div className="row">
        {Array.isArray(localAddress?.address) &&
        localAddress.address.length > 0 ? (
          localAddress.address.map((addr, index) => (
            <div className="col-md-3 mt-3" key={index}>
              <div className="card mb-2">
                <div className="card-body">{addr}</div>
                <button
                  className="btn btn-sm btn-danger m-2"
                  onClick={() => handleDeleteAddress(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted mt-3">No addresses found.</p>
        )}
      </div>
    </div>
  );
};

export default AddAddress;
