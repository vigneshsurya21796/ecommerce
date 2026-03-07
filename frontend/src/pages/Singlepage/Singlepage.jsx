import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Singlepage.css";
import { productslist } from "../../features/Products/Productsslice";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from "../../features/Cart/Cartslice";

function Singlepage() {
  const [singleProduct, setSingleProduct] = useState(null);
  const [image, setImage] = useState(null);

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

  const increment = (id) => {
    dispatch(incrementQuantity(id));
  };

  const decrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  useEffect(() => {
    dispatch(productslist());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const product = products.find((p) => p.id.toString() === id);
      setSingleProduct(product);
      setImage(product?.image);
    }
  }, [products, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!singleProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-purple-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const cartItem = cart.find((item) => item.id === singleProduct.id);

  return (
    <div className=" min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Image Section */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="relative">
              <img
                src={image || singleProduct.image}
                alt={singleProduct.title}
                className="w-full max-w-md h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {singleProduct.category}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold text-purple-900">
              {singleProduct.title}
            </h1>

            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-purple-700">
                ${singleProduct.price.toFixed(2)}
              </span>
              <div className="flex items-center space-x-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(singleProduct.rating.rate)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm text-purple-600 ml-2">
                  ({singleProduct.rating.rate} - {singleProduct.rating.count}{" "}
                  reviews)
                </span>
              </div>
            </div>

            <div className="text-gray-700 text-lg leading-relaxed">
              <p>{singleProduct.description}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl">
              {cartItem ? (
                <div className="flex items-center justify-center space-x-4 bg-white p-4 rounded-lg shadow-md">
                  <button
                    onClick={() => decrement(cartItem.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold text-purple-800">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => increment(cartItem.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => productadd(singleProduct)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Singlepage;
