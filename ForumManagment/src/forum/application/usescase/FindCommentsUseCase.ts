import { ForumInterface } from "../../domain/repositories/ForumInterface";

export class FindCommentsUseCase {
    constructor(readonly forumInterface:ForumInterface) { }
    async execute(postUuid:string): Promise<any> {
        return await this.forumInterface.findComments(postUuid);
    }
}