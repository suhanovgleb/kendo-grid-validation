import { Component, Input, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AnnotationDataService } from './../../services/annotation-data.service';

@Component({
  selector: 'app-detail-grid',
  templateUrl: './detail-grid.component.html',
  styleUrls: ['./detail-grid.component.scss']
})
export class DetailGridComponent implements OnInit {

  @Input()
  public dataItem: any;

  public view$: Observable<GridDataResult>;

  public gridState: State = {
    sort: [],
    skip: 0,
    group: []
};

  constructor(private dataService: AnnotationDataService) { }

  ngOnInit() {
    this.view$ = this.dataService.pipe(map(data => process(data, this.gridState)));

  }


}
