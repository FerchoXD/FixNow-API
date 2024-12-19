import { UserInterface } from "../../domain/repositories/UserInterface";

export class TokenFcmUseCase {
    constructor(readonly repo: UserInterface) {
    }

    async execute(userUuid: string, token: string): Promise<any> {
        console.log('TokenFcmUseCase.execute, userUuid:', userUuid, 'token:', token);
        const response = await this.repo.saveTokenFcm(userUuid, token);
        response
    }
}