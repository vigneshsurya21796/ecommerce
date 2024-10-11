/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Singlepage.css";
import { productslist } from "../../features/Products/Productsslice";
import { ShoppingCart } from 'lucide-react';
function Singlepage() {
  const [singleProduct, setSingleProduct] = useState(null);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  const { id } = useParams();  

  useEffect(() => {
    dispatch(productslist());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const product = products.find((p) => p.id.toString() === id);
      setSingleProduct([product]);
      setImage(product?.thumbnail);
    }
  }, [products, id]);

  if (isLoading) {
    return <span className="loader"></span>;
  }

  if (!singleProduct) {
    return <div>Product not found</div>;
  }
  console.log(...singleProduct);
  return (
    <div>
      <div>
        {singleProduct?.map((el, idx) => {
          return (
            <div key={idx}>
              <div className="container_flex">
                <div className="img_flex">
                  <img
                    src={el?.images[0]}
                    onClick={() => setImage(el?.images[0])}
                    alt="Productimage"
                  />

                  <img
                    src={el?.images[1] ? el?.images[1] : el?.images[0]}
                    onClick={() =>
                      setImage(el?.images[1] ? el?.images[1] : el?.images[0])
                    }
                    alt="Productimage"
                  />

                  <img
                    src={el?.images[2] ? el?.images[2] : el?.images[0]}
                    onClick={() =>
                      setImage(el?.images[2] ? el?.images[2] : el?.images[0])
                    }
                    alt="Productimage"
                  />
                </div>

                <div className="thumnail_img">
                  <img src={image} alt="" />
                </div>
                <div className="flex_box">
                  <div className="title">{el?.title}</div>
                  <div className="price">${el?.price}</div>
                  <div className="description">{el?.description}</div>
                  <button className="add_to_cart"><ShoppingCart color="white" />Add to cart</button>
                </div>
              </div>
            </div>
          );
        })}{" "}
      </div>
    </div>
  );
}

export default Singlepage;
