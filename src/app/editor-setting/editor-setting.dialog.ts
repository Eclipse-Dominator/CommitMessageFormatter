import { Component, EventEmitter, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  headerCap: number;
  bodyCap: number;
  removeDoubleSpace: boolean;
  fontSize: number;
};

export const getDefaultSetting: () => DialogData = () => {
  return {
    headerCap: 50,
    bodyCap: 72,
    removeDoubleSpace: true,
    fontSize: 16,
  };
};

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
  public contentChange: EventEmitter<DialogData> = new EventEmitter<DialogData>();

  constructor(
    public dialogRef: MatDialogRef<EditorSettingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  emitData() {
    this.contentChange.emit(this.data);
  }

  reset() {
    this.data = getDefaultSetting();
    this.emitData();
  }
}
