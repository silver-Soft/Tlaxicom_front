import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoTlaxicomComponent } from './logo-tlaxicom.component';

describe('LogoTlaxicomComponent', () => {
  let component: LogoTlaxicomComponent;
  let fixture: ComponentFixture<LogoTlaxicomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoTlaxicomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoTlaxicomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
