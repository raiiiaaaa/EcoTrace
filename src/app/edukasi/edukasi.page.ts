import { Component } from '@angular/core';
import { DataService, EducationArticle } from '../services/data';
import { ModalController } from '@ionic/angular';
import { BacaComponent } from './baca/baca.component';

@Component({
  selector: 'app-edukasi',
  templateUrl: './edukasi.page.html',
  styleUrls: ['./edukasi.page.scss'],
  standalone: false
})
export class EdukasiPage {
  articles: EducationArticle[] = [];
  filteredArticles: EducationArticle[] = [];
  currentFilter: string = 'Semua';
  searchTerm: string = '';

  constructor(private dataService: DataService, private modalCtrl: ModalController) {}

  // saat halaman masuk
  ionViewWillEnter() {
    this.dataService.getEducationArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.filterData();
      },
      error: (err) => {
        console.error('Gagal memuat artikel edukasi:', err);
      }
    });
  }

  // set filter
  setFilter(filter: string) {
    this.currentFilter = filter;
    this.filterData();
  }

  // filter data
  filterData() {
    let temp = this.articles;
    if (this.currentFilter !== 'Semua') {
      temp = temp.filter(a => a.category === this.currentFilter);
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(a => a.title.toLowerCase().includes(term));
    }
    this.filteredArticles = temp;
  }

  // buka artikel
  async openArticle(article: EducationArticle) {
    const modal = await this.modalCtrl.create({
      component: BacaComponent,
      componentProps: { article }
    });
    await modal.present();
  }
}
