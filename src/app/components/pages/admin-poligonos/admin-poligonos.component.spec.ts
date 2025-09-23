import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPoligonosComponent } from './admin-poligonos.component';

describe('AdminPoligonosComponent', () => {
  let component: AdminPoligonosComponent;
  let fixture: ComponentFixture<AdminPoligonosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPoligonosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPoligonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
