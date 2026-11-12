import { Component, effect, inject } from '@angular/core';
import { FileRead } from '../../services/file-read';
import { NavTab } from '../nav-tab/nav-tab';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, NavTab],
  selector: 'app-file-upload',
  styleUrl: './file-upload.css',
  templateUrl: './file-upload.html',
})
export class FileUpload {
  
  fileReadSvc: FileRead = inject(FileRead);
  onFileSelected(event: Event){
    this.fileReadSvc?.onFileSelected(event)
  }

}
