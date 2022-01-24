import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
describe("Create Statement", () => {
    let inMemoryStatementsRepository: InMemoryStatementsRepository;
    let inMemoryUsersRepository: InMemoryUsersRepository;
    let createStatementUseCase: CreateStatementUseCase;
    let createUserUseCase: CreateUserUseCase;

    beforeEach(() => {
      inMemoryStatementsRepository = new InMemoryStatementsRepository();
      inMemoryUsersRepository = new InMemoryUsersRepository();
      createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
      createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });
    it("should be able to create a statement", async () => {
      const user = {
          name: "User Name",
          email: "user@user.com",
          password: "1234"

      };
      const user_created = await createUserUseCase.execute(user);

      const result = await createStatementUseCase.execute({
        user_id: user_created.id as string,
        description: "Test",
        amount: 10,
        type: OperationType.DEPOSIT
      });

      expect(result).toHaveProperty("id");
  });

  it("should not be able to create a statement to a none existent user", () => {
      expect(async () => {
        await createStatementUseCase.execute({
          user_id: "id_not_existent",
          description: "Test",
          amount: 10,
          type: OperationType.DEPOSIT
        });
      }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a statement with withdraw type if not have sufficient funds", () => {
    expect(async () => {
      const user = {
        name: "User Name",
        email: "user@user.com",
        password: "1234"
      };
      const user_created = await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: user_created.id as string,
        description: "Test",
        amount: 10,
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
