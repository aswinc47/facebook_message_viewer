import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { FileRead } from '../../../shared/services/file-read';
import { IMessagesType } from '../../../model/message';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChatWindow } from '../chat-window/chat-window';
import { NgClass } from '@angular/common';

@Component({
  imports: [ScrollingModule, ChatWindow, NgClass],
  selector: 'app-message-layout',
  styleUrl: './message-layout.css',
  templateUrl: './message-layout.html',
})
export class MessageLayout {
  private route = inject(ActivatedRoute)
  private fileUploadSvc = inject(FileRead);
  selectedUser: string = ''
  queryParams = toSignal(
    this.route.queryParamMap,
    { initialValue: this.route.snapshot.queryParamMap }
  )
  currentMessageData = computed(() => {
    const type: IMessagesType | null = this.queryParams()?.['get']('type') as IMessagesType | null;
    if(!type) return {}
    const messages = this.fileUploadSvc?.messageSignal()?.[type]
    return messages
  })

  trackByIndex(index: number, item: any): number {
    return index;
  }

  get currentMessages(){
    return Object.keys(this.currentMessageData())
  }
  messageLength(key: string){
    if(this.currentMessageData()){
      return this.currentMessageData()?.[key]?.length ?? 0
    }else{
      return 0
    }
  }
  loadMessages(key:string){
    this.selectedUser = key;
    console.log(this.currentMessageData()?.[key]);
    
  }
}
