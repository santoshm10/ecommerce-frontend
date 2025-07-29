import useFetch from "../useFetch";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";

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
    fetchWishlist,
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
      fetchWishlist();
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
    <div className="container-fluid bg-dark-subtle py-3">
      <div className="row flex-column flex-md-row">
        {/* Sidebar Filters */}
        <div className="col-12 col-md-3 bg-white px-4 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <h4>Filters</h4>
            <button
              className="btn btn-link link-dark p-0"
              onClick={clearFilter}
            >
              Clear
            </button>
          </div>

          <div>
            <p><strong>Price Range</strong></p>
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
          </div>

          <div>
            <p><strong>Category</strong></p>
            {["Men", "Women", "Kids", "Electronics", "Home"].map((cat) => (
              <div key={cat}>
                <input
                  type="checkbox"
                  id={cat}
                  value={cat}
                  onChange={selectCategory}
                />
                <label htmlFor={cat} className="ms-1">{cat} clothing</label>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <p><strong>Rating</strong></p>
            {[4, 3, 2, 1].map((star) => (
              <div key={star}>
                <input
                  type="radio"
                  name="rating"
                  id={`${star}Star`}
                  value={star}
                  onChange={ratingFilter}
                />
                <label htmlFor={`${star}Star`} className="ms-1">
                  {star} Star & Above
                </label>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <p><strong>Sort By</strong></p>
            <div>
              <input
                type="radio"
                name="sortBy"
                id="lowHigh"
                value="ascending"
                onChange={sortByFilter}
              />
              <label htmlFor="lowHigh" className="ms-1">Price - Low to High</label>
            </div>
            <div>
              <input
                type="radio"
                name="sortBy"
                id="highLow"
                value="descending"
                onChange={sortByFilter}
              />
              <label htmlFor="highLow" className="ms-1">Price - High to Low</label>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="col-12 col-md-9 mt-4 mt-md-0">
          <div className="row">
            {sortedData.length === 0 ? (
              <p className="text-center">No products found in this category.</p>
            ) : (
              sortedData.map((product) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  key={product._id}
                >
                  <div className="card h-100">
                    <Link to={`/products/${product._id}`}>
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="card-img-top img-fluid bg-light p-2"
                      />
                    </Link>
                    <div className="card-body text-center">
                      <p className="card-title"><strong>{product.name}</strong></p>
                      <p className="card-text">RS. {product.price}</p>

                      <div className="d-grid gap-2">
                        {userId &&
                        cartItems?.some(
                          (item) =>
                            item?.product?._id === product._id ||
                            item?._id === product._id ||
                            item?.product === product._id
                        ) ? (
                          <button
                            className="btn btn-outline-success"
                            onClick={handleGoToCart}
                          >
                            Go To Cart
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => onAddToCart(product)}
                          >
                            Add to Cart
                          </button>
                        )}

                        {userId &&
                        wishlistItems?.some(
                          (item) =>
                            item?.product?._id === product._id ||
                            item?._id === product._id ||
                            item?.product === product._id
                        ) ? (
                          <button
                            className="btn btn-outline-success"
                            onClick={handleGoToWishlist}
                          >
                            Go To Wishlist
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => onMoveToWishlist(product)}
                          >
                            Add to Wishlist
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
