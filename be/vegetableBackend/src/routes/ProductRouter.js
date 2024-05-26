const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/ProductController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', ProductController.createProduct)
// router.put('/update/:id', authMiddleware, ProductController.updateProduct)
router.put('/update/:id', ProductController.updateProduct)
// router.get('/get-details/:id', ProductController.getDetailsProduct)
router.get('/get-details/:id', ProductController.getDetailsProduct)
router.delete('/delete/:id', ProductController.deleteProduct)
router.get('/get-all', ProductController.getAllProduct)
router.post('/delete-many', ProductController.deleteMany)
router.get('/get-all-type', ProductController.getAllType)
router.get('/get-all-rating', ProductController.getAllRating)

module.exports = router
