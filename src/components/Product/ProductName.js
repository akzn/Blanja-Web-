import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Navbar from "../Navbar";
import Newdata from "../Home/NewData";
import "../../assets/style/product.css";
import Rating from "../Rating/Rating";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/product";
import { API } from "../../utility/Auth";

const ProductName = (props) => {
  const {
    name,
    qty_in_stock,
    price,
    brand,
    condition,
    desc,
    size,
    photo,
    qty,
    color,
    rating,
    id,
    seller_id,
  } = props;

  const [jumlah, setJumlah] = useState(1);
  const [sizes, setSizes] = useState(0);
  const [warna, setWarna] = useState("");
  // console.log("color", warna);
  // console.log("jumlah", jumlah);
  // console.log("sizes", sizes);
  // console.log("ID", id);
  // console.log("ID_SELLER", seller_id);
  // console.log("ini props", props);
  // console.log("ini addtocart", addToCart);

  const history = useHistory();

  const { carts: stateCarts } = useSelector((state) => state.product);
  const userdata = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const isSoldOut = qty_in_stock < 1;
  console.log('product prop',props)
  console.log('isSoldOut',isSoldOut)

  const kirim = () => {
    if (userdata && userdata.user_id) {
      if (!isSoldOut) {
        const sendData = {
          brand: brand,
          id: id,
          photo: photo[0],
          name: name,
          price: Number(price),
          qty_in_stock:qty_in_stock,
          qty: jumlah,
          seller_id: seller_id,
          selected: true,
          user_id:userdata.user_id
        };
        dispatch(addToCart(sendData));
        history.push("/mybag");
      }
    } else {
      history.push("/login");
    }
  };

  const index = stateCarts.findIndex((item) => {
    return item.id === id;
  });

  // console.log("INDEX", size[sizes]);

  const handleAddToCart = () => {
    if (userdata && userdata.user_id) {
      if (!isSoldOut) {
        dispatch(
          addToCart({
            brand: brand,
            id: id,
            photo: photo[0],
            name: name,
            price: Number(price),
            qty_in_stock:qty_in_stock,
            qty: jumlah,
            seller_id: seller_id,
            selected: false,
            user_id: userdata.user_id,
          })
        );
      }
    } else {
      history.push("/login");
    }
  };

  const handleMinusClick = () => {
    if (qty_in_stock > 0) {
      if (jumlah <= 1) {
        return;
      } else {
        setJumlah(jumlah - qty);
      }
    }
  };

  const handlePlusClick = () => {
    if (qty_in_stock > 0) {
      // setJumlah((prevJumlah) => Math.min(prevJumlah + qty_in_stock, qty_in_stock));
      if (qty_in_stock > 0) {
        if ((jumlah + qty) > qty_in_stock) {
          setJumlah(qty_in_stock);
          alert('Limit Stock Reached')
        } else {
          setJumlah(jumlah + qty);
        }
      }
    }
  };

  
  useEffect(() => {
    console.log('user_id',userdata.user_id)
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-5 col-lg-5">
            <img
              className="img-fluid rounded"
              src={API + photo[0]}
              style={{ height: "25rem" }}
              alt=""
            />
            <div className="d-flex">
              <img
                className="img-fluid rounded mt-2"
                src={API + photo[0]}
                alt="img"
                style={{ width: "20%", margin: "1px" }}
              />
              <img
                className="img-fluid rounded mt-2"
                src={API + photo[1]}
                alt="img"
                style={{ width: "20%", margin: "1px" }}
              />
              <img
                className="img-fluid rounded mt-2"
                src={API + photo[2]}
                alt="img"
                style={{ width: "20%", margin: "1px" }}
              />
            </div>
          </div>
          <div className="col-12 col-md-7 col-l-7">
            {isSoldOut && <p className="sold-out-text bg-danger text-light text-center font-weight-bold mb-0">Sold Out</p>}
            <h3 className="name">{name}</h3>
            <p className="brand">{brand}</p>
            <Rating product_rating={rating} />
            <h3 className="tag-price mt-5">Price</h3>
            <p className="price">Rp. {price}</p>
            <h4>Color</h4>
            {color &&
              color.map(({ id, color_hexa, color_name }) => {
                return (
                  <button
                    key={id}
                    onClick={() => setWarna(color_name)}
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: color_hexa,
                      borderColor: color_name === warna ? color_hexa : "white",
                      borderRadius: "100%",
                      borderWidth: "5px",
                    }}
                    className="mr-3"
                  />
                );
              })}
            <div className="d-flex">
              <p className="tag-size mr-5 mt-5">Size</p>
              <p className="tag-total mt-5 ml-5">Jumlah</p>
            </div>

            <div className="d-flex">
              <button
                className="minus mr-2"
                onClick={() => {
                  if (sizes === 0) return;
                  setSizes((sizes) => sizes - 1);
                }}
              >
                <p>-</p>
              </button>
              <p className="number mt-2">{size[sizes]}</p>
              <button
                className="plus ml-2"
                onClick={() => {
                  if (sizes === size.length - 1) {
                    return;
                  } else if (sizes < size.length) {
                    setSizes((sizes) => sizes + 1);
                  }
                }}
              >
                <p>+</p>
              </button>
              <button
                className="minus2 mr-2"
                style={{
                  backgroundColor: jumlah === 1 ? "#d4d4d4" : "white",
                  borderColor: jumlah === 1 ? "white" : "gray",
                }}
                onClick={handleMinusClick}
              >
                <p style={{ color: jumlah === 1 ? "white" : "black" }}>-</p>
              </button>
              <p className="number mt-2">{jumlah}</p>
              <button
                className="plus ml-2"
                onClick={handlePlusClick}
              >
                <p>+</p>
              </button>
            </div>
            <div className="row">
              <div className="col-12 col-sm-3 mt-2">
              <Link
                  to={{
                    pathname: "/chat",
                    seller_id,
                  }}
                >
                <button className="chat rounded-pill">Chat</button>
                </Link>
              </div>
              
              {/* Btn keranjang  */}
              { !isSoldOut ? (
                <div className="row col-12 col-sm-9 mt-2">
                  <div className="col-12 col-sm-6">
                    {index >= 0 ? (
                      <button
                        className="rounded-pill"
                        style={{
                          backgroundColor: "#222222",
                          color: "white",
                          fontSize: "10px",
                          width: "100%",
                          height: "48px",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                        }}


                      >
                        Item already in bag
                      </button>
                    ) : (
                      <button
                        className="rounded-pill"
                        style={{
                          backgroundColor: "white",
                          color: "Black",
                          fontSize: "15px",
                          width: "100%",
                          height: "48px",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                        }}
                        onClick={handleAddToCart}
                        disabled={isSoldOut}
                      >
                        Add bag
                      </button>
                    )}
                  </div>

                  <div className="col-12 col-sm-6 ">
                    <button className="buy rounded-pill" onClick={kirim}>
                      Buy Now
                    </button>
                  </div>
             
                </div>
              ) : (
                <div className="row col-12 col-sm-9 mt-2">
                  <div className="col-12 col-sm-6 ">
                    {/* <p className="sold-out-text bg-danger text-light text-center font-weight-bold mb-0">Sold Out</p> */}
                  </div>
                </div>
              )}
              
              {/* end button add keranjang */}
            </div>
          </div>
        </div>
        <h3 className="informasi">Informasi Produk</h3>
        {/* <h3 className="tag-condition mt-5">Condition</h3>
        <p className="condition">{condition}</p> */}
        <h3 className="tag-desc">Description</h3>
        <p className="desc">{desc}</p>
        <p className="informasi">Product review</p>
        <div className="d-flex">
          <p className="rate">{rating}</p>
          <p className="five">/5</p>
        </div>
        <div className="star">
          <Rating product_rating={rating} />
        </div>
        <div>
          <hr />
          <h2 className="part-section mt-5">You can also like this</h2>
          <p>You’ve never seen it before!</p>
        </div>

        <article>
          <div className="row d-flex flex-row justify-content-start">
            <Newdata />
          </div>
        </article>
      </div>
    </div>
  );
};

export default ProductName;
