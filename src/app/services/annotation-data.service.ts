import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { NotificationCustomService } from './notification-custom.service';


const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable({
    providedIn: 'root'
})

export class AnnotationDataService extends BehaviorSubject<any[]> {

    public apiURL = environment.apiURL + '/productToProductannotations';

    // Data in it's current state
    public data: any[] = [];
    // Last data that came from server
    public originalData: any[] = [];

    public isDataProcessing = false;

    constructor(
        private http: HttpClient,
        private notificationService: NotificationCustomService) {
        super([]);
    }
   
    public getAnnotationsById(id: string) {
        this.read(id)
            .subscribe(data => {
                /*
                this.transformFlatToGridData(data);
                */
                this.data = data;
                this.originalData = cloneData(data);
                super.next(data);
                this.notificationService.successNotification('Data has been loaded from server');
                this.isDataProcessing = false;
            },
            (error) => {
                this.notificationService.errorNotification('An error has occurred. Data hasn\'nt been reloaded from server');
                this.isDataProcessing = false;
            });
    }
   
    private read(id: string): Observable<any[]> {
        return this.http.get(this.apiURL + '/' + id).pipe(map(res => <any[]>res));
    }
}
