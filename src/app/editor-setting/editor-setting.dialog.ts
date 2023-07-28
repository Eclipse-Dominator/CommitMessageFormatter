import { Component, EventEmitter, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SettingData, getDefaultSetting } from '../model/commit-storage';

@Component({
  selector: 'app-editor-setting',
  templateUrl: './editor-setting.dialog.html',
  styleUrls: ['./editor-setting.dialog.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatFormFieldModule
  ],
})
export class EditorSettingDialog {
  public contentChange: EventEmitter<SettingData> = new EventEmitter<SettingData>();

  constructor(
    public dialogRef: MatDialogRef<EditorSettingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: SettingData,
  ) { }

  emitData() {
    this.contentChange.emit(this.data);
  }

  reset() {
    this.data = getDefaultSetting();
    this.emitData();
  }
}
export { SettingData, getDefaultSetting };

