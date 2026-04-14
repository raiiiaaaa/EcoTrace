import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EducationArticle } from '../../services/data';

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
}
