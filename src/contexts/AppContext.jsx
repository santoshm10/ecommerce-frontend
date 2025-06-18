import { createContext, useContext, useState, useCallback } from "react";


const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppContextProvider({ children }) {
  const [state, setState] = useState(null);
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState([]);
  const [rating, setRating] = useState(null);
  const [sort, setSort] = useState(null)

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
}, [])

  const clearFilter = () => {
    setCategory([]);
    setRating(null);
    setSort(null)
  };

  const ratingFilter = (e) => {
    setRating(Number(e.target.value));
  };

  const sortByFilter = (e)=>{
    setSort(e.target.value)
  }

  const handleAddToCart = async (user, product, quantity) => {
  console.log("Add to Cart payload:", { user, product, quantity });

  try {
    const response = await fetch("https://ecommerce-backend-gules-phi.vercel.app/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user,        
        product,     
        quantity: Number(quantity),
      }),
    });

    const result = await response.json();
    console.log("Add to cart response:", result);

    if (response.ok) {
      alert("Item added to cart successfully!");
    } else {
      alert("Failed to add item to cart: " + result.error);
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    alert("Something went wrong while adding item to cart.");
  }
};


  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        reduce,
        count,
        increse,
        category,
        selectCategory,
        clearFilter,
        rating,
        ratingFilter,
        sortByFilter,
        sort,
        handleAddToCart
      }}
    >
      {children}
    </AppContext.Provider>
  );
}





