import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { DataService, Activity } from '../../services/data';

@Component({
  selector: 'app-tambah',
  templateUrl: './tambah.component.html',
  styleUrls: ['./tambah.component.scss'],
  standalone: false
})
export class TambahComponent implements OnInit {
  @Input() activity?: Activity;

  name: string = '';
  type: 'Plastik' | 'Kertas' | 'Logam' | 'B3' = 'Plastik';
  weight: number = 0;
  isEditMode: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    if (this.activity) {
      this.isEditMode = true;
      this.name = this.activity.name;
      this.type = this.activity.type;
      this.weight = this.activity.weight;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async save(status: 'Tersetor' | 'Tersimpan') {
    if (!this.name || this.weight <= 0) {
      const toast = await this.toastCtrl.create({
        message: 'Mohon isi nama dan berat dengan valid.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    if (this.isEditMode && this.activity) {
      const updatedActivity: Activity = {
        ...this.activity,
        type: this.type,
        name: this.name,
        weight: parseFloat(this.weight.toString()),
        status: status
      };
      this.dataService.updateActivity(updatedActivity);
      
      const toast = await this.toastCtrl.create({
        message: 'Data berhasil diperbarui!',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } else {
      const newActivity: Activity = {
        id: Math.random().toString(36).substring(7),
        type: this.type,
        name: this.name,
        weight: parseFloat(this.weight.toString()),
        status: status,
        date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      this.dataService.addActivity(newActivity);

      const toast = await this.toastCtrl.create({
        message: status === 'Tersetor' ? 'Sukses disetor! Poin bertambah.' : 'Disimpan ke jurnal.',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    }

    this.modalCtrl.dismiss(true);
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Apakah kamu yakin ingin menghapus catatan ini?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        { 
          text: 'Hapus', 
          role: 'destructive',
          handler: async () => {
            if (this.activity) {
              this.dataService.deleteActivity(this.activity.id);
              const toast = await this.toastCtrl.create({
                message: 'Data terhapus.',
                duration: 2000,
                color: 'dark'
              });
              toast.present();
              this.modalCtrl.dismiss(true);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
