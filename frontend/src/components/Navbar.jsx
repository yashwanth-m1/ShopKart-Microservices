import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  let user = null;

  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch (error) {
      console.error("Invalid user data:", error);
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
    window.location.reload();
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* LOGO */}

        <Link to="/" className="brand">
          <div className="brand-icon">S</div>

          <div>
            <span className="brand-name">
              ShopKart
            </span>

            <span className="brand-tagline">
              SHOP SMART
            </span>
          </div>
        </Link>


        {/* NAVIGATION */}

        <nav className="nav-menu">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>


          {/* SHOW CART ONLY FOR LOGGED-IN USERS */}

          {token && (
            <Link to="/cart" className="cart-link">
              Cart
            </Link>
          )}


          {token ? (
            <>

              {/* ADMIN DASHBOARD */}

              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="admin-link"
                >
                  Admin Dashboard
                </Link>
              )}


              {/* USER NAME */}

              <span className="user-name">
                Hi, {user?.name || "User"}
              </span>


              {/* LOGOUT */}

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>
          ) : (
            <>

              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
              >
                Create Account
              </Link>

            </>
          )}

        </nav>

      </div>
    </header>
  );
}

export default Navbar;