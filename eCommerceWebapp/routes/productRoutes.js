import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  //     deleteProductController,
  //   getProductByIdController,
  //   getProductController,
  getProductsByCategoryController,
  //   getSingleProductBySlugController,
  //   productCountController,
  //   productFiltersController,
  //   productListController,
  //   productPhotoController,
  //   searchProductController,
  //    updateProductController,
} from "../controller/ProductController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
// router.post('/create-product' , requireSignIn , isAdmin , formidable(), createProductController)
router.post("/", createProductController);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/products-by-category/:cid", getProductsByCategoryController);
// //routes get product
// router.get("/get-product", getProductController);

// //routes get single product
// router.get("/get-product/:slug", getSingleProductBySlugController);

// //get photo
// router.get("/product-photo/:pid", productPhotoController);

// // Route to delete product
// router.delete("/delete-product/:pid", deleteProductController);

// // Update product route

// router.put("/update-product/:id", formidable(), updateProductController);

//get product by category

// //filter product
// router.post("/product-filters", productFiltersController);

// //product per page
// router.get("/product-list/:page", productListController);

// //product count
// router.get("/product-count", productCountController);

// router.get("/search/:keyword", searchProductController);

// // Get single product by ID
// router.get("/get-product-by-id/:pid", getProductByIdController);

export default router;
