import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-type-details',
  templateUrl: './type-details.component.html',
  styleUrls: ['./type-details.component.scss']
})
export class TypeDetailsComponent implements OnInit {

  @Input() public type: any;

  constructor() { }

  ngOnInit() {
    console.log(this.type);
  }

}
