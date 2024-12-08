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
import { ConsumerHistorySupplier } from "./Services/rabbitmq/consumer/HistoryConsumerSupplier";
import { ConsumerHistoryCustomer} from "./Services/rabbitmq/consumer/HistoryConsumerCustomer";
import { RabbitMQHistorySupplierUseCase } from "../application/usecases/RabbitmqHistorySupplierUseCase";
import { RabbitMQHistoryCustomerUseCase } from "../application/usecases/RabbitmqHistoryCustomerUseCase";
import { SearchSuppliersController } from "./controllers/SearchSuppliersController";
import { SearchSuppliersUseCase } from "../application/usecases/SearchSuppliersUseCase";
import { AnalyzePrompt } from './Services/aws/AnalyzePrompt';
import { ConsumerPayment } from "./Services/rabbitmq/consumer/PaymentConsumer";
import { GetDataUserController } from "./controllers/GetDataUserController";
import { GetDataUserUseCase } from "../application/usecases/GetDataUserUseCase";
import { RabbitmqPaymentUseCase } from '../application/usecases/RabbitmqPaymentUseCase';
import { ConsumerRaiting } from "./Services/rabbitmq/consumer/RaitingConsumer";
import { RabbitmqRaitingUseCase } from "../application/usecases/RabbitmqRaitingUseCase";
import { GetAllSuppliersController } from "./controllers/GetAllSuppliersController";
import { GetAllSuppliersUseCase } from "../application/usecases/GetAllSuppliersUseCase";
import { TokenFcmUseCase } from "../application/usecases/TokenFcmUseCase";
import { TokenFcmController } from "./controllers/GetTokenFcmController";
import { ConsumerTokenfcm } from "./Services/rabbitmq/consumer/HistoryNotifications";
import { RabbitmqTokenfcmUsecase } from "../application/usecases/rabbitMQHistoryTokenfcmUseCase";
import { ConsumerChatBotSupplier } from "./Services/rabbitmq/consumer/ChatBotConsumerSupplier";
import { RabbitmqGetSuppliersUsecase } from "../application/usecases/RabbitmqGetSuppliersUsecase";

const mysqlRepository = new UserMySqlRepository();
const googleAuthService = new GoogleAuthService( new GoogleAuthUseCase(mysqlRepository) );
const databaseConfig = new MySQLConfig();
const consumerHistorys = new ConsumerHistorySupplier();
const consumerHistoryc = new ConsumerHistoryCustomer();
const consumerPayment = new ConsumerPayment();
const consumerRaiting = new ConsumerRaiting();
const consumerTokenfcm = new ConsumerTokenfcm();
const consumerChatBotSupplier = new ConsumerChatBotSupplier();
const analyzePrompt = new AnalyzePrompt();


export async function init() {
  try {
    // Inicializar RabbitMQ Consumer
    await consumerHistorys.setup();
    await consumerHistorys.consume(async (data: any) => {
      console.log('Datos recibidos de historial:', data);
    });
    await consumerChatBotSupplier.setup();
    await consumerChatBotSupplier.consume(async (data: any) => {
      console.log('Datos recibidos de chatbot:', data);
    });
    await consumerHistoryc.setup();
    await consumerHistoryc.consume(async (data: any) => {
      console.log('Datos recibidos de historial:', data);
    });
    await consumerPayment.setup();
    await consumerPayment.consume(async (data: any) => {
      console.log('Datos recibidos de pagos:', data);
    });
    await consumerRaiting.setup();
    await consumerRaiting.consume(async (data: any) => {
      console.log('Datos recibidos de pagos:', data);
    });
    await consumerTokenfcm.setup();
    await consumerTokenfcm.consume(async (data: any) => {
      console.log('Datos recibidos de historial:', data);
    });
    console.log('RabbitMQ Consumer está listo');
  } catch (error) {
    console.error('Error al configurar las dependencias:', error);
  }
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
const rabbitMQHistorySupplierUseCase = new RabbitMQHistorySupplierUseCase(mysqlRepository);
const rabbitMQHistoryCustomerUseCase = new RabbitMQHistoryCustomerUseCase(mysqlRepository);
const rabbitmqPaymentUsecase = new RabbitmqPaymentUseCase(mysqlRepository);
const rabbitmqRaitingUsecase = new RabbitmqRaitingUseCase(mysqlRepository);
const rabbitmqTokenfcmUsecase = new RabbitmqTokenfcmUsecase(mysqlRepository);
const rabbitmqgetSuppliersUsecase = new RabbitmqGetSuppliersUsecase(mysqlRepository,analyzePrompt);
const searchSuppliersUseCase = new SearchSuppliersUseCase(mysqlRepository, analyzePrompt);
const getDataUserUseCase = new GetDataUserUseCase(mysqlRepository);
const getAllSuppliersUseCase = new GetAllSuppliersUseCase(mysqlRepository);
const tokenfcmUseCase = new TokenFcmUseCase(mysqlRepository);

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
const searchSuppliersController = new SearchSuppliersController(searchSuppliersUseCase);
const getDataUserController = new GetDataUserController(getDataUserUseCase);
const getAllSuppliersController = new GetAllSuppliersController(getAllSuppliersUseCase);
const tokenfcmController = new TokenFcmController(tokenfcmUseCase);

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
  rabbitMQHistorySupplierUseCase,
  rabbitMQHistoryCustomerUseCase,
  rabbitmqPaymentUsecase,
  rabbitmqRaitingUsecase,
  searchSuppliersController,
  getDataUserController,
  getAllSuppliersController,
  tokenfcmController,
  rabbitmqTokenfcmUsecase,
  rabbitmqgetSuppliersUsecase
  };