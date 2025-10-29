const express = require('express');
const router = express.Router();
const { validateTransferInput, validateWithdrawalInput, validateHistoryInput } = require('../middleware');
const { postTransfer, postWithdrawal, getHistory } = require('../controllers/accountController');

router.post('/:fromAccountId/transfer', validateTransferInput, postTransfer);
router.post('/:accountId/withdraw', validateWithdrawalInput, postWithdrawal);
router.get('/:accountId/history', validateHistoryInput, getHistory);

module.exports = router;
