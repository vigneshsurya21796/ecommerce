import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productslist } from "../../features/Products/Productsslice";
import { toast } from "react-toastify";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from "../../features/Cart/cartSlice";
import { FaStar, FaRegStar, FaShoppingCart, FaArrowLeft, FaFire, FaHeart } from "react-icons/fa";
import ImageGallery from "../../Components/ImageGallery/ImageGallery";
import { toggleWishlist } from "../../features/Wishlist/wishlistSlice";

function Singlepage() {
  const [singleProduct, setSingleProduct] = useState(null);

  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
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

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

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

  // Same category, sorted by rating desc, exclude current product
  const sameCategory = products
    .filter((p) => p.category === singleProduct.category && p.id !== singleProduct.id)
    .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));

  // Recommendations: up to 4 from same category
  const recommendations = sameCategory.slice(0, 4);

  // Top picks fallback: highest rated across all categories (if recommendations < 4)
  const topPicks = recommendations.length < 4
    ? products
        .filter((p) => p.id !== singleProduct.id && !recommendations.find((r) => r.id === p.id))
        .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
        .slice(0, 4 - recommendations.length)
    : [];

  const allRecommended = [...recommendations, ...topPicks];

  // Build gallery: FakeStore has 1 image — structure supports multiple when you have your own product DB
  const galleryImages = [singleProduct.image];

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

            {/* Left: Image Gallery */}
            <div className="lg:w-1/2 p-8">
              <ImageGallery images={galleryImages} alt={singleProduct.title} />
            </div>

            {/* Right: Details */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-between">
              <div>
                {/* Category badge + Wishlist */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                    {singleProduct.category}
                  </span>
                  <button
                    onClick={() => {
                      const isWishlisted = wishlistItems.find((w) => w.id === singleProduct.id);
                      dispatch(toggleWishlist({ ...singleProduct, id: singleProduct.id }));
                      if (isWishlisted) {
                        toast.info("Removed from wishlist");
                      } else {
                        toast.success("Added to wishlist");
                      }
                    }}
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      wishlistItems.find((w) => w.id === singleProduct.id)
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                    }`}
                  >
                    <FaHeart size={13} />
                    {wishlistItems.find((w) => w.id === singleProduct.id) ? "Wishlisted" : "Wishlist"}
                  </button>
                </div>

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
                    {singleProduct.rating?.rate ? `${singleProduct.rating.rate}/5` : "No rating"}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <span className="text-3xl font-bold text-indigo-600">
                    ₹{singleProduct.price.toFixed(2)}
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

        {/* You May Also Like */}
        {allRecommended.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-1">
              <FaFire className="text-orange-400" size={18} />
              <h2 className="text-xl font-bold text-gray-800">You May Also Like</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6 capitalize">
              {recommendations.length > 0
                ? `Top picks from ${singleProduct.category}`
                : "Trending across all categories"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allRecommended.map((product) => {
                const inCart = cart.find((c) => c.id === product.id);
                const isTopPick = !recommendations.find((r) => r.id === product.id);
                return (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    {/* Badge */}
                    {isTopPick && (
                      <div className="absolute mt-2 ml-2">
                        <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Top Pick
                        </span>
                      </div>
                    )}

                    <div className="bg-gray-50 h-40 flex items-center justify-center overflow-hidden p-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1 leading-snug group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </p>
                      {/* Mini rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <FaStar size={10} className="text-yellow-400" />
                        <span className="text-xs text-gray-500">{product.rating?.rate ?? "—"}</span>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-indigo-600 font-bold text-sm">
                          ₹{product.price.toFixed(2)}
                        </span>
                        {inCart && (
                          <span className="text-xs text-green-600 font-medium">In cart</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Singlepage;
