import useFetch from "../useFetch";
import { useAppContext } from "../contexts/AppContext";

function Cart() {
  const { count, reduce, increse } = useAppContext();
  const { data, loading, error } = useFetch(
    "https://ecommerce-backend-gules-phi.vercel.app/api/cart"
  );

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !Array.isArray(data)) return <p>No data found.</p>;

  console.log("All Data:", data);
  console.log("checking it is array or not:", Array.isArray(data)); // Should print `true`

  const cartProducts = Array.isArray(data) ? data : [];

  console.log("Product details:", cartProducts);

  return (
    <>
      <div className="bg-body-tertiary">
        <div className="container bg-white">
          <div className="row">
            <div className="col md-6">
              {cartProducts?.map((product) => (
                <div className="card my-2">
                  <div className="row">
                    <div className="col md-6">
                      <img
                        className="card-img bg-body-tertiary img-fluid"
                        src={product?.product?.imageUrls[0] || "https://www.pngall.com/wp-content/uploads/2016/05/Jacket-PNG.png"}
                        alt={product?.name || "Product Image"}
                      />
                    </div>
                    <div className="col md-6">
                      <div className="card-body">
                        <h3 className="card-title ">{product.product.name}</h3>
                        <p className="card-text fs-4 text">₹{product.product.price}</p>
                        <div className="d-flex align-items-center gap-2">
                          <p className="mb-0 fs-5 ">Quantity: </p>
                          <button
                            className="btn btn-outline-secondary rounded-circle"
                            onClick={reduce}
                          >
                            -
                          </button>
                          <span className="fs-5 fw-bold border border-secondary px-4 py-1">
                            {count}
                          </span>
                          <button
                            className="btn btn-outline-secondary rounded-circle "
                            onClick={increse}
                          >
                            +
                          </button>
                        </div>{" "}
                        <br />
                        <div className="d-grid gap-2">
                          <button className="btn btn-primary mt-2">
                            Remove From Cart
                          </button>
                          <button className="btn btn-secondary mt-2">
                            Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col md-6">
              <div className="card py-4 px-4 my-2">
                <h2>Total Details</h2>
                <hr />
                <p>Price ({count} Item): 2000</p>
                <hr />
                <p>Discount: -1000</p>
                <hr />
                <p>Delivery Charges: 400</p>
                <hr />
                <p>
                  <strong>TOTAL AMOUNT: 2400</strong>
                </p>
                <hr />
                <p>You will save 1000 on this order</p>
                <button className="btn btn-primary">PLACE ORDER</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
