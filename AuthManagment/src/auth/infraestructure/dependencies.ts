import { DatabaseConfig } from "../../database/Config/DatabaseConfig";
import { MySQLConfig } from "../../database/Config/MySQL/MySQLConfig";
import { ActivateUserUseCase } from "../application/usecases/ActivateUserUseCase";
import { GetServicesUseCase } from "../application/usecases/GetServicesUseCase";
import { LoginUserUseCase } from "../application/usecases/loginUserUseCase";
import { LogoutUserUseCase } from "../application/usecases/LogoutUserUseCase";
import { RegisterUserUseCase } from "../application/usecases/RegisterUserUseCase";
import { SaveProfileDataUseCase } from "../application/usecases/SaveProfileDataUseCase";
import { ActivateUserController } from "./controllers/ActivateUserController";
import { GetServicesController } from "./controllers/GetServicesController";
import { LoginUserController } from "./controllers/LoginUserController";
import { LogoutUserController } from "./controllers/LogoutUserController";
import { RegisterUserController } from "./controllers/RegisterUserController";
import { SaveProfileDataController } from "./controllers/SaveProfileDataController";
import { UserMySqlRepository } from "./repositories/UserMySqlRepository";
import { EmailService } from "./Services/Email/Email";
import { ImageStorageService } from "./Services/StorageImages/ImageStorageService";
import { SearchSupplierController } from "./controllers/SearchSupplierController";
import { SearchSupplierUseCase } from "../application/usecases/SearchSupplierUseCase";
import { GetProfileUseCase } from "../application/usecases/GetGetProfileUseCase";
import { GetProfileController } from "./controllers/GetProfileController";
import { GetFiltersUseCase } from "../application/usecases/GetFiltersUseCase";
import { GetFiltersController } from "./controllers/GetFiltersController";
import { GoogleAuthController } from "./controllers/GoogleAuthController";
import { GoogleAuthUseCase } from "../application/usecases/GoogleAuthUseCase";
import { GoogleAuthService } from "./Services/GoogleAuth/GoogleAuthService";
import { ConsumerHistory } from "./Services/rabbitmq/consumer/HistoryConsumer";
import { RabbitMQHistoryUseCase } from "../application/usecases/RabbitmqHistoryUseCase";

const mysqlRepository = new UserMySqlRepository();
const googleAuthService = new GoogleAuthService( new GoogleAuthUseCase(mysqlRepository) );
const databaseConfig = new MySQLConfig();
const consumerHistory = new ConsumerHistory();


export async function init() {
  try {
    // Inicializar RabbitMQ Consumer
    await consumerHistory.setup();
    await consumerHistory.consume(async (data: any) => {
      console.log('Datos recibidos:', data);
    });
    console.log('RabbitMQ Consumer está listo');
  } catch (error) {
    console.error('Error al configurar las dependencias:', error);
  }
}

// Si se necesita acceder al consumerHistory desde otra parte del código
function getConsumerHistory() {
  return consumerHistory;
}

function getDatabaseConfig(currentRepository: any): DatabaseConfig {
  if (currentRepository instanceof UserMySqlRepository) {
    return databaseConfig;
  }
  throw new Error('Unsupported repository type');
}

const registerUserUseCase = new RegisterUserUseCase(mysqlRepository);
const activateUserUseCase = new ActivateUserUseCase(mysqlRepository);
const loginUserUseCase = new LoginUserUseCase(mysqlRepository);
const logoutUserUseCase = new LogoutUserUseCase(mysqlRepository);
const saveProfileDataUseCase = new SaveProfileDataUseCase(mysqlRepository, ImageStorageService as any);
const getServicesUseCase = new GetServicesUseCase(mysqlRepository);
const searchSupplierUseCase = new SearchSupplierUseCase();
const getProfileUseCase = new GetProfileUseCase(mysqlRepository);
const getFiltersUseCase = new GetFiltersUseCase(mysqlRepository);
const rabbitmqHistoryUsecase = new RabbitMQHistoryUseCase(mysqlRepository);

const registerUserController = new RegisterUserController(registerUserUseCase, new EmailService());
const activateUserController = new ActivateUserController(activateUserUseCase);
const loginUserController = new LoginUserController(loginUserUseCase);
const logoutUserController = new LogoutUserController(logoutUserUseCase);
const saveProfileDataController = new SaveProfileDataController();
const getServicesController = new GetServicesController(getServicesUseCase);
const searchSupplierController = new SearchSupplierController(searchSupplierUseCase);
const getProfileController = new GetProfileController(getProfileUseCase);
const getFiltersController = new GetFiltersController(getFiltersUseCase);
const googleAuthController = new GoogleAuthController(googleAuthService);

const dbConfig = getDatabaseConfig(mysqlRepository);
dbConfig.initialize().then(() => {
  console.log('Database initialized.');
});


export { 
  registerUserController, 
  activateUserController, 
  loginUserController, 
  logoutUserController, 
  saveProfileDataController,
  getServicesController,
  searchSupplierController,
  getProfileController,
  getFiltersController,
  googleAuthController,
  rabbitmqHistoryUsecase
  };