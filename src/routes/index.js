
const { Router } = require('express');
const router = Router();

const users = require('./users.js')
const products = require('./products.js')

// router.use('/users', users)
router.use('/products', products)

module.exports = router;