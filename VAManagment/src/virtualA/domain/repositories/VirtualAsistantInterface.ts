
export interface VirtualAsistantInterface {
    getRecomendation(userUuid:string,content:string,complexity:string,complexResponse:string, simpleResponse:string): Promise<any>;
}