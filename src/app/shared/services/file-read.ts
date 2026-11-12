import { Service, signal, Signal } from '@angular/core';
import * as JSZip from 'jszip';
import { IMessageSignal } from '../../model/message';

@Service()
export class FileRead {

  jsonData: any = [];
  messageSignal = signal<IMessageSignal>({
    messages: {},
    blockedMessages: {},
    otherMessages: {},
    groupMessages: {}
  })
  
  async onFileSelected(event: Event): Promise<void> {
    let messages: any = {} 
    let blockedMessages: any = {}
    let otherMessages: any = {}
    let groupMessages: any = {}
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const selectedFiles: File[] = Array.from(input.files);

    try {
      let noName = 1;
      let blocked = 1;

      for (const file of selectedFiles) {
      const zip = await JSZip.loadAsync(file);

        for (const filename of Object.keys(zip.files)) {
          const zipEntry = zip.files[filename];
          if (!zipEntry.dir && filename.endsWith('.json')) {
            const fileContent = await zipEntry.async('string');
            let fileContentObj = JSON.parse(fileContent);
            this.jsonData.push(fileContentObj)
            if(messages[fileContentObj?.title] && fileContentObj?.title?.length && fileContentObj?.title?.replace(' ','')?.toLowerCase() !== 'facebookuser'){
              if(fileContentObj?.participants?.length == 2){
                groupMessages[fileContentObj?.title]?.push(...fileContentObj?.messages)
              }else{
                messages[fileContentObj?.title]?.push(...fileContentObj?.messages)
              }
            }else{
              if(!fileContentObj?.title?.length){
                if(fileContentObj?.participants?.length !== 2){
                  groupMessages[noName+'_other'] = fileContentObj?.messages;
                }else{
                  otherMessages[noName+'_other'] = fileContentObj?.messages;
                }
                noName = noName + 1;
              }else if(fileContentObj?.title?.replace(' ','')?.toLowerCase() == 'facebookuser'){
                if(fileContentObj?.participants?.length !== 2){
                  groupMessages[blocked+'_blocked'] = fileContentObj?.messages;
                }else{
                  blockedMessages[blocked+'_blocked'] = fileContentObj?.messages;
                }
                blocked = blocked + 1;
              }else{
                if(fileContentObj?.participants?.length !== 2){
                  groupMessages[fileContentObj.title] = fileContentObj?.messages
                }else{
                  messages[fileContentObj.title] = fileContentObj?.messages
                }
              }
            }
          }
        }
      }
      this.messageSignal.set({
        messages: this.sortObject(messages), 
        blockedMessages: this.sortObject(blockedMessages),
        otherMessages: this.sortObject(otherMessages), 
        groupMessages: this.sortObject(groupMessages)
      })
  } catch(err){
    console.error(err);
  }
}

sortObject(previousObj: Record<any, any[]>){
    let sortedMessages = Object.fromEntries(
      Object.entries(previousObj).sort(
        ([keyA, arrA], [keyB, arrB]) => arrB?.length - arrA?.length
      )
    );
    return sortedMessages
}


fixText(text: string): string {
  const bytes = new Uint8Array(
    Array.from(text, char => char.charCodeAt(0))
  );

  try {
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return text;
  }
}

}
