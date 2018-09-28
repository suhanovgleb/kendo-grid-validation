import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ErrrosListComponent } from './components/errros-list/errros-list.component';
import { TooltipModule } from '@progress/kendo-angular-tooltip';





@NgModule({
  declarations: [
    AppComponent,
    ErrrosListComponent
  ],
  imports: [
    BrowserModule,
    GridModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    DialogsModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ErrrosListComponent]
})
export class AppModule { }
