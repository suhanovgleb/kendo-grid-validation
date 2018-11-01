
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ErrrosListComponent } from './components/errros-list/errros-list.component';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { RouterInitializer } from '@angular/router/src/router_module';
import { RoutingModule } from './routing.module';


@NgModule({
  declarations: [
    AppComponent,
    ErrrosListComponent,
    ProductGridComponent,
    MainPageComponent,
    HeaderComponent
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
    RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ErrrosListComponent]
})
export class AppModule { }
