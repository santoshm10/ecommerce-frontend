import { useAppContext } from "../contexts/AppContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
    handleAddToCart,
    userId,
    handleCartAlert,
    fetchWishlist,
    wishlistLoading,
    fetchCart,
  } = useAppContext();

  // Fetch wishlist and cart on page load
  useEffect(() => {
    fetchWishlist();
    fetchCart();
  }, []);

  const handleRemoveFromWishlist = async (itemId) => {
    await removeFromWishlist(itemId);
  };

  const moveToCart = async (item) => {
    await handleAddToCart(item.user, item.product._id, item.quantity);
    await removeFromWishlist(item._id);
  };

  if (wishlistLoading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container-fluid py-4">
      <h3 className="text-center mb-4">My Wishlist</h3>
      <div className="row">
        {Array.isArray(wishlistItems) && wishlistItems.length === 0 && (
          <p className="text-center w-100">No products in wishlist.</p>
        )}

        {Array.isArray(wishlistItems) &&
          wishlistItems.map((item) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              key={item._id}
            >
              <div className="card h-100 d-flex flex-column">
                <Link to={`/products/${item.product._id}`}>
                  <img
                    src={item.product.imageUrls[0]}
                    alt={item.product.name}
                    className="card-img-top img-fluid bg-light p-2"
                    style={{ objectFit: "contain", height: 200 }}
                  />
                </Link>
                <div className="card-body d-flex flex-column text-center">
                  <p className="card-title">
                    <strong>{item.product.name}</strong>
                  </p>
                  <p className="card-text">₹ {item.product.price}</p>

                  <div className="mt-auto d-grid gap-2">
                    {userId ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => moveToCart(item)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={handleCartAlert}
                      >
                        Add to Cart
                      </button>
                    )}

                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveFromWishlist(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Wishlist;
