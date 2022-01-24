import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe("Authenticate User", () => {
    let usersRepositoryInMemory: InMemoryUsersRepository;
    let authenticateUserUseCase: AuthenticateUserUseCase;
    let createUserUseCase: CreateUserUseCase;
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory
        );
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });
    it("should be able to authenticate an user", async () => {
      const user = {
          name: "User Name",
          email: "user@user.com",
          password: "1234"

      };
      await createUserUseCase.execute(user);

      const result = await authenticateUserUseCase.execute({
          email: user.email,
          password: user.password,
      });

      expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a none existent user", () => {
      expect(async () => {
          await authenticateUserUseCase.execute({
              email: "user_not_existent@user.com",
              password: "1234",
          });
      }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with incorrect password", () => {
      expect(async () => {
          const user = {
            name: "User Name",
            email: "user@user.com",
            password: "12345"
          };
          await createUserUseCase.execute(user);

          await authenticateUserUseCase.execute({
              email: user.email,
              password: "IncorrectPassword",
          });
      }).rejects.toBeInstanceOf(AppError);
  });
});
