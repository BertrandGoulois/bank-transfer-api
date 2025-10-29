const { postTransfer } = require('../controllers/transferController');
const { postWithdrawal } = require('../controllers/withdrawalController');
const { getHistory } = require('../controllers/historyController');

module.exports = { postTransfer, postWithdrawal, getHistory };