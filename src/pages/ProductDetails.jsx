import StarRating from "../components/StarRating";
import useFetch from "../useFetch";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const ProductDetails = () => {
  const { count, reduce, increse, handleAddToCart, handleCartAlert, userId } =
    useAppContext();
  const { productId } = useParams();
  const { data, loading, error } = useFetch(
    "https://ecommerce-backend-gules-phi.vercel.app/api/products"
  );

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error) return <p>Error: {error}</p>;
  if (!data || !Array.isArray(data)) return <p>No data found.</p>;

  const selectedProduct = data.find((product) => product._id === productId);

  // ⛔️ Important: guard against undefined product
  if (!selectedProduct) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="bg-body-tertiary">
      <div className="container bg-white">
        <div className="row">
          <div className="col-md-3">
            <img
              src={selectedProduct.imageUrls?.[0]}
              alt={selectedProduct.name}
              className="img-fluid bg-light"
            />
            <div className="d-grid gap-2">
              <button className="btn btn-primary mt-2">Buy Now</button>

              <div className="d-grid">
                {userId ? (
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() =>
                      handleAddToCart(userId, selectedProduct._id, count)
                    }
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
              </div>
            </div>
          </div>

          <div className="col-md-6 ms-3">
            <h3>{selectedProduct.name}</h3>
            <div className="d-flex align-items-center gap-2">
              <p className="mb-0">{selectedProduct.rating}</p>
              <span>
                <StarRating rating={selectedProduct.rating} />
              </span>
            </div>

            <p className="fs-4 text">
              <strong>₹{selectedProduct.price}</strong>
            </p>

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
            </div>
            <div className="py-3">
              <span className="fs-5 fw-bold border border-secondary px-4 py-1">
                {selectedProduct.size}
              </span>
            </div>

            <hr />

            <div className="d-flex align-items-center gap-2 pt-3">
              <span className="fs-5 text-center px-4 py-1">
                <i className="bi bi-box-seam bg-light px-3 py-3 rounded-circle fs-1"></i>{" "}
                <br /> <br />
                {selectedProduct.returnPolicy}
              </span>
              <span className="fs-5 text-center px-4 py-1">
                <i className="bi bi-cash-coin bg-light px-3 py-3 rounded-circle fs-1"></i>{" "}
                <br /> <br />
                {selectedProduct.isPayOnDelivery
                  ? "Cash On Delivery"
                  : "Pay Before Delivery"}
              </span>
              <span className="fs-5 px-4 py-1 text-center">
                <i className="bi bi-truck bg-light px-3 py-3 rounded-circle fs-1"></i>{" "}
                <br /> <br />
                {selectedProduct.isFreeDelivery
                  ? "Free Delivery"
                  : "Delivery Charges"}
              </span>
              <span className="fs-5 text-center px-4 py-1">
                <i className="bi bi-credit-card-fill bg-light px-3 py-3 rounded-circle fs-1"></i>{" "}
                <br /> <br />
                {selectedProduct.isSequrePayment ? "Secure Payment" : "No"}
              </span>
            </div>
            <hr />

            <div>
              <p>
                <strong>Description:</strong>
              </p>

              <ul>
                {selectedProduct.description
                  .split(".")
                  .map((sentence, index) =>
                    sentence.trim() ? (
                      <li key={index}>{sentence.trim()}.</li>
                    ) : null
                  )}
              </ul>
            </div>
          </div>
        </div>
        <hr />
        <h3>More items you may like in apparel</h3>
      </div>
    </div>
  );
};

export default ProductDetails;
