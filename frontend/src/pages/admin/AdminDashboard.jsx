import { Link } from "react-router-dom";
import "./Admin.css";

function AdminDashboard() {
  return (
    <div className="admin-page">

      <div className="admin-sidebar">
        <h2>ShopKart Admin</h2>

        <Link to="/admin">Dashboard</Link>

        <Link to="/admin/products">
          Products
        </Link>

        <Link to="/admin/orders">
          Orders
        </Link>

        <Link to="/">
          View Store
        </Link>
      </div>

      <main className="admin-main">

        <h1>Admin Dashboard</h1>

        <div className="admin-cards">

          <div className="admin-card">
            <span>Total Products</span>
            <h2>Manage Products</h2>
          </div>

          <div className="admin-card">
            <span>Orders</span>
            <h2>Manage Orders</h2>
          </div>

          <div className="admin-card">
            <span>ShopKart</span>
            <h2>Admin Panel</h2>
          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;