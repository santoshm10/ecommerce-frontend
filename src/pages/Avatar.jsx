import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import useFetch from "../useFetch";
import Orders from "../components/Orders";

const Avatar = () => {
  const { userId } = useAppContext();
  const [localAvatar, setLocalAvatar] = useState({});

  const { data, loading } = useFetch(
    `https://ecommerce-backend-gules-phi.vercel.app/api/users/${userId}`
  );

  console.log("user data by user iD: ", data);
  console.log("user localAvatar by user iD: ", localAvatar);

  // Sync local state with global Avatar
  useEffect(() => {
    if (data && typeof data === "object") {
      setLocalAvatar(data);
    }
  }, [data]);

  const navigate = useNavigate();

  const handleAddNewAddress = () => {
    navigate(`/profile/${userId}/address`);
  };

  return (
    <div className="container p-4">
      {loading ? (
        <p className="text-muted">Loading user info...</p>
      ) : localAvatar && localAvatar.name ? (
        <div className="card p-3">
          <div className="row">
            <div className="col-md-4 p-3">
              <img
                className="img-fluid rounded"
                src={`${localAvatar.userAvatarUrl}?w=826`}
                alt={`${localAvatar.name}`}
              />
            </div>

            <div className="col-md-8 p-3 fs-5">
              <h2 className="mb-5">{localAvatar.name}</h2>
              <hr />
              <p>
                <strong>Email:</strong> {localAvatar.email}
              </p>
              <p>
                <strong>Phone:</strong> {localAvatar.phoneNumber}
              </p>
              <span>
                <p>
                  <strong>Address:</strong> {localAvatar.address[0]}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={handleAddNewAddress}
                >
                  Add New Address
                </button>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted mt-3">No user found.</p>
      )}

        <Orders/>
      
    </div>
  );
};

export default Avatar;
