import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticoComponent } from './estadistico.component';

describe('EstadisticoComponent', () => {
  let component: EstadisticoComponent;
  let fixture: ComponentFixture<EstadisticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
