import { ForumInterface } from "../../domain/repositories/ForumInterface";

export class CreatePostUseCase {
    constructor(readonly repository: ForumInterface) { }

    async execute(username: string, title: string, content: string, time: Date): Promise<any> {
        console.log('CreateServiceHistoryUseCase');
        return await this.repository.createPost(username, title, content, time);
    }
}