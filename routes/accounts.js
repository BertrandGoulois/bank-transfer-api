const express = require('express');
const router = express.Router();
const { validateTransferInput, validateWithdrawalInput } = require('../middleware');
const { postTransfer, postWithdrawal, getHistory } = require('../controllers/accountController');

router.post('/:fromAccountId/transfer', validateTransferInput, postTransfer);
router.post('/:accountId/withdraw', validateWithdrawalInput, postWithdrawal);
router.get('/:accountId/history', getHistory);

module.exports = router;
