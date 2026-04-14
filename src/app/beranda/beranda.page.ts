import { Component } from '@angular/core';
import { DataService } from '../services/data';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-beranda',
  templateUrl: './beranda.page.html',
  styleUrls: ['./beranda.page.scss'],
  standalone: false
})
export class BerandaPage {
  points: number = 0;
  stats: any = { totalPlastik: 0, totalKertas: 0, totalLogam: 0, impact: '0.0' };
  userName: string = 'Masyarakat Bumi';
  level: number = 1;
  nextLevelPoints: number = 500;
  progressPercentage: number = 0;

  constructor(private dataService: DataService, private alertCtrl: AlertController) {}

  ionViewWillEnter() {
    this.points = this.dataService.getPoints();
    this.stats = this.dataService.getStats();
    this.calculateLevel();
    this.checkUserName();
  }

  calculateLevel() {
    const thresholds = [500, 2000, 5000, 10000, 25000, 50000, 100000];
    this.level = 1;
    this.nextLevelPoints = thresholds[0];
    
    for (let i = 0; i < thresholds.length; i++) {
      if (this.points >= thresholds[i]) {
        this.level = i + 2;
        this.nextLevelPoints = thresholds[i + 1] ? thresholds[i + 1] : thresholds[i];
      } else {
        break;
      }
    }

    if (this.points >= thresholds[thresholds.length - 1]) {
      this.progressPercentage = 100;
    } else {
      this.progressPercentage = (this.points / this.nextLevelPoints) * 100;
    }
  }

  async checkUserName() {
    const storedName = localStorage.getItem('ecotrace_username');
    if (storedName) {
      this.userName = storedName;
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Selamat Datang!',
        message: 'Siapa nama panggilanmu?',
        backdropDismiss: false,
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'Ketik nama kamu...'
          }
        ],
        buttons: [
          {
            text: 'Mulai',
            handler: (data) => {
              if (data.name && data.name.trim() !== '') {
                this.userName = data.name;
                localStorage.setItem('ecotrace_username', data.name);
              } else {
                this.userName = 'Masyarakat Bumi';
                localStorage.setItem('ecotrace_username', 'Masyarakat Bumi');
              }
            }
          }
        ]
      });
      await alert.present();
    }
  }
}
