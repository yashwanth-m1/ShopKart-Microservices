import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

const API_URL = "http://localhost:3000";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: ""
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");

    let user = null;

    try {
      user = userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Invalid user data");
    }

    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      navigate("/");
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/products`
      );

      setProducts(response.data.products || []);

    } catch (error) {
      console.error(
        "Product fetch error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to fetch products"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select a product image");
      return;
    }

    try {
      setSubmitting(true);

      const productData = new FormData();

      productData.append("name", formData.name);
      productData.append(
        "description",
        formData.description
      );
      productData.append(
        "price",
        formData.price
      );
      productData.append(
        "stock",
        formData.stock
      );
      productData.append(
        "category",
        formData.category
      );
      productData.append(
        "brand",
        formData.brand
      );

      // IMPORTANT:
      // "image" must match multer backend field name
      productData.append(
        "image",
        imageFile
      );

      const response = await axios.post(
        `${API_URL}/api/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "Product added:",
        response.data
      );

      alert("Product added successfully");

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: ""
      });

      setImageFile(null);

      // Reset file input
      const fileInput =
        document.getElementById("product-image");

      if (fileInput) {
        fileInput.value = "";
      }

      await fetchProducts();

    } catch (error) {
      console.error(
        "Add product error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to add product"
      );

    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Product deleted successfully");

      await fetchProducts();

    } catch (error) {
      console.error(
        "Delete product error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete product"
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-loading">
          Loading products...
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
          <span className="section-label">
            ADMIN PANEL
          </span>

          <h1>
            Manage Products
          </h1>

          <p>
            Add, view and delete products.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* ADD PRODUCT FORM */}

        <section className="admin-product-form">

          <h2>
            Add New Product
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="admin-form-grid">

              <div className="form-group">
                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              {/* IMAGE FILE INPUT */}

              <div className="form-group">
                <label>
                  Product Image
                </label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />

                {imageFile && (
                  <small className="selected-image">
                    Selected: {imageFile.name}
                  </small>
                )}
              </div>

            </div>

            <div className="form-group">
              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              className="admin-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Uploading..."
                : "Add Product"}
            </button>

          </form>

        </section>

        {/* PRODUCT LIST */}

        <section className="admin-products-list">

          <h2>
            All Products ({products.length})
          </h2>

          {products.length === 0 ? (

            <p className="empty-message">
              No products found.
            </p>

          ) : (

            <div className="admin-products-grid">

              {products.map((product) => (

                <div
                  className="admin-product-card"
                  key={product._id}
                >

                  <div className="admin-product-image">

                    {product.images?.[0] ? (

                      <img
                        src={product.images[0]}
                        alt={product.name}
                      />

                    ) : (

                      <span>No Image</span>

                    )}

                  </div>

                  <div className="admin-product-info">

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      ₹{Number(
                        product.price
                      ).toLocaleString()}
                    </p>

                    <small>
                      Stock: {product.stock}
                    </small>

                    <button
                      className="delete-product-btn"
                      onClick={() =>
                        deleteProduct(product._id)
                      }
                    >
                      Delete Product
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminProducts;