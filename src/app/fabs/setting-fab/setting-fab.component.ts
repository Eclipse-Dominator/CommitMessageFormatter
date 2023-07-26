import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { EditorSettingDialog, DialogData, getDefaultSetting } from '../../editor-setting/editor-setting.dialog'

@Component({
  selector: 'app-setting-fab',
  templateUrl: './setting-fab.component.html',
  styleUrls: ['./setting-fab.component.css']
})
export class SettingFabComponent {
  @Output() settingChange = new EventEmitter<DialogData>();

  editorSettings: DialogData = getDefaultSetting();

  constructor(public dialog: MatDialog) { }

  openSettingDialog() {
    const dialogRef: MatDialogRef<EditorSettingDialog, DialogData> = this.dialog.open(EditorSettingDialog, {
      data: this.editorSettings
    });

    const subscription = dialogRef.componentInstance.contentChange.subscribe((data: DialogData) => {
      this.editorSettings = data;
      this.settingChange.emit(data);
    });

    dialogRef.afterClosed().subscribe(() => {
      subscription.unsubscribe();
    });
  }
}
