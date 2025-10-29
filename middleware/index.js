/**
 * Validates transfer input.
 */
const validateTransferInput = require('./validateTransferInput');
/**
 * Validates withdrawal input.
 */
const validateWithdrawalInput = require('./validateWithdrawalInput');
/**
 * Validates history input.
 */
const validateHistoryInput = require('./validateHistoryInput');

module.exports = { validateTransferInput, validateWithdrawalInput, validateHistoryInput };