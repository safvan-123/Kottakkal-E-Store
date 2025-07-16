import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// import { useLocation } from "react-router-dom";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // const location = useLocation();
  const { token, isLoggedIn } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState(null);

  const CART_API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/cart`;

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn || !token) {
      setCartItems([]);
      setCartTotal(0);
      return;
    }

    setLoadingCart(true);
    setCartError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      };
      const { data } = await axios.get(CART_API_BASE_URL, config);
      if (data.success) {
        setCartItems(data.items);
        setCartTotal(data.total);
      } else {
        setCartError(data.message || "Failed to fetch cart.");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartError(
        error.response?.data?.message || "Error fetching cart items."
      );
    } finally {
      setLoadingCart(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1, size, color) => {
    if (!isLoggedIn) {
      toast.error("Please log in to add items to the cart.");
      return;
    }
    if (!token) {
      setCartError("Authentication token not available. Please log in again.");
      return;
    }

    const itemSize =
      size || (product.sizes?.length ? product.sizes[0] : "One Size");
    const itemColor =
      color || (product.colors?.length ? product.colors[0] : "Default Color");

    if (product.sizes?.length && !itemSize) {
      toast.error(`Please select a size for ${product.name}`);
      return;
    }
    if (product.colors?.length && !itemColor) {
      toast.error(`Please select a color for ${product.name}`);
      return;
    }
    if (product.colors?.length && itemColor === "Default Color" && !color) {
      toast.error(`Please select a color for ${product.name}`);
      return;
    }

    // ✅ Check if the item with same productId, size, and color already exists
    const itemAlreadyInCart = cartItems?.some(
      (item) => item.product?._id === product._id
    );

    setCartError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      };
      const payload = {
        productId: product._id,
        quantity,
        size: itemSize,
        color: itemColor,
      };
      const { data } = await axios.post(CART_API_BASE_URL, payload, config);

      if (data.success) {
        setCartItems(data.items);
        setCartTotal(data.total);

        if (!itemAlreadyInCart) {
          toast.success(
            () => (
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={product.imageUrl || "/images/default-product.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-green-600">
                    ✅ {product.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Successfully added to your cart!
                  </p>
                </div>
              </div>
            ),
            {
              autoClose: 3000,
              position: "top-right",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              hideProgressBar: false,
              icon: false,
            }
          );
        } else if (itemAlreadyInCart) {
          toast.info(
            () => (
              <div className="flex items-center space-x-3">
                {/* <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={product.imageUrl || "/images/default-product.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div> */}
                <div className="flex-shrink-0 w-14 h-14 bg-gray-200 rounded overflow-hidden relative">
                  <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={product.imageUrl || "/images/default-product.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-teal-600">
                    🛍️ {product.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Already in cart. Update quantity from the cart page.
                  </p>
                </div>
              </div>
            ),
            {
              autoClose: 4000,
              position: "top-right",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              hideProgressBar: false,
              icon: false,
            }
          );
        }
      } else {
        setCartError(data.message || "Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setCartError(
        error.response?.data?.message || "Error adding item to cart."
      );
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!isLoggedIn || !token) {
      toast.error("Please log in to modify your cart.");
      return;
    }

    const originalCartItems = cartItems;
    const originalCartTotal = cartTotal;
    const updatedItems = cartItems.filter((item) => item._id !== cartItemId);
    const updatedTotal = updatedItems.reduce(
      (acc, item) => acc + item.subTotal,
      0
    );

    setCartItems(updatedItems);
    setCartTotal(updatedTotal);
    toast.info("Removing item...");

    setCartError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      };
      const { data } = await axios.delete(
        `${CART_API_BASE_URL}/${cartItemId}`,
        config
      );

      if (data.success) {
        setCartItems(data.items);
        setCartTotal(data.total);
        toast.success("Item removed successfully!");
      } else {
        setCartItems(originalCartItems);
        setCartTotal(originalCartTotal);
        setCartError(data.message || "Failed to remove item from cart.");
        toast.error(data.message || "Failed to remove item.");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);

      setCartItems(originalCartItems);
      setCartTotal(originalCartTotal);
      setCartError(
        error.response?.data?.message || "Error removing item from cart."
      );
      toast.error(error.response?.data?.message || "Error removing item.");
    }
  };

  const updateCartQuantity = async (cartItemId, newQuantity) => {
    if (!isLoggedIn || !token) {
      toast.error("Please log in to modify your cart.");
      return;
    }
    if (newQuantity < 1) {
      toast.error(
        "Quantity cannot be less than 1. Use the trash icon to remove."
      );
      return;
    }

    const originalCartItems = cartItems;
    const originalCartTotal = cartTotal;

    const updatedItems = cartItems.map((item) =>
      item._id === cartItemId
        ? {
            ...item,
            quantity: newQuantity,
            subTotal:
              (item.product.offerPrice || item.product.price) * newQuantity,
          }
        : item
    );
    const updatedTotal = updatedItems.reduce(
      (acc, item) => acc + item.subTotal,
      0
    );

    setCartItems(updatedItems);
    setCartTotal(updatedTotal);

    setCartError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      };
      const payload = { quantity: newQuantity };
      const { data } = await axios.put(
        `${CART_API_BASE_URL}/${cartItemId}`,
        payload,
        config
      );

      if (data.success) {
        setCartItems(data.items);
        setCartTotal(data.total);
        toast.success("Cart quantity updated.");
      } else {
        setCartItems(originalCartItems);
        setCartTotal(originalCartTotal);
        setCartError(data.message || "Failed to update quantity.");
        toast.error(data.message || "Failed to update quantity.");
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);

      setCartItems(originalCartItems);
      setCartTotal(originalCartTotal);
      setCartError(
        error.response?.data?.message || "Error updating cart quantity."
      );
      toast.error(
        error.response?.data?.message || "Error updating cart quantity."
      );
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn || !token) {
      toast.error("Please log in to clear your cart.");
      return;
    }

    setLoadingCart(true);
    setCartError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      };
      const { data } = await axios.delete(CART_API_BASE_URL, config);

      if (data.success) {
        setCartItems([]);
        setCartTotal(0);
      } else {
        setCartError(data.message || "Failed to clear cart.");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      setCartError(error.response?.data?.message || "Error clearing cart.");
    } finally {
      setLoadingCart(false);
    }
  };

  const contextValue = {
    cartItems,
    cartTotal,
    loadingCart,
    cartError,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
