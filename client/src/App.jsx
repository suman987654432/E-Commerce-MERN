import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";
import Cart from "./pages/Cart";

import UserLogin from "./auth/UserLogin";
import UserSignUp from "./auth/UserSignUp";
import AdminDashboard from "./admin/AdminDash";
import AddProduct from "./admin/AddProduct";
import UpdateProduct from "./admin/UpdateProduct";
import ToastProvider from "./components/ToastProvider"; // Import correctly
import WishListPage from "./pages/WishListPage"
import ProductDetailsPage from "./pages/ProductDetailsPage";

const App = () => {
  return (
    <>
      <ToastProvider />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="product" element={<Product />} />
            {/* <Route path="wishlist" element={<WishList />} /> */}
            <Route path="cart" element={<Cart />} />
            <Route path="userlogin" element={<UserLogin />} />
            <Route path="usersignup" element={<UserSignUp />} />
            <Route path="wish" element={< WishListPage />} />
            <Route path="/productdetails/:id" element={<ProductDetailsPage />} />
          </Route>

          <Route path="admin" element={<AdminDashboard />}>
            <Route path="insert" element={<AddProduct />} />
            <Route path="updateproducts" element={<UpdateProduct />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
