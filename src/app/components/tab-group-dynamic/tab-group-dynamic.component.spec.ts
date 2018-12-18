import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabGroupDynamicComponent } from './tab-group-dynamic.component';

describe('TabGroupDynamicComponent', () => {
  let component: TabGroupDynamicComponent;
  let fixture: ComponentFixture<TabGroupDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabGroupDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabGroupDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
