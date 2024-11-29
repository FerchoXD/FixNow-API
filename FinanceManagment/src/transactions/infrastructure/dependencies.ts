import { GetTransactionUseCase } from "../application/usecases/GetTransactionUseCase";
import { CreateTransactionUseCase } from "../application/usecases/CreateTransactionUseCase";
import { CreateTransactionController } from "./controllers/CreateTransactionController";
import { GetTransactionController } from "./controllers/GetTransactionController";
import { TransactionMongoRepository } from "./repositories/TransactionMongoRepository";

const mongoRepostory = new TransactionMongoRepository();

const createTransactionUseCase = new CreateTransactionUseCase(mongoRepostory);
const createTransactionController = new CreateTransactionController(createTransactionUseCase);

const getTransactionUseCase = new GetTransactionUseCase(mongoRepostory);
const getTransactionController = new GetTransactionController(getTransactionUseCase);

export {
    createTransactionController,
    getTransactionController
}