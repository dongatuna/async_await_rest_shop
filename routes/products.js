const express = require('express');
const router = require('express-promise-router')();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads/");
    },

    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-')+file.originalname);
    }

});

const fileFilter = (req, file, cb)=>{
    //reject a file
    if(file.mimetype ==='image/jpeg'|| file.mimetype==='image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({
    storage,
    limits: {fileSize: 1024*1024*25},
    fileFilter
});

const {validateBody, schemas } = require("../helpers/routeHelpers");
const ProductsController = require('../controllers/products');

router.route('/post')
.post(checkAuth, upload.single('productImage'), validateBody(schemas.productSchema), ProductsController.createProduct);

router.route('/')
.get(ProductsController.getProducts);

router.route('/:id')
.get(ProductsController.getProductById);

router.route('/:id')
.delete(checkAuth, ProductsController.deleteProduct);

router.route('/:id')
.patch(checkAuth, validateBody(schemas.productSchema), ProductsController.updateProduct);

module.exports = router;