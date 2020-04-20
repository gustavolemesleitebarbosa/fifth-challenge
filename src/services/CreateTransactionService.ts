import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
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
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    const transactionRepository = getCustomRepository(TransactionRepository);
    const currentBalance = await transactionRepository.getBalance();

    if (type === 'outcome' && currentBalance.total - value < 0) {
      throw new AppError('Not enough money', 400);
    }

    const transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id;
    if (!transactionCategory) {
      const newCategory = await categoryRepository.create({
        title: category,
      });
      const { id } = await categoryRepository.save(newCategory);
      category_id = id;
    } else {
      category_id = transactionCategory.id;
    }

    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
