import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { DataService } from '../services/data';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanLoad {

  constructor(private dataService: DataService, private router: Router) {}

  canLoad(): boolean {
    if (this.dataService.hasUserSetName()) {
      return true;
    }
    // Belum isi nama → arahkan ke beranda terlebih dahulu
    this.router.navigate(['/tabs/beranda']);
    return false;
  }
}
