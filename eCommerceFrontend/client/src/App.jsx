import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "./components/Footer";
import Home from "./pages/Home";
import ShopPage from "./pages/ShopPage";
import Navbar from "./components/Navbar";
import SingleProductPage from "./components/SingleProductPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import MyOrdersPage from "./pages/MyOrder";
import ContactPage from "./pages/ContactPage";
import OfferSalesPage from "./components/OfferSalesPage";
import AddressForm from "./pages/AddressForm";
import OrderSuccessPage from "./pages/PurchaseSuccess";
import OrderDetailPage from "./components/OrderDetailPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import SubCategoriesPage from "./pages/SubCategoriesPage";
import Chatbot from "./components/chatbot/Chatbot";
import FloatingChatWidget from "./components/chatbot/FloatingChatWidget";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Notifications from "./components/Notifications";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/chat" element={<ShopPage />} />
        <Route path="/product/:productId" element={<SingleProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/myorders" element={<MyOrdersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/address" element={<AddressForm />} />
        <Route path="/offersalepage" element={<OfferSalesPage />} />
        <Route path="/ordersuccess" element={<OrderSuccessPage />} />
        <Route path="/myorders/:id" element={<OrderDetailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/subcategories/:masterCategoryname"
          element={<SubCategoriesPage />}
        />
      </Routes>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
