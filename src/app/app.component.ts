import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet | undefined;

  private lastBackPress = 0;
  private readonly backPressThreshold = 2000;

  constructor(
    private platform: Platform,
    private location: Location,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.initializeApp();
  }

  // inisialisasi aplikasi
  initializeApp() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.routerOutlet?.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/tabs/beranda' || this.router.url === '/') {
        // Saat sudah di awal aplikasi (Beranda/root), gunakan double-tap untuk keluar
        this.handleExit();
      } else {
        // Jika masih ada history web (misal pindah tab), kembali ke menu sebelumnya
        this.location.back();
      }
    });
  }

  // handle keluar aplikasi
  private async handleExit() {
    const now = Date.now();
    if (now - this.lastBackPress < this.backPressThreshold) {
      App.exitApp();
    } else {
      this.lastBackPress = now;
      const toast = await this.toastCtrl.create({
        message: 'Ketuk lagi untuk keluar',
        duration: 2000,
        position: 'bottom',
        color: 'dark'
      });
      await toast.present();
    }
  }
}
