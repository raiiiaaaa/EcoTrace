import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
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

  // Multi-select state
  isSelectMode: boolean = false;
  selectedIds: Set<string> = new Set();

  private pressTimer: any = null;
  private readonly LONG_PRESS_MS = 600;

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  // memuat data saat halaman dibuka
  ionViewWillEnter() {
    this.exitSelectMode();
    this.loadData();
  }

  // memuat data
  loadData() {
    this.activities = this.dataService.getActivities();
    this.filterData();
  }

  // mengatur filter
  setFilter(filter: string) {
    this.currentFilter = filter;
    this.filterData();
  }

  // memfilter data
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

  // ─── Long Press ──────────────────────────────────────────────────────────

  // memulai long press
  onPressStart(item: Activity) {
    this.pressTimer = setTimeout(() => {
      this.enterSelectMode(item);
    }, this.LONG_PRESS_MS);
  }

  // mengakhiri long press
  onPressEnd() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  // membatalkan long press
  onPressCancel() {
    this.onPressEnd();
  }

  // ─── Select Mode ─────────────────────────────────────────────────────────

  // masuk ke select mode
  enterSelectMode(item: Activity) {
    this.isSelectMode = true;
    this.selectedIds = new Set([item.id]);
  }

  // keluar dari select mode
  exitSelectMode() {
    this.isSelectMode = false;
    this.selectedIds = new Set();
  }

  // toggle select
  toggleSelect(item: Activity) {
    if (this.selectedIds.has(item.id)) {
      this.selectedIds.delete(item.id);
      if (this.selectedIds.size === 0) {
        this.exitSelectMode();
      }
    } else {
      this.selectedIds.add(item.id);
    }
  }

  // mengecek apakah item dipilih
  isSelected(item: Activity): boolean {
    return this.selectedIds.has(item.id);
  }

  // mendapatkan jumlah item yang dipilih
  get selectedCount(): number {
    return this.selectedIds.size;
  }

  // ─── Item Tap ────────────────────────────────────────────────────────────

  // tap item
  onItemTap(item: Activity) {
    if (this.isSelectMode) {
      this.toggleSelect(item);
    } else {
      this.openAddModal(item);
    }
  }

  // ─── Delete Selected ─────────────────────────────────────────────────────

  // menghapus item yang dipilih
  async deleteSelected() {
    const count = this.selectedIds.size;
    const alert = await this.alertCtrl.create({
      header: 'Hapus Item',
      message: `Hapus ${count} item yang dipilih?`,
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.selectedIds.forEach(id => this.dataService.deleteActivity(id));
            this.exitSelectMode();
            this.loadData();
          }
        }
      ]
    });
    await alert.present();
  }

  // ─── Add / Edit Modal ────────────────────────────────────────────────────

  // membuka modal tambah aktivitas
  async openAddModal(activity?: Activity) {
    if (this.isSelectMode) return;
    const modal = await this.modalCtrl.create({
      component: TambahComponent,
      componentProps: { activity },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });
    modal.onDidDismiss().then((data) => {
      if (data.data) this.loadData();
    });
    return await modal.present();
  }
}
