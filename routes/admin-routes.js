const router = require('express').Router();

const adminController = require('../controllers/admin-controller');

router.post('/register', adminController.postRegister)

router.post('/login', adminController.postLogin)

router.get('/:adminId', adminController.getRecords)

router.get('/verify/:adminId', adminController.verifyAdmin)

module.exports = router