
export interface ChatInterface {
    createMessage(sender: string, receiver: string, message: string): Promise<any>;
}