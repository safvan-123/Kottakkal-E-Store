import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { CategoryProvider } from "./context/CategoryContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const clientId =
  "226251661150-764glgmht3fd65okj8acfacs41rcilgp.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ThemeProvider>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <CategoryProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CategoryProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </ThemeProvider>
  // </StrictMode>
);
