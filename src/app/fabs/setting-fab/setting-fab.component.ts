import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { EditorSettingDialog } from '../../editor-setting/editor-setting.dialog'
import { CommitStorage, getDefaultSetting, SettingData } from '../../model/commit-storage';

@Component({
  selector: 'app-setting-fab',
  templateUrl: './setting-fab.component.html',
  styleUrls: ['./setting-fab.component.css']
})
export class SettingFabComponent {
  @Output() settingChange = new EventEmitter<SettingData>();

  editorSettings: SettingData = getDefaultSetting();

  constructor(public dialog: MatDialog) { }

  openSettingDialog() {
    const dialogRef: MatDialogRef<EditorSettingDialog, SettingData> = this.dialog.open(EditorSettingDialog, {
      data: this.editorSettings
    });

    const subscription = dialogRef.componentInstance.contentChange.subscribe((data: SettingData) => {
      this.editorSettings = data;
      this.settingChange.emit(data);
    });

    dialogRef.afterClosed().subscribe(() => {
      subscription.unsubscribe();
    });
  }

  importCommitData(data: CommitStorage) {
    this.editorSettings = data.setting;
    this.settingChange.emit(this.editorSettings);
  }
}
