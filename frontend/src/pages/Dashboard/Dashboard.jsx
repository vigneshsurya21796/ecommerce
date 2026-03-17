import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productslist } from "../../features/Products/Productsslice";
import FilterComponent from "../../Components/filter";
import { FaHeart, FaStar, FaRegStar, FaPlus } from "react-icons/fa";

function Dashboard() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  const [filteredProducts, setFilteredProducts] = React.useState(products);
  const [sortBy, setSortBy] = React.useState("default");

  useEffect(() => {
    dispatch(productslist());
  }, [dispatch]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // ✅ Filtering
  const handleFilterChange = useCallback(
      (filters) => {
        let updatedProducts = [...products];

        if (filters.category !== "All Categories") {
          updatedProducts = updatedProducts.filter(
              (p) =>
                  p.category.toLowerCase().includes(filters.category.toLowerCase()) ||
                  filters.category.toLowerCase().includes(p.category.toLowerCase())
          );
        }

        updatedProducts = updatedProducts.filter(
            (p) =>
                p.price >= parseFloat(filters.minPrice) &&
                p.price <= parseFloat(filters.maxPrice)
        );
        setFilteredProducts(updatedProducts);
      },
      [products]
  );

  // ✅ Sorting
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    let sortedProducts = [...filteredProducts];

    switch (sortValue) {
      case "price-low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "name":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  // ✅ Utility to render stars
  const renderStars = (rating) => {
    return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) =>
              i < Math.floor(rating)
                  ? <FaStar key={i} size={12} className="text-yellow-400" />
                  : <FaRegStar key={i} size={12} className="text-gray-300" />
          )}
        </div>
    );
  };

  return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort By</span>
              <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="default">Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Products count */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Showing 1 - {Math.min(10, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </p>
          </div>

          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <div className="w-80 flex-shrink-0">
              <FilterComponent onFilterChange={handleFilterChange} />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, idx) => (
                    <div
                        key={product.id || idx}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col relative"
                    >
                      {/* Wishlist button */}
                      <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md hover:bg-red-50 transition-colors">
                        <FaHeart size={15} className="text-gray-300" />
                      </button>

                      {/* Image */}
                      <Link to={`/singlepage/${product.id}`} className="bg-gray-50 h-52 flex items-center justify-center overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="max-w-full max-h-full object-contain p-5 group-hover:scale-110 transition-transform duration-300"
                        />
                      </Link>

                      {/* Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                          {product.category}
                        </div>
                        <Link to={`/singlepage/${product.id}`}>
                          <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors leading-snug">
                            {product.title}
                          </h3>
                        </Link>

                        {/* Stars + count */}
                        <div className="flex items-center gap-1 mb-3">
                          {renderStars(product.rating?.rate ?? 0)}
                          <span className="text-xs text-gray-400 ml-1">({product.rating?.count ?? 0})</span>
                        </div>

                        {/* Price + Button */}
                        <div className="mt-auto">
                          <span className="text-xl font-bold text-gray-900 block mb-3">
                            ${product.price.toFixed(2)}
                          </span>
                          <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                            <FaPlus size={13} />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No products found matching your criteria.
                    </p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default Dashboard;
