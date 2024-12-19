import { ForumInterface } from "../../domain/repositories/ForumInterface";

export class GetAllPostUseCase {
    constructor(readonly repository: ForumInterface) { }

    async execute(): Promise<any> {
        console.log('GetAllPostUseCase');
        return await this.repository.getAllPost();
    }
}