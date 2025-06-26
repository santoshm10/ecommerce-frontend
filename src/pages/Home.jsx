import useFetch from "../useFetch";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { data, loading, error } = useFetch(
    "https://ecommerce-backend-gules-phi.vercel.app/api/category"
  );

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/products/category/${categoryName}`);
  };

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
        <div className="row">
          {data?.map((category) => (
            <div className="col" key={category._id}>
              <div
                className="card text-decoration-none text-dark"
                onClick={() => handleCategoryClick(category.category)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <img
                    src="https://www.pngall.com/wp-content/uploads/2016/05/Jacket-PNG.png"
                    alt={category.category}
                    className="img-thumbnail"
                  />
                  <h5 className="card-title text-center mt-2">
                    {category.category}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <img
            src="https://placehold.co/1100x400"
            alt="Hero banner"
            className="py-4 img-fluid center"
          />
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="row g-0 bg-dark-subtle">
                <div className="col-md-4">
                  <img
                    src="https://placehold.co/50x70/000000/FFF"
                    className="card-img p-4"
                    alt="New Arrival"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <p className="card-text">
                      <small className="text-body-secondary">NEW ARRIVAL</small>
                    </p>
                    <div className="mt-5">
                      <h5 className="card-title">Summer Collection</h5>
                      <p className="card-text">
                        Checkout best summer collection to stay cool this
                        summer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-3">
              <div className="row g-0 bg-dark-subtle">
                <div className="col-md-4">
                  <img
                    src="https://placehold.co/50x70/000000/FFF"
                    className="card-img p-4"
                    alt="New Arrival"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <p className="card-text">
                      <small className="text-body-secondary">NEW ARRIVAL</small>
                    </p>
                    <div className="mt-5">
                      <h5 className="card-title">Summer Collection</h5>
                      <p className="card-text">
                        Checkout best summer collection to stay cool this
                        summer.
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
