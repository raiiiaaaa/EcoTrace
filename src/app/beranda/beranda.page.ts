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
  userName: string = 'Warga Bumi';
  level: number = 1;
  levelTitle: string = 'Eco Beginner';
  nextLevelPoints: number = 500;
  progressPercentage: number = 0;

  dailyTips: string[] = [
    'Gunakan tas kain atau totebag saat berbelanja untuk mengurangi sampah plastik sekali pakai.',
    'Matikan keran air saat menyikat gigi. Kebiasaan kecil ini bisa menghemat hingga 8 liter air per menit!',
    'Pisahkan sampah organik dan anorganik di rumah agar proses daur ulang menjadi lebih mudah dan efisien.',
    'Kurangi konsumsi daging merah. Industri peternakan menyumbang sekitar 14,5% emisi gas rumah kaca global.',
    'Gunakan transportasi umum, bersepeda, atau berjalan kaki untuk mengurangi emisi karbon dari kendaraan pribadi.',
    'Cabut charger dan perangkat elektronik dari stopkontak saat tidak digunakan untuk menghemat energi listrik.',
    'Pilih produk dengan kemasan minimal atau kemasan yang dapat didaur ulang untuk mengurangi limbah kemasan.',
    'Tanam pohon atau tanaman di sekitar rumah. Satu pohon dewasa mampu menyerap sekitar 22 kg CO₂ per tahun.',
    'Gunakan lampu LED yang hemat energi. Lampu LED menggunakan 75% lebih sedikit energi dibanding lampu pijar biasa.',
    'Kurangi penggunaan tisu dan pilih saputangan kain yang bisa dicuci ulang untuk mengurangi limbah kertas.',
  ];

  todayTip: string = this.dailyTips[0];

  constructor(private dataService: DataService, private alertCtrl: AlertController) {}

  ionViewWillEnter() {
    this.points = this.dataService.getPoints();
    this.stats = this.dataService.getStats();
    this.calculateLevel();
    this.loadUserName();
    this.loadDailyTip();
  }

  loadUserName() {
    this.userName = this.dataService.getUserName();
    if (!this.dataService.hasUserSetName()) {
      this.promptUserName();
    }
  }

  loadDailyTip() {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const saved = this.dataService.getDailyTip();

    if (saved.date !== dateKey) {
      // Hari baru: pilih tips berdasarkan tanggal sebagai seed
      const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
      const index = seed % this.dailyTips.length;
      this.dataService.saveDailyTip(dateKey, index);
      this.todayTip = this.dailyTips[index];
    } else {
      this.todayTip = this.dailyTips[saved.index] || this.dailyTips[0];
    }
  }

  calculateLevel() {
    const thresholds = [500, 2000, 5000, 10000, 25000, 50000, 100000];
    const titles = [
      'Eco Beginner',
      'Eco Learner',
      'Eco Scout',
      'Eco Ranger',
      'Eco Protector',
      'Eco Guardian',
      'Eco Master',
      'Eco Warrior'
    ];
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

    this.levelTitle = titles[this.level - 1] || 'Eco Legend';

    if (this.points >= thresholds[thresholds.length - 1]) {
      this.progressPercentage = 100;
    } else {
      this.progressPercentage = (this.points / this.nextLevelPoints) * 100;
    }
  }

  async promptUserName() {
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
            const name = data.name && data.name.trim() !== '' ? data.name : 'Warga Bumi';
            this.userName = name;
            this.dataService.saveUserName(name);
          }
        }
      ]
    });
    await alert.present();
  }
}
