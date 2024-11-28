
export interface ChatInterface {
    saveMessage(data: { sender: string; receiver: string; content: string }): Promise<any>;

}