import { ForumInterface } from "../../domain/repositories/ForumInterface";

export class CreateCommentUseCase {
    constructor(readonly repository: ForumInterface) { }

    async execute(username:string, postUuid: string, content: string, time: Date): Promise<any> {
        console.log('CreateCommentUseCase');
        return await this.repository.createComment(username,postUuid, content, time);
    }
}