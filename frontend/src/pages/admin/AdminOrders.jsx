import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const API_URL = "https://d2o8lzgxvs6ck1.cloudfront.net";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(
        `${API_URL}/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchOrders();

      alert("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update status:", error);

      alert(
        error.response?.data?.message ||
        "Failed to update order status"
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-loading">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">
        <h2>ShopKart Admin</h2>

        <Link to="/admin">
          Dashboard
        </Link>

        <Link to="/admin/products">
          Products
        </Link>

        <Link to="/admin/orders">
          Orders
        </Link>

        <Link to="/">
          View Store
        </Link>
      </aside>

      <main className="admin-main">

        <div className="admin-page-header">
          <div>
            <span className="section-label">
              ORDER MANAGEMENT
            </span>

            <h1>Manage Orders</h1>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchOrders}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!error && orders.length === 0 ? (
          <div className="empty-message">
            No orders found.
          </div>
        ) : (
          <div className="orders-table-container">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>

                    <td className="order-id">
                      #{order._id.slice(-8)}
                    </td>

                    <td>
                      {order.shippingAddress?.fullName || "-"}
                    </td>

                    <td>
                      {order.shippingAddress?.phone || "-"}
                    </td>

                    <td>
                      ₹{Number(
                        order.totalPrice || 0
                      ).toLocaleString()}
                    </td>

                    <td>
                      <span className="order-status">
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="PENDING">
                          PENDING
                        </option>

                        <option value="CONFIRMED">
                          CONFIRMED
                        </option>

                        <option value="SHIPPED">
                          SHIPPED
                        </option>

                        <option value="DELIVERED">
                          DELIVERED
                        </option>
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </main>
    </div>
  );
}

export default AdminOrders;