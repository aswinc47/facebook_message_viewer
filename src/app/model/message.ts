export interface IMessageSignal{
    messages: any
    blockedMessages: any
    otherMessages: any
    groupMessages: any
}
export type IMessagesType = keyof(IMessageSignal);