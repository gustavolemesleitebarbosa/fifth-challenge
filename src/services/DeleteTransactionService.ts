import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const transaction = transactionsRepository.findOne({ where: { id } });

    if (transaction) {
      try {
        await transactionsRepository.delete({ id });
      } catch (err) {
        throw new AppError('unable to delete', 400);
      }
    }
  }
}

export default DeleteTransactionService;
