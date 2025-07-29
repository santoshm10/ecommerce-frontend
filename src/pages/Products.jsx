import useFetch from "../useFetch";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { category: routeCategory } = useParams();
  const navigate = useNavigate();

  const {
    category,
    selectCategory,
    clearFilter,
    ratingFilter,
    rating,
    sortByFilter,
    sort,
    handleAddToCart,
    count,
    userId,
    priceRange,
    priceFilter,
    searchQuery,
    handleAddToWishlist,
    cartItems,
    wishlistItems,
    fetchCart,
    fetchWishlist
  } = useAppContext();

  const { data, loading, error } = useFetch(
    "https://ecommerce-backend-gules-phi.vercel.app/api/products"
  );

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleGoToWishlist = () => {
    navigate("/wishlist");
  };

  const onAddToCart = async (product) => {
    const alreadyInCart = cartItems?.some(
      (item) =>
        item?.product?._id === product._id ||
        item?._id === product._id ||
        item?.product === product._id
    );
    if (!alreadyInCart) {
      await handleAddToCart(userId, product, count);
      fetchCart();
    }
  };

  const onMoveToWishlist = async (product) => {
    const alreadyInWishlist = wishlistItems.some(
      (item) => item.product._id === product._id
    );
    if (!alreadyInWishlist) {
      await handleAddToWishlist(userId, product._id, product.quantity);
      fetchWishlist()
    }
  };

  const productList = Array.isArray(data) ? data : [];

  const filteredData =
    productList.filter((product) => {
      const categoryMatch =
        category.length > 0
          ? category.includes(product.category?.category)
          : true;

      const ratingMatch = rating !== null ? product.rating >= rating : true;

      const priceMatch = product.price <= priceRange.max;

      const searchMatch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return categoryMatch && ratingMatch && priceMatch && searchMatch;
    }) || [];

  useEffect(() => {
    if (routeCategory && routeCategory !== "All") {
      selectCategory({ target: { value: routeCategory, checked: true } });
    }
  }, [routeCategory, selectCategory]);

  const sortedData =
    filteredData.length > 0
      ? [...filteredData].sort((a, b) => {
          if (sort === "ascending") return a.price - b.price;
          if (sort === "descending") return b.price - a.price;
          return 0;
        })
      : filteredData;

  // Fetch cart initially
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
      <div className="  bg-dark-subtle">
        <div className="">
          <div className="row">
            <div className="col-md-3 pt-4 ps-5 bg-white">
              <div className="d-flex aline-item-center gap-2">
                <h3>Filters</h3>{" "}
                <button
                  className="btn btn-link link-dark justify-content-end"
                  onClick={clearFilter}
                >
                  Clear
                </button>
              </div>
              <div>
                <p>
                  <strong>Price Range</strong>
                </p>
                <label htmlFor="priceRange" className="form-label">
                  Up to ₹{priceRange.max}
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="priceRange"
                  name="max"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange.max}
                  onChange={priceFilter}
                />
                <p>
                  <strong>Category</strong>
                </p>
                <input
                  type="checkbox"
                  id="men"
                  value="Men"
                  onChange={selectCategory}
                />
                <label htmlFor="men">Men clothing</label> <br />

                <input
                  type="checkbox"
                  id="women"
                  value="Women"
                  onChange={selectCategory}
                />
                <label htmlFor="women">Women clothing</label> <br />

                <input
                  type="checkbox"
                  id="kids"
                  value="Kids"
                  onChange={selectCategory}
                />
                <label htmlFor="kids">Kids clothing</label> <br />

                <input
                  type="checkbox"
                  id="electronics"
                  value="Electronics"
                  onChange={selectCategory}
                />
                <label htmlFor="electronics">Electronics</label> <br />

                <input
                  type="checkbox"
                  id="home"
                  value="Home"
                  onChange={selectCategory}
                />
                <label htmlFor="home">Home</label>

              </div>{" "}
              <br />
              <div>
                <p>
                  <strong>Rating</strong>
                </p>
                <input
                  type="radio"
                  name="rating"
                  id="4StarAbove"
                  value="4"
                  onChange={ratingFilter}
                />{" "}
                4 Star & Above <br />
                <input
                  type="radio"
                  name="rating"
                  id="3StarAbove"
                  value="3"
                  onChange={ratingFilter}
                />{" "}
                3 Star & Above <br />
                <input
                  type="radio"
                  name="rating"
                  id="2StarAbove"
                  value="2"
                  onChange={ratingFilter}
                />{" "}
                2 Star & Above <br />
                <input
                  type="radio"
                  name="rating"
                  id="1StarAbove"
                  value="1"
                  onChange={ratingFilter}
                />{" "}
                1 Star & Above
              </div>{" "}
              <br />
              <div>
                <p>
                  <strong>Sort By</strong>
                </p>
                <input
                  type="radio"
                  name="sortBy"
                  id="4StarAbove"
                  value="ascending"
                  onChange={sortByFilter}
                />{" "}
                Price - Low to High <br />
                <input
                  type="radio"
                  name="sortBy"
                  id="3StarAbove"
                  value="descending"
                  onChange={sortByFilter}
                />{" "}
                Price - High to Low
              </div>
            </div>
            <div className="col-md-9 ">
              <div className="">
                <div className="row">
                  {sortedData.length === 0 && (
                    <p className="text-center">
                      No products found in this category.
                    </p>
                  )}

                  {sortedData?.map((product) => (
                    <div className="col-md-3 mt-3" key={product._id}>
                      <div className="card ">
                        <Link to={`/products/${product._id}`}>
                          <img
                            src={product.imageUrls[0]}
                            alt=""
                            className="card-img-top img-fluid bg-light py-2"
                          />
                        </Link>
                        <div className="card-body text-center">
                          <p className="card-title center">
                            <strong>{product.name}</strong>
                          </p>
                          <p className="card-text">RS. {product.price}</p>

                          <div className="d-grid">
                            {userId &&
                            cartItems?.some(
                              (item) =>
                                item?.product?._id === product._id ||
                                item?._id === product._id ||
                                item?.product === product._id
                            ) ? (
                              <button
                                className="btn btn-outline-success mt-2"
                                onClick={handleGoToCart}
                              >
                                Go To Cart
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary mt-2"
                                onClick={() => onAddToCart(product)}
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>

                          <div className="d-grid">
                            {userId &&
                            wishlistItems?.find(
                              (item) =>
                                item?.product?._id === product._id ||
                                item?._id === product._id ||
                                item?.product === product._id
                            ) ? (
                              <button
                                className="btn btn-outline-success mt-2"
                                onClick={handleGoToWishlist}
                              >
                                Go To Wishlist
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary mt-2"
                                onClick={() => onMoveToWishlist(product)}
                              >
                                Add to Wishlist
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
