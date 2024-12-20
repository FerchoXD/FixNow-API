import { ForumInterface } from "../../domain/repositories/ForumInterface";

export class CreatePostUseCase {
    constructor(readonly repository: ForumInterface) { }

    async execute(userUuid:string,username: string, title: string, content: string, time: Date): Promise<any> {
        console.log('CreateServiceHistoryUseCase');
        return await this.repository.createPost(userUuid,username, title, content, time);
    }
}