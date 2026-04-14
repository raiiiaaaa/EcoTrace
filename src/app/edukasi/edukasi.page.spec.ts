import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdukasiPage } from './edukasi.page';

describe('EdukasiPage', () => {
  let component: EdukasiPage;
  let fixture: ComponentFixture<EdukasiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EdukasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
