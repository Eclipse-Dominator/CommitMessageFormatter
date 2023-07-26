import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Formatter, Warning } from '../model/formatter.model'
import { DialogData, getDefaultSetting } from '../editor-setting/editor-setting.dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @Input() settingChange: EventEmitter<DialogData> = new EventEmitter<DialogData>();
  @ViewChild('textEditor') textEditor?: ElementRef<HTMLTextAreaElement>;

  setting: DialogData = getDefaultSetting();

  commitMessage: string = '';
  formattedMessage: string = '';
  warnings?: Warning[];
  subscription?: Subscription;

  ngAfterViewInit(): void {
    this.subscription = this.settingChange.subscribe((setting) => {
      this.setting = setting;
      this.formatCommitMessage()
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  formatCommitMessage() {
    // You can implement your own logic to format the commit message here
    // For this example, let's just add "[Formatted]: " at the beginning of the commit message
    const fmt = new Formatter(this.setting.headerCap, this.setting.bodyCap, this.setting.removeDoubleSpace);
    let output = fmt.formatCommitMessage(this.commitMessage);
    this.formattedMessage = output.result;
    this.warnings = output.warnings;
  }
}
