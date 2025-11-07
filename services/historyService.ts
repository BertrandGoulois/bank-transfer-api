import { sequelize } from '../models/index';
import { HistoryResult } from '../interfaces/transactions';
import { QueryTypes, Transaction } from 'sequelize';

const history = async (accountId: number): Promise<HistoryResult> => {
  console.log(`History service called for account id ${accountId}`);
  const t: Transaction = await sequelize.transaction();

  try {
    const [account]: any = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: accountId }, type: QueryTypes.SELECT, transaction: t }
    );

    if (!account) throw { status: 404, error: 'Account not found' };

    const transactions: any[] = await sequelize.query(
      `SELECT * FROM "Transactions" WHERE "accountId" = $id`,
      { bind: { id: accountId }, type: QueryTypes.SELECT, transaction: t }
    );

    const amounts = transactions.map(t => parseFloat(t.amount));
    const averageAmount =
      amounts.length > 0 ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;

    const byType: Record<string, number> = transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDay: Record<string, number> = transactions.reduce((acc, t) => {
      const day = new Date(t.createdAt).toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    await t.commit();

    return {
      message: 'History endpoint reached',
      metrics: { averageAmount, byType, byDay },
      transactions
    };
  } catch (err) {
    await t.rollback();
    console.error('History retrieval failed:', err);
    throw err;
  }
};

export default history;
