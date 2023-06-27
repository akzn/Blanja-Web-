import Layout from '../../../components/Admin/Layout';
import React, { useEffect, useState } from "react";
import { Jumbotron } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import NotFound from "../../../assets/image/ordernot.png";
const getUrl = process.env.REACT_APP_URL;

const ViewOrderList = () => {
//   const [order, setOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page
  const [order, setOrder] = useState([]); // Array to store fetched data
  const [displayedOrder, setDisplayedOrder] = useState([]);

  const token = useSelector((state) => state.auth.data.token);

  //pagination
  const totalPages = Math.ceil(order.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getOrder = async () => {
    await axios
      .get(`${getUrl}/orders/admin`, {
        headers: {
          "x-access-token": "Bearer " + token,
        },
      })
      .then(({ data }) => {
        console.log('orders',data)
        const order = data.data;
        console.log("ini order", order);
        setOrder(order);
      })
      .catch((err) => {
        console.log("ini error", err.response);
      });
  };

  // get data on finish render
  useEffect(() => {
    getOrder();
  }, []);

  // update page
  useEffect(() => {
    const updatedOrder = order.slice(startIndex, endIndex);
    setDisplayedOrder(updatedOrder);
  }, [currentPage, order, startIndex, endIndex]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Layout>
   
      <h3>Order List</h3>
      <p>Manage Store Order List</p>
      <hr />
            {order.length === 0 ? (
              <div className="d-flex justify-content-center align-items-center mt-10">
                <img src={NotFound} style={{ height: "15rem" }} />
              </div>
            ) : (
              <div className="container">
                <div className="d-flex">
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Transaction Code</th>
                        <th scope="col">Status Order</th>
                        <th scope="col">Address</th>
                        <th scope="col">Total Price</th>
                        {/* <th scope="col">Product Name</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {displayedOrder.map(
                        ({
                          id,
                          transaction_code,
                          total,
                          status_order,
                          address,
                          order_detail,
                        }) => {
                          return (
                            <>
                              <tr>
                                <td>
                                  <Link to={{ pathname: "/admin/order-detail/"+transaction_code,  state: { id } }} style={{ textDecoration: "none" }}>
                                    {transaction_code}
                                  </Link>
                                </td>
                                <td>{status_order}</td>
                                <td>{address}</td>
                                <td>Rp. {total}</td>

                                {/* {order_detail.map(
                                  ({ category_name, product_name }) => {
                                    return (
                                      <>
                                        <td>{product_name}</td>
                                      </>
                                    );
                                  }
                                )} */}
                              </tr>
                            </>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Render the pagination buttons */}
                <nav>
                    <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        key={index}
                        >
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(index + 1)}
                            disabled={currentPage === index + 1}
                        >
                            {index + 1}
                        </button>
                        </li>
                    ))}
                    </ul>
                </nav>
              </div>
            )}
    </Layout>
  );
};

export default ViewOrderList;