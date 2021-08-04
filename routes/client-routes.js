const router = require('express').Router();

const clientControllers = require('../controllers/user-controller');

router.post('/register', clientControllers.postRegister)

router.post('/login', clientControllers.postLogin)

router.post('/notify', clientControllers.sendNotification)

router.get('/:userId', clientControllers.getProfile)

module.exports = router