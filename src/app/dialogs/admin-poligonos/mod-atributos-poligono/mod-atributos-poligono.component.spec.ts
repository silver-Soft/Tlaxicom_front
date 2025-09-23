import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModAtributosPoligonoComponent } from './mod-atributos-poligono.component';

describe('ModAtributosPoligonoComponent', () => {
  let component: ModAtributosPoligonoComponent;
  let fixture: ComponentFixture<ModAtributosPoligonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModAtributosPoligonoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModAtributosPoligonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
