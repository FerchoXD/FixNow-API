import { ForumInterface } from "../../domain/repositories/ForumInterface";

export class GetAllPostByIdUseCase {
    constructor(readonly repository: ForumInterface) { }

    async execute(userUuid: string): Promise<any> {
        console.log('GetAllPostByIdUseCase');
        return await this.repository.getAllPostById(userUuid);
    }
}