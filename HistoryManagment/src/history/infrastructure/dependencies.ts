import { DatabaseConfig } from "../../database/config/DatabaseConfig";
import { MySQLConfig } from "../../database/config/MySQL/MySQLConfig";
import { HistoryCalendarModel } from './models/MySQL/HistoryCalendarModel';
import { HistoryMySqlRepository } from "../../history/infrastructure/repositories/HistoryMySqlRepository";
import { CreateServiceHistoryUseCase } from "../application/usescase/CreateServiceHistoryUseCase";
import { CreateServiceHistoryController } from "./controllers/CreateServiceHistoryController";
import { CreateSupplierHistoryUseCase } from "../application/usescase/CreateSupplierHistoryUseCase";
import { CreateSupplierHistoryController } from "./controllers/CreateSupplierHistoryController";

const mysqlRepository = new HistoryMySqlRepository();
const databaseConfig = new MySQLConfig();
const history = new HistoryCalendarModel();

function getDatabaseConfig(currentRepository: HistoryMySqlRepository): DatabaseConfig {
  if (currentRepository instanceof HistoryMySqlRepository) {
    return databaseConfig;
  }
  throw new Error('Unsupported repository type');
}

const createServiceHistoryUseCase = new CreateServiceHistoryUseCase(mysqlRepository);
const createServiceHistoryController = new CreateServiceHistoryController(createServiceHistoryUseCase);

const createSupplierHistoryUseCase = new CreateSupplierHistoryUseCase(mysqlRepository)
const createSupplierHistoryController = new CreateSupplierHistoryController(createSupplierHistoryUseCase);

const dbConfig = getDatabaseConfig(mysqlRepository);

// Asegúrate de que HistoryCalendarModel esté inicializado
dbConfig.initialize().then(() => {
  console.log('Database initialized.');
});

export { 
  createServiceHistoryController,
  createSupplierHistoryController
  };