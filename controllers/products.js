const mongoose = require('mongoose');
const Product = require('../models/product');
//const multer = require('multer');

module.exports = {

    createProduct: async (req, res, next)=>{
        try{
           
            const {name, price, productImage} = req.value.body;

            const newProduct = new Product({
                _id: new mongoose.Types.ObjectId(),
                name:req.value.body.name,
                price: req.value.body.price,
                productImage:req.file.path
            });

            await newProduct.save();
            console.log(newProduct);

            res.status(201).json({
                message: "Created new product",

                createdProduct:{
                    name: newProduct.name,
                    price: newProduct.price,
                    productImage:newProduct.productImage                  
                },

                request:{
                    type: "GET",
                    url: 'http://localhost:3000/products/'+newProduct._id
                }

            });
        }catch(error){
            console.log("This is product error", error);
            res.status(500).json({
                error: error
            });
        }
    },

    getProducts: async (req, res, next)=>{
        try{
            const allProducts = await Product.find({});

            console.log(allProducts);
            //check if the allProduct is null
            if(allProducts.length < 1){
                return res.status(404).json({
                    message: "No products in the store at the moment"
                });
            }

            res.status(200).json({
                count: allProducts.length,
                products: allProducts.map(product =>{
                    return{
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/products/'+product._id
                        }
                    
                    }
                })
            
            })
            
        }catch(error){
            res.status(500).json({
                error
            });
        }
    },

    getProductById: async(req, res, next)=>{
        try{
            const productId =req.params.id;

            //console.log(productId); 
            const product = await Product.findById(productId).select("name price");

            res.status(200).json({
                message: "Here is the product you requested",
                product,
                request: {
                    message: "To see all the products, click the link below",
                    type: "GET",
                    url: 'http://localhost:3000/products'
                }

            });

            
        }catch(error){
            res.status(500).json({error});
        }
    },

    updateProduct: async(req, res, next)=>{
        try{
            const id = req.params.id;

            const product = await Product.findByIdAndUpdate(id, req.value.body, {new: true});
            
            console.log("this is the updated product", product);
            res.status(200).json({
                
                request:{
                    message: "To see the updated product, see the link below",
                    type: "GET",
                    url: 'http://localhost:3000'+id
                }            
            });
    
        }catch(error){
            console.log(error);
        }
    },

    deleteProduct: async(req, res, next) =>{
        try{
            const productId = req.params.id;

            const result = await Product.remove({_id: productId});

            //console.log("Was the result deleted? ", result);

            if(result.ok){
                res.status(200).json({
                    message: "Product deleted",
                    request:{
                        message:"Use the url below to post a new product",
                        type: "POST",
                        url: "http://localhost:3000/products",
                        body:{name:"String", price: "Number"}
                    }
                });
            }
            

        }catch(error){
            res.status(500).json({
                error
            });
        }

    }
}