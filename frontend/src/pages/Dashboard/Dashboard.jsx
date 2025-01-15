import React from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { productslist } from "../../features/Products/Productsslice";
function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);

  /* useEffect(() => {
    console.log(user);
    console.log(products.products);
    if (!user) {
      navigate("/Login");
    }
  }, [user]); */
  useEffect(() => {
    dispatch(productslist());
  }, []);
  return (
    <div>
      <div className="Grid_conatiner">
        {products.map((product, idx) => {
          return (
            <Link
              to={`/singlepage/${product.id}`}
              className="Product_container"
              key={idx}
            >
              <div className="img_container">
                <img src={product.thumbnail} alt="" />
              </div>

              <div className="Details_flex">
                <div>{product.title.slice(0, 15)}</div>
                <b>${product.price}</b>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
