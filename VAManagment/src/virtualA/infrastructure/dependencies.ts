import { MongoConfig } from "../../database/config/MongoDb/MongoConfig";
import { GetChatUseCase } from "../application/usescase/GetChatUseCase";
import { RecomendationChatUseCase } from "../application/usescase/RecomendationChatUseCase";
import { GetChatController } from "./controllers/GetChatController";
import { RecomendationChatController } from "./controllers/RecomendationChatController";
import { ChatBotMongoRepository } from "./repositories/ChatBotMongoRepository";

const mongoConfig = new MongoConfig();
const mongoRepository = new ChatBotMongoRepository();

const recomendationChatUseCase = new RecomendationChatUseCase(mongoRepository);
const getChatUseCase = new GetChatUseCase(mongoRepository);

const recomendationChatController = new RecomendationChatController(recomendationChatUseCase);
const getChatController = new GetChatController(getChatUseCase);

mongoConfig.initialize().then(() => {
  console.log('MongoDB initialized.');
});

export { 
  recomendationChatController,
  getChatController
};