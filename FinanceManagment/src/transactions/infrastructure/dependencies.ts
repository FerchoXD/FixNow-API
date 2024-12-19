import { GetTransactionUseCase } from "../application/usecases/GetTransactionUseCase";
import { CreateTransactionUseCase } from "../application/usecases/CreateTransactionUseCase";
import { CreateTransactionController } from "./controllers/CreateTransactionController";
import { GetTransactionController } from "./controllers/GetTransactionController";
import { TransactionMongoRepository } from "./repositories/TransactionMongoRepository";
import { GetTotalTransactionsByUserIdController } from "./controllers/GetTotalTransactionsByUserIdController";
import { GetTotalTransactionsByUserId } from "../application/usecases/GetTotalTransactionsByUserId";
import { GetTotalTransactionsByUserController } from "./controllers/GetAllTotalTransactionsByUser";
import { GetAllTotalTransactionsByUser } from "../application/usecases/GetAllTotalTransactionsByUser";

const mongoRepostory = new TransactionMongoRepository();

const createTransactionUseCase = new CreateTransactionUseCase(mongoRepostory);
const createTransactionController = new CreateTransactionController(createTransactionUseCase);

const getTransactionUseCase = new GetTransactionUseCase(mongoRepostory);
const getTransactionController = new GetTransactionController(getTransactionUseCase);

const getTotalTransactionsUseCase = new GetTotalTransactionsByUserId(mongoRepostory);
const getTotalTransactionByUserIdController = new GetTotalTransactionsByUserIdController(getTotalTransactionsUseCase);

const getAllTotalTransactionsUseCase = new GetAllTotalTransactionsByUser(mongoRepostory);
const getAllTotalTransactionsByUser = new GetTotalTransactionsByUserController(getAllTotalTransactionsUseCase);

export {
    createTransactionController,
    getTransactionController,
    getTotalTransactionByUserIdController,
    getAllTotalTransactionsByUser
}