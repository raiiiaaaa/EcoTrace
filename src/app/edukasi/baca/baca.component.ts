import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EducationArticle } from '../../services/data';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-baca',
  templateUrl: './baca.component.html',
  styleUrls: ['./baca.component.scss'],
  standalone: false
})
export class BacaComponent implements OnInit {
  @Input() article!: EducationArticle;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async shareArticle() {
    try {
      await Share.share({
        title: this.article.title,
        text: `${this.article.title}\n\n${this.article.content}\n\n*_Dibagikan melalui EcoTrace._*`,
        dialogTitle: 'Bagikan Edukasi',
      });
    } catch (error) {
      console.error('Gagal membagikan edukasi:', error);
    }
  }
}
