import { MongoConfig } from "../../database/config/MongoDb/MongoConfig";
import { SendMessageUseCase } from "../application/usescase/SendMessageUseCase";
import { SendMessageController } from "./controllers/SendMessageController";
import { ChatMongoRepository } from "./repositories/ChatMongoRepository";

const mongoConfig = new MongoConfig();
const mongoRepository = new ChatMongoRepository();

const sendMessageUseCase = new SendMessageUseCase(mongoRepository);
const sendMessageController = new SendMessageController(sendMessageUseCase);

mongoConfig.initialize().then(() => {
  console.log('MongoDB initialized.');
});


export { 
  sendMessageController
};