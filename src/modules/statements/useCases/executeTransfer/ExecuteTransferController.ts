import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ExecuteTransferUseCase } from './ExecuteTransferUseCase';

class ExecuteTransferController {
  async execute(request: Request, response: Response) {
    const { id: origin_user_id } = request.user;
    const { destiny_user_id } = request.params;
    const { amount, description } = request.body;

    const executeTransferUseCase = container.resolve(ExecuteTransferUseCase);

    await executeTransferUseCase.execute({
      origin_user_id,
      destiny_user_id,
      amount,
      description
    });

    return response.json();
  }
}

export { ExecuteTransferController }
