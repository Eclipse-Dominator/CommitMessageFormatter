import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent {
  @Input() msg: string = "";
  @Input() fontSize: number = 16;

  constructor(private clipboard: Clipboard) { }

  copyToClipboard() {
    this.clipboard.copy(this.msg);
  }
}
