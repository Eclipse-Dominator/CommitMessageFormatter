import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Warning } from '../../model/formatter.model'

@Component({
  selector: 'app-warning-fab',
  templateUrl: './warning-fab.component.html',
  styleUrls: ['./warning-fab.component.css'],
})
export class WarningFabComponent {
  @Input() warnings?: Warning[] = [];
  textEditor?: HTMLTextAreaElement;

  constructor(private _snackBar: MatSnackBar) { }

  highlightLine(warning: Warning) {
    if (!this.textEditor) return;
    const lines = this.textEditor.value.split('\n');

    const prevLen = lines.slice(0, warning.lineNum).reduce((acc, cur) => {
      return acc + cur.length + 1;
    }, 0);

    let start: number = prevLen;
    let end: number;

    if (warning.lineRange) {
      start += warning.lineRange[0];
      end = prevLen + warning.lineRange[1];
    } else if (warning.targetText) {
      start += lines[warning.lineNum].indexOf(warning.targetText);
      end = start + warning.targetText.length;
    } else {
      end = start + lines[warning.lineNum].length;
    }

    this.textEditor.focus();
    setTimeout(() => {
      this.textEditor!.select(); // without this line, the selection will not be focused.
      this.textEditor!.setSelectionRange(start, end);
    }, 100);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "dismiss");
  }
}
