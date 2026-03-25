import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist } from "../../features/Wishlist/wishlistSlice";
import { addToCart } from "../../features/Cart/cartSlice";
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item.id,
      name: item.title,
      image: item.image,
      price: item.price,
      quantity: 1,
    }));
    toast.success("Added to cart");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full mb-6">
            <FaHeart size={40} className="text-red-200" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you love by clicking the heart icon.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <FaArrowLeft size={13} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaHeart className="text-red-500" size={20} />
              Wishlist
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
          >
            <FaArrowLeft size={11} />
            Continue Shopping
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const inCart = cartItems.find((c) => c.id === item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Remove from wishlist */}
                <div className="relative">
                  <Link
                    to={`/singlepage/${item.id}`}
                    className="bg-gray-50 h-52 flex items-center justify-center overflow-hidden block"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <button
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                    {item.category}
                  </p>
                  <Link to={`/singlepage/${item.id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-3 hover:text-indigo-600 transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </Link>

                  <div className="mt-auto">
                    <span className="text-xl font-bold text-gray-900 block mb-3">
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-colors ${
                        inCart
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      <FaShoppingCart size={13} />
                      {inCart ? "Already in Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
