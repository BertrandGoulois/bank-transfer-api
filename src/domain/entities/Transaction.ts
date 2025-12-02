export class Transaction {
    constructor(
        public readonly id: number,
        public readonly accountId: number,
        public readonly type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER',
        public readonly amount: number,
        public readonly description?: string,
        public createdAt: Date = new Date()
    ) {}
}