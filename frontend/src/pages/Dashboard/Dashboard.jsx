import React, { useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productslist } from "../../features/Products/Productsslice";
import FilterComponent from "../../Components/filter";
import { FaHeart, FaStar, FaRegStar, FaPlus, FaSearch } from "react-icons/fa";
import { addToCart } from "../../features/Cart/cartSlice";
import { toggleWishlist } from "../../features/Wishlist/wishlistSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [sortBy, setSortBy] = React.useState("default");

  useEffect(() => {
    dispatch(productslist());
  }, [dispatch]);

  // Re-apply filters whenever products load or search query changes
  useEffect(() => {
    applySearch(products, searchQuery);
  }, [products, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const applySearch = (list, query) => {
    if (!query) {
      setFilteredProducts(list);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredProducts(
      list.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      )
    );
  };

  // Filtering (category + price) — works on top of search result
  const handleFilterChange = useCallback(
    (filters) => {
      let base = [...products];

      // Apply search first
      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        base = base.filter(
          (p) =>
            p.title.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower)
        );
      }

      if (filters.category !== "All Categories") {
        base = base.filter(
          (p) =>
            p.category.toLowerCase().includes(filters.category.toLowerCase()) ||
            filters.category.toLowerCase().includes(p.category.toLowerCase())
        );
      }

      base = base.filter(
        (p) =>
          p.price >= parseFloat(filters.minPrice) &&
          p.price <= parseFloat(filters.maxPrice)
      );

      setFilteredProducts(base);
    },
    [products, searchQuery]
  );

  // Sorting
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    let sorted = [...filteredProducts];
    switch (sortValue) {
      case "price-low-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    setFilteredProducts(sorted);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product._id,
      name: product.title,
      image: product.image,
      price: product.price,
      quantity: 1,
    }));
  };

  const renderStars = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) =>
        i < Math.floor(rating)
          ? <FaStar key={i} size={12} className="text-yellow-400" />
          : <FaRegStar key={i} size={12} className="text-gray-300" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">

        {/* Header row */}
        <div className="flex justify-between items-center mb-4">
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

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className="w-80 flex-shrink-0">
            <FilterComponent onFilterChange={handleFilterChange} />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-4">
                  <FaSearch size={24} className="text-indigo-300" />
                </div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">
                  No products found
                </h2>
                {searchQuery ? (
                  <p className="text-gray-400 text-sm">
                    No results for &ldquo;<span className="font-medium">{searchQuery}</span>&rdquo;.
                    Try a different keyword or clear your filters.
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    Try adjusting your filters.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product._id || idx}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col relative"
                  >
                    {/* Wishlist */}
                    {(() => {
                      const isWishlisted = wishlistItems.find((w) => w.id === product._id);
                      return (
                        <button
                          onClick={(e) => { e.preventDefault(); dispatch(toggleWishlist({ ...product, id: product._id })); }}
                          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md hover:bg-red-50 transition-colors"
                          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <FaHeart size={15} className={isWishlisted ? "text-red-500" : "text-gray-300"} />
                        </button>
                      );
                    })()}

                    {/* Image */}
                    <Link
                      to={`/product/${product._id}`}
                      className="bg-gray-50 h-52 flex items-center justify-center overflow-hidden"
                    >
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
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors leading-snug">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(product.rating ?? 0)}
                        <span className="text-xs text-gray-400 ml-1">
                          {product.rating ? `${product.rating}/5` : "No rating"}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <span className="text-xl font-bold text-gray-900 block mb-3">
                          ₹{product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                        >
                          <FaPlus size={13} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default Dashboard;
