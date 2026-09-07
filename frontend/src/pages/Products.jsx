import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/products");

        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Product fetch error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(searchText) ||
      product.brand?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText)
    );
  });

  return (
    <section className="products-page">

      <div className="products-container">

        <div className="products-header">

          <div>
            <span className="section-label">
              SHOP OUR COLLECTION
            </span>

            <h2>Featured Products</h2>

            <p>
              Find the products you are looking for.
            </p>
          </div>

          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>

        {!loading && !error && (
          <p className="products-count">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        )}

        {loading && (
          <div className="status-message">
            Loading products...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="empty-message">
              No products found.
            </div>
          )}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}

      </div>

    </section>
  );
}

export default Products;