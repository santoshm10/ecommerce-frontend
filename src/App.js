/*import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppContextProvider } from './contexts/AppContext';

import Home from './pages/Home';
import Nav from './components/Nav';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';


function App() {
  return (
    <AppContextProvider>
      <Router>
        
        
        <Routes>
          <Nav />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />}/>
          <Route path="/products/category/:category" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetails />}/>
          <Route path="/cart" element={<Cart />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/wishlist" element={<Wishlist />}/>
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
*/

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from './contexts/AppContext';

import Home from './pages/Home';
import Nav from './components/Nav';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Avatar from './pages/Avatar';
import AddAddress from './components/addressManagement/AddAddress';






function App() {
  return (
    <Router> 
      <AppContextProvider> 
        <Nav />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/category/:category" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Avatar />} />
          <Route path="/profile/:userId/address" element={<AddAddress />} />
          
        </Routes>
      </AppContextProvider>
    </Router>
  );
}

export default App;
