
export interface ForumInterface {
    createPost(userUuid:string,username:string, title:string, content:string, time:Date): Promise<any>;
    createComment(username:string,postUuid:string ,content:string, time:Date): Promise<any>;
    findComments(postUuid:string): Promise<any>;
    findPostByTitleUsernameAndContent(searchTerm:string): Promise<any>;
    getAllPost(): Promise<any>;
    getAllPostById(userUuid:string): Promise<any>;
}