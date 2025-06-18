import { NavLink } from "react-router-dom"


const Nav = ()=> {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
        
                <NavLink className="navbar-brand" to="/">MyShoppingSite</NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    
                    <form className="d-flex ms-auto" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>

                    <div className="ms-auto d-flex align-items-center">
                        <button type="button" className="btn btn-secondary me-2">Login</button>
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink
                                className="nav-link active"
                                aria-current="page"
                                to="/cart"
                                >
                                <i className="bi bi-cart3"></i>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                className="nav-link active"
                                aria-current="page"
                                to="/wishlist"
                                >
                                <i className="bi bi-heart"></i>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default Nav