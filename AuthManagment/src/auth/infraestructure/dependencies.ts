import { DatabaseConfig } from "../../database/Config/DatabaseConfig";
import { MySQLConfig } from "../../database/Config/MySQL/MySQLConfig";
import { ActivateUserUseCase } from "../application/usecases/ActivateUserUseCase";
import { LoginUserUseCase } from "../application/usecases/loginUserUseCase";
import { LogoutUserUseCase } from "../application/usecases/LogoutUserUseCase";
import { RegisterUserUseCase } from "../application/usecases/RegisterUserUseCase";
import { ActivateUserController } from "./controllers/ActivateUserController";
import { LoginUserController } from "./controllers/LoginUserController";
import { LogoutUserController } from "./controllers/LogoutUserController";
import { RegisterUserController } from "./controllers/RegisterUserController";
import { UserMySqlRepository } from "./repositories/UserMySqlRepository";
import { EmailService } from "./Services/Email/Email";


const mysqlRepository = new UserMySqlRepository();

const currentRepository = mysqlRepository;

function getDatabaseConfig(currentRepository: any): DatabaseConfig {
    if (currentRepository instanceof UserMySqlRepository) {
      return new MySQLConfig();
    }
    throw new Error('Unsupported repository type');
  }

const registerUserUseCase = new RegisterUserUseCase(currentRepository);
const registerUserController = new RegisterUserController(registerUserUseCase, new EmailService());

const activateUserUseCase = new ActivateUserUseCase(currentRepository);
const activateUserController = new ActivateUserController(activateUserUseCase);

const loginUserUseCase = new LoginUserUseCase(currentRepository);
const loginUserController = new LoginUserController(loginUserUseCase);

const logoutUserUseCase = new LogoutUserUseCase(currentRepository);
const logoutUserController = new LogoutUserController(logoutUserUseCase);

const dbConfig = getDatabaseConfig(currentRepository);
dbConfig.initialize().then(() => {
  console.log('Database initialized.');
});

export { registerUserController, activateUserController, loginUserController, logoutUserController }