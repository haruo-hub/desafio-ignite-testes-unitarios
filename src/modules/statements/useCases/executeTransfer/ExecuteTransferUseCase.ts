import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ExecuteTransferError } from "./ExecuteTransferError";

interface IRequest {
  origin_user_id: string,
  destiny_user_id: string,
  amount: number,
  description: string
}

enum OperationType {
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
}

@injectable()
class ExecuteTransferUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute(
    { origin_user_id,
      destiny_user_id,
      amount,
      description }: IRequest) : Promise<void> {

    const origin_user = await this.usersRepository.findById(origin_user_id);
    const destiny_user = await this.usersRepository.findById(destiny_user_id);
    if (!origin_user || !destiny_user) {
      throw new ExecuteTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: origin_user_id });
    if (balance < amount) {
      throw new ExecuteTransferError.InsufficientFunds()
    }

    const statementTransferOperation = await this.statementsRepository.create({
      user_id: origin_user_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    const statementDepositOperation = await this.statementsRepository.create({
      user_id: destiny_user_id,
      type: OperationType.DEPOSIT,
      amount,
      description
    });
  }
}

export { ExecuteTransferUseCase };

