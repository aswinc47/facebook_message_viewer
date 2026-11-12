import { Component, inject } from '@angular/core';
import { FileRead } from '../../services/file-read';
import { IMessagesType } from '../../../model/message';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-nav-tab',
  styleUrl: './nav-tab.css',
  templateUrl: './nav-tab.html',
})
export class NavTab {
  fileReadSvc: FileRead = inject(FileRead);
  router: Router = inject(Router);

  messagesSize(type: IMessagesType){
    return Object.values(this.fileReadSvc?.messageSignal()[type])?.length
  }

  viewMessages(type: IMessagesType){
    console.log(this.fileReadSvc?.messageSignal()[type])
    this.router.navigate(['/dashboard/messages'], {queryParams: {type}})
  }
}
