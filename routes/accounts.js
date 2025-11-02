const express = require('express');
const router = express.Router();
const { validateTransferInput, validateWithdrawalInput, validateHistoryInput } = require('../middleware');
const { postTransfer, postWithdrawal, getHistory } = require('../controllers');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/:fromAccountId/transfer', authenticateToken, validateTransferInput, postTransfer);
router.post('/:accountId/withdraw', authenticateToken, validateWithdrawalInput, postWithdrawal);
router.get('/:accountId/history', authenticateToken, validateHistoryInput, getHistory);

module.exports = router;
