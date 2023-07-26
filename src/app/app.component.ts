import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { EditorComponent } from './editor/editor.component';
import { WarningFabComponent } from './fabs/warning-fab/warning-fab.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Commit-Formatter';

  @ViewChild('editor') editor!: EditorComponent;
  @ViewChild('warningFab') warningFab!: WarningFabComponent;
  textArea?: HTMLTextAreaElement;

  ngAfterViewInit(): void {
    this.warningFab.textEditor = this.editor.textEditor?.nativeElement;
  }
}
