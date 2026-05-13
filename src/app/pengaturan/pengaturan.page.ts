import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data';

import { Platform } from '@ionic/angular';
import { registerPlugin } from '@capacitor/core';
const FileSaver = registerPlugin<any>('FileSaver');

@Component({
  selector: 'app-pengaturan',
  templateUrl: './pengaturan.page.html',
  styleUrls: ['./pengaturan.page.scss'],
  standalone: false
})
export class PengaturanPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private dataService: DataService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {
  }

  // ─── Export Data ──────────────────────────────────────────────────────────
  async exportData() {
    const dataStr = this.dataService.getRawData();
    const exportFileDefaultName = 'ecotrace-data-backup.json';

    if (this.platform.is('capacitor')) {
      try {
        await FileSaver.saveFile({
          data: dataStr,
          filename: exportFileDefaultName
        });
        
        this.showToast('Data berhasil disimpan!', 'success');
      } catch (e: any) {
        if (e && e.message !== 'Dibatalkan') {
          console.error('Error exporting data natively', e);
          this.showToast('Gagal menyimpan file: ' + (e.message || ''), 'danger');
        }
      }
    } else {
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      this.showToast('Data berhasil diekspor!');
    }
  }

  // ─── Import Data ──────────────────────────────────────────────────────────
  triggerImport() {
    this.fileInput.nativeElement.click();
  }

  importData(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const contents = e.target.result;
        const success = this.dataService.importData(contents);
        
        if (success) {
          this.showToast('Data berhasil diimpor! Aplikasi menggunakan data baru.', 'success');
          // Reset file input
          this.fileInput.nativeElement.value = '';
        } else {
          this.showToast('Gagal mengimpor data. Format file tidak valid.', 'danger');
        }
      };
      reader.readAsText(file);
    }
  }

  // ─── Clear Data ───────────────────────────────────────────────────────────
  async confirmClearData() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus seluruh data aktivitas dan poin? Tindakan ini tidak dapat dibatalkan.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Hapus',
          cssClass: 'danger',
          handler: () => {
            this.dataService.clearData();
            this.showToast('Seluruh data berhasil dihapus.', 'warning');
          }
        }
      ]
    });

    await alert.present();
  }

  // ─── Helper ───────────────────────────────────────────────────────────────
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
