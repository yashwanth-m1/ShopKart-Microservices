import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CART
  // ==========================================

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/cart");

        const cartData = response.data.cart;

        if (!cartData || !cartData.items) {
          setError("Cart data not found");
          return;
        }

        setCart(cartData);

        // Redirect if cart is empty
        if (cartData.items.length === 0) {
          navigate("/cart");
        }

      } catch (error) {
        console.error(
          "Checkout cart error:",
          error.response?.data || error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
          "Failed to load checkout"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      setError("");

      // ------------------------------------------
      // FRONTEND VALIDATION
      // ------------------------------------------

      if (cart.items.length === 0) {
        setError("Your cart is empty");
        return;
      }

      if (
        !formData.fullName.trim() ||
        !formData.phone.trim() ||
        !formData.addressLine1.trim() ||
        !formData.city.trim() ||
        !formData.state.trim() ||
        !formData.postalCode.trim()
      ) {
        setError("Please complete all required shipping details");
        return;
      }

      // ------------------------------------------
      // CREATE ORDER DATA
      // Backend expects productId + quantity
      // ------------------------------------------

      const orderData = {
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity)
        })),

        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.addressLine2.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim() || "India"
        },

        paymentMethod: paymentMethod
      };

      console.log(
        "Sending order data:",
        orderData
      );

      setPlacingOrder(true);

      // ------------------------------------------
      // SEND ORDER
      // ------------------------------------------

      const response = await api.post(
        "/api/orders",
        orderData
      );

      console.log(
        "Order created:",
        response.data
      );

      alert("Order placed successfully!");

      // Go to home page
      navigate("/");

    } catch (error) {
      console.error(
        "Order placement error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
        "Failed to place order"
      );

    } finally {
      setPlacingOrder(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <p className="status-message">
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">

          <div className="error-message">
            {error}
          </div>

          <Link
            to="/cart"
            className="primary-btn"
          >
            Back to Cart
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-header">
          <span className="section-label">
            SECURE CHECKOUT
          </span>

          <h1>Checkout</h1>

          <p>
            Enter your shipping details and place your order.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >

          {/* ================================= */}
          {/* SHIPPING DETAILS */}
          {/* ================================= */}

          <section className="checkout-form-card">

            <h2>Shipping Details</h2>

            <div className="checkout-form-grid">

              <div className="form-group full-width">
                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Postal Code *
                </label>

                <input
                  type="text"
                  name="postalCode"
                  placeholder="Enter PIN code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Address *
                </label>

                <input
                  type="text"
                  name="addressLine1"
                  placeholder="House number, street, area"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Address Line 2
                </label>

                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Apartment, landmark (optional)"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  City *
                </label>

                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  State *
                </label>

                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* ================================= */}
            {/* PAYMENT */}
            {/* ================================= */}

            <div className="payment-section">

              <h2>Payment Method</h2>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span>
                  Cash on Delivery
                </span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span>
                  UPI
                </span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span>
                  Card
                </span>
              </label>

            </div>

          </section>

          {/* ================================= */}
          {/* ORDER SUMMARY */}
          {/* ================================= */}

          <aside className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="checkout-items">

              {cart.items.map((item) => (

                <div
                  className="checkout-item"
                  key={item.productId}
                >

                  <div className="checkout-item-image">

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

                  <div className="checkout-item-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      Qty: {item.quantity}
                    </p>

                    <strong>
                      ₹{(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>

              ))}

            </div>

            <div className="checkout-total-section">

              <div className="summary-row">
                <span>Items</span>

                <span>
                  {cart.totalItems}
                </span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>

                <span>Free</span>
              </div>

              <div className="summary-row total-row">
                <span>Total</span>

                <strong>
                  ₹{Number(
                    cart.totalPrice
                  ).toLocaleString()}
                </strong>
              </div>

            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : `Place Order • ₹${Number(
                    cart.totalPrice
                  ).toLocaleString()}`
              }
            </button>

            <Link
              to="/cart"
              className="back-to-cart"
            >
              ← Back to Cart
            </Link>

          </aside>

        </form>

      </div>

    </div>
  );
}

export default Checkout;