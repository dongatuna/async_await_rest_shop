const express = require("express");
const router = require("express-promise-router")();

const {validateBody, schemas } = require("../helpers/routeHelpers");

const OrdersController = require("../controllers/orders");
const checkAuth = require('../middleware/check-auth');

router.route('/post')
    .post(checkAuth, validateBody(schemas.orderSchema), OrdersController.postOrder);

router.route('/')
    .get(checkAuth, OrdersController.getOrders);

router.route('/:id')
    .get(checkAuth, OrdersController.getOrderById);

module.exports =router;