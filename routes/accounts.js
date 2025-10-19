const express = require('express');
const router = express.Router();
const { postTransfer, postWithdrawal } = require('../controllers/accountController');

router.post('/:fromAccountId/transfer', postTransfer);
router.post('/:accountId/withdraw', postWithdrawal);

module.exports = router;
