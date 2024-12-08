
export interface VirtualAsistantInterface {
    getRecomendation(userUuid:string,content:string,complexity:string,complexResponse:string, simpleResponse:string,suppliers:any): Promise<any>;
    getchat(userUuid:string): Promise<any>;
}