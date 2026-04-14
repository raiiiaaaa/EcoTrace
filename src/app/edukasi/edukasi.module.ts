import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EdukasiPageRoutingModule } from './edukasi-routing.module';

import { EdukasiPage } from './edukasi.page';
import { BacaComponent } from './baca/baca.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EdukasiPageRoutingModule
  ],
  declarations: [EdukasiPage, BacaComponent]
})
export class EdukasiPageModule {}
