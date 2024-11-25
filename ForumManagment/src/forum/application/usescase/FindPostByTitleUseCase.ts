import { ForumInterface } from "../../domain/repositories/ForumInterface";

export class FindPostByTitleUseCase {
    constructor(readonly respository:ForumInterface) { }
    async execute(searchTerm:string): Promise<any> {
        return await this.respository.findPostByTitleUsernameAndContent(searchTerm);
    }
}
