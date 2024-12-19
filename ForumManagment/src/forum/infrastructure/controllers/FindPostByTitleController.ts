import { FindPostByTitleUseCase } from "../../application/usescase/FindPostByTitleUseCase";
import { Request, Response } from 'express';

export class FindPostByTitleController {
    constructor(readonly findPostByTitleUseCase: FindPostByTitleUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const searchTerm = req.query.searchTerm as string || '';
            
            const post = await this.findPostByTitleUseCase.execute(searchTerm);
    
            if (!post.data || post.data.length === 0) {
                return res.status(404).json({ message: 'No se encontraron posts.' });
            }
    
            return res.status(200).json(post);
        } catch (error) {
            console.error('Error al buscar posts:', error);
            return res.status(500).json({ message: 'Ocurrió un error en el servidor.' });
        }
    }
    
}
