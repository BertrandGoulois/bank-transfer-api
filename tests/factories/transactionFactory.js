"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTransaction = makeTransaction;
const Transaction_1 = require("../../src/domain/entities/Transaction");
function makeTransaction(overrides) {
    const now = new Date();
    return new Transaction_1.Transaction(overrides?.id ?? 0, overrides?.accountId ?? 1, overrides?.type ?? 'DEPOSIT', overrides?.amount ?? 100, overrides?.description, overrides?.createdAt ?? now);
}
