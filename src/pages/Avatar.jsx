import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import useFetch from "../useFetch";

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

      <div className="">
        <h2 className="py-3">Order History</h2>
        <div class="card">
          <div class="card-header">
            <strong>Status: </strong>Delivered <small>Date: 09-07-2025</small>
          </div>
          <div class="card-body">
            <div class="row g-0">
              <div class="col-md-3">
                <img
                  src="https://www.pngall.com/wp-content/uploads/2016/05/Jacket-PNG.png"
                  class=" img-fluid rounded mx-auto d-block w-50"
                  alt="..."
                />
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <h5 class="card-title">Card title</h5>
                  <p class="card-text">
                    This is a wider card with supporting text below as a natural
                    lead-in to additional content. This content is a little bit
                    longer.
                  </p>
                  <button class="btn btn-primary">View Item</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
