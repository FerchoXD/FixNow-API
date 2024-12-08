import { MongoConfig } from "../../database/config/MongoDb/MongoConfig";
import { RecomendationChatUseCase } from "../application/usescase/RecomendationChatUseCase";
import { RecomendationChatController } from "./controllers/RecomendationChatController";
import { ChatBotMongoRepository } from "./repositories/ChatBotMongoRepository";

const mongoConfig = new MongoConfig();
const mongoRepository = new ChatBotMongoRepository();

const recomendationChatUseCase = new RecomendationChatUseCase(mongoRepository);

const recomendationChatController = new RecomendationChatController(recomendationChatUseCase);

mongoConfig.initialize().then(() => {
  console.log('MongoDB initialized.');
});

export { 
  recomendationChatController,
};