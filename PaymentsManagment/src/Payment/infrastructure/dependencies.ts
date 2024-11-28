import { DatabaseConfig } from "../../database/config/DatabaseConfig";
import { MySQLConfig } from "../../database/config/MySQL/MySQLConfig";
import { CreateSuscriptionUseCase } from "../application/usescase/CreateSuscriptionUseCase";
import { CreateSuscriptionController } from "./controllers/CreateSuscriptionController";
import PaymentModel from "./models/MySQL/PaymentModel";
import { PaymentMySqlRepository } from "./repositories/PaymentMySqlRepository";

const mysqlRepository = new PaymentMySqlRepository();
const databaseConfig = new MySQLConfig();
const payment = new PaymentModel();


function getDatabaseConfig(currentRepository: any): DatabaseConfig {
  if (currentRepository instanceof PaymentMySqlRepository) {
    return databaseConfig;
  }
  throw new Error('Unsupported repository type');
}

const createSuscriptionUseCase = new CreateSuscriptionUseCase(mysqlRepository);

const createSuscriptionController = new CreateSuscriptionController(createSuscriptionUseCase);


const dbConfig = getDatabaseConfig(mysqlRepository);

dbConfig.initialize().then(() => {
  console.log('Database initialized.');
});

export { 
  createSuscriptionController,
  };