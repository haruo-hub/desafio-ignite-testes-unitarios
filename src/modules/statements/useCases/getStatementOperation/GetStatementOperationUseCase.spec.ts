import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
describe("Get Statement Operation", () => {
    let inMemoryStatementsRepository: InMemoryStatementsRepository;
    let inMemoryUsersRepository: InMemoryUsersRepository;
    let createUserUseCase: CreateUserUseCase;
    let createStatementUseCase: CreateStatementUseCase;
    let getStatementOperationUseCase: GetStatementOperationUseCase;

    beforeEach(() => {
      inMemoryStatementsRepository = new InMemoryStatementsRepository();
      inMemoryUsersRepository = new InMemoryUsersRepository();
      createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
      createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
      getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });
    it("should be able to get statement operation", async () => {
      const user = {
          name: "User Name",
          email: "user@user.com",
          password: "1234"

      };
      const user_created = await createUserUseCase.execute(user);

      const statement_created = await createStatementUseCase.execute({
        user_id: user_created.id as string,
        description: "Test",
        amount: 10,
        type: OperationType.DEPOSIT
      });

      const result = await getStatementOperationUseCase.execute({
        "user_id": user_created.id as string,
        "statement_id": statement_created.id as string
      });

      expect(result).toHaveProperty("user_id");
      expect(result.user_id).toBe(user_created.id);
  });

  it("should not be able to get statement operation to a none existent user", () => {
      expect(async () => {
        await getStatementOperationUseCase.execute({
          "user_id": "id_non_existent",
          "statement_id": "id_non_existent",
        });
      }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to get statement operation to a none existent operation", () => {
    expect(async () => {
      const user = {
        name: "User Name",
        email: "user@user.com",
        password: "1234"
      };
      const user_created = await createUserUseCase.execute(user);

      const result = await getStatementOperationUseCase.execute({
        "user_id": user_created.id as string,
        "statement_id": "id_non_existent",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
