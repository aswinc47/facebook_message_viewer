import { Component, computed, effect, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { FileRead } from '../../../shared/services/file-read';
import { NgClass } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import moment from 'moment';

@Component({
  imports: [NgClass, ScrollingModule],
  selector: 'app-chat-window',
  styleUrl: './chat-window.css',
  templateUrl: './chat-window.html',
})
export class ChatWindow {
  chatData = input<any>([]);
  senterName = input<string>('')
  fileReadSvc = inject(FileRead);
  showSearch = false;
@ViewChild('scrollContainer') scrollContainer!: CdkVirtualScrollViewport;
  
  chatMessages = computed(() => {
    return [...(this.chatData() ?? [])].reverse();
  });
  constructor(){
    effect(()=>{
      this.chatData();
      this.scrollToBottom()
    })
  }

  openSearch(){
    this.showSearch = !this.showSearch
  }
  searchText = signal('');

  searchResults = computed(() => {
    const search = this.searchText().trim().toLowerCase();

    if (!search) return [];

    return this.chatMessages()
      .map((message, index) => ({
        message,
        index
      }))
      .filter(item =>
        item.message?.content?.toLowerCase().includes(search)
      )
      .slice(0, 10);
  });

  onSearch(value: string) {
    this.searchText.set(value);
  }

  goToMessage(index: number) {
    this.scrollContainer.scrollToIndex(index, 'smooth');
    this.searchText.set('');
    this.showSearch = false;
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      const viewport = this.scrollContainer;

      if (!viewport) return;

      viewport.scrollToIndex(this.chatMessages().length - 1, 'auto');
    });
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  formatDateTime(timestamp: number): string {
    return moment(timestamp).format('DD MMM YYYY, hh:mm A');
  }
}
