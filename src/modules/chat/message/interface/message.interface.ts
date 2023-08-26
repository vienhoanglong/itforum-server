export interface IMessage {
  contentMessage: string;
  conversationId: string;
  senderId: string;
  reactionMessage?: IReactionMessage[];
  typeMessage: string;
  file?: string;
  typeFile?: string;
}
export interface IReactionMessage {
  userId: string;
  typeEmotion: string;
}
