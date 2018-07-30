const express = require('express');
const router = require('express-promise-router')();

const {validateBody, schemas } = require("../helpers/routeHelpers");

const ProductsController = require('../controllers/products');

router.route('/post')
.post(validateBody(schemas.productSchema), ProductsController.createProduct);

router.route('/')
.get(ProductsController.getProducts);

router.route('/:id')
.get(ProductsController.getProductById);

router.route('/:id')
.delete(ProductsController.deleteProduct);

router.route('/:id')
.patch(validateBody(schemas.productSchema), ProductsController.updateProduct);



module.exports = router;