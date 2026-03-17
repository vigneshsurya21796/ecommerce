import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productslist } from "../../features/Products/Productsslice";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from "../../features/Cart/Cartslice";
import { FaStar, FaRegStar, FaShoppingCart, FaArrowLeft } from "react-icons/fa";

function Singlepage() {
  const [singleProduct, setSingleProduct] = useState(null);

  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart.items);
  const { id } = useParams();

  const productadd = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
      })
    );
  };

  const increment = (id) => dispatch(incrementQuantity(id));
  const decrement = (id) => dispatch(decrementQuantity(id));

  useEffect(() => {
    dispatch(productslist());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const product = products.find((p) => p.id.toString() === id);
      setSingleProduct(product || null);
    }
  }, [products, id]);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating)
        ? <FaStar key={i} size={15} className="text-yellow-400" />
        : <FaRegStar key={i} size={15} className="text-gray-300" />
    );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!singleProduct) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Product not found.</p>
      </div>
    );
  }

  const cartItem = cart.find((item) => item.id === singleProduct.id);

  const relatedProducts = products
    .filter((p) => p.category === singleProduct.category && p.id !== singleProduct.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-8 transition-colors"
        >
          <FaArrowLeft size={12} />
          Back to Products
        </Link>

        {/* Product Detail Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Left: Image */}
            <div className="lg:w-1/2 bg-gray-50 flex items-center justify-center p-10 min-h-96">
              <img
                src={singleProduct.image}
                alt={singleProduct.title}
                className="max-w-full max-h-80 object-contain"
              />
            </div>

            {/* Right: Details */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-between">
              <div>
                {/* Category badge */}
                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                  {singleProduct.category}
                </span>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {singleProduct.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-0.5">
                    {renderStars(singleProduct.rating?.rate ?? 0)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {singleProduct.rating?.rate} · {singleProduct.rating?.count} reviews
                  </span>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <span className="text-3xl font-bold text-indigo-600">
                    ${singleProduct.price.toFixed(2)}
                  </span>
                </div>

                <hr className="border-gray-100 mb-5" />

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  {singleProduct.description}
                </p>
              </div>

              {/* Add to Cart / Quantity Controls */}
              {cartItem ? (
                <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl">
                  <button
                    onClick={() => decrement(cartItem.id)}
                    className="w-10 h-10 bg-white border border-indigo-200 text-indigo-600 font-bold text-xl rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    −
                  </button>
                  <span className="text-xl font-bold text-indigo-800 w-8 text-center">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => increment(cartItem.id)}
                    className="w-10 h-10 bg-white border border-indigo-200 text-indigo-600 font-bold text-xl rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-indigo-600 font-medium ml-2">
                    In your cart
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => productadd(singleProduct)}
                  className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3.5 rounded-xl font-semibold text-base transition-colors shadow-md hover:shadow-lg"
                >
                  <FaShoppingCart size={17} />
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Related Products</h2>
            <p className="text-sm text-gray-500 mb-6 capitalize">{singleProduct.category}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <Link
                  to={`/singlepage/${product.id}`}
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  <div className="bg-gray-50 h-40 flex items-center justify-center overflow-hidden p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {product.title}
                    </p>
                    <span className="text-indigo-600 font-bold text-sm mt-auto">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Singlepage;
