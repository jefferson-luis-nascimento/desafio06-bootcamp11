import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    let categoryObj = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryObj) {
      categoryObj = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(categoryObj);
    }

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      if (value > balance.total) {
        throw new AppError('Outcome value is greater than balance.');
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryObj.id,
      category: categoryObj,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
