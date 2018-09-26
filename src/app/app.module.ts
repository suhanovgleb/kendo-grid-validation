import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogsModule } from '@progress/kendo-angular-dialog';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GridModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    DialogsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
