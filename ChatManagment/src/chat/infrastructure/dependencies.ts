import { createServer } from 'http';
import express from 'express';
import { MongoConfig } from "../../database/config/MongoDb/MongoConfig";
import { SendMessageUseCase } from "../application/usescase/SendMessageUseCase";
import { SendMessageController } from "./controllers/SendMessageController";
import { ChatMongoRepository } from "./repositories/ChatMongoRepository";

// Configurar Express
const app = express();
app.use(express.json());

// Crear el servidor HTTP
const httpServer = createServer(app);

// Inicializar MongoDB
const mongoConfig = new MongoConfig();
mongoConfig.initialize().then(() => {
  console.log('MongoDB initialized.');
});


// Crear repositorio y casos de uso
const mongoRepository = new ChatMongoRepository();
const sendMessageUseCase = new SendMessageUseCase(mongoRepository);
const sendMessageController = new SendMessageController(sendMessageUseCase);

// Exportar el servidor y las dependencias
export {
  app,
  httpServer,
  sendMessageController,
};
