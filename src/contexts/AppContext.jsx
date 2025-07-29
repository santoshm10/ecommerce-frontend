import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
//import { useEffect } from "react";

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
  const [priceRange, setPriceRange] = useState({ max: 10000 });
  const [searchQuery, setSearchQuery] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItem] = useState([]);

  const [userId, setUserId] = useState("68103fd1e368407f3b0d93ef"); //userId = "68103fd1e368407f3b0d93ef"; // Replace with logged-in user ID later
  const [deliveryAddres, setDeliveryAddress] = useState("");

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
    setPriceRange({ max: 10000 })
  };

  const ratingFilter = (e) => {
    setRating(Number(e.target.value));
  };

  const sortByFilter = (e) => {
    setSort(e.target.value);
  };

  const priceFilter = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  //Fetch wishlist by user id
  const fetchWishlist = async () => {
    setWishlistLoading(true);
    try {
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/wishlist/${userId}`
      );
      const wishlistResult = await response.json();

      setWishlistItem(
        Array.isArray(wishlistResult)
          ? wishlistResult
          : wishlistResult.wishlist || []
      );
    } catch (error) {
      console.error("Error fetching wishlist: ", error);
      setWishlistItem([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  // wishlist button: onclick product add or send in wishlist
  const handleAddToWishlist = async (user, productId, quantity) => {
    setWishlistItem((prev) => prev.filter((item) => item._id !== productId));

    try {
      // Check if item already in wishlist
      const wishlistExistingItem = wishlistItems.find(
        (item) => item.product._id === productId
      );

      if (wishlistExistingItem) {
        // If already in wishlist, update quantity
        await updateWishlistQuantity(
          productId,
          quantity + wishlistExistingItem.quantity
        );
        toast.success("Product already in wishlist. Increased quantity.");
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
          toast.success("Product added to wishlist");
          fetchWishlist(); // Refresh wishlist UI
        } else {
          toast.error(
            "Failed to add to wishlist: " + (result.error || "Unknown error")
          );
        }
      }
    } catch (error) {
      console.error("Add to wishlist error:", error);
      toast.error("Something went wrong while adding to wishlist.");
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

  //Remove from wishliat
  const removeFromWishlist = async (wishlistItemId) => {
    setWishlistItem((prev) =>
      prev.filter((item) => item._id !== wishlistItemId)
    );
    try {
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/wishlist/${wishlistItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Product remove from wishlist");
        await fetchWishlist();
      }
    } catch (error) {
      console.error("Remove from wishlsit error:", error);
    }
  };

  //Fetch cart by user ID
  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/cart/${userId}`
      );
      const result = await response.json();

      // ✅ Force it to always be an array
      setCartItems(Array.isArray(result) ? result : result.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]); // fallback
    } finally {
      setCartLoading(false);
    }
  };

  // Add to Cart (with check for existing product)

  const handleAddToCart = async (user, product, quantity) => {
    try {
      const latestCart = Array.isArray(cartItems) ? cartItems : [];

      const existingItem = latestCart.find(
        (item) =>
          item?.product?._id === product ||
          item?._id === product ||
          item?.product === product
      );

      if (existingItem) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.product._id === product
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );

        await updateCartQuantity(product, existingItem.quantity + quantity);
        toast.success("Product already in cart! Quantity Increased");
      } else {
        const response = await fetch(
          "https://ecommerce-backend-gules-phi.vercel.app/api/cart",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, product, quantity }),
          }
        );

        const result = await response.json(); // ✅ only once

        if (response.ok) {
          setCartItems((prev) => [...prev, result]);
          toast.success("Product added to cart");
        } else {
          toast.error("Failed to add to cart: " + result.error);
        }
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  //Update Quantity
  const updateCartQuantity = async (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
    try {
      const response = await fetch(
        "https://ecommerce-backend-gules-phi.vercel.app/api/cart",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: userId, product: productId, quantity }),
        }
      );

      if (!response.ok) {
        toast.error("Failed to update quantity");
        await fetchCart(); // fallback
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error("Network error during update");
      await fetchCart(); // fallback
    }
  };

  //Remove from Cart
  const removeFromCart = async (cartItemId) => {
    // Optimistic Update
    setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));

    try {
      const response = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/cart/${cartItemId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        toast.error("Failed to remove from cart");
        await fetchCart(); // fallback
      } else {
        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error("Network error during remove");
      await fetchCart(); // fallback
    }
  };

  const handleCartAlert = () => {
    if (!userId) {
      const msg = "Please Login";
      setCartIconAlert(msg);
      window.alert(msg);
    }
  };

  const handleDeliveryAddress = (event) => {
    const selectedDeliveryAddress = event.target.value;
    setDeliveryAddress(selectedDeliveryAddress);
    navigate(`/cart`);
  };

  const handlePlaceOrder = async (userId, cartItems, deliveryAddress) => {
    // 0️⃣ Basic validations
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return alert("Cart is empty. Cannot place order.");
    }

    if (!userId) {
      return alert("Please login.");
    }

    if (!deliveryAddress) {
      alert("Delivery address missing. Please Select Address.");
      return 
    }

    try {
      // 1️⃣ Build payload
      const orderItem = cartItems.map((item) => ({
        product: item.product._id || item.product, // support populated or non-populated
        quantity: item.quantity,
      }));

      const orderPrice = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // 2️⃣ POST to create order
      const orderRes = await fetch(
        "https://ecommerce-backend-gules-phi.vercel.app/api/order/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: userId,
            orderItem,
            orderPrice,
            deliveryAdress: deliveryAddress,
          }),
        }
      );

      const orderResult = await orderRes.json();

      if (!orderRes.ok) {
        return alert(
          "Failed to place order: " + (orderResult.error || "Unknown")
        );
      }

      toast.success("Order placed successfully!");

      // 3️⃣ DELETE all cart items for this user
      const deleteRes = await fetch(
        `https://ecommerce-backend-gules-phi.vercel.app/api/cart/user/${userId}`,
        { method: "DELETE" }
      );

      const deleteResult = await deleteRes.json();

      if (!deleteRes.ok) {
        return alert(
          "Order placed but failed to clear cart: " +
            (deleteResult.error || "Unknown")
        );
      }

      // 4️⃣ Clear frontend state & re‑fetch
      setCartItems([]);
      // If using fetchCart elsewhere to sync nav/cart count, enable below:
      // await fetchCart();
    } catch (err) {
      console.error("Error in handlePlaceOrder:", err);
      alert("Something went wrong while placing the order.");
    }
  };

  /*  useEffect( () => {
  if (userId) {
    fetchCart();
    fetchWishlist();
  }
}, [ fetchCart, fetchWishlist]);
 */

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
        wishlistLoading,
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
        deliveryAddres,
        setDeliveryAddress,
        handleDeliveryAddress,
        handlePlaceOrder,
        priceRange,
        priceFilter,
        searchQuery,
        handleSearchChange,
        clearSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
