import { useAppContext } from "../contexts/AppContext";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";

const Orders = () => {
    const { userId } = useAppContext();
    const { data: orders, loading, error } = useFetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/order/user/${userId}`
    );

    if (loading) return <p>Loading orders…</p>;
    if (error) return <p className="text-danger">Error: {error}</p>;
    if (!Array.isArray(orders) || orders.length === 0) {
        return <p>You have no past orders.</p>;
    }

    return (
        <div>
            <h2 className="py-3">Order History</h2>
            {orders.map((order) => (
                <div className="card mb-4" key={order._id}>
                    <div className="card-header">
                        <strong>Order ID:</strong> {order._id}{" "}
                        <small className="text-muted">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </small>
                    </div>
                    <div className="card-body">
                        {order.orderItem.map(({ product, quantity }) => (
                            <div className="row g-0 mb-3" key={product._id}>
                                <div className="col-md-3">
                                    <img
                                        src={product.imageUrls?.[0] || "/fallback.jpg"}
                                        alt={product.name}
                                        className="img-fluid rounded mx-auto d-block w-50"
                                    />
                                </div>
                                <div className="col-md-9">
                                    <h6 className="card-title">{product.name}</h6>
                                    <p className="card-text">
                                        Quantity: {quantity} × ₹{product.price.toLocaleString("en-IN")}
                                    </p>
                                    <small className="text-muted" style={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 1,    
                                        overflow: "hidden",
                                    }}>
                                        {product.description}

                                    </small>
                                    <Link className="btn btn-primary mt-2" to={`/products/${product._id}`}>View Product</Link>

                                </div>
                            </div>
                        ))}
                        <hr />
                        <div className="gap-2">
                            <p>
                                <strong>Total Paid:</strong> ₹
                                {order.orderPrice.toLocaleString("en-IN")}
                            </p>
                            <p>
                                <strong>Delivery Status: </strong>
                                {order.status}
                            </p>
                        </div>

                    </div>
                </div>
            ))}

        </div>
    );
};

export default Orders;