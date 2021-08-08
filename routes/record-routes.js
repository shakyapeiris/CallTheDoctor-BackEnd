const router = require('express').Router()

const recordController = require('../controllers/record-controller')

router.get('/:recordId', recordController.getRecord)

router.post('/:recordId', recordController.postDischarge)

module.exports = router;