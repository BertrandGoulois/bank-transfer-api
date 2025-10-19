const express = require('express');
const router = express.Router();
const { postTransfer, postWithdrawal, getHistory } = require('../controllers/accountController');

router.post('/:fromAccountId/transfer', postTransfer);
router.post('/:accountId/withdraw', postWithdrawal);
router.get('/:accountId/history', getHistory);

module.exports = router;
