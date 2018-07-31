const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

//there are four routes - post, get all orders, get specific order, delete an order

module.exports = {

    postOrder: async(req, res, next) =>{

        const productId = req.value.body.product;
        const quantity = req.value.body.quantity;

        //need to verify that before we post the order, the product in the order exists in our products collection
        try{

            const productExists = await Product.findById(productId);

            if(!productExists){
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product:productId,
                quantity:quantity
            });

            //save the new order
            await order.save();

            //respond with a token
            res.status(201).json({
                message: "Order has been stored",
                createdOrder: {
                    "product": order.product,
                    "quantity": order.quantity
                },
                request:{
                    type: "GET",
                    message: "To see this order you saved, visit the url below...",
                    url: 'http://localhost:3000/orders/'+order._id
                }
            });

        }catch(error){
            console.log("Error", error);

            res.status(500).json({
                error: error
            });
        }
         
    },

    getOrders: async (req, res, next) =>{
        try{
            //get all the orders in the DB and save them in allOrders
            const allOrders = await Order.find({})
                                         .populate('product', 'name price');

            if(allOrders.length < 1){
                return res.status(404).json({
                    message: "There are no orders"
                });
            }

            res.status(200).json({
                message: "Find the orders below",
                count: allOrders.length,
                orders: allOrders.map(doc=>{
                    return{
                        product: doc.product,
                        quantity: doc.quantity,
                        price: doc.price,
                        request:{
                            type: "GET",
                            message: "To see a specific order click the url below",
                            url: "http://localhost:3000/orders/"+doc._id
                        }
                    }
                })
            });

        }catch(error){
            res.status(500).json({
                error
            });
        }
    },

    getOrderById: async(req, res, next) =>{
        try{
            const id = req.params.id;

            const order = await Order.findById(id).populate('product');
            console.log("Order is here ", order);

            if(!order){
                return res.status(404).json({
                    message: "Order not found"                    
                });
            }

            res.status(200).json({
                message: "Here is the order",
                name: order.product.name,
                price: order.product['price'],
                quantity: order.quantity,

                request:{
                    message:"To see all the orders click on the url link below",
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            });

        }catch(error){
            res.status(500).json({
                error
            });
        }
    },

    deleteOrder: async(req, res, next)=>{
        try{
            
            Order.remove({_id:req.params.id});
        }catch(error){

        }
    }

}