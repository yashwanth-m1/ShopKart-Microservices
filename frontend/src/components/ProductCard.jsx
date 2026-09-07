import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add products to your cart.");

      navigate("/login");

      return;
    }

    try {
      await api.post("/api/cart", {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : null
      });

      alert(`${product.name} added to cart successfully!`);
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    }
  };

  return (
    <article className="product-card">

      <div className="product-image-container">
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="no-image">
            <span>No Image</span>
          </div>
        )}
      </div>

      <div className="product-content">

        <span className="product-category">
          {product.category}
        </span>

        <h3 className="product-name">
          {product.name}
        </h3>

        <p className="product-description">
          {product.description}
        </p>

        <p className="product-brand">
          {product.brand}
        </p>

        <div className="product-bottom">
          <div>
            <p className="price">
              ₹{Number(product.price).toLocaleString()}
            </p>

            <p className="stock">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>
          </div>

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>
        </div>

      </div>

    </article>
  );
}

export default ProductCard;