const express = require("express");
const router = express.Router();
const productsRoutes = require("../controllers/products-controller");

router.get("/es", productsRoutes.getProductsFromEs);
router.get("/sql", productsRoutes.getProductsFromSql);
router.get('/:id',productsRoutes.getProductDetails);
module.exports = router;
