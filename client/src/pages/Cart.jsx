import { useSelector, useDispatch } from "react-redux";
import Table from "react-bootstrap/Table";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import BASE_URL from "../config";
import { proDelete, qntyInc, qntyDec } from "../redux/cartSlice";
import "../css/cart.css"
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authCheck";
import { toast } from "react-toastify";

const Cart = () => {
  const cartItems = useSelector((state) => state.mycart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let totAmount = 0;

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 My Cart</h1>
      <hr />
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover className="cart-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((product) => {
                  totAmount += product.price * product.qnty;
                  return (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={`${BASE_URL}/${product.defaultImage}`}
                          alt={product.name}
                          className="cart-image"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>₹{product.price}</td>
                      <td>
                        <FaMinusCircle
                          className="icon-minus"
                          onClick={() => dispatch(qntyDec({ id: product.id }))}
                        />
                        <span className="quantity">{product.qnty}</span>
                        <FaPlusCircle
                          className="icon-plus"
                          onClick={() => dispatch(qntyInc({ id: product.id }))}
                        />
                      </td>
                      <td>₹{product.price * product.qnty}</td>
                      <td>
                        <MdDelete
                          className="icon-delete"
                          onClick={() => dispatch(proDelete(product.id))}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          <div className="total-amount-container">
            <h5>Total Amount: ₹{totAmount}</h5>
            <button
              className="checkout-button"
              onClick={() => {
                // Only require login at checkout
                if (!isAuthenticated()) {
                  toast.error('Please login to checkout');
                  navigate('/userlogin');
                  return;
                }
                navigate("/checkout");
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
