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

  // Handle removing item from wishlist
  const handleRemoveFromWishlist = async (itemId) => {
    await removeFromWishlist(itemId);
  };

  // Move to cart and remove from wishlist
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
    <div className="container mt-4">
      <div className="row">
        {Array.isArray(wishlistItems) && wishlistItems.length === 0 && (
          <p className="text-center">No products in wishlist.</p>
        )}

        {Array.isArray(wishlistItems) &&
          wishlistItems.map((item) => (
            <div className="col-md-3 mt-3" key={item._id}>
              <div className="card">
                <Link to={`/products/${item.product._id}`}>
                  <img
                    src={item.product.imageUrls[0]}
                    alt={item.product.name}
                    className="card-img-top img-fluid bg-light py-2"
                  />
                </Link>
                <div className="card-body text-center">
                  <p className="card-title">
                    <strong>{item.product.name}</strong>
                  </p>
                  <p className="card-text">₹ {item.product.price}</p>

                  <div className="d-grid">
                    {userId ? (
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => moveToCart(item)}
                      >
                        Add to cart
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mt-2"
                        onClick={handleCartAlert}
                      >
                        Add to cart
                      </button>
                    )}

                    <button
                      className="btn btn-danger mt-2"
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
