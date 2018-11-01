import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { MainPageComponent } from './components/main-page/main-page.component';

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
