import { TabGroupDynamicComponent } from './components/tab-group-dynamic/tab-group-dynamic.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './components/main-page/main-page.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';

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
        component: TabGroupDynamicComponent
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
