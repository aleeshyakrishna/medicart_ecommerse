const express = require('express');
const userController = require('../controllers/user_controller/userController');
const router = express.Router();
const middleware=require('../middleware/middlewares');
const userHelper = require('../helpers/userHelper');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//  res.render('user/index')
// });


router.get('/',userController.getHome)

router.route('/signup')
   .get(userController.showSignup)
   .post(userController.postSignup)

router.route('/login')
   .get(userController.showLogin)
   .post(userController.postLogin)

   router.get('/logout',userController.logout)

   router.get('/profile',middleware.userAuth,userController.getAccount)

   router.get('/cart' ,middleware.userAuth,userController.getCart)

   router.get('/add-to-cart/:id', middleware.userAuth,userController.addToCart)

   router.post('/update-quantity/:id',middleware.userAuth,userController.changeQuantity) 

   router.get('/forgot',userController.getForgot)

   router.get('/checkout',middleware.userAuth,userController.getCheckout)

   router.post('/checkout',middleware.userAuth,userController.postcheck)

   router.get('/addAddress',middleware.userAuth,userController.getaddAddress)
   router.post('/addAddress',middleware.userAuth,userController.addAddress)

   router.get('/order-placed',middleware.userAuth,userController.getOrderConfirmed)
   // router.post('addAddress',middleware.userAuth,userController.)

// router.get('/otp_login',userController.Otppage)

router.get('/selectAddress',middleware.userAuth,userController.getSelectAddress)

//
router.get('/search', userController.search);
// router.get('/category/:id',userController.getCategory)


router.get('/shopcategory',userController.categoryproduct)

router.post('/changepassword',middleware.userAuth,userController.changePassword)
// router.post('/changepassword',middleware.userAuth,userController.changePassword)

module.exports = router;
