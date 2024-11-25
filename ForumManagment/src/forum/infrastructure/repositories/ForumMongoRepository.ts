import { ForumInterface } from "../../domain/repositories/ForumInterface";
import { CommentModel } from "../models/Mongo/CommentSchema";
import { PostModel } from "../models/Mongo/PostSchema";
import { v4 as uuidv4 } from 'uuid';

export class ForumMongoRepository implements ForumInterface {

    async findPostByTitleUsernameAndContent(searchTerm: string): Promise<any> {
        if (!searchTerm) {
            throw new Error('El parámetro de búsqueda es requerido.');
        }

        try {
            // Búsqueda en múltiples campos usando $or
            const posts = await PostModel.find({
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },   // Coincidencia parcial en título
                    { username: { $regex: searchTerm, $options: 'i' } }, // Coincidencia parcial en autor
                    { content: { $regex: searchTerm, $options: 'i' } }   // Coincidencia parcial en contenido
                ]
            }).exec();

            if (!posts || posts.length === 0) {
                return {
                    success: true,
                    message: 'No se encontraron posts que coincidan con el término de búsqueda.',
                    data: [],
                };
            }

            return {
                success: true,
                message: 'Posts encontrados.',
                data: posts,
            };
        } catch (error) {
            console.error('Error al buscar posts:', error);
            throw new Error('Ocurrió un error al buscar los posts.');
        }
    }
    

    async findComments(postUuid: string): Promise<any> {
        if (!postUuid || typeof postUuid !== 'string') {
            throw new Error('El campo "postUuid" es requerido y debe ser una cadena válida.');
        }
    
        try {
            const comments = await CommentModel.find({ postUuid }).exec();
    
            if (comments.length === 0) {
                return {
                    success: true,
                    message: 'No se encontraron comentarios para este postUuid.',
                    data: [],
                };
            }
    
            // Formatear los comentarios para el response
            const formattedComments = comments.map((comment) => ({
                id: comment.uuid,
                username: comment.username,
                content: comment.content,
                createdAt: comment.time,
            }));
    
            return {
                success: true,
                message: 'Comentarios encontrados.',
                data: formattedComments,
            };
        } catch (error) {
            console.error('Error al buscar comentarios:', error);
            throw new Error('Ocurrió un error al buscar los comentarios.');
        }
    }
    

    async createComment(username:string ,postUuid: string, content: string, time: Date): Promise<any> {

        const postExists = await PostModel.exists({ uuid: postUuid });
        if (!postExists) {
            throw new Error(`No se encontró un Post con el uuid: ${postUuid}`);
        }

        const newComment = new CommentModel({
            uuid: uuidv4(), 
            username,
            postUuid,
            content,
            time: Date.now(),
        });

        try {
            const savedComment = await newComment.save();

            const response = {
                status: 'success',
                uuid: savedComment.uuid,
                username: savedComment.username,
                content: savedComment.content,
                time: savedComment.time,
            }

            return response;
        } catch (error) {
            console.error('Error al guardar el comentario:', error);
            throw new Error('Ocurrió un error al guardar el comentario.');
        }
    }

    async createPost(username: string, title: string, content: string, time: Date): Promise<any> {
        try {
            const newPost = new PostModel({
                uuid: uuidv4(), 
                username,
                title,
                content,
                time,
            });

            const savedPost = await newPost.save();

            return savedPost;
        } catch (error) {
            console.error("Error al crear el post:", error);
            throw new Error("No se pudo crear el post.");
        }
    }
}