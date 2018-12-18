import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab-group-dynamic',
  templateUrl: './tab-group-dynamic.component.html',
  styleUrls: ['./tab-group-dynamic.component.scss']
})
export class TabGroupDynamicComponent implements OnInit {

  @Input()
  public q: any;

  tabs = ['First', 'Second', 'Third'];
  selected = new FormControl(0);

  constructor() { }

  ngOnInit() {
  }

  addTab(selectAfterAdding: boolean) {
    this.tabs.push('New');
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
