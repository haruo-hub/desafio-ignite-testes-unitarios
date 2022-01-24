import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Get Balance", () => {
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getBalanceUseCase: GetBalanceUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });
  it("should be able to get the balance", async () => {
    const user = {
        name: "User Name",
        email: "user@user.com",
        password: "1234"

    };
    const user_created = await createUserUseCase.execute(user);

    const result = await getBalanceUseCase.execute({
      user_id: user_created.id as string
    });

    expect(result).toHaveProperty("balance");
    expect(result.balance).toBe(0);
  });

  it("should not be able to get a balance to a none existent user", () => {
    expect(async () => {
      const result = await getBalanceUseCase.execute({
        user_id: "id_not_existent"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
