import React, { useEffect, useState } from "react";

function FilterComponent({ onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");

  const categories = [
    "All Categories",
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
    "other",
  ];

  // Predefined price ranges
  const priceRanges = [
    { label: "All", min: 0, max: 1000000 },
    { label: "₹0 – ₹500", min: 0, max: 500 },
    { label: "₹500 – ₹2000", min: 500, max: 2000 },
    { label: "₹2000 – ₹10000", min: 2000, max: 10000 },
    { label: "₹10000+", min: 10000, max: 1000000 },
  ];

  useEffect(() => {
    const range =
        priceRanges.find((p) => p.label === selectedPriceRange) || priceRanges[0];
    onFilterChange({
      category: selectedCategory,
      minPrice: range.min,
      maxPrice: range.max,
    });
  }, [selectedCategory, selectedPriceRange]);

  const handleReset = () => {
    setSelectedCategory("All Categories");
    setSelectedPriceRange("All");
  };

  return (
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 uppercase mb-4">
            CATEGORY
          </h3>
          <div className="space-y-2">
            {categories.map((category, idx) => (
                <button
                    key={idx}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {category}
                </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 uppercase mb-4">
            PRICE RANGE
          </h3>
          <div className="space-y-2">
            {priceRanges.map((range, idx) => (
                <button
                    key={idx}
                    onClick={() => setSelectedPriceRange(range.label)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        selectedPriceRange === range.label
                            ? "bg-indigo-500 text-white shadow-md"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {range.label}
                </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 py-2 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-gray-300"
        >
          Reset All Filters
        </button>

        {/* Current Filters */}
        {(selectedCategory !== "All Categories" || selectedPriceRange !== "All") && (
            <div className="mt-6 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">
                Active Filters:
              </h4>
              <div className="space-y-1 text-xs text-indigo-700">
                {selectedCategory !== "All Categories" && (
                    <div>Category: {selectedCategory}</div>
                )}
                {selectedPriceRange !== "All" && (
                    <div>Price: {selectedPriceRange}</div>
                )}
              </div>
            </div>
        )}
      </div>
  );
}

export default FilterComponent;
