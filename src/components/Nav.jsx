import { NavLink } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const Nav = () => {
  const {
    userId,
    handleCartAlert,
    localCartItems,
    localWishlistItems,
  } = useAppContext();


  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          MyShoppingSite
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex ms-auto" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>

          <div className="ms-auto d-flex align-items-center">
            <ul className="navbar-nav gap-3 mb-2 mb-lg-0">
              <li className="nav-item position-relative">
                <NavLink
                  className="nav-link active"
                  aria-current="page"
                  to="/profile" //user profile page
                >
                  {userId ? <i className="bi bi-person fs-4"></i> : <i></i>}
                </NavLink>
              </li>

              <li className="nav-item position-relative">
                {userId ? (
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/cart"
                  >
                    <span className="position-absolute top-70 start-100 translate-middle badge rounded-pill bg-danger">
                      {localCartItems.length}
                    </span>
                    <i className="bi bi-cart3 fs-4"></i>
                  </NavLink>
                ) : (
                  <div
                    className="nav-link active"
                    aria-current="page"
                    onClick={handleCartAlert}
                  >
                    <i className="bi bi-cart3 fs-4"></i>
                  </div>
                )}
              </li>

              <li className="nav-item position-relative">
                {userId ? (
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/wishlist"
                  >
                    <span className="position-absolute top-70 start-100 translate-middle badge rounded-pill bg-danger">
                      {localWishlistItems.length}
                    </span>
                    <i className="bi bi-heart fs-4"></i>
                  </NavLink>
                ) : (
                  <div
                    className="nav-link active"
                    aria-current="page"
                    onClick={handleCartAlert}
                  >
                    <i className="bi bi-heart fs-4"></i>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
