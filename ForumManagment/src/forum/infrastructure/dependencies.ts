import { MongoConfig } from "../../database/config/MongoDb/MongoConfig";
import { ForumMongoRepository } from "./repositories/ForumMongoRepository";
import { CreatePostUseCase } from "../application/usescase/CreatePostUseCase";
import { CreatePostController } from "./controllers/CreatePostController";
import { CreateCommentUseCase } from "../application/usescase/CreateCommentUseCase";
import { CreateCommentController } from "./controllers/CreateCommentController";
import { FindCommentsController } from "./controllers/FindCommentsController";
import { FindCommentsUseCase } from "../application/usescase/FindCommentsUseCase";
import { FindPostByTitleUseCase } from "../application/usescase/FindPostByTitleUseCase";
import { FindPostByTitleController } from "./controllers/FindPostByTitleController";
import { GetAllPostController } from "./controllers/GetAllPostController";
import { GetAllPostUseCase } from "../application/usescase/GetAllPostUseCase";
import { GetAllPostByIdController } from "./controllers/GetAllPostByIdController";
import { GetAllPostByIdUseCase } from "../application/usescase/GetAllPostByIdUseCase";

const mongoConfig = new MongoConfig();
const mongoRepository = new ForumMongoRepository();

const createPostUseCase = new CreatePostUseCase(mongoRepository);
const createCommentUseCase = new CreateCommentUseCase(mongoRepository);
const findCommentsUseCase = new FindCommentsUseCase(mongoRepository);
const findPostByTitleUseCase = new FindPostByTitleUseCase(mongoRepository);
const getAllPostUseCase = new GetAllPostUseCase(mongoRepository);
const getAllPostByIdUseCase = new GetAllPostByIdUseCase(mongoRepository);

const createPostController = new CreatePostController(createPostUseCase);
const createCommentController = new CreateCommentController(createCommentUseCase);
const findCommentsController = new FindCommentsController(findCommentsUseCase);
const findPostByTitleController = new FindPostByTitleController(findPostByTitleUseCase);
const getAllPostController = new GetAllPostController(getAllPostUseCase);
const geAllPostByIdController = new GetAllPostByIdController(getAllPostByIdUseCase);

// Inicializar la base de datos
mongoConfig.initialize().then(() => {
  console.log('MongoDB initialized.');
});


// Exportar
export { 
  createPostController,
  createCommentController,
  findCommentsController,
  findPostByTitleController,
  getAllPostController,
  geAllPostByIdController
};