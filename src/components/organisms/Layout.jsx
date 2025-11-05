import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import { cartService } from "@/services/api/cartService";
import { wishlistService } from "@/services/api/wishlistService";
import { productService } from "@/services/api/productService";

function Layout() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsData, cartData, wishlistData] = await Promise.all([
        productService.getAll(),
        cartService.getCart(),
        wishlistService.getAll(),
      ]);
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCartItems(cartData);
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    if (!term.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const outletContext = {
    cartItems,
    setCartItems,
    products,
    setProducts,
    filteredProducts,
    setFilteredProducts,
    wishlist,
    setWishlist,
    loading,
    setLoading,
    handleSearch,
    loadInitialData,
  };

  return (
    <div className="App min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        onSearch={handleSearch}
      />
      
      <main>
        <Outlet context={outletContext} />
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Layout;