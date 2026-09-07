import { Link } from "react-router-dom";
import Products from "./products";

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-label">
              ONLINE SHOPPING MADE SIMPLE
            </span>

            <h1>
              Everything you need,
              <span> all in one place.</span>
            </h1>

            <p>
              Discover great products, competitive prices,
              and a simple shopping experience with ShopKart.
            </p>

            <div className="hero-buttons">
              <Link
                to="/products"
                className="primary-btn"
              >
                Shop Now
              </Link>

              <Link
                to="/register"
                className="secondary-btn"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-content">
              <span className="hero-card-small">
                SHOPKART
              </span>

              <h2>Shop smarter.</h2>

              <p>
                Browse products and manage your cart easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Products />
    </>
  );
}

export default Home;