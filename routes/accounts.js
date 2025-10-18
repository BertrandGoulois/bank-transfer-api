const express = require('express');
const router = express.Router();
const { postTransfer } = require('../controllers/accountController');

router.post('/:fromAccountId/transfer', postTransfer);

module.exports = router;
