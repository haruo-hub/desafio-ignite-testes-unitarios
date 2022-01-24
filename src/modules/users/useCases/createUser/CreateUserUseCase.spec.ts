import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

describe("Create User", () => {
    let usersRepositoryInMemory: InMemoryUsersRepository;
    let createUserUseCase: CreateUserUseCase;
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });
    it("should be able to create an user", async () => {
      const user = {
          name: "User Name",
          email: "user@user.com",
          password: "1234"
      };

      const result = await createUserUseCase.execute(user);

      expect(result).toHaveProperty("id");
  });

  it("should not be able to create an user with same e-mail", () => {
      expect(async () => {
        const user = {
          name: "User Name",
          email: "user@user.com",
          password: "1234"
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
      }).rejects.toBeInstanceOf(AppError);
  });
});
