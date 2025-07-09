import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";

import Products from "./pages/Products";
import AllUsers from "./pages/AllUsers";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import Createcategory from "./pages/Createcategory";
import AddOfferProduct from "./pages/AddOfferProduct";
import ListOfferProducts from "./pages/ListOfferProducts";
import AllOrders from "./pages/AllOrders";
import AllContacts from "./pages/ContactMessages";
import ReturnRequests from "./pages/ReturnRequests";
import AddMasterCategoryPage from "./pages/AddMasterCategory";
import MasterCategoryList from "./pages/MasterCategoryList";
import EditMasterCategory from "./pages/EditMasterCategory";
import SubCategoryListPage from "./pages/SubCategoryList";
import AddEditSubCategoryPage from "./pages/AddEditSubCategory";
import AddEditProductPage from "./pages/AddEditProductPage";
import ProductListPage from "./pages/ProductListingPage";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />}>
          <Route path="/allusers" element={<AllUsers />} />
          {/* <Route path="/products/category/:cid" element={<Products />} /> */}
          {/* <Route path="/product/create/:cid" element={<CreateProduct />} />
          <Route path="/update-product/:pid" element={<EditProduct />} /> */}
          <Route path="/create-category" element={<Createcategory />} />
          <Route path="/add-offer-products" element={<AddOfferProduct />} />
          <Route path="/get-offer-products" element={<ListOfferProducts />} />
          <Route path="/orders" element={<AllOrders />} />
          <Route path="/return-requests" element={<ReturnRequests />} />
          <Route path="/contactMsg" element={<AllContacts />} />
          <Route path="/addmaster" element={<AddMasterCategoryPage />} />
          <Route path="/listmaster" element={<MasterCategoryList />} />
          <Route path="/listmaster/:id" element={<EditMasterCategory />} />
          <Route path="/listsubcategory" element={<SubCategoryListPage />} />
          <Route path="/addsubcategory" element={<AddEditSubCategoryPage />} />
          <Route
            path="/addsubcategory/:id"
            element={<AddEditSubCategoryPage />}
          />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/addproduct" element={<AddEditProductPage />} />
          <Route path="/addproduct/:id" element={<AddEditProductPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
