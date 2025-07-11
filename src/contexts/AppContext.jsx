import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppContextProvider({ children }) {
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [cartIconAlert, setCartIconAlert] = useState("");
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState([]);
  const [rating, setRating] = useState(null);
  const [sort, setSort] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  console.log("cartItems: ", cartItems);
  const [localCartItems, setLocalCartItems] = useState([]);
  console.log("localCartItems: ", localCartItems);
  const [wishlistItems, setWishlistItem] = useState([]);
  const [localWishlistItems, setLocalWishlistItems] = useState([]);
  console.log("localWishlistItems: ", localWishlistItems);
  const [userId, setUserId] = useState("6825cc70ffc5d2746de48e9c"); //userId = "68103fd1e368407f3b0d93ef"; // Replace with logged-in user ID later
  console.log("wishlistItems aapcontext: ", wishlistItems);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  console.log("newUserData after setnewUserData: ", newUserData);

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

  //Fetch wishlist bu user id
  const fetchWishlist = async () => {
    setWishlistLoading(true); // Set loading to true before fetch
    try {
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/wishlist/${userId}`
      );
      const wishlistResult = await response.json();
      console.log("Fetched Wishlist Result:", wishlistResult);

      setWishlistItem(
        Array.isArray(wishlistResult)
          ? wishlistResult
          : wishlistResult.wishlist || []
      );
    } catch (error) {
      console.error("Error fetching wishlist: ", error);
      setWishlistItem([]); // Ensure it's an array even on error
    } finally {
      setWishlistLoading(false); // Set loading to false after fetch (success or error)
    }
  };

  // wishlist button: onclick product add or send in wishlist
  const handleAddToWishlist = async (user, productId, quantity) => {
    console.log("🛒 handleAddToWishlist →", { user, productId, quantity });

    try {
      // Check if item already in wishlist
      const wishlistExistingItem = wishlistItems.find(
        (item) => item.product._id === productId
      );

      console.log("🧾 Existing Wishlist Item:", wishlistExistingItem);

      if (wishlistExistingItem) {
        // If already in wishlist, update quantity
        await updateWishlistQuantity(
          productId,
          quantity + wishlistExistingItem.quantity
        );
        alert("Product already in wishlist. Increased quantity.");
      } else {
        const response = await fetch(
          "https://ecommerce-backend-gules-phi.vercel.app/api/wishlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user,
              product: productId,
              quantity,
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          alert("Product added to wishlist");
          fetchWishlist(); // Refresh wishlist UI
        } else {
          alert(
            "Failed to add to wishlist: " + (result.error || "Unknown error")
          );
        }
      }
    } catch (error) {
      console.error("Add to wishlist error:", error);
      alert("Something went wrong while adding to wishlist.");
    }
  };

  //Update Quantity
  const updateWishlistQuantity = async (productId, quantity) => {
    try {
      const response = await fetch(
        "https://ecommerce-backend-gules-phi.vercel.app/api/wishlist",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: userId, product: productId, quantity }),
        }
      );

      if (response.ok) {
        fetchWishlist();
      }
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  //Remove from Cart
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/wishlist/${wishlistItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Product remove from wishlist");
        await fetchWishlist(); // ✅ make sure to await
      }
    } catch (error) {
      console.error("Remove from wishlsit error:", error);
    }
  };

  //Fetch cart by user ID
  const fetchCart = async () => {
    setCartLoading(true); // Ensure this is also managed correctly for cart
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
    } finally {
      setCartLoading(false); // Set loading to false after fetch
    }
  };

  // Add to Cart (with check for existing product)

  const handleAddToCart = async (user, product, quantity) => {
  console.log("user, product, quantity", user, product, quantity);

  try {
    // ✅ Refresh cart first to get updated backend state
    await fetchCart();

    const latestCart = Array.isArray(cartItems) ? cartItems : [];

    const existingItem = latestCart.find(
      (item) => item.product._id === product
    );

    if (existingItem) {
      await updateCartQuantity(product, existingItem.quantity + quantity);
      alert("Product already in cart");
    } else {
      const response = await fetch(
        "https://ecommerce-backend-gules-phi.vercel.app/api/cart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, product, quantity }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Product added to cart");
        await fetchCart();
      } else {
        alert("Failed to add to cart: " + result.error);
      }
    }
  } catch (error) {
    console.error("Add to cart error:", error);
  }
};


  /* const handleAddToCart = async (user, product, quantity) => {
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

        const result = await response.json();
        if (response.ok) {
          alert("Product added to cart"); // This alert fires before knowing success
          fetchCart(); // Refresh cart
        } else {
          alert("Failed to add to cart: " + result.error);
        }
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  }; */

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

  const handleNewUserInput = (event) => {
    const { name, value } = event.target;
    setNewUserData({
      ...newUserData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });
      console.log("response: ", response);
      const result = await response.json();
      console.log("result: ", result);

      if (response.ok) {
        alert("User registered successfully");
      } else {
        alert(result.error || "Registration failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong");
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
        wishlistLoading, // EXPOSE NEW LOADING STATE
        showUserLogin,
        setShowUserLogin,
        setUserId,
        navigate,
        cartIconAlert,
        setCartIconAlert,
        handleCartAlert,
        handleAddToWishlist,
        removeFromWishlist,
        fetchWishlist,
        wishlistItems,
        newUserData,
        setNewUserData,
        handleNewUserInput,
        handleSubmit,
        localCartItems,
        setLocalCartItems,
        localWishlistItems,
        setLocalWishlistItems,
       
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
