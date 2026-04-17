import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet | undefined;

  constructor(
    private platform: Platform,
    private location: Location
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.routerOutlet?.canGoBack()) {
        this.routerOutlet.pop();
      } else {
        // Jika tidak ada stack navigasi (misal di root tab), 
        // gunakan history browser untuk kembali ke tab/menu sebelumnya
        if (window.history.length > 1) {
          this.location.back();
        } else {
          // Jika sudah di awal aplikasi, maka keluar
          App.exitApp();
        }
      }
    });
  }
}
