import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import About from "./pages/About"
import Product from "./pages/Product"
import Cart from "./pages/Cart";
import WishList from "./pages/WishList";
import UserLogin from "./auth/UserLogin";
import UserSIgnUp from "./auth/UserSIgnUp";
import AdminDashboard from "./admin/AdminDash";
import AddProduct from "./admin/AddProduct";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Main Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />

            <Route path="about" element={<About />} />
            <Route path="product" element={<Product />} />
            <Route path="wishlist" element={<WishList />} />
            <Route path="cart" element={<Cart />} />
            <Route path="userlogin" element={<UserLogin />} />
            <Route path="usersignup" element={<UserSIgnUp />} />
          </Route>
          <Route path="admin" element={<AdminDashboard />} >
            <Route path="insert" element={<AddProduct />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
