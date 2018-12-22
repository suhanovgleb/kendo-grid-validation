import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './components/main-page/main-page.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { TabGroupComponent } from './components/tab-group/tab-group.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
    },
    {
        path: 'products',
        component: ProductGridComponent
    },
    {
        path: 'main',
        component: MainPageComponent
    },
    {
        path: 'test',
        component: TabGroupComponent
    },
    // Path after ** will not work
    {
        path: '**',
        redirectTo: 'main'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class RoutingModule {}
