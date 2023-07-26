import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "../Rating/Rating";
import axios from "axios";
import Loader from "../Loader/Loader";
const getUrl = process.env.REACT_APP_URL;

const NewData = () => {
  const [products, setProducts] = useState([]);
  const getProducts = () => {
    axios
      .get(`${getUrl}/products?limit=15&keyword=created_at DESC`)
      .then((res) => {
        const newProduct = res.data.data.products;
        // console.log('newProduct',newProduct);
        setProducts(newProduct);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (!products.length) {
    return <Loader />;
  }

  return (
    <>
      {products.map(
        ({
          id,
          product_name,
          product_photo,
          category_name,
          product_price,
          product_qty,
          product_desc,
          rating,
        }) => {
          
          // Check if the product is sold out (quantity less than 1)
          const isSoldOut = product_qty < 1;
          return (
            <Card
              className="card-style"
              style={{ width: "18rem", marginRight: "12px" }}
              key={id}
            >
              <Link
                to={{
                  pathname: `/products/${id}`,
                  products,
                }}
              >
                <img
                  src={getUrl + JSON.parse(product_photo).shift()}
                  className="card-img-top img-fluid"
                  alt="..."
                  style={{ height: "15rem" }}
                />
              </Link>

              <div className="card-body" style={{ bottom: 0 }}>
                {/* Display "Sold Out" text if the product is sold out */}
                {isSoldOut && <p className="sold-out-text bg-danger text-light text-center font-weight-bold mb-0">Sold Out</p>}
                <h5 className="card-title">{product_name}</h5>
                <p className="card-text">Rp. {product_price}</p>
                <p className="card-text2">{category_name}</p>
                <Rating product_rating={rating} />
              </div>
            </Card>
          );
        }
      )}
    </>
  );
};

export default NewData;
