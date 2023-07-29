import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommitStorage } from '../model/commit-storage';

@Component({
  selector: 'app-commit-content-bar',
  templateUrl: './commit-content-bar.component.html',
  styleUrls: ['./commit-content-bar.component.css']
})
export class CommitContentBarComponent {
  pages: CommitStorage[] = [];
  activePageIndex: number = 0;

  @Input() getCurrentCommit?: () => CommitStorage;
  @Output() commitChange: EventEmitter<CommitStorage> = new EventEmitter<CommitStorage>();

  constructor() {
    this.createNewPage();
  }

  get activePage(): CommitStorage {
    return this.pages[this.activePageIndex];
  }

  createNewPage() {
    this.pages.push(new CommitStorage());
    setTimeout(() => {
      this.changePage(this.pages.length - 1);
    }, 100);
  }

  changePage(index: number) {
    if (this.getCurrentCommit) {
      this.pages[this.activePageIndex] = this.getCurrentCommit();
    }

    this.activePageIndex = index;
    this.commitChange.emit(this.pages[index]);
  }

  removePage(index: number) {
    if (this.pages.length === 1) {
      return;
    }

    this.pages.splice(index, 1);
    if (this.activePageIndex >= this.pages.length) {
      this.activePageIndex = this.pages.length - 1;
    }
    this.commitChange.emit(this.pages[this.activePageIndex]);
  }
}
