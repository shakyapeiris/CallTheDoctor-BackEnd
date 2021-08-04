const router = require('express').Router()

const recordController = require('../controllers/record-controller')

router.get('/:recordId', recordController.getRecord)

module.exports = router;