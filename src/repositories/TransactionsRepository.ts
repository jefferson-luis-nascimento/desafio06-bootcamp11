import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions
      .filter(tran => tran.type === 'income')
      .reduce((amount, current) => {
        return Number(amount) + Number(current.value);
      }, 0);

    const outcome = transactions
      .filter(tran => tran.type === 'outcome')
      .reduce((amount, current) => {
        return Number(amount) + Number(current.value);
      }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
