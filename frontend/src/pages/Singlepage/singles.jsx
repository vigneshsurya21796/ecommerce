import React, { useEffect, useState } from "react";
import { useParams,Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Singlepage.css";
import { productslist } from "../../features/Products/Productsslice";
function Singlepage() {
  /* <------------------------------- its no working while reloading */
  const [image, setimage] = useState();
  
  const dispatch = useDispatch();
  const { products,isLoading } = useSelector((state) => state.products);
  // const { isLoading } = useSelector((state) => state.auth)
  console.log(products);
  const { id } = useParams();
  console.log(id);
  let singleproduct = products?.find((p) => p.id.toString() === id);
  const [Singleproductstate, setSingleproductstate] = useState([singleproduct]);
  console.log(singleproduct);
  console.log(Singleproductstate);
  useEffect(() => {
    dispatch(productslist());
    console.log(Singleproductstate);

    const imgfunc = Singleproductstate.map((el) => el?.thumbnail); 
    setimage(imgfunc[0]);
    
    setSingleproductstate([singleproduct]);
  }, []);
  if(isLoading || singleproduct === undefined) {
    return <div>Loading......</div>
  }

  return (
    <div>
      {Singleproductstate?.map((el, idx) => {
        return (
          <div key={idx}>
            <div className="description">{el?.description}</div>
            <div className="container_flex">
              <div className="img_flex">
                <img
                  src={el?.images[0]}
                  onClick={() => setimage(el?.images[0])}
                  alt="Productimage"
                />

                <img
                  src={el?.images[1] ? el?.images[1] : el?.images[0]}
                  onClick={() =>
                    setimage(el?.images[1] ? el?.images[1] : el?.images[0])
                  }
                  alt="Productimage"
                />

                <img
                  src={el?.images[2] ? el?.images[2] : el?.images[0]}
                  onClick={() =>
                    setimage(el?.images[2] ? el?.images[2] : el?.images[0])
                  }
                  alt="Productimage"
                />
              </div>

              <div className="thumnail_img">
                <img src={image} alt="" />
              </div>
              <div className="title">{el?.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Singlepage;
