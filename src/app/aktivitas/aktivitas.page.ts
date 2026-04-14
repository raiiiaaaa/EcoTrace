import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService, Activity } from '../services/data';
import { TambahComponent } from './tambah/tambah.component';

@Component({
  selector: 'app-aktivitas',
  templateUrl: './aktivitas.page.html',
  styleUrls: ['./aktivitas.page.scss'],
  standalone: false
})
export class AktivitasPage {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  searchTerm: string = '';
  currentFilter: string = 'Semua';

  constructor(private dataService: DataService, private modalCtrl: ModalController) {}

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.activities = this.dataService.getActivities();
    this.filterData();
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.filterData();
  }

  filterData() {
    let temp = this.activities;

    if (this.currentFilter !== 'Semua') {
      temp = temp.filter(a => a.type === this.currentFilter);
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(a => a.name.toLowerCase().includes(term));
    }

    this.filteredActivities = temp;
  }

  async openAddModal(activity?: Activity) {
    const modal = await this.modalCtrl.create({
      component: TambahComponent,
      componentProps: {
        activity: activity
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });
    
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.loadData();
      }
    });

    return await modal.present();
  }
}
