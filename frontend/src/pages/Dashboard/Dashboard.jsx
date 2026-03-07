import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productslist } from "../../features/Products/Productsslice";
import FilterComponent from "../../Components/filter";
import { Heart, Star, Plus } from "lucide-react"; // ✅ Lucide icons

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
          {[...Array(5)].map((_, i) => (
              <Star
                  key={i}
                  size={12}
                  strokeWidth={2}
                  className={
                    i < Math.floor(rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                  }
              />
          ))}
        </div>
    );
  };

  return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort By</span>
              <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
                    >
                      <Link to={`/singlepage/${product.id}`} className="block">
                        {/* Product Image */}
                        <div className="relative bg-gray-50 h-48 flex items-center justify-center">
                          <img
                              src={product.image}
                              alt={product.title}
                              className="max-w-full max-h-full object-contain p-4"
                          />
                          {product.salePrice && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                Sale
                              </div>
                          )}
                          <button className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
                            {/*<Heart*/}
                            {/*    size={16}*/}
                            {/*    strokeWidth={2}*/}
                            {/*    className="text-gray-400 hover:text-red-500"*/}
                            {/*/>*/}
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
                            {product.category}
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {product.title}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center mb-2">
                            {/*{renderStars(product.rating.rate)}*/}
                            <span className="text-xs text-gray-500 ml-1">
                          ({product.rating.count})
                        </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                              {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                              )}
                            </div>
                            <button className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors">
                              {/*<Plus size={16} strokeWidth={2} />*/}
                            </button>
                          </div>
                        </div>
                      </Link>
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
