import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CART
  // ==========================================

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/cart");

      setCart(response.data.cart);
    } catch (error) {
      console.error("Cart fetch error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
        "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, [navigate]);

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    if (quantity <= 0) {
      return;
    }

    try {
      const response = await api.put(
        `/api/cart/${productId}`,
        {
          quantity
        }
      );

      setCart(response.data.cart);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to update cart"
      );
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = async (productId) => {
    try {
      const response = await api.delete(
        `/api/cart/${productId}`
      );

      setCart(response.data.cart);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to remove product"
      );
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmClear) {
      return;
    }

    try {
      await api.delete("/api/cart");

      setCart({
        items: [],
        totalItems: 0,
        totalPrice: 0
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to clear cart"
      );
    }
  };

  // ==========================================
  // PROCEED TO CHECKOUT
  // ==========================================

  const proceedToCheckout = () => {
    if (!cart.items || cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    

    navigate("/checkout");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="cart-container">
        <div className="status-message">
          Loading your cart...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* ===================================== */}
        {/* CART HEADER */}
        {/* ===================================== */}

        <div className="cart-header">

          <div>
            <span className="section-label">
              YOUR SHOPPING BAG
            </span>

            <h1>Shopping Cart</h1>

            <p>
              {cart.totalItems} item
              {cart.totalItems !== 1 ? "s" : ""}{" "}
              in your cart
            </p>
          </div>

          {cart.items.length > 0 && (
            <button
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          )}

        </div>

        {/* ===================================== */}
        {/* EMPTY CART */}
        {/* ===================================== */}

        {cart.items.length === 0 ? (

          <div className="empty-cart">

            <h2>Your cart is empty</h2>

            <p>
              Looks like you haven't added
              anything yet.
            </p>

            <Link
              to="/products"
              className="primary-btn"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="cart-layout">

            {/* ================================= */}
            {/* CART ITEMS */}
            {/* ================================= */}

            <div className="cart-items">

              {cart.items.map((item) => (

                <div
                  className="cart-item"
                  key={item.productId}
                >

                  <div className="cart-item-image">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <div className="cart-no-image">
                        No Image
                      </div>
                    )}

                  </div>

                  <div className="cart-item-info">

                    <h3>{item.name}</h3>

                    <p>
                      ₹{Number(
                        item.price
                      ).toLocaleString()}
                    </p>

                  </div>

                  {/* QUANTITY */}

                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* ITEM TOTAL */}

                  <div className="cart-item-total">

                    ₹{(
                      item.price *
                      item.quantity
                    ).toLocaleString()}

                  </div>

                  {/* REMOVE */}

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item.productId)
                    }
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            {/* ================================= */}
            {/* ORDER SUMMARY */}
            {/* ================================= */}

            <aside className="cart-summary">

              <h2>Order Summary</h2>

              <div className="summary-row">

                <span>Items</span>

                <span>
                  {cart.totalItems}
                </span>

              </div>

              <div className="summary-row total-row">

                <span>Total</span>

                <strong>
                  ₹{Number(
                    cart.totalPrice
                  ).toLocaleString()}
                </strong>

              </div>

              {/* PROCEED TO CHECKOUT */}

              <button
                className="checkout-btn"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="continue-shopping"
              >
                Continue Shopping
              </Link>

            </aside>

          </div>
        )}

      </div>

    </div>
  );
}

export default Cart;