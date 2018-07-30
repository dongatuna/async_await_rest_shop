const express = require("express");
const router = require("express-promise-router")();

const {validateBody, schemas } = require("../helpers/routeHelpers");

const OrdersController = require("../controllers/orders");

router.route('/post')
    .post(validateBody(schemas.orderSchema), OrdersController.postOrder);

router.route('/')
    .get(OrdersController.getOrders);

router.route('/:id')
    .get(OrdersController.getOrderById);

module.exports =router;