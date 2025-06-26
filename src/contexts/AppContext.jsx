
import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";



const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppContextProvider({ children }) {
  const navigate = useNavigate()
  const [cartLoading, setCartLoading] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [cartIconAlert, setCartIconAlert] = useState("")
  //const [state, setState] = useState(null);
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState([]);
  const [rating, setRating] = useState(null);
  const [sort, setSort] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState("68103fd1e368407f3b0d93ef"); //userId = "68103fd1e368407f3b0d93ef"; // Replace with logged-in user ID later

  const reduce = () => {
    setCount((c) => (c > 0 ? c - 1 : c));
  };

  const increse = () => {
    setCount((c) => c + 1);
  };

  const selectCategory = useCallback((e) => {
    const selectedValue = e.target.value;
    setCategory((prev) =>
      e.target.checked
        ? [...prev, selectedValue]
        : prev.filter((cat) => cat !== selectedValue)
    );
  }, []);

  const clearFilter = () => {
    setCategory([]);
    setRating(null);
    setSort(null);
  };

  const ratingFilter = (e) => {
    setRating(Number(e.target.value));
  };

  const sortByFilter = (e) => {
    setSort(e.target.value);
  };

  //Fetch cart by user ID
  const fetchCart = async () => {
    try {
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/cart/${userId}`
      );
      const result = await response.json();
      console.log("Fetched Cart Result:", result); // ✅ check what's returned

      // ✅ Force it to always be an array
      setCartItems(Array.isArray(result) ? result : result.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]); // fallback
    }
  };

  // Add to Cart (with check for existing product)
  const handleAddToCart = async (user, product, quantity) => {
    console.log("user, product, quantity", user, product, quantity);
    try {
      const existingItem = cartItems.find(
        (item) => item.product._id === product
      );

      console.log("existingItem", existingItem);
      if (existingItem) {
        // If product exists, increase quantity
        await updateCartQuantity(product, existingItem.quantity + quantity);
        alert("Product alredy in cart");
      } else {
        const response = await fetch(
          "https://ecommerce-backend-gules-phi.vercel.app/api/cart",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, product, quantity }),
          }
        );
        alert("Product added to cart");

        const result = await response.json();
        if (response.ok) {
          fetchCart(); // Refresh cart
        } else {
          alert("Failed to add to cart: " + result.error);
        }
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  //Update Quantity

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const response = await fetch(
        "https://ecommerce-backend-gules-phi.vercel.app/api/cart",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: userId, product: productId, quantity }),
        }
      );

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  //Remove from Cart

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/cart/${cartItemId}`,
        {
          method: "DELETE",
        }
      );

      alert("Product remove from cart");
      if (response.ok) {
        await fetchCart(); // ✅ make sure to await
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  const handleCartAlert = () => {
    if (!userId) {
      const msg = "Please Login";
      setCartIconAlert(msg);
      window.alert(msg);
    }
  };

  return (
    <AppContext.Provider
      value={{
        count,
        increse,
        reduce,
        category,
        selectCategory,
        clearFilter,
        rating,
        ratingFilter,
        sortByFilter,
        sort,
        handleAddToCart,
        cartItems,
        fetchCart,
        updateCartQuantity,
        removeFromCart,
        userId,
        cartLoading,
        showUserLogin,
        setShowUserLogin,
        setUserId,
        navigate,
        cartIconAlert, 
        setCartIconAlert,
        handleCartAlert
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
