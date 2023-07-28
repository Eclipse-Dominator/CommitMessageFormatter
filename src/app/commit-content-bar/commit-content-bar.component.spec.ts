import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitContentBarComponent } from './commit-content-bar.component';

describe('CommitContentBarComponent', () => {
  let component: CommitContentBarComponent;
  let fixture: ComponentFixture<CommitContentBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommitContentBarComponent]
    });
    fixture = TestBed.createComponent(CommitContentBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
