import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './shared/material.module'

import { AppComponent } from './app.component';
import { CommitContentBarComponent } from './commit-content-bar/commit-content-bar.component';
import { DisplayComponent } from './display/display.component';
import { EditorComponent } from './editor/editor.component';
import { SettingFabComponent } from './fabs/setting-fab/setting-fab.component';
import { WarningFabComponent } from './fabs/warning-fab/warning-fab.component';
@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    DisplayComponent,
    SettingFabComponent,
    WarningFabComponent,
    CommitContentBarComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
