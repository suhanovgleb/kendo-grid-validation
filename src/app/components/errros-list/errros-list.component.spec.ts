import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrrosListComponent } from './errros-list.component';

describe('ErrrosListComponent', () => {
  let component: ErrrosListComponent;
  let fixture: ComponentFixture<ErrrosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrrosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrrosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
