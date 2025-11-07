import express, { Router } from 'express';
import { validateTransferInput, validateWithdrawalInput, validateHistoryInput } from '../middleware';
import { postTransfer, postWithdrawal, getHistory } from '../controllers';
import authenticateToken from '../middleware/authenticateToken';

const router: Router = express.Router();

router.post(
    '/:fromAccountId/transfer',
    authenticateToken,
    validateTransferInput,
    postTransfer
);

router.post(
    '/:accountId/withdraw',
    authenticateToken,
    validateWithdrawalInput,
    postWithdrawal
);

router.get(
    '/:accountId/history',
    authenticateToken,
    validateHistoryInput,
    getHistory
);

export default router;
