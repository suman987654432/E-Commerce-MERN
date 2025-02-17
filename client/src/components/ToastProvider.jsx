
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
  return <ToastContainer position="top-right" autoClose={2000} />;
};

export default ToastProvider;
