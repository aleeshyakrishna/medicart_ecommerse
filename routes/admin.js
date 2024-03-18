var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admin_controller/adminController');
const authentication = require('../middleware/middlewares')
const multer=require('../multer/multer')
/* GET home page. */
router.get('/' ,adminController.adminLogin)
router.post('/',adminController.postAdminLogin)
router.get('/admin-logout',adminController.adminLogout)

router.get('/dashboard', adminController.admindashboard)


router.get('/view-user', adminController.getUserlist)

router.get('/block-users/:id', adminController.blockTheUser)

router.get('/unblock-users/:id', adminController.unblockTheUser)

router.route('/add-category')
    .get(adminController.getCategory)
    .post(adminController.postCategory)


router.post('/delete-product/:id',adminController.deleteProduct)

router.get('/edit-product/:productId',adminController.editProduct)
router.post('/edit-product/:productId',adminController.post_EditProduct)

router.get('/view-product',adminController.viewproduct)

router.get('/add-product', adminController.getaddProduct)

router.post('/add-product',multer.uploads.array('mimg',4),adminController.addProducts)

router.get('/admin_check',(req,res)=>{
    res.render("admin/admin_")
})

router.get('/order-management',adminController.orderManagement)


module.exports = router;
