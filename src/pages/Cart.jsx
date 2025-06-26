import { useAppContext } from "../contexts/AppContext";
import { useEffect } from "react";

function Cart() {
  const {
    cartItems,
    fetchCart,
    updateCartQuantity,
    removeFromCart,
    cartLoading,
  } = useAppContext();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (productId, currentQuantity, type) => {
    const newQuantity =
      type === "increase" ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) return;
    updateCartQuantity(productId, newQuantity);
  };

  const totalPrice = Array.isArray(cartItems)
  ? cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  : 0;


  /*const discount = cartItems.reduce(
    (discount, item) => discount + item.product.discount,
    0
  );*/

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
            
            {Array.isArray(cartItems) &&
            cartItems?.length === 0 && (
              <p className="text-center text-muted">Your cart is empty.</p>
            )}

            {Array.isArray(cartItems) && 
              cartItems?.map((item) => (
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
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove From Cart
                      </button>

                      <button
                        className="btn btn-outline-secondary btn-sm mt-2"
                        onClick={() => removeFromCart(item._id)}
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
              <h2>Total Details</h2>
              <hr />
              <p>
                Price ({cartItems.length} items): ₹{totalPrice}
              </p>
              <hr />
              <p>Discount: -₹100 note: edit productSchema and add discount</p>
              <hr />
              <p>
                Delivery Charges: ₹40 note: add condition when delivery charges
                aplicable
              </p>
              <hr />
              <p>
                <strong>TOTAL AMOUNT: ₹{totalPrice - 100 + 40}</strong>
              </p>
              <hr />
              <p>You will save ₹100 on this order</p>
              <button className="btn btn-primary">PLACE ORDER</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
