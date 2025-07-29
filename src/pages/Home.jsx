import useFetch from "../useFetch";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useEffect } from "react";

const Home = () => {
  const { fetchCart, fetchWishlist } = useAppContext();

  const { data, loading, error } = useFetch(
    "https://ecommerce-backend-gules-phi.vercel.app/api/category"
  );

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/products/category/${categoryName}`);
  };

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="container py-4">

        {/* Category Section */}
        <div className="row justify-content-center">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item) => (
              <div
                className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3 d-flex justify-content-center"
                key={item._id}
              >
                <div
                  className="card text-decoration-none text-dark"
                  onClick={() => handleCategoryClick(item.category)}
                  style={{ cursor: "pointer", maxWidth: "200px", width: "100%" }}
                >
                  <div className="card-body">
                    <img
                      src="https://www.pngall.com/wp-content/uploads/2016/05/Jacket-PNG.png"
                      alt={item.category}
                      className="img-thumbnail"
                    />
                    <h5 className="card-title text-center mt-2">
                      {item.category}
                    </h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && <p>No categories found.</p>
          )}
        </div>

        {/* Banner Image */}
        <div className="row">
          <div className="col-12">
            <img
              src="https://placehold.co/1100x400"
              alt="Hero banner"
              className="img-fluid w-100 py-4 rounded"
            />
          </div>
        </div>

        {/* New Arrivals Section */}
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <div className="card h-100">
              <div className="row g-0 bg-dark-subtle h-100">
                <div className="col-4">
                  <img
                    src="https://placehold.co/50x70/000000/FFF"
                    className="card-img p-4"
                    alt="New Arrival"
                  />
                </div>
                <div className="col-8">
                  <div className="card-body d-flex flex-column justify-content-between h-100">
                    <div>
                      <p className="card-text">
                        <small className="text-body-secondary">NEW ARRIVAL</small>
                      </p>
                    </div>
                    <div>
                      <h5 className="card-title">Summer Collection</h5>
                      <p className="card-text">
                        Checkout best summer collection to stay cool this summer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="card h-100">
              <div className="row g-0 bg-dark-subtle h-100">
                <div className="col-4">
                  <img
                    src="https://placehold.co/50x70/000000/FFF"
                    className="card-img p-4"
                    alt="New Arrival"
                  />
                </div>
                <div className="col-8">
                  <div className="card-body d-flex flex-column justify-content-between h-100">
                    <div>
                      <p className="card-text">
                        <small className="text-body-secondary">NEW ARRIVAL</small>
                      </p>
                    </div>
                    <div>
                      <h5 className="card-title">Summer Collection</h5>
                      <p className="card-text">
                        Checkout best summer collection to stay cool this summer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default Home;
