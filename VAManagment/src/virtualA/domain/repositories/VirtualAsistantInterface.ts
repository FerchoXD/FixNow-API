
export interface VirtualAsistantInterface {
    getRecomendation(userUuid:string,content:string,complexity:any,complexResponse:any, simpleResponse:any,suppliers:any, response:any): Promise<any>;
    getchat(userUuid:string): Promise<any>;
}