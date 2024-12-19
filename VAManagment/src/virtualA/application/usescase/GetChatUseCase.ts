import { VirtualAsistantInterface } from "../../domain/repositories/VirtualAsistantInterface";

export class GetChatUseCase {
    constructor(readonly repository: VirtualAsistantInterface) { }

    async execute(userUuid: string): Promise<any> {
        return await this.repository.getchat(userUuid);
    }
}