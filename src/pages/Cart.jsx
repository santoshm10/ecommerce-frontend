import { useAppContext } from "../contexts/AppContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Cart() {
  const {
    cartItems,
    fetchCart,
    updateCartQuantity,
    removeFromCart,
    cartLoading,
    handleAddToWishlist,
    localCartItems,
    setLocalCartItems,
    userId
  } = useAppContext();

   const navigate = useNavigate();

   const handleAddNewAddress = () => {
    navigate(`/profile/${userId}/address`);
  };

  // Fetch cart initially
  useEffect(() => {
    fetchCart();
  }, []);

  // Sync local state with global cartItems
  useEffect(() => {
    setLocalCartItems(cartItems || []);
  }, [cartItems, setLocalCartItems]);

  // Handle Quantity Change
  const handleQuantityChange = (productId, currentQuantity, type) => {
    const newQuantity =
      type === "increase" ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) return;

    // Optimistically update local cart
    const updatedCart = localCartItems.map((item) =>
      item.product._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setLocalCartItems(updatedCart);

    // Update backend
    updateCartQuantity(productId, newQuantity);
  };

  // Handle Remove from Cart
  const handleRemoveFromCart = (itemId) => {
    setLocalCartItems((prev) => prev.filter((item) => item._id !== itemId));
    removeFromCart(itemId);
  };

  // Handle Move to Wishlist
  const moveToWishlist = async (item) => {
    setLocalCartItems((prev) => prev.filter((i) => i._id !== item._id));
    await handleAddToWishlist(item.user, item.product._id, item.quantity);
    await removeFromCart(item._id);
  };

  // Calculations
  const totalPrice = Array.isArray(localCartItems)
    ? localCartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      )
    : 0;

  const totalDiscount = Array.isArray(localCartItems)
    ? localCartItems.reduce((total, item) => {
        const price = item.product.price;
        const discountPercent = item.product.discount || 0;
        const quantity = item.quantity;
        const discountAmount = (price * discountPercent * quantity) / 100;
        return total + discountAmount;
      }, 0)
    : 0;

  const finalPrice = totalPrice - totalDiscount;

  const totalItems = Array.isArray(localCartItems)
    ? localCartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const deliveryCharges = Array.isArray(localCartItems)
    ? localCartItems.some((item) => item.product.isFreeDelivery === false)
      ? 400
      : 0
    : 0;

  if (cartLoading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="bg-body-tertiary">
      <div className="container bg-white">
        <div className="row">
          <div className="col-md-6">
            {Array.isArray(localCartItems) && localCartItems.length === 0 && (
              <p className="text-center text-muted">Your cart is empty.</p>
            )}

            {Array.isArray(localCartItems) &&
              localCartItems.map((item) => (
                <div className="card my-2" key={item._id}>
                  <div className="row">
                    <div className="col-md-6">
                      <img
                        className="card-img img-fluid"
                        src={item.product.imageUrls[0]}
                        alt={item.product.name}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="card-body">
                        <h5>{item.product.name}</h5>
                        <p>₹{item.product.price}</p>
                        <div className="d-flex align-items-center gap-2">
                          <p className="mb-0 fs-5">Qty:</p>
                          <button
                            className="btn btn-outline-secondary rounded-circle"
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity,
                                "decrease"
                              )
                            }
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary rounded-circle"
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity,
                                "increase"
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="btn btn-secondary btn-sm mt-2"
                          onClick={() => handleRemoveFromCart(item._id)}
                        >
                          Remove From Cart
                        </button>

                        <button
                          className="btn btn-outline-secondary btn-sm mt-2"
                          onClick={() => moveToWishlist(item)}
                        >
                          Move to Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="col-md-6">
            <div className="card py-4 px-4 my-2">
              <div className="card-body">
                <h3 className="card-title mb-3">Delivery Address</h3>
                <hr />

                <label className="mb-3">
                  <input
                    type="radio"
                    name="address"
                    id="defaultAddress"
                    className="me-2"
                  />
                  Default Address
                </label>

                <div className="d-flex gap-3">
                  <button className="btn btn-primary">Choose Address</button>
                  <button className="btn btn-primary" onClick={handleAddNewAddress}>Add New Address</button>
                </div>
              </div>
            </div>

            <div className="card py-4 px-4 my-2">
              <h3>Total Details</h3>
              <hr />
              <p>
                Price ({totalItems} items): ₹{totalPrice}
              </p>
              <hr />
              <p>Discount: -₹{totalDiscount}</p>
              <hr />
              <p>Delivery Charges: ₹{deliveryCharges}</p>
              <hr />
              <p>
                <strong>TOTAL AMOUNT: ₹{finalPrice + deliveryCharges}</strong>
              </p>
              <hr />
              <p>You will save ₹{totalDiscount} on this order</p>
              <button className="btn btn-primary">PLACE ORDER</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
