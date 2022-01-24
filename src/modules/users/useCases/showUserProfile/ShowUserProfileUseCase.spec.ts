import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show User Profile", () => {
    let usersRepositoryInMemory: InMemoryUsersRepository;
    let showUserProfileUseCase: ShowUserProfileUseCase;
    let createUserUseCase: CreateUserUseCase;
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });
    it("should be able to show an user profile", async () => {
      const user = {
        name: "User Name",
        email: "user@user.com",
        password: "1234"
      };
      const created_user = await createUserUseCase.execute(user);
      const result = await showUserProfileUseCase.execute(created_user.id as string);

      expect(result.name).toBe("User Name");
  });

  it("should not be able to show an user profile if the user not exists", () => {
      expect(async () => {
        const result = await showUserProfileUseCase.execute("id_not_existent");
      }).rejects.toBeInstanceOf(AppError);
  });
});
