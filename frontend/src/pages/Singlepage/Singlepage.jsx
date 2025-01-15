import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Singlepage.css";
import { productslist } from "../../features/Products/Productsslice";
import { ShoppingCart } from "lucide-react";
import {
  addToCart,
  incrementQuantity,
  decrementQuantity,
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
        name: product.name,
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
    if (products?.length > 0) {
      const product = products.find((p) => p.id.toString() === id);
      setSingleProduct(product);
      setImage(product?.thumbnail);
    }
  }, [products, id]);

  if (isLoading) {
    return <span className="loader"></span>;
  }

  if (!singleProduct) {
    return <div>Product not found</div>;
  }

  // Find the cart item for this product
  const cartItem = cart.find((item) => item.id === singleProduct.id);

  return (
    <div>
      <div>
        <div className="container_flex">
          <div className="img_flex">
            {singleProduct?.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setImage(img)}
                alt={`Productimage-${idx}`}
              />
            ))}
          </div>

          <div className="thumnail_img">
            <img src={image} alt="" />
          </div>
          <div className="flex_box">
            <div className="title">{singleProduct?.title}</div>
            <div className="price">${singleProduct?.price}</div>
            <div className="description">{singleProduct?.description}</div>
            <div>
              {cartItem ? (
                <div className="quantity_controls">
                  <button onClick={() => decrement(cartItem.id)}>-</button>
                  <span>{cartItem.quantity}</span>
                  <button onClick={() => increment(cartItem.id)}>+</button>
                </div>
              ) : (
                <button
                  onClick={() => productadd(singleProduct)}
                  className="add_to_cart"
                >
                  <ShoppingCart color="white" />
                  Add to cart
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
