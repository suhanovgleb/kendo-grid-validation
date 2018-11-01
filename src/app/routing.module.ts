import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductGridComponent } from './components/product-grid/product-grid.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
    },
    {
        path: 'products',
        component: ProductGridComponent
    },
    {
        path: '**',
        redirectTo: 'products'
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
