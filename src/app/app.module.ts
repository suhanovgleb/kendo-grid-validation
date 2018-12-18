import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { ErrrosListComponent } from './components/errros-list/errros-list.component';
import { HeaderComponent } from './components/header/header.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { RoutingModule } from './routing.module';
import { TabGroupDynamicComponent } from './components/tab-group-dynamic/tab-group-dynamic.component';
import { DetailGridComponent } from './components/detail-grid/detail-grid.component';



@NgModule({
  declarations: [
    AppComponent,
    ErrrosListComponent,
    ProductGridComponent,
    MainPageComponent,
    HeaderComponent,
    TabGroupDynamicComponent,
    DetailGridComponent
  ],
  imports: [
    BrowserModule,
    GridModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    DialogsModule,
    TooltipModule,
    NotificationModule,
    DropDownsModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    MDBBootstrapModule.forRoot(),
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ErrrosListComponent]
})
export class AppModule { }
